const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const transcriptPath = 'C:\\Users\\illia\\.gemini\\antigravity\\brain\\05bd60d7-c01b-4a6a-bf91-95a6571a3ed8\\.system_generated\\logs\\transcript_full.jsonl';

async function main() {
  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
  const line177 = JSON.parse(lines[177]);
  const content = line177.content;

  const startIdx = content.indexOf('{"cars"');
  if (startIdx === -1) {
    console.error('Marker {"cars" not found in line 177');
    return;
  }

  const endIdx = content.lastIndexOf('}');
  const jsonStr = content.substring(startIdx, endIdx + 1);

  const dump = JSON.parse(jsonStr);
  console.log(`Parsed successfully: ${dump.cars?.length} cars, ${dump.car_images?.length} car_images`);

  const url = 'https://pkhwqgxekokfxigqavpq.supabase.co';
  const key = 'sb_publishable_zRPXraN-8P5htn7iyEprfg_DKr_R3_D';
  const db = createClient(url, key);

  console.log(`Inserting ${dump.car_images.length} images into new database...`);

  const batchSize = 50;
  for (let i = 0; i < dump.car_images.length; i += batchSize) {
    const chunk = dump.car_images.slice(i, i + batchSize).map(img => {
      let imgUrl = img.url;
      if (imgUrl.includes('supabase.co')) {
        imgUrl = imgUrl.replace(
          /https:\/\/[^/]+\/storage\/v1\/object\/public\/car-images\//,
          'https://pub-ac9620a56fef470eb3923296ccced71a.r2.dev/car-images/'
        ).replace(/\.(png|jpg|jpeg|webp)$/i, '.webp');
      }
      return {
        id: img.id,
        car_id: img.car_id,
        url: imgUrl,
        position: img.position,
        alt: img.alt || null
      };
    });

    const { error } = await db.from('car_images').upsert(chunk);
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`Batch ${i / batchSize + 1} (${chunk.length} items) inserted successfully.`);
    }
  }

  const { count, error: countErr } = await db.from('car_images').select('*', { count: 'exact', head: true });
  console.log('Final car_images count in DB:', count, 'Error:', countErr);
}

main().catch(console.error);
