import { hasAnalyticsConsent, readCookieConsent } from "@/lib/cookieConsent";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __fleetcodesGaInitialView?: boolean;
  }
}

export const hasGoogleAnalytics = Boolean(GA_MEASUREMENT_ID);

export const applyGoogleConsent = () => {
  if (typeof window === "undefined" || !window.gtag) return;
  const saved = readCookieConsent();
  if (!saved) return;

  const marketing = saved.marketing ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: saved.analytics ? "granted" : "denied",
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  });
};

export const trackPageView = (path: string, title: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }

  applyGoogleConsent();
  if (!hasAnalyticsConsent()) return;

  // The head tag already sent this page view when consent was saved before load.
  if (window.__fleetcodesGaInitialView) {
    window.__fleetcodesGaInitialView = false;
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

export const trackEvent = (
  eventName: string,
  parameters: Record<string, string | number | boolean | undefined> = {},
) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag || !hasAnalyticsConsent()) {
    return;
  }

  applyGoogleConsent();

  window.gtag("event", eventName, {
    page_location: window.location.href,
    ...parameters,
  });
};
