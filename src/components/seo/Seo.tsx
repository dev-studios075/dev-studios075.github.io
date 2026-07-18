import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  absolutePageUrl,
  absoluteUrl,
} from "@/lib/site";

type JsonLd = Record<string, unknown>;

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  keywords?: string;
  locale?: string;
  imageWidth?: string;
  imageHeight?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: JsonLd | JsonLd[];
}

const setMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const setLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
};

const removeMeta = (selector: string) => document.head.querySelector(selector)?.remove();

const setJsonLd = (jsonLd?: JsonLd | JsonLd[]) => {
  const id = "route-json-ld";
  const existing = document.getElementById(id);

  if (!jsonLd) {
    existing?.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.id = id;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(jsonLd);

  if (!existing) {
    document.head.appendChild(script);
  }
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  keywords = DEFAULT_KEYWORDS,
  locale = "en_IN",
  imageWidth = DEFAULT_IMAGE_WIDTH,
  imageHeight = DEFAULT_IMAGE_HEIGHT,
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
}: SeoProps) => {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = absolutePageUrl(path || location.pathname);
    const imageUrl = absoluteUrl(image);

    document.title = title;
    setLink("canonical", canonicalUrl);

    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    });
    setMeta('meta[name="googlebot"]', {
      name: "googlebot",
      content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    });

    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: locale });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    setMeta('meta[property="og:image:width"]', { property: "og:image:width", content: imageWidth });
    setMeta('meta[property="og:image:height"]', { property: "og:image:height", content: imageHeight });
    setMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: title });

    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    setMeta('meta[name="twitter:image:width"]', { name: "twitter:image:width", content: imageWidth });
    setMeta('meta[name="twitter:image:height"]', { name: "twitter:image:height", content: imageHeight });

    if (publishedTime) {
      setMeta('meta[property="article:published_time"]', {
        property: "article:published_time",
        content: publishedTime,
      });
    } else removeMeta('meta[property="article:published_time"]');

    if (modifiedTime) {
      setMeta('meta[property="article:modified_time"]', {
        property: "article:modified_time",
        content: modifiedTime,
      });
    } else removeMeta('meta[property="article:modified_time"]');

    if (author) {
      setMeta('meta[name="author"]', { name: "author", content: author });
      setMeta('meta[property="article:author"]', { property: "article:author", content: author });
    } else {
      removeMeta('meta[name="author"]');
      removeMeta('meta[property="article:author"]');
    }

    setJsonLd(jsonLd);
  }, [
    author,
    description,
    image,
    imageHeight,
    imageWidth,
    jsonLd,
    keywords,
    locale,
    location.pathname,
    location.search,
    modifiedTime,
    noindex,
    path,
    publishedTime,
    title,
    type,
  ]);

  return null;
};

export default Seo;
