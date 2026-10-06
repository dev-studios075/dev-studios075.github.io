import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "../src/lib/parseFrontmatter.mjs";

const blogDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "blog");

const truncateAtWord = (value, maxLength) => {
  const clean = String(value).replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength + 1);
  const boundary = shortened.lastIndexOf(" ");
  return shortened
    .slice(0, boundary > maxLength * 0.7 ? boundary : maxLength)
    .trim()
    .replace(/[—,:;\-]+$/, "")
    .replace(/\s+(and|or|for|to|the|a|an|of|in|with|your|more|that|this|how|what|every|must|get)$/i, "")
    .trim();
};

const yamlValue = (value) => {
  if (/[:#{}[\],&*?!'"]/.test(value) || value !== value.trim()) {
    return JSON.stringify(value);
  }
  return value;
};

const fitTitle = (title = "") => {
  let next = title.replace(/\s+/g, " ").trim();
  if (next.length >= 25 && next.length <= 70) return next;

  const candidates = [
    next.replace(/[,:]?\s*in 2026\.?$/i, ""),
    next.replace(/[,:]?\s*for 2026\.?$/i, ""),
    next.replace(/[,:]?\s*2026\.?$/i, ""),
    next.replace(/\s+—\s+.+$/, ""),
    next.replace(/\s+-\s+.+$/, ""),
    next.replace(/:\s+.+$/, ""),
    next.replace(/\s*\(.+\)\s*$/, ""),
  ].map((value) => value.replace(/\s+/g, " ").trim());

  for (const candidate of candidates) {
    if (candidate.length >= 25 && candidate.length <= 70) return candidate;
  }

  if (next.length > 70) return truncateAtWord(next, 70);
  if (next.length < 25) {
    const padded = `${next} for Indian fleets`;
    if (padded.length <= 70) return padded;
  }
  return next;
};

const firstPlainParagraph = (content = "") =>
  content
    .replace(/^#\s+.*$/m, "")
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[#>*_`]/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .find((block) => block.length >= 80) || "";

const fitExcerpt = (excerpt = "", content = "") => {
  let next = excerpt.replace(/\s+/g, " ").trim();
  if (next.length >= 80 && next.length <= 170) return next;
  if (next.length > 170) return truncateAtWord(next, 170);

  const fromBody = firstPlainParagraph(content);
  const combined = [next, fromBody].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  if (combined.length >= 80) return truncateAtWord(combined, 170);
  return combined;
};

const replaceField = (raw, field, value) => {
  const pattern = new RegExp(`^${field}:\\s*.*$`, "m");
  if (!pattern.test(raw)) return raw;
  return raw.replace(pattern, `${field}: ${yamlValue(value)}`);
};

let titles = 0;
let excerpts = 0;

for (const file of fs.readdirSync(blogDir).filter((name) => name.endsWith(".md"))) {
  const filePath = path.join(blogDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, content } = parseFrontmatter(raw);
  const title = fitTitle(meta.title || "");
  const excerpt = fitExcerpt(meta.excerpt || "", content);
  let next = raw;

  if (title !== meta.title) {
    next = replaceField(next, "title", title);
    titles += 1;
  }
  if (excerpt !== meta.excerpt) {
    next = replaceField(next, "excerpt", excerpt);
    excerpts += 1;
  }
  if (next !== raw) fs.writeFileSync(filePath, next);
}

console.log(`Updated ${titles} titles and ${excerpts} excerpts.`);
