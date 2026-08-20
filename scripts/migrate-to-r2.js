const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

// 1. Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.R2_BUCKET_NAME || 'lux-auto-media';
let r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-ac9620a56fef470eb3923296ccced71a.r2.dev';
r2PublicUrl = r2PublicUrl.replace(/\/+$/, '');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing in .env.local');
  process.exit(1);
}

if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
  console.error('Cloudflare R2 credentials missing in .env.local');
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseKey);

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

async function main() {
  console.log('--- STARTING CLOUDFLARE R2 MIGRATION & IMAGE OPTIMIZATION ---');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`R2 Bucket: ${r2Bucket}`);
  console.log(`R2 Public URL: ${r2PublicUrl}`);

  const { data: images, error } = await db
    .from('car_images')
    .select('id, car_id, url, position')
    .order('car_id')
    .order('position');

  if (error) {
    console.error('Failed to fetch car_images:', error.message);
    process.exit(1);
  }

  console.log(`Found ${images.length} images in database.`);

  const toMigrate = images.filter(img => img.url && img.url.includes('supabase.co'));
  const alreadyMigrated = images.filter(img => img.url && img.url.includes('r2.dev'));

  console.log(`Images to migrate from Supabase: ${toMigrate.length}`);
  console.log(`Already on R2: ${alreadyMigrated.length}`);

  if (toMigrate.length === 0) {
    console.log('All images are already on Cloudflare R2! Nothing to migrate.');
    return;
  }

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toMigrate.length; i++) {
    const item = toMigrate[i];
    const progress = `[${i + 1}/${toMigrate.length}]`;

    try {
      // 1. Download original image
      const res = await fetch(item.url);
      if (!res.ok) {
        throw new Error(`Failed to fetch image HTTP ${res.status}: ${res.statusText}`);
      }
      const originalArrayBuffer = await res.arrayBuffer();
      const originalBuffer = Buffer.from(originalArrayBuffer);
      const origSize = originalBuffer.length;
      totalOriginalBytes += origSize;

      // 2. Optimize image with sharp
      const optimizedBuffer = await sharp(originalBuffer)
        .rotate() // Auto-rotate according to EXIF
        .resize({
          width: 1920,
          height: 1920,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      const optSize = optimizedBuffer.length;
      totalOptimizedBytes += optSize;

      // 3. Upload to Cloudflare R2
      const filename = `car-images/${crypto.randomUUID()}.webp`;
      await s3.send(
        new PutObjectCommand({
          Bucket: r2Bucket,
          Key: filename,
          Body: optimizedBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      const newUrl = `${r2PublicUrl}/${filename}`;

      // 4. Update Supabase database record
      const { error: updateErr } = await db
        .from('car_images')
        .update({ url: newUrl })
        .eq('id', item.id);

      if (updateErr) {
        throw new Error(`DB update failed: ${updateErr.message}`);
      }

      successCount++;
      const savedPercent = (((origSize - optSize) / origSize) * 100).toFixed(1);
      console.log(
        `${progress} OK: ${(origSize / 1024 / 1024).toFixed(2)} MB -> ${(optSize / 1024).toFixed(0)} KB (-${savedPercent}%) | Car ID: ${item.car_id}`
      );
    } catch (err) {
      failCount++;
      console.error(`${progress} ERROR for image ${item.id} (${item.url}):`, err.message);
    }
  }

  console.log('\n================ MIGRATION SUMMARY ================');
  console.log(`Total images processed: ${toMigrate.length}`);
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Original total size: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total size: ${(totalOptimizedBytes / 1024 / 1024).toFixed(2)} MB`);
  if (totalOriginalBytes > 0) {
    const totalSaved = (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1);
    console.log(`Total storage & bandwidth saved: ${totalSaved}% !`);
  }
  console.log('===================================================\n');
}

main().catch(err => {
  console.error('Migration crashed:', err);
  process.exit(1);
});
