export const VALID_BLOG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Old indexed or space/mixed-case filenames → kebab-case slugs. */
export const BLOG_SLUG_REDIRECTS = {
  "Gst compliance automation transport business india 2026":
    "gst-compliance-automation-transport-business-india-2026",
  "Fleet-management-software-vs-manual-operations-india-2026":
    "fleet-management-software-vs-manual-operations-india-2026",
  "Night-driving-safety-fleet-technology-india-2026":
    "night-driving-safety-fleet-technology-india-2026",
  "Predictive-maintenance-fleet-software-india-2026":
    "predictive-maintenance-fleet-software-india-2026",
  "Replace-whatsapp-spreadsheets-transport-management-india-2026":
    "replace-whatsapp-spreadsheets-transport-management-india-2026",
};

export const resolveBlogSlugRedirect = (slug = "") => {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    decoded = slug;
  }

  if (BLOG_SLUG_REDIRECTS[decoded]) return BLOG_SLUG_REDIRECTS[decoded];

  const normalized = decoded.toLowerCase();
  return Object.entries(BLOG_SLUG_REDIRECTS).find(([from]) => from.toLowerCase() === normalized)?.[1];
};
