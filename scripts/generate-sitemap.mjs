import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const publicDir = path.join(rootDir, "public");

let siteUrl = (process.env.VITE_SITE_URL || "https://www.fleetcodes.com").replace(/\/$/, "");
if (siteUrl === "https://fleetcodes.com") {
  siteUrl = "https://www.fleetcodes.com";
}

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizeUrl = (value) => encodeURI(value);

const absoluteUrl = (loc) => normalizeUrl(`${siteUrl}${loc}`);

const canonicalPath = (loc = "/") => {
  const basePath = loc.split(/[?#]/)[0] || "/";
  const normalizedPath = basePath.startsWith("/") ? basePath : `/${basePath}`;

  if (normalizedPath === "/" || normalizedPath.endsWith("/")) {
    return normalizedPath;
  }

  if (/\/[^/]+\.[^/]+$/.test(normalizedPath)) {
    return normalizedPath;
  }

  return `${normalizedPath}/`;
};

const absolutePageUrl = (loc) => absoluteUrl(canonicalPath(loc));

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

const daysSince = (dateValue) => {
  if (!dateValue) {
    return Number.POSITIVE_INFINITY;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return (Date.now() - date.getTime()) / 86400000;
};

const blogPriority = (dateValue) => {
  const age = daysSince(dateValue);
  if (age <= 30) return "0.85";
  if (age <= 90) return "0.8";
  return "0.7";
};

const blogChangefreq = (dateValue) => {
  const age = daysSince(dateValue);
  if (age <= 30) return "weekly";
  if (age <= 90) return "weekly";
  return "monthly";
};

const blogUrls = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
        const slug = file.replace(/\.md$/, "");

        const lastmod = parseDate(raw);

        return {
          loc: `/blog/${slug}`,
          lastmod,
          title: parseField(raw, "title"),
          image: parseField(raw, "coverImage"),
          priority: blogPriority(lastmod),
          changefreq: blogChangefreq(lastmod),
        };
      })
      .sort((a, b) => (b.lastmod || "").localeCompare(a.lastmod || ""))
  : [];

const urls = [
  {
    loc: "/",
    title: "Fleetcodes - Automation-First TMS for Logistics",
    image: "/new-og-image.png",
    priority: "1.0",
  },
  {
    loc: "/about",
    title: "About Us | Fleetcodes",
    image: "/new-og-image.png",
    priority: "0.8",
  },
  {
    loc: "/careers",
    title: "Careers at Fleetcodes",
    image: "/new-og-image.png",
    priority: "0.8",
  },
  {
    loc: "/book-demo",
    title: "Book a Demo | Fleetcodes",
    image: "/new-og-image.png",
    priority: "0.9",
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
  const href = absolutePageUrl(loc);

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

const pubDate = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
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
    <loc>${escapeXml(absolutePageUrl(url.loc))}</loc>${alternateLinks(url.loc)}${imageEntry(url)}${url.lastmod ? `
    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
    <changefreq>${url.changefreq || (url.loc.startsWith("/blog/") ? "monthly" : "weekly")}</changefreq>
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
- About: ${siteUrl}/about/
- Careers: ${siteUrl}/careers/
- Book Demo: ${siteUrl}/book-demo/
- Blog: ${siteUrl}/blog/
- Sitemap: ${siteUrl}/sitemap.xml
- Blog Feed: ${siteUrl}/feed.xml

## Topics

- AI-powered dispatch planning
- Transport management systems
- Fleet operations automation
- Indian logistics compliance
- Real-time fleet visibility
- Trip sheets, PODs, billing, and driver settlements

## Blog Articles

${blogUrls
  .map((post) => `- ${post.title || post.loc.replace("/blog/", "")}: ${absolutePageUrl(post.loc)}`)
  .join("\n")}
`;

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fleetcodes Blog</title>
    <link>${siteUrl}/blog/</link>
    <description>Fleet management, TMS automation, dispatch, compliance, and logistics operations insights from Fleetcodes.</description>
    <language>en-IN</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${blogUrls
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title || post.loc.replace("/blog/", ""))}</title>
      <link>${escapeXml(absolutePageUrl(post.loc))}</link>
      <guid isPermaLink="true">${escapeXml(absolutePageUrl(post.loc))}</guid>${post.lastmod ? `
      <pubDate>${pubDate(post.lastmod)}</pubDate>` : ""}
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);
fs.writeFileSync(path.join(publicDir, "feed.xml"), feed);

console.log(`Generated sitemap.xml, robots.txt, llms.txt, and feed.xml for ${siteUrl}`);
