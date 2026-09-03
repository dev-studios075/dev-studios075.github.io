export const COOKIE_CONSENT_KEY = "fleetcodes-cookie-consent-v1";
export const COOKIE_CONSENT_EVENT = "fleetcodes:cookie-consent-change";
export const OPEN_COOKIE_PREFERENCES_EVENT = "fleetcodes:open-cookie-preferences";

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const readCookieConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return { essential: true, analytics: parsed.analytics, marketing: parsed.marketing, updatedAt: parsed.updatedAt || "" };
  } catch {
    return null;
  }
};

export const saveCookieConsent = (choices: Pick<CookieConsent, "analytics" | "marketing">) => {
  const consent: CookieConsent = { essential: true, ...choices, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
  return consent;
};

export const hasAnalyticsConsent = () => readCookieConsent()?.analytics === true;

export const openCookiePreferences = () => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
