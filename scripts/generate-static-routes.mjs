import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { micromark } from "micromark";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const distDir = path.join(rootDir, "dist");

let siteUrl = (process.env.VITE_SITE_URL || "https://www.fleetcodes.com").replace(/\/$/, "");
if (siteUrl === "https://fleetcodes.com") {
  siteUrl = "https://www.fleetcodes.com";
}
const siteName = "Fleetcodes";
const defaultImage = "/new-og-image.png";
const defaultKeywords =
  "fleet management software, transport management system, logistics automation, AI dispatch, fleet tracking, Indian logistics, TMS software, Fleetcodes";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cleanMarkdown = (content = "") =>
  content
    .replace(/^#\s+.*$/m, "")
    .replace(/^\*\*By[^\n]+Min Read\*\*$/im, "")
    .replace(/^By[^\n]+Min Read$/im, "")
    .trim();

const renderMarkdown = (content = "") => micromark(cleanMarkdown(content));

const renderStaticFallback = ({ eyebrow, title, description, image, meta, contentHtml }) => `
        <main data-static-fallback style="max-width: 920px; margin: 0 auto; padding: 48px 24px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827;">
          ${eyebrow ? `<p style="margin: 0 0 12px; color: #4f46e5; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">${escapeHtml(eyebrow)}</p>` : ""}
          <h1 style="margin: 0 0 16px; font-size: clamp(32px, 6vw, 56px); line-height: 1.05; letter-spacing: -0.02em;">${escapeHtml(title)}</h1>
          ${description ? `<p style="margin: 0 0 20px; color: #4b5563; font-size: 18px; line-height: 1.65;">${escapeHtml(description)}</p>` : ""}
          ${meta ? `<p style="margin: 0 0 28px; color: #6b7280; font-size: 14px;">${escapeHtml(meta)}</p>` : ""}
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="display: block; width: 100%; max-height: 420px; object-fit: cover; border-radius: 18px; margin: 0 0 36px;" />` : ""}
          ${contentHtml ? `<article style="font-size: 17px; line-height: 1.78;">${contentHtml}</article>` : ""}
        </main>`;

const absoluteUrl = (value = "/") => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${siteUrl}${encodeURI(normalizedPath)}`;
};

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return {};
  }

  return match[1].split("\n").reduce((meta, line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return meta;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    meta[key] = value.trim();
    return meta;
  }, {});
};

const posts = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(/\.md$/, "");
        const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
        const meta = parseFrontmatter(raw);

        const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        const content = match ? match[2] : raw;
        const wordCount = content ? content.trim().split(/\s+/).length : 0;

        return {
          slug,
          title: meta.title || slug,
          description: meta.excerpt || "",
          date: meta.date || "",
          author: meta.author || siteName,
          image: meta.coverImage || defaultImage,
          content,
          wordCount,
        };
      })
      .sort((a, b) => (b.date > a.date ? 1 : -1))
  : [];

const templatePath = path.join(distDir, "index.html");
const template = fs.readFileSync(templatePath, "utf8");

const setTag = (html, selector, replacement) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<${escapedSelector}[^>]*>`, "i");
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
};

const setMetaName = (html, name, content) =>
  setTag(
    html,
    `meta name="${name}"`,
    `<meta name="${name}" content="${escapeHtml(content)}" />`,
  );

const setMetaProperty = (html, property, content) =>
  setTag(
    html,
    `meta property="${property}"`,
    `<meta property="${property}" content="${escapeHtml(content)}" />`,
  );

const setCanonical = (html, url) =>
  setTag(html, `link rel="canonical"`, `<link rel="canonical" href="${escapeHtml(url)}" />`);

const setAlternate = (html, hreflang, url) => {
  const regex = new RegExp(`<link\\s+rel="alternate"\\s+hreflang="${hreflang}"[^>]*>`, "i");
  const replacement = `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(url)}" />`;
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
};

const setJsonLd = (html, jsonLd) =>
  html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  );

