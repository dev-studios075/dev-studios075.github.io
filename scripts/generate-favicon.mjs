import fs from 'fs';
import sharp from 'sharp';

// Render the blue ring design matching the user's screenshot
// Center (48,48) with white circular backing disc and the blue ring
const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <circle cx="48" cy="48" r="44" fill="#ffffff" />
  <circle cx="48" cy="48" r="34.5" fill="none" stroke="#2466a0" stroke-width="19" />
</svg>`;

async function run() {
  try {
    const pngPath = 'public/favicon.png';
    const icoPath = 'public/favicon.ico';

    // 1. Generate 96x96 PNG using sharp
    await sharp(Buffer.from(svgString))
      .png()
      .toFile(pngPath);
    console.log('Successfully generated public/favicon.png using sharp!');

    // 2. Read PNG and convert to ICO
    const pngData = fs.readFileSync(pngPath);
    
    // Icon Header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: 1 = Icon
    header.writeUInt16LE(1, 4); // Count of images: 1
    
    // Icon Directory Entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(96, 0);   // Width: 96px
    entry.writeUInt8(96, 1);   // Height: 96px
    entry.writeUInt8(0, 2);    // Color count (0 if >=8bpp)
    entry.writeUInt8(0, 3);    // Reserved (0)
    entry.writeUInt16LE(1, 4);  // Color planes (1)
    entry.writeUInt16LE(32, 6); // Bits per pixel (32)
    entry.writeUInt32LE(pngData.length, 8); // Image data size
    entry.writeUInt32LE(22, 12); // Image data offset (6 bytes header + 16 bytes entry = 22)
    
    // Concatenate all to form a valid ICO file
    const icoData = Buffer.concat([header, entry, pngData]);
    fs.writeFileSync(icoPath, icoData);
    console.log('Successfully generated public/favicon.ico!');
  } catch (err) {
    console.error('Error generating favicon:', err);
  }
}

run();
