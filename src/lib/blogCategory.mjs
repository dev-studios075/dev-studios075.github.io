export const BLOG_CATEGORIES = [
  "AI & Automation",
  "Compliance",
  "Fleet Management",
  "Operations",
  "Analytics",
  "Technology",
];

export const BLOG_CATEGORY_ALIASES = {
  Fleet: "Fleet Management",
};

export const resolveBlogCategoryParam = (value) => {
  if (!value || value === "All") return "All";
  const mapped = BLOG_CATEGORY_ALIASES[value] || value;
  return BLOG_CATEGORIES.includes(mapped) ? mapped : "All";
};

export const getBlogCategory = (title = "") => {
  const normalized = title.toLowerCase();
  if (normalized.includes("dispatch") || normalized.includes("operations")) return "Operations";
  if (normalized.includes("compliance") || normalized.includes("permit")) return "Compliance";
  if (normalized.includes("analytics") || normalized.includes("data")) return "Analytics";
  if (normalized.includes("ai") || normalized.includes("automation")) return "AI & Automation";
  if (normalized.includes("fleet") || normalized.includes("vehicle")) return "Fleet Management";
  return "Technology";
};
