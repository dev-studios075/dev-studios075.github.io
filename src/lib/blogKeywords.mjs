const DEFAULT_BLOG_KEYWORDS = [
  "fleet management software",
  "transport management system",
  "logistics automation",
  "AI dispatch",
  "fleet tracking",
  "Indian logistics",
  "TMS software",
  "Fleetcodes",
];

const TOPIC_KEYWORDS = [
  { test: /\b3pl\b|third-party logistics/i, keywords: ["3PL fleet software", "third-party logistics"] },
  { test: /transport management/i, keywords: ["transport management software"] },
  { test: /\btms\b/i, keywords: ["TMS software"] },
  { test: /dispatch/i, keywords: ["fleet dispatch", "AI dispatch"] },
  { test: /gps|tracking|visibility/i, keywords: ["fleet tracking", "real-time visibility"] },
  { test: /compliance|e-way|ais-140|permit/i, keywords: ["fleet compliance"] },
  { test: /billing|pod|settlement/i, keywords: ["fleet billing", "POD management"] },
  { test: /\bev\b|electric|\belectrification\b/i, keywords: ["EV fleet management"] },
  { test: /\bcosts?\b|expense|\bfuel\b/i, keywords: ["fleet cost control"] },
  { test: /maintenance/i, keywords: ["fleet maintenance"] },
];

const splitKeywords = (value = "") =>
  String(value)
    .split(",")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);

const uniqueKeywords = (values) => {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const resolveBlogKeywords = ({ title = "", excerpt = "", keywords = "" } = {}) => {
  const explicit = uniqueKeywords(splitKeywords(keywords));
  if (explicit.length) {
    return uniqueKeywords([...explicit, ...DEFAULT_BLOG_KEYWORDS]).join(", ");
  }

  const cleanTitle = String(title).replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
  const derived = [];

  if (cleanTitle && cleanTitle.length <= 70) derived.push(cleanTitle);

  for (const part of cleanTitle.split(/\s*[-–|:]\s+|\?\s+/)) {
    const trimmed = part.trim();
    if (trimmed.length >= 8 && trimmed.length <= 70) derived.push(trimmed);
  }

  const haystack = `${title} ${excerpt}`;
  for (const rule of TOPIC_KEYWORDS) {
    if (rule.test.test(haystack)) derived.push(...rule.keywords);
  }

  return uniqueKeywords([...derived, ...DEFAULT_BLOG_KEYWORDS]).slice(0, 16).join(", ");
};
