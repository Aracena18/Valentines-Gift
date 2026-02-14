/**
 * Scans public/images/ for .webp files and writes a JSON list
 * that the PhotoGallery component can import at build time.
 *
 * Run: node scripts/generate-photo-list.cjs
 */
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'photos.json');

const supported = ['.webp', '.jpg', '.jpeg', '.png'];

const files = fs.readdirSync(imagesDir)
  .filter(f => supported.includes(path.extname(f).toLowerCase()))
  .sort()
  .map(f => `/images/${f}`);

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2) + '\n');
console.log(`✅ Generated ${outputFile} with ${files.length} photos`);
