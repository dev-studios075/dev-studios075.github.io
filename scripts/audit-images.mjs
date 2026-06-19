import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const uploadDir = path.join(rootDir, "public", "uploads");
const maxRecommendedBytes = 500 * 1024;
const maxRecommendedWidth = 1200;

const formatKb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const getImageSize = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");

  if (signature === "89504e470d0a1a0a") {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;

    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        break;
      }

      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      const isStartOfFrame = [
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
      ].includes(marker);

      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }

      offset += 2 + length;
    }
  }

  return undefined;
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : entryPath;
  });

const images = fs.existsSync(uploadDir)
  ? walk(uploadDir)
      .filter((file) => /\.(png|jpe?g)$/i.test(file))
      .map((file) => {
        const stats = fs.statSync(file);
        const dimensions = getImageSize(file);

        return {
          file,
          relativePath: path.relative(rootDir, file),
          size: stats.size,
          width: dimensions?.width || 0,
          height: dimensions?.height || 0,
        };
      })
      .sort((a, b) => b.size - a.size)
  : [];

const oversized = images.filter(
  (image) => image.size > maxRecommendedBytes || image.width > maxRecommendedWidth,
);

console.log(`Scanned ${images.length} upload images.`);

if (oversized.length === 0) {
  console.log("No oversized upload images found.");
} else {
  console.log(
    `${oversized.length} images exceed ${formatKb(maxRecommendedBytes)} or ${maxRecommendedWidth}px width:`,
  );

  oversized.slice(0, 30).forEach((image) => {
    console.log(
      `- ${image.relativePath} (${image.width}x${image.height}, ${formatKb(image.size)})`,
    );
  });

  if (oversized.length > 30) {
    console.log(`...and ${oversized.length - 30} more.`);
  }
}
