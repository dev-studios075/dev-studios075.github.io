import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const targetFile = path.join(rootDir, "src", "content", "blog-index.json");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return { meta, content: match[2].trim() };
}

const posts = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.md$/, "");
        const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
        const { meta, content } = parseFrontmatter(raw);
        const words = content.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.round(words / 200));

        return {
          slug,
          title: meta.title || slug,
          date: meta.date || "",
          author: meta.author || "",
          excerpt: meta.excerpt || "",
          coverImage: meta.coverImage || "",
          readingTime,
        };
      })
      .sort((a, b) => (b.date > a.date ? 1 : -1))
  : [];

fs.writeFileSync(targetFile, JSON.stringify(posts, null, 2), "utf8");
console.log(`Generated blog-index.json with ${posts.length} entries.`);
