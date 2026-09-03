import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import english from "@/locales/en.json";
import hindi from "@/locales/hi.json";

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

type Variables = Record<string, string | number>;
const dictionaries = { en: english, hi: hindi } as const;

const resolve = (source: unknown, key: string): unknown => key.split(".").reduce<unknown>((value, part) => {
  if (!value || typeof value !== "object") return undefined;
  return (value as Record<string, unknown>)[part];
}, source);

const interpolate = (value: string, variables?: Variables) => variables
  ? value.replace(/\{\{(\w+)\}\}/g, (_, key) => String(variables[key] ?? `{{${key}}}`))
  : value;

export const useTranslation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const language: Language = location.pathname === "/hi" || location.pathname.startsWith("/hi/") ? "hi" : "en";

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const localizePath = (path: string) => {
    if (language !== "hi" || /^https?:/i.test(path) || path.startsWith("#")) return path;
    if (path.startsWith("/#")) return `/hi/${path.slice(1)}`;
    return path === "/" ? "/hi/" : `/hi${path.startsWith("/") ? path : `/${path}`}`;
  };

  const setLanguage = (next: Language) => {
    window.localStorage.setItem(LANGUAGE_KEY, next);
    const base = stripHindiPrefix(location.pathname);
    const pathname = next === "hi" && isLocalizablePath(base) ? (base === "/" ? "/hi/" : `/hi${base}/`) : `${base}${base === "/" ? "" : "/"}`;
    navigate(`${pathname}${location.search}${location.hash}`);
  };

  const t = (key: string, variables?: Variables) => {
    const localized = resolve(dictionaries[language], key);
    const fallback = resolve(dictionaries.en, key);
    const value = typeof localized === "string" ? localized : typeof fallback === "string" ? fallback : key;
    return interpolate(value, variables);
  };

  const tObject = <T,>(key: string): T => {
    const localized = resolve(dictionaries[language], key);
    const fallback = resolve(dictionaries.en, key);
    return (localized ?? fallback) as T;
  };

  return { language, localizePath, setLanguage, t, tObject };
};
