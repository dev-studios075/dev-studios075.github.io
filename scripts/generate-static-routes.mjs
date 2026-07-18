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

const truncateAtWord = (value = "", maxLength) => {
  const clean = String(value).replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength + 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > maxLength * 0.7 ? boundary : maxLength).trim()}…`;
};

const seoTitle = (title = "") => {
  const suffix = ` | ${siteName}`;
  const clean = String(title).replace(/\s+/g, " ").trim();
  if (clean.toLowerCase().includes(siteName.toLowerCase())) return truncateAtWord(clean, 60);
  if (`${clean}${suffix}`.length <= 60) return `${clean}${suffix}`;
  return `${truncateAtWord(clean, 60 - suffix.length - 1)}${suffix}`;
};

const seoDescription = (description = "") => truncateAtWord(description, 160);

const cleanMarkdown = (content = "") =>
  content
    .replace(/^#\s+.*$/m, "")
    .replace(/^\*\*By[^\n]+Min Read\*\*$/im, "")
    .replace(/^By[^\n]+Min Read$/im, "")
    .trim();

const renderMarkdown = (content = "") => micromark(cleanMarkdown(content));

const renderStaticFallback = ({ eyebrow, title, description, image, meta, contentHtml, relatedHtml }) => `
        <main data-static-fallback style="max-width: 920px; margin: 0 auto; padding: 48px 24px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827;">
          ${eyebrow ? `<p style="margin: 0 0 12px; color: #4f46e5; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">${escapeHtml(eyebrow)}</p>` : ""}
          <h1 style="margin: 0 0 16px; font-size: clamp(32px, 6vw, 56px); line-height: 1.05; letter-spacing: -0.02em;">${escapeHtml(title)}</h1>
          ${description ? `<p style="margin: 0 0 20px; color: #4b5563; font-size: 18px; line-height: 1.65;">${escapeHtml(description)}</p>` : ""}
          ${meta ? `<p style="margin: 0 0 28px; color: #6b7280; font-size: 14px;">${escapeHtml(meta)}</p>` : ""}
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="display: block; width: 100%; max-height: 420px; object-fit: cover; border-radius: 18px; margin: 0 0 36px;" />` : ""}
          ${contentHtml ? `<article style="font-size: 17px; line-height: 1.78;">${contentHtml}</article>` : ""}
          ${relatedHtml || ""}
        </main>`;

