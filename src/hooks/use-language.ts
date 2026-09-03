import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Language = "en" | "hi";
const LANGUAGE_KEY = "fleetcodes-language";
export const getPreferredLanguage = (): Language | null => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return saved === "hi" || saved === "en" ? saved : null;
};

const corePaths = ["/", "/about", "/careers", "/book-demo", "/privacy", "/terms", "/security", "/blog"];

const stripHindiPrefix = (pathname: string) => {
  const stripped = pathname.replace(/^\/hi(?=\/|$)/, "") || "/";
  return stripped.length > 1 ? stripped.replace(/\/$/, "") : stripped;
};

export const isLocalizablePath = (pathname: string) => {
  const path = stripHindiPrefix(pathname);
  return corePaths.includes(path) || /^\/blog\/page\/\d+$/.test(path) || /^\/blog\/[^/]+$/.test(path);
};

export const useLanguage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const language: Language = location.pathname === "/hi" || location.pathname.startsWith("/hi/") ? "hi" : "en";
  const isHindi = language === "hi";

  useEffect(() => {
    document.documentElement.lang = isHindi ? "hi" : "en";
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [isHindi, language]);

  const localizePath = (path: string) => {
    if (!isHindi || /^https?:/i.test(path) || path.startsWith("#")) return path;
    if (path.startsWith("/#")) return `/hi/${path.slice(1)}`;
    return path === "/" ? "/hi/" : `/hi${path.startsWith("/") ? path : `/${path}`}`;
  };

  const setLanguage = (next: Language) => {
    window.localStorage.setItem(LANGUAGE_KEY, next);
    const base = stripHindiPrefix(location.pathname);
    const pathname = next === "hi" && isLocalizablePath(base) ? (base === "/" ? "/hi/" : `/hi${base}/`) : `${base}${base === "/" ? "" : "/"}`;
    navigate(`${pathname}${location.search}${location.hash}`);
  };

  return { language, isHindi, localizePath, setLanguage };
};
