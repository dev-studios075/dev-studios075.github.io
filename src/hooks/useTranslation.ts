import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import english from "@/locales/en.json";
import hindi from "@/locales/hi.json";
import { isLocalizablePath, stripHindiPrefix } from "@/lib/i18nPaths.mjs";

export type Language = "en" | "hi";
const LANGUAGE_KEY = "fleetcodes-language";

export { hasHindiAlternate, isLocalizablePath, stripHindiPrefix } from "@/lib/i18nPaths.mjs";

export const getPreferredLanguage = (): Language | null => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return saved === "hi" || saved === "en" ? saved : null;
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
