const { createClient } = require('@supabase/supabase-js');

const url = 'https://pkhwqgxekokfxigqavpq.supabase.co';
const key = 'sb_publishable_zRPXraN-8P5htn7iyEprfg_DKr_R3_D';
const db = createClient(url, key);

async function verify() {
  const { data: cars } = await db.from('cars').select('id, brand, model, price, is_hidden');
  const { data: images } = await db.from('car_images').select('id, car_id, url, position');

  console.log('=== VERIFICATION ===');
  console.log('Total Cars in DB:', cars?.length);
  console.log('Total Images in DB:', images?.length);

  const r2Images = images.filter(img => img.url.includes('pub-ac9620a56fef470eb3923296ccced71a.r2.dev'));
  console.log('Images pointing to Cloudflare R2:', r2Images.length, 'of', images.length);

  // Check first 5 cars with images
  for (let i = 0; i < Math.min(5, cars.length); i++) {
    const c = cars[i];
    const cImgs = images.filter(img => img.car_id === c.id);
    console.log(`- Car: ${c.brand} ${c.model} (${c.price}$) -> ${cImgs.length} images. First img: ${cImgs[0]?.url}`);
  }
}
verify().catch(console.error);
