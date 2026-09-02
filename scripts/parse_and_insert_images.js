const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const transcriptPath = 'C:\\Users\\illia\\.gemini\\antigravity\\brain\\05bd60d7-c01b-4a6a-bf91-95a6571a3ed8\\.system_generated\\logs\\transcript_full.jsonl';

async function main() {
  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
  const line208 = lines[208];
  
  // Extract all lines that match INSERT INTO public.car_images
  const rawText = JSON.parse(line208).content || '';
  const textLines = rawText.split('\n');

  console.log(`Processing ${textLines.length} lines from user input...`);

  const images = [];
  const regex = /INSERT INTO public\.car_images VALUES \('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(NULL|'[^']*')\);/i;

  for (const line of textLines) {
    const match = line.match(regex);
    if (match) {
      let [_, id, car_id, url, position, alt] = match;
      let imgUrl = url;
      if (imgUrl.includes('supabase.co')) {
        imgUrl = imgUrl.replace(
          /https:\/\/[^/]+\/storage\/v1\/object\/public\/car-images\//,
          'https://pub-ac9620a56fef470eb3923296ccced71a.r2.dev/car-images/'
        ).replace(/\.(png|jpg|jpeg|webp)$/i, '.webp');
      }

      images.push({
        id,
        car_id,
        url: imgUrl,
        position: parseInt(position, 10),
        alt: alt === 'NULL' ? null : alt.replace(/^'|'$/g, '')
      });
    }
  }

  console.log(`Parsed ${images.length} valid car_images records!`);

  if (images.length === 0) {
    console.error('No images matched regex.');
    return;
  }

  const supabaseUrl = 'https://pkhwqgxekokfxigqavpq.supabase.co';
  const supabaseKey = 'sb_publishable_zRPXraN-8P5htn7iyEprfg_DKr_R3_D';
  const db = createClient(supabaseUrl, supabaseKey);

  // Insert in batches of 50
  const batchSize = 50;
  for (let i = 0; i < images.length; i += batchSize) {
    const chunk = images.slice(i, i + batchSize);
    const { error } = await db.from('car_images').upsert(chunk);
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`Batch ${Math.floor(i / batchSize) + 1} (${chunk.length} items) inserted successfully!`);
    }
  }

  const { count, error: countErr } = await db.from('car_images').select('*', { count: 'exact', head: true });
  console.log('Total car_images in DB:', count, 'Error:', countErr);
}

main().catch(console.error);
