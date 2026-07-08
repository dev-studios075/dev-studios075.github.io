export const SITE_NAME = "Fleetcodes";
const rawUrl = (import.meta.env.VITE_SITE_URL || "https://www.fleetcodes.com").replace(/\/$/, "");
export const SITE_URL = rawUrl === "https://fleetcodes.com" ? "https://www.fleetcodes.com" : rawUrl;

export const DEFAULT_TITLE = "Fleetcodes - Automation-First TMS for Logistics";
export const DEFAULT_DESCRIPTION = "AI-powered TMS that learns your SOPs and runs your logistics autonomously. Cut cost, eliminate errors, and scale fleet operations without scaling headcount.";
export const DEFAULT_IMAGE = "/new-og-image.png";
export const DEFAULT_KEYWORDS = "fleet management software, transport management system, logistics automation, AI dispatch, fleet tracking, Indian logistics, TMS software, Fleetcodes";
export const DEFAULT_IMAGE_WIDTH = "1200";
export const DEFAULT_IMAGE_HEIGHT = "630";
export const APP_DOWNLOAD_URL = "https://app-link.fleetcodes.com/prod/app-release.apk";
export const APP_DOWNLOAD_QR_SRC = "/assets/images/fleetcodes-app-download-qr.svg";
export const LINKEDIN_URL = "https://www.linkedin.com/company/fleetcodes";

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};
