const fs = require('fs');
const path = require('path');
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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.R2_BUCKET_NAME || 'lux-auto-media';
let r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-ac9620a56fef470eb3923296ccced71a.r2.dev';
r2PublicUrl = r2PublicUrl.replace(/\/+$/, '');

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
  console.log('--- STARTING DETERMINISTIC R2 MIGRATION ---');

  const { data: images, error } = await db
    .from('car_images')
    .select('id, car_id, url, position')
    .order('car_id')
    .order('position');

  if (error) {
    console.error('Failed to fetch car_images:', error.message);
    process.exit(1);
  }

  console.log(`Found ${images.length} total images in database.`);

  const toMigrate = images.filter(img => img.url && img.url.includes('supabase.co'));
  console.log(`Images to process: ${toMigrate.length}`);

  const sqlStatements = [];
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (let i = 0; i < toMigrate.length; i++) {
    const item = toMigrate[i];
    const progress = `[${i + 1}/${toMigrate.length}]`;

    try {
      const urlObj = new URL(item.url);
      const pathname = decodeURIComponent(urlObj.pathname);
      const baseName = path.basename(pathname, path.extname(pathname));
      const r2Key = `car-images/${baseName}.webp`;
      const newUrl = `${r2PublicUrl}/${r2Key}`;

      sqlStatements.push(`UPDATE public.car_images SET url = '${newUrl}' WHERE id = '${item.id}';`);

      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuf = await res.arrayBuffer();
      const origBuf = Buffer.from(arrayBuf);
      totalOriginal += origBuf.length;

      const optBuf = await sharp(origBuf)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      totalOptimized += optBuf.length;

      await s3.send(
        new PutObjectCommand({
          Bucket: r2Bucket,
          Key: r2Key,
          Body: optBuf,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      console.log(`${progress} Uploaded: ${r2Key} (${(optBuf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`${progress} Failed for ${item.id}:`, e.message);
    }
  }

  const sqlFilePath = path.resolve(__dirname, 'update_database.sql');
  fs.writeFileSync(sqlFilePath, sqlStatements.join('\n'), 'utf8');

  console.log(`\nGenerated SQL script with ${sqlStatements.length} update queries at: ${sqlFilePath}`);
  console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