const renderPage = ({ title, description, path: routePath, image, type = "website", jsonLd, bodyHtml = "" }) => {
  const canonicalUrl = absoluteUrl(routePath);
  const imageUrl = absoluteUrl(image);
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setCanonical(html, canonicalUrl);
  html = setAlternate(html, "x-default", canonicalUrl);
  html = setAlternate(html, "en", canonicalUrl);
  html = setMetaName(html, "description", description);
  html = setMetaName(html, "keywords", defaultKeywords);
  html = setMetaProperty(html, "og:type", type);
  html = setMetaProperty(html, "og:title", title);
  html = setMetaProperty(html, "og:description", description);
  html = setMetaProperty(html, "og:url", canonicalUrl);
  html = setMetaProperty(html, "og:image", imageUrl);
  html = setMetaProperty(html, "og:image:alt", title);
  html = setMetaName(html, "twitter:title", title);
  html = setMetaName(html, "twitter:description", description);
  html = setMetaName(html, "twitter:image", imageUrl);
  html = setJsonLd(html, jsonLd);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

  return html;
};

const writeRoute = (routePath, html) => {
  const outDir = path.join(distDir, routePath.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
};

writeRoute(
  "/blog",
  renderPage({
    title: `Fleet Management Blog | ${siteName}`,
    description:
      "Fleet management, AI dispatch, TMS automation, compliance, and logistics operations insights for Indian transporters and shippers.",
    path: "/blog",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `Fleet Management Blog | ${siteName}`,
      url: absoluteUrl("/blog"),
      blogPost: posts.slice(0, 50).map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
        datePublished: post.date,
        image: absoluteUrl(post.image),
        author: {
          "@type": "Person",
          name: post.author,
        },
      })),
    },
    bodyHtml: renderStaticFallback({
      eyebrow: "Fleet Management Blog",
      title: `Fleet Management Blog | ${siteName}`,
      description:
        "Fleet management, AI dispatch, TMS automation, compliance, and logistics operations insights for Indian transporters and shippers.",
      contentHtml: `<ul>${posts
        .map(
          (post) =>
            `<li><a href="${escapeHtml(`/blog/${post.slug}`)}">${escapeHtml(post.title)}</a>${post.description ? ` - ${escapeHtml(post.description)}` : ""}</li>`,
        )
        .join("")}</ul>`,
    }),
  }),
);

posts.forEach((post) => {
  writeRoute(
    `/blog/${post.slug}`,
    renderPage({
      title: `${post.title} | ${siteName}`,
      description: post.description,
      path: `/blog/${post.slug}`,
      image: post.image,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: absoluteUrl(post.image),
        datePublished: post.date,
        dateModified: post.date,
        author: post.author ? {
          "@type": "Person",
          name: post.author,
        } : undefined,
        inLanguage: "en-IN",
        wordCount: post.wordCount,
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/favicon.png"),
            width: 32,
            height: 32,
          },
        },
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
      },
      bodyHtml: renderStaticFallback({
        eyebrow: "Fleetcodes Blog",
        title: post.title,
        description: post.description,
        image: post.image,
        meta: [post.author, post.date].filter(Boolean).join(" | "),
        contentHtml: renderMarkdown(post.content),
      }),
    }),
  );
});

writeRoute(
  "/about",
  renderPage({
    title: `About Us | ${siteName}`,
    description:
      "Learn how Fleetcodes was built by logistics operators for logistics operators — and why we're obsessed with automating fleet management across India.",
    path: "/about",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `About Us | ${siteName}`,
      url: absoluteUrl("/about"),
      description:
        "Learn how Fleetcodes was built by logistics operators for logistics operators — and why we're obsessed with automating fleet management across India.",
    },
  }),
);

writeRoute(
  "/careers",
  renderPage({
    title: `Careers | ${siteName}`,
    description:
      "Join the Fleetcodes team and help build the automation-first TMS transforming Indian logistics. View open roles in engineering, product, and sales.",
    path: "/careers",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `Careers at ${siteName}`,
      url: absoluteUrl("/careers"),
      description:
        "Join the Fleetcodes team and help build the automation-first TMS transforming Indian logistics. View open roles in engineering, product, and sales.",
    },
  }),
);

writeRoute(
  "/book-demo",
  renderPage({
    title: `Book a Free Live Demo | ${siteName}`,
    description:
      "Schedule a 30-minute personalized walkthrough with our logistics automation experts. Learn how Fleetcodes TMS can digitize and automate your operations.",
    path: "/book-demo",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: `Book a Free Live Demo | ${siteName}`,
      url: absoluteUrl("/book-demo"),
      description:
        "Schedule a 30-minute personalized walkthrough with our logistics automation experts. Learn how Fleetcodes TMS can digitize and automate your operations.",
    },
  }),
);

console.log(`Generated static HTML for /blog, /about, /careers, /book-demo, and ${posts.length} blog posts`);
