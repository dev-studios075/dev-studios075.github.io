import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const publicDir = path.join(rootDir, "public");
const maxWidth = "1200";
const jpegQuality = "82";

const coverImagePattern = /^coverImage:\s*(["']?)(\/uploads\/[^"'\n]+\.png)\1\s*$/m;

const formatKb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const hasAlpha = (filePath) => {
  const output = execFileSync("sips", ["-g", "hasAlpha", filePath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  return output.includes("hasAlpha: yes");
};

const files = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"))
  : [];

let converted = 0;
let beforeBytes = 0;
let afterBytes = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(coverImagePattern);

  if (!match) {
    continue;
  }

  const pngPublicPath = match[2];
  const sourcePath = path.join(publicDir, pngPublicPath.replace(/^\//, ""));

  if (!fs.existsSync(sourcePath) || hasAlpha(sourcePath)) {
    continue;
  }

  const jpgPublicPath = pngPublicPath.replace(/\.png$/i, ".jpg");
  const outputPath = path.join(publicDir, jpgPublicPath.replace(/^\//, ""));
  const beforeSize = fs.statSync(sourcePath).size;

  execFileSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", jpegQuality, "-Z", maxWidth, sourcePath, "--out", outputPath],
    { stdio: ["ignore", "ignore", "pipe"] },
  );

  const afterSize = fs.statSync(outputPath).size;
  fs.writeFileSync(filePath, raw.replace(pngPublicPath, jpgPublicPath), "utf8");
  fs.unlinkSync(sourcePath);

  converted += 1;
  beforeBytes += beforeSize;
  afterBytes += afterSize;
}

console.log(
  `Optimized ${converted} blog cover images from ${formatKb(beforeBytes)} to ${formatKb(afterBytes)}.`,
);

