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

const normalizeUrl = (value) => encodeURI(value);

const absoluteUrl = (loc) => normalizeUrl(`${siteUrl}${loc}`);

const parseDate = (raw) => {
  const match = raw.match(/^date:\s*["']?([^"'\n]+)["']?/m);
  return match?.[1]?.trim();
};

const parseField = (raw, field) => {
  const line = raw.split("\n").find((row) => row.startsWith(`${field}:`));

  if (!line) {
    return undefined;
  }

  let value = line.slice(line.indexOf(":") + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return value.trim();
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
          title: parseField(raw, "title"),
          image: parseField(raw, "coverImage"),
          priority: "0.7",
        };
      })
  : [];

const urls = [
  {
    loc: "/",
    title: "Fleetcodes - Automation-First TMS for Logistics",
    image: "/new-og-image.png",
    priority: "1.0",
  },
  {
    loc: "/blog",
    title: "Fleet Management Blog | Fleetcodes",
    image: "/new-og-image.png",
    priority: "0.8",
  },
  ...blogUrls,
];

const alternateLinks = (loc) => {
  const href = absoluteUrl(loc);

  return `
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(href)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(href)}" />`;
};

const imageEntry = (url) => {
  if (!url.image) {
    return "";
  }

  const imageLoc = url.image.startsWith("http") ? normalizeUrl(url.image) : absoluteUrl(url.image);
  const imageTitle = url.title ? `
      <image:title>${escapeXml(url.title)}</image:title>` : "";

  return `
    <image:image>
      <image:loc>${escapeXml(imageLoc)}</image:loc>${imageTitle}
    </image:image>`;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(absoluteUrl(url.loc))}</loc>${alternateLinks(url.loc)}${imageEntry(url)}${url.lastmod ? `
    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
    <changefreq>${url.loc.startsWith("/blog/") ? "monthly" : "weekly"}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `# *
User-agent: *
Allow: /
Disallow: /private/

Host: ${siteUrl}

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# Fleetcodes

Fleetcodes is an automation-first transport management system for logistics teams, fleet owners, transporters, and shippers.

## Core Pages

- Homepage: ${siteUrl}/
- Blog: ${siteUrl}/blog
- Sitemap: ${siteUrl}/sitemap.xml

## Topics

- AI-powered dispatch planning
- Transport management systems
- Fleet operations automation
- Indian logistics compliance
- Real-time fleet visibility
- Trip sheets, PODs, billing, and driver settlements

## Blog Articles

${blogUrls
  .map((post) => `- ${post.title || post.loc.replace("/blog/", "")}: ${siteUrl}${post.loc}`)
  .join("\n")}
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);

console.log(`Generated sitemap.xml, robots.txt, and llms.txt for ${siteUrl}`);
