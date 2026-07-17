
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing in .env.local!");
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseKey);

// Helper for mime type
function getMimeType(filename) {
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

// Parse mileage
function parseMileage(str) {
  const clean = str.replace(/[^\d]/g, '');
  let val = parseInt(clean, 10) || 0;
  if (str.includes('тис')) {
    val = val * 1000;
  }
  return val;
}

// Clean HTML tags and entities
function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, '') // remove html tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function run() {
  const carsDir = 'D:\\LuxAuto-копія\\cars';
  if (!fs.existsSync(carsDir)) {
    console.error(`Legacy cars directory not found: ${carsDir}`);
    process.exit(1);
  }

  const carFolders = fs.readdirSync(carsDir).filter(f => f.startsWith('car')).sort((a, b) => {
    const numA = parseInt(a.replace('car', ''), 10) || 0;
    const numB = parseInt(b.replace('car', ''), 10) || 0;
    return numA - numB;
  });
  console.log(`Found ${carFolders.length} car folders to import...`);

  for (const folder of carFolders) {
    const folderPath = path.join(carsDir, folder);
    const htmlFile = path.join(folderPath, `${folder}.html`);

    if (!fs.existsSync(htmlFile)) {
      console.log(`HTML file not found: ${htmlFile}, skipping...`);
      continue;
    }

    console.log(`\n=============================================`);
    console.log(`Processing folder: ${folder}...`);
    const html = fs.readFileSync(htmlFile, 'utf8');

    // 1. Title/Name
    const h1Match = html.match(/<h1>(.*?)<\/h1>/);
    if (!h1Match) {
      console.log(`Could not find <h1> tag in ${htmlFile}, skipping...`);
      continue;
    }
    const fullName = cleanText(h1Match[1]);
    console.log(`Car Name: ${fullName}`);

    // Parse brand, model, year
    const parts = fullName.split(' ');
    const year = parseInt(parts[parts.length - 1], 10) || new Date().getFullYear();
    
    let brand = parts[0];
    let model = parts.slice(1, -1).join(' ');

    if (fullName.startsWith('Mercedes-Benz')) {
      brand = 'Mercedes-Benz';
      model = parts.slice(1, -1).join(' ');
    } else if (fullName.startsWith('Land Rover')) {
      brand = 'Land Rover';
      model = parts.slice(2, -1).join(' ');
    }

    // 2. Price
    const priceMatch = html.match(/<div class="price">(.*?)<\/div>/);
    const rawPrice = priceMatch ? priceMatch[1] : '0';
    const price = parseInt(rawPrice.replace(/[^\d]/g, ''), 10) || 0;
    console.log(`Price: $${price}`);

    // 3. Short description
    const shortDescMatch = html.match(/<div class="short-about">[\s\S]*?<p>([\s\S]*?)<\/p>/);
    const short_description = shortDescMatch ? cleanText(shortDescMatch[1]) : '';

    // 4. Full description
    const descMatch = html.match(/<h2>Опис автомобіля<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/);
    const description = descMatch ? cleanText(descMatch[1]) : '';

    // 5. Specs
    // Find specs in the first specs section (under h2 "Характеристики")
    const specsSectionMatch = html.match(/<h2>Характеристики<\/h2>[\s\S]*?<div class="specs">([\s\S]*?)<\/div>\s*<\/div>/);
    let mileage = 0;
    let fuel = '';
    let engine = '';
    let transmission = '';
    let drive = '';
    let body_type = '';

    if (specsSectionMatch) {
      const specsHtml = specsSectionMatch[1];
      const specMatches = [...specsHtml.matchAll(/<div class="spec"><b>(.*?)<\/b>[\s\S]*?<br\/?>([\s\S]*?)<\/div>/g)];
      for (const m of specMatches) {
        const specName = cleanText(m[1]).replace(':', '');
        const specValue = cleanText(m[2]);

        if (specName.includes('Пробіг')) mileage = parseMileage(specValue);
        else if (specName.includes('Паливо')) fuel = specValue;
        else if (specName.includes('Двигун')) engine = specValue;
        else if (specName.includes('Коробка')) transmission = specValue;
        else if (specName.includes('Привід')) drive = specValue;
        else if (specName.includes('Кузов')) body_type = specValue;
      }
    }

    // 6. Details (Detailed specs under second specs section)
    const detailsSectionMatch = html.match(/<h2>Детальніше про характеристики<\/h2>[\s\S]*?<div class="specs">([\s\S]*?)<\/div>\s*<\/div>/);
    const details = {};
    if (detailsSectionMatch) {
      const detailsHtml = detailsSectionMatch[1];
      const detailMatches = [...detailsHtml.matchAll(/<div class="spec"><b>(.*?)<\/b>[\s\S]*?<br\/?>([\s\S]*?)<\/div>/g)];
      for (const m of detailMatches) {
        const key = cleanText(m[1]).replace(':', '');
        const value = cleanText(m[2]);
        details[key] = value;
      }
    }

    // 7. Features
    const featuresMatches = [...html.matchAll(/<div class="feature">✓\s*(.*?)<\/div>/g)];
    const features = featuresMatches.map(m => cleanText(m[1]));

    // 8. Images in thumbs
    const thumbsMatch = html.match(/<div class="thumbs">([\s\S]*?)<\/div>/);
    const imageUrls = [];
    if (thumbsMatch) {
      const thumbsHtml = thumbsMatch[1];
      const imgMatches = [...thumbsHtml.matchAll(/<img src="([^"]+)"/g)];
      for (const m of imgMatches) {
        const imgName = m[1];
        if (!imageUrls.includes(imgName)) {
          imageUrls.push(imgName);
        }
      }
    } else {
      // Fallback: check main image
      const mainImgMatch = html.match(/<img id="mainImage" src="([^"]+)"/);
      if (mainImgMatch) {
        imageUrls.push(mainImgMatch[1]);
      }
    }

    console.log(`Parsed Specs:
      Year: ${year}
      Mileage: ${mileage}
      Fuel: ${fuel}
      Engine: ${engine}
      Transmission: ${transmission}
      Drive: ${drive}
      Body type: ${body_type}
      Images count: ${imageUrls.length}
    `);

    // Insert car row
    const carRow = {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      engine,
      transmission,
      drive,
      body_type,
      short_description,
      description,
      features,
      details,
      is_top: folder === 'car2' || folder === 'car6' || folder === 'car8', 
      is_sold: false,
      is_recommended: folder === 'car1' || folder === 'car2' || folder === 'car3',
      is_hidden: false
    };

    console.log(`Inserting car into Supabase...`);
    const { data: insertedCar, error: carError } = await db
      .from('cars')
      .insert(carRow)
      .select()
      .single();

    if (carError) {
      console.error(`Failed to insert car ${fullName}:`, carError.message);
      continue;
    }

    console.log(`Successfully inserted car! ID: ${insertedCar.id}`);

    // Upload images and insert to car_images table
    if (imageUrls.length) {
      console.log(`Uploading ${imageUrls.length} images...`);
      const carImagesToInsert = [];

      for (let i = 0; i < imageUrls.length; i++) {
        const imgName = imageUrls[i];
        const imgPath = path.join(folderPath, imgName);

        if (!fs.existsSync(imgPath)) {
          console.warn(`Image file not found: ${imgPath}, skipping image...`);
          continue;
        }

        const fileBuffer = fs.readFileSync(imgPath);
        const fileExt = path.extname(imgName).toLowerCase() || '.webp';
        const storagePath = `${crypto.randomUUID()}${fileExt}`;
        const mimeType = getMimeType(imgName);

        console.log(`  Uploading ${imgName} -> ${storagePath} (${mimeType})...`);
        const { error: uploadError } = await db.storage
          .from('car-images')
          .upload(storagePath, fileBuffer, {
            contentType: mimeType,
            duplex: 'half'
          });

        if (uploadError) {
          console.error(`  Upload failed for ${imgName}:`, uploadError.message);
          continue;
        }

        const { data: publicUrlData } = db.storage
          .from('car-images')
          .getPublicUrl(storagePath);

        carImagesToInsert.push({
          car_id: insertedCar.id,
          url: publicUrlData.publicUrl,
          position: i
        });
      }

      if (carImagesToInsert.length) {
        console.log(`Inserting image records into car_images...`);
        const { error: imagesError } = await db
          .from('car_images')
          .insert(carImagesToInsert);

        if (imagesError) {
          console.error(`Failed to insert car_images records:`, imagesError.message);
        } else {
          console.log(`Successfully uploaded and linked ${carImagesToInsert.length} images!`);
        }
      }
    }
  }

  console.log(`\n=============================================`);
  console.log(`All cars imported successfully!`);
}

run().catch(err => {
  console.error("Global error running script:", err);
});
