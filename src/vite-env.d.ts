/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@/lib/parseFrontmatter.mjs" {
  export const parseFrontmatter: (raw?: string) => {
    meta: Record<string, string>;
    content: string;
    valid: boolean;
  };
}

declare module "@/lib/coverImage.mjs" {
  export const coverPicture: (src?: string) => {
    fallback: string;
    webpSrcSet: string;
    sizes: string;
  };
}

declare module "@/lib/blogCategory.mjs" {
  export const BLOG_CATEGORIES: readonly string[];
  export const BLOG_CATEGORY_ALIASES: Record<string, string>;
  export const resolveBlogCategoryParam: (value?: string | null) => string;
  export const getBlogCategory: (title?: string) => string;
}

declare module "@/lib/i18nPaths.mjs" {
  export const CORE_LOCALIZABLE_PATHS: readonly string[];
  export const stripHindiPrefix: (pathname?: string) => string;
  export const hasHindiAlternate: (pathname?: string) => boolean;
  export const isLocalizablePath: (pathname?: string) => boolean;
}

declare module "@/lib/blogKeywords.mjs" {
  export const resolveBlogKeywords: (input?: {
    title?: string;
    excerpt?: string;
    keywords?: string;
  }) => string;
}

declare module "@/lib/blogSlugRedirects.mjs" {
  export const VALID_BLOG_SLUG: RegExp;
  export const BLOG_SLUG_REDIRECTS: Record<string, string>;
  export const resolveBlogSlugRedirect: (slug?: string) => string | undefined;
}
