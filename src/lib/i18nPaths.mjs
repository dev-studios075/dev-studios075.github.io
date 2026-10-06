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

/** Pages that have a real Hindi URL (hreflang, sitemap, prerender). Individual blog posts are English-only. */
export const hasHindiAlternate = (pathname = "/") => {
  const path = stripHindiPrefix(pathname);
  return CORE_LOCALIZABLE_PATHS.includes(path) || /^\/blog\/page\/\d+$/.test(path);
};

/** Paths that may keep Hindi chrome, including English-only blog articles. */
export const isLocalizablePath = (pathname = "/") => {
  const path = stripHindiPrefix(pathname);
  return hasHindiAlternate(path) || /^\/blog\/[^/]+$/.test(path);
};
