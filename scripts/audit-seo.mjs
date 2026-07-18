import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const publicDir = path.join(rootDir, "public");
const today = new Date();
const warnings = [];
const errors = [];

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw, valid: false };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[key] = value.trim();
  }
  return { meta, content: match[2].trim(), valid: true };
};

const tokens = (value = "") => new Set(
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((token) => token.length > 2),
);

const similarity = (left, right) => {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const overlap = [...a].filter((token) => b.has(token)).length;
  return overlap / Math.min(a.size, b.size);
};

const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));
const posts = files.map((file) => {
  const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
  const parsed = parseFrontmatter(raw);
  const words = parsed.content ? parsed.content.split(/\s+/).filter(Boolean).length : 0;
  const slug = file.replace(/\.md$/, "");

  if (!parsed.valid) errors.push(`${file}: missing or invalid frontmatter`);
  for (const field of ["title", "date", "author", "excerpt", "coverImage"]) {
    if (!parsed.meta[field]) errors.push(`${file}: missing ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) warnings.push(`${file}: slug should be lowercase kebab-case`);
  if (parsed.meta.title && (parsed.meta.title.length < 25 || parsed.meta.title.length > 70)) {
    warnings.push(`${file}: title length is ${parsed.meta.title.length} (target 25-70)`);
  }
  if (parsed.meta.excerpt && (parsed.meta.excerpt.length < 80 || parsed.meta.excerpt.length > 170)) {
    warnings.push(`${file}: excerpt length is ${parsed.meta.excerpt.length} (target 80-170)`);
  }
  if (words < 600) warnings.push(`${file}: thin article (${words} words)`);

  const date = new Date(parsed.meta.date);
  if (!parsed.meta.date || Number.isNaN(date.getTime())) errors.push(`${file}: invalid date`);
  else if (date > today) warnings.push(`${file}: future publication date ${parsed.meta.date}`);

  if (parsed.meta.coverImage) {
    const imagePath = path.join(publicDir, parsed.meta.coverImage.replace(/^\//, ""));
    if (!fs.existsSync(imagePath)) errors.push(`${file}: cover image not found (${parsed.meta.coverImage})`);
  }

  return { file, slug, words, ...parsed.meta };
});

for (let i = 0; i < posts.length; i += 1) {
  for (let j = i + 1; j < posts.length; j += 1) {
    const score = similarity(posts[i].title, posts[j].title);
    if (score >= 0.72) {
      warnings.push(`${posts[i].file} <> ${posts[j].file}: similar titles (${score.toFixed(2)})`);
    }
  }
}

console.log(`SEO audit: ${posts.length} blog posts, ${errors.length} errors, ${warnings.length} warnings`);
if (errors.length) console.log(`\nErrors:\n- ${errors.join("\n- ")}`);
if (warnings.length) console.log(`\nWarnings:\n- ${warnings.join("\n- ")}`);

if (errors.length) process.exitCode = 1;
