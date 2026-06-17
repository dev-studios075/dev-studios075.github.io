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
  if (!GA_MEASUREMENT_ID || isInitialized || typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });

  isInitialized = true;
};

export const trackPageView = (path: string, title: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") {
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
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") {
    return;
  }

  initializeGoogleAnalytics();

  window.gtag?.("event", eventName, {
    page_location: window.location.href,
    ...parameters,
  });
};
