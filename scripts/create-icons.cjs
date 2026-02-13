const fs = require('fs');
const path = require('path');

// Copy SVG as placeholder PNG icons (replace with real PNGs later)
const src = path.join(__dirname, '..', 'public', 'icons', 'icon-192.svg');
fs.copyFileSync(src, path.join(__dirname, '..', 'public', 'icons', 'icon-192.png'));
fs.copyFileSync(src, path.join(__dirname, '..', 'public', 'icons', 'icon-512.png'));
console.log('Placeholder icons created. Replace with real PNGs for production.');
