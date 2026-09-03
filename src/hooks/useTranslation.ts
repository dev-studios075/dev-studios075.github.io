import english from "@/locales/en.json";
import hindi from "@/locales/hi.json";
import { useLanguage } from "@/hooks/use-language";

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
  const languageState = useLanguage();
  const { language } = languageState;

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

  return { t, tObject, ...languageState };
};
