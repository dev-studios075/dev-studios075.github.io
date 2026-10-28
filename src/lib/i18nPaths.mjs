export const CORE_LOCALIZABLE_PATHS = [
  "/",
  "/about",
  "/careers",
  "/book-demo",
  "/privacy",
  "/terms",
  "/security",
  "/blog",
];

export const stripHindiPrefix = (pathname = "/") => {
  const stripped = pathname.replace(/^\/hi(?=\/|$)/, "") || "/";
  return stripped.length > 1 ? stripped.replace(/\/$/, "") : stripped;
};

/**
 * Pages with a real Hindi URL (hreflang + sitemap).
 * Individual blog articles are English-only: /hi/blog/{slug} redirects to /blog/{slug}.
 */
export const hasHindiAlternate = (pathname = "/") => {
  const path = stripHindiPrefix(pathname);
  return CORE_LOCALIZABLE_PATHS.includes(path) || /^\/blog\/page\/\d+$/.test(path);
};

/** Paths the language switcher may move to a /hi/… URL. Same as hasHindiAlternate. */
export const isLocalizablePath = (pathname = "/") => hasHindiAlternate(pathname);

/** True for an English blog article path (/blog/{slug}), not listing or pagination. */
export const isBlogArticlePath = (pathname = "/") => {
  const path = stripHindiPrefix(pathname);
  return /^\/blog\/[^/]+$/.test(path) && !/^\/blog\/page\/\d+$/.test(path);
};
