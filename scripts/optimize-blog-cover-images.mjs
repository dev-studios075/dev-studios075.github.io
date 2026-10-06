import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { parseFrontmatter } from "../src/lib/parseFrontmatter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const publicDir = path.join(rootDir, "public");
const maxWidth = 1200;
const jpegQuality = 82;
const webpQuality = 78;

const formatKb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const toPublicPath = (coverImage) => path.join(publicDir, coverImage.replace(/^\//, ""));

const isFresh = (outputPath, sourcePath) =>
  fs.existsSync(outputPath) && fs.statSync(outputPath).mtimeMs >= fs.statSync(sourcePath).mtimeMs;

const writeWebp = async (sourcePath, width) => {
  const dest = width === maxWidth
    ? `${sourcePath.replace(/\.[^.]+$/, "")}.webp`
    : `${sourcePath.replace(/\.[^.]+$/, "")}-${width}.webp`;

  if (isFresh(dest, sourcePath)) {
    return { dest, wrote: false };
  }

  await sharp(sourcePath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: webpQuality })
    .toFile(dest);

  return { dest, wrote: true };
};

const files = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"))
  : [];

let converted = 0;
let webpWritten = 0;
let beforeBytes = 0;
let afterBytes = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { meta } = parseFrontmatter(raw);
  const coverImage = meta.coverImage;

  if (!coverImage || !coverImage.startsWith("/uploads/")) {
    continue;
  }

  let sourcePath = toPublicPath(coverImage);
  if (!fs.existsSync(sourcePath)) {
    continue;
  }

  if (/\.png$/i.test(coverImage)) {
    const metadata = await sharp(sourcePath).metadata();
    if (metadata.hasAlpha) {
      continue;
    }

    const jpgPublicPath = coverImage.replace(/\.png$/i, ".jpg");
    const outputPath = toPublicPath(jpgPublicPath);
    const beforeSize = fs.statSync(sourcePath).size;

    await sharp(sourcePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality: jpegQuality, mozjpeg: true })
      .toFile(outputPath);

    const afterSize = fs.statSync(outputPath).size;
    fs.writeFileSync(filePath, raw.replace(coverImage, jpgPublicPath), "utf8");
    fs.unlinkSync(sourcePath);

    converted += 1;
    beforeBytes += beforeSize;
    afterBytes += afterSize;
    sourcePath = outputPath;
  }

  for (const width of [maxWidth, 640]) {
    const result = await writeWebp(sourcePath, width);
    if (result.wrote) webpWritten += 1;
  }
}

console.log(
  `Optimized ${converted} PNG covers from ${formatKb(beforeBytes)} to ${formatKb(afterBytes)}. Wrote ${webpWritten} WebP variants.`,
);
