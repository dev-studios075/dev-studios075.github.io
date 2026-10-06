import { hasAnalyticsConsent } from "@/lib/cookieConsent";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let isInitialized = false;

export const hasGoogleAnalytics = Boolean(GA_MEASUREMENT_ID);

export const initializeGoogleAnalytics = () => {
  if (!GA_MEASUREMENT_ID || isInitialized || typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  // gtag.js ignores a plain array. It accepts a rest-parameter array once that array owns `callee`, which is how it recognizes an Arguments object.
  window.gtag = window.gtag || ((...args: unknown[]) => {
    Object.defineProperty(args, "callee", { value: window.gtag });
    window.dataLayer?.push(args);
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());

  isInitialized = true;
};

export const trackPageView = (path: string, title: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  initializeGoogleAnalytics();

  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

export const trackEvent = (
  eventName: string,
  parameters: Record<string, string | number | boolean | undefined> = {},
) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  initializeGoogleAnalytics();

  window.gtag?.("event", eventName, {
    page_location: window.location.href,
    ...parameters,
  });
};