const absoluteUrl = (value = "/") => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${siteUrl}${encodeURI(normalizedPath)}`;
};

const canonicalPath = (value = "/") => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const basePath = value.split(/[?#]/)[0] || "/";
  const normalizedPath = basePath.startsWith("/") ? basePath : `/${basePath}`;

  if (normalizedPath === "/" || normalizedPath.endsWith("/")) {
    return normalizedPath;
  }

  if (/\/[^/]+\.[^/]+$/.test(normalizedPath)) {
    return normalizedPath;
  }

  return `${normalizedPath}/`;
};

const absolutePageUrl = (value = "/") => {
  const canonical = canonicalPath(value);
  return /^https?:\/\//i.test(canonical) ? canonical : absoluteUrl(canonical);
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

const getCategory = (title = "") => {
  const normalized = title.toLowerCase();
  if (normalized.includes("dispatch") || normalized.includes("operations")) return "Operations";
  if (normalized.includes("compliance") || normalized.includes("permit")) return "Compliance";
  if (normalized.includes("analytics") || normalized.includes("data")) return "Analytics";
  if (normalized.includes("ai") || normalized.includes("automation")) return "AI & Automation";
  if (normalized.includes("fleet") || normalized.includes("vehicle")) return "Fleet Management";
  return "Technology";
};

const getRelatedPosts = (currentPost) =>
  (() => {
    const currentIndex = posts.findIndex((post) => post.slug === currentPost.slug);
    const guaranteedNeighbors = [-2, -1, 1, 2]
      .map((offset) => posts[(currentIndex + offset + posts.length) % posts.length])
      .filter((post) => post && post.slug !== currentPost.slug);
    const semanticMatches = posts
      .filter((candidate) => candidate.slug !== currentPost.slug)
      .sort((a, b) => {
      const category = getCategory(currentPost.title);
      const aSameCategory = getCategory(a.title) === category ? 1 : 0;
      const bSameCategory = getCategory(b.title) === category ? 1 : 0;

      if (aSameCategory !== bSameCategory) {
        return bSameCategory - aSameCategory;
      }

      return (b.date || "").localeCompare(a.date || "");
      });

    return [...new Map([...guaranteedNeighbors, ...semanticMatches].map((post) => [post.slug, post])).values()]
      .slice(0, 6);
  })();

const essentialGuideSlugs = [
  "what-is-fleet-management-system-india-guide-2026",
  "how-to-start-transport-business-india-guide-2026",
  "e-way-bill-2-india-transporter-compliance-guide-2026",
  "fleet-sop-automation-transport-operations-india-2026",
  "automating-billing-pods-driver-settlements-fleetcodes-2026",
  "what-is-transport-manifest-guide-transporters-shippers-2026",
];
const postsPerPage = 10;

const renderRelatedLinks = (currentPost) => {
  const related = getRelatedPosts(currentPost);

  if (!related.length) {
    return "";
  }

  return `
          <nav aria-label="Related Fleetcodes articles" style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <h2 style="margin: 0 0 16px; font-size: 22px; line-height: 1.2;">Related fleet management guides</h2>
            <ul style="margin: 0; padding-left: 20px;">
              ${related
                .map(
                  (post) =>
                    `<li style="margin: 0 0 10px;"><a href="${escapeHtml(canonicalPath(`/blog/${post.slug}`))}">${escapeHtml(post.title)}</a></li>`,
                )
                .join("")}
            </ul>
          </nav>`;
};

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
  const canonicalUrl = absolutePageUrl(routePath);
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
  "/",
  renderPage({
    title: `${siteName} - Automation-First TMS for Logistics`,
    description:
      "AI-powered TMS that learns your SOPs and runs your logistics autonomously. Cut cost, eliminate errors, and scale fleet operations without scaling headcount.",
    path: "/",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: siteName,
          url: absolutePageUrl("/"),
          logo: absoluteUrl("/favicon.png"),
          sameAs: ["https://www.linkedin.com/company/fleetcodes"],
        },
        {
          "@type": "SoftwareApplication",
          name: siteName,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, Android",
          url: absolutePageUrl("/"),
          image: absoluteUrl(defaultImage),
        },
        {
          "@type": "ItemList",
          name: "Latest Fleetcodes logistics guides",
          itemListElement: posts.slice(0, 12).map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absolutePageUrl(`/blog/${post.slug}`),
            name: post.title,
          })),
        },
      ],
    },
    bodyHtml: renderStaticFallback({
      eyebrow: "Fleetcodes",
      title: `${siteName} - Automation-First TMS for Logistics`,
      description:
        "AI-powered TMS for dispatch, visibility, billing, compliance, and fleet operations automation.",
      contentHtml: `
        <nav aria-label="Core Fleetcodes pages">
          <ul>
            <li><a href="/">Homepage</a></li>
            <li><a href="/book-demo/">Book a Demo</a></li>
            <li><a href="/blog/">Fleet Management Blog</a></li>
            <li><a href="/about/">About Fleetcodes</a></li>
            <li><a href="/careers/">Careers</a></li>
          </ul>
        </nav>
        <section>
          <h2>Latest fleet management guides</h2>
          <ul>
            ${posts
              .slice(0, 12)
              .map((post) => `<li><a href="${escapeHtml(canonicalPath(`/blog/${post.slug}`))}">${escapeHtml(post.title)}</a></li>`)
              .join("")}
          </ul>
        </section>
      `,
    }),
  }),
);

const blogPageCount = Math.max(1, Math.ceil(posts.length / postsPerPage));

for (let pageNumber = 1; pageNumber <= blogPageCount; pageNumber += 1) {
  const routePath = pageNumber === 1 ? "/blog" : `/blog/page/${pageNumber}`;
  const pagePosts = posts.slice((pageNumber - 1) * postsPerPage, pageNumber * postsPerPage);
  const pageTitle = pageNumber === 1
    ? `Fleet Management Blog | ${siteName}`
    : `Fleet Management Blog - Page ${pageNumber} | ${siteName}`;
  const paginationHtml = `
    <nav aria-label="Blog pagination">
      ${pageNumber > 1 ? `<a rel="prev" href="${pageNumber === 2 ? "/blog/" : `/blog/page/${pageNumber - 1}/`}">Previous</a>` : ""}
      ${Array.from({ length: blogPageCount }, (_, index) => index + 1)
        .map((page) => `<a href="${page === 1 ? "/blog/" : `/blog/page/${page}/`}"${page === pageNumber ? ' aria-current="page"' : ""}>${page}</a>`)
        .join(" ")}
      ${pageNumber < blogPageCount ? `<a rel="next" href="/blog/page/${pageNumber + 1}/">Next</a>` : ""}
    </nav>`;

  writeRoute(
    routePath,
    renderPage({
    title: pageTitle,
    description:
      "Fleet management, AI dispatch, TMS automation, compliance, and logistics operations insights for Indian transporters and shippers.",
    path: routePath,
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: pageTitle,
      url: absolutePageUrl(routePath),
      blogPost: pagePosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: absolutePageUrl(`/blog/${post.slug}`),
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
      title: pageTitle,
      description:
        "Fleet management, AI dispatch, TMS automation, compliance, and logistics operations insights for Indian transporters and shippers.",
      contentHtml: `
        ${pageNumber === 1 ? `<section aria-labelledby="essential-guides-heading">
          <h2 id="essential-guides-heading">Essential fleet and transport guides</h2>
          <ul>${essentialGuideSlugs
            .map((slug) => posts.find((post) => post.slug === slug))
            .filter(Boolean)
            .map((post) => `<li><a href="${escapeHtml(canonicalPath(`/blog/${post.slug}`))}">${escapeHtml(post.title)}</a></li>`)
            .join("")}</ul>
        </section>` : ""}
        <h2>All fleet management articles</h2>
        <ul>${pagePosts
        .map(
          (post) =>
            `<li><a href="${escapeHtml(canonicalPath(`/blog/${post.slug}`))}">${escapeHtml(post.title)}</a>${post.description ? ` - ${escapeHtml(post.description)}` : ""}</li>`,
        )
        .join("")}</ul>
        ${paginationHtml}`,
    }),
  }));
}

posts.forEach((post) => {
  const canonicalUrl = absolutePageUrl(`/blog/${post.slug}`);
  writeRoute(
    `/blog/${post.slug}`,
    renderPage({
      title: seoTitle(post.title),
      description: seoDescription(post.description),
      path: `/blog/${post.slug}`,
      image: post.image,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [{
        "@type": "BlogPosting",
        headline: post.title,
        description: seoDescription(post.description),
        image: absoluteUrl(post.image),
        datePublished: post.date,
        dateModified: post.date,
        author: post.author ? {
          "@type": post.author.toLowerCase().includes("fleetcodes") ? "Organization" : "Person",
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
        mainEntityOfPage: absolutePageUrl(`/blog/${post.slug}`),
        isPartOf: {
          "@type": "Blog",
          name: `Fleet Management Blog | ${siteName}`,
          url: absolutePageUrl("/blog"),
        },
        relatedLink: getRelatedPosts(post).map((related) => absolutePageUrl(`/blog/${related.slug}`)),
      }, {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absolutePageUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: absolutePageUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
        ],
      }],
      },
      bodyHtml: renderStaticFallback({
        eyebrow: "Fleetcodes Blog",
        title: post.title,
        description: post.description,
        image: post.image,
        meta: [post.author, post.date].filter(Boolean).join(" | "),
        contentHtml: renderMarkdown(post.content),
        relatedHtml: renderRelatedLinks(post),
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
      url: absolutePageUrl("/about"),
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
      url: absolutePageUrl("/careers"),
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
      url: absolutePageUrl("/book-demo"),
      description:
        "Schedule a 30-minute personalized walkthrough with our logistics automation experts. Learn how Fleetcodes TMS can digitize and automate your operations.",
    },
  }),
);

console.log(`Generated static HTML for /, /blog, /about, /careers, /book-demo, and ${posts.length} blog posts`);
