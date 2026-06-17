import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const publicDir = path.join(rootDir, "public");

const siteUrl = (process.env.VITE_SITE_URL || "https://fleetcodes.com").replace(/\/$/, "");

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const parseDate = (raw) => {
  const match = raw.match(/^date:\s*["']?([^"'\n]+)["']?/m);
  return match?.[1]?.trim();
};

const blogUrls = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
        const slug = file.replace(/\.md$/, "");

        return {
          loc: `/blog/${slug}`,
          lastmod: parseDate(raw),
          priority: "0.7",
        };
      })
  : [];

const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/blog", priority: "0.8" },
  ...blogUrls,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(`${siteUrl}${url.loc}`)}</loc>${url.lastmod ? `
    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
    <changefreq>${url.loc.startsWith("/blog/") ? "monthly" : "weekly"}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);
