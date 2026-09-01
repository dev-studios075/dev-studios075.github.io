import fs from 'fs';
import sharp from 'sharp';

async function run() {
  try {
    const pngPath = 'public/favicon.png';
    const icoPath = 'public/favicon.ico';

    // Generate a compact browser icon from the official app-logo source.
    await sharp('public/assets/brand/logo-with-bg.png')
      .resize(192, 192)
      .png()
      .toFile(pngPath);
    console.log('Successfully generated the Fleetcodes favicon PNG.');

    // 2. Read PNG and convert to ICO
    const pngData = fs.readFileSync(pngPath);
    
    // Icon Header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: 1 = Icon
    header.writeUInt16LE(1, 4); // Count of images: 1
    
    // Icon Directory Entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(192, 0);  // Width: 192px
    entry.writeUInt8(192, 1);  // Height: 192px
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
