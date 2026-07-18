import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowUpRight, Tag, Search, BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { SITE_NAME, absolutePageUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const fallbackImages = [blog1, blog2, blog3];

const essentialGuideSlugs = [
  "what-is-fleet-management-system-india-guide-2026",
  "how-to-start-transport-business-india-guide-2026",
  "e-way-bill-2-india-transporter-compliance-guide-2026",
  "fleet-sop-automation-transport-operations-india-2026",
  "automating-billing-pods-driver-settlements-fleetcodes-2026",
  "what-is-transport-manifest-guide-transporters-shippers-2026",
];

/** Strip YAML-encoded wrapping quotes */
const cleanTitle = (t = "") => t.replace(/^["'""]|["'""]$/g, "").trim();

const formatReadingTime = (minutes?: number) => `${minutes || 1} min`;

/** Category from title */
const getCategory = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("dispatch") || t.includes("operations")) return "Operations";
  if (t.includes("compliance") || t.includes("permit")) return "Compliance";
  if (t.includes("analytics") || t.includes("data")) return "Analytics";
  if (t.includes("ai") || t.includes("automation")) return "AI & Automation";
  if (t.includes("fleet") || t.includes("vehicle")) return "Fleet";
  return "Technology";
};

const BlogCardSkeleton = () => (
  <div className="group glass rounded-2xl overflow-hidden flex flex-col h-full bg-card/10 animate-pulse">
    {/* Image placeholder */}
    <div className="relative overflow-hidden aspect-[16/10] bg-slate-200 dark:bg-slate-800 shrink-0" />
    
    {/* Body placeholder */}
    <div className="p-5 flex flex-col items-start flex-1 gap-4">
      {/* Date & read time */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
        <div className="w-12 h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
      </div>
      
      {/* Title */}
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="w-full h-4 bg-slate-250 dark:bg-slate-800 rounded-full" />
        <div className="w-4/5 h-4 bg-slate-250 dark:bg-slate-800 rounded-full" />
      </div>
      
      {/* Excerpt description */}
      <div className="flex flex-col items-start gap-1.5 w-full flex-1">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
        <div className="w-5/6 h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
      </div>
      
      {/* Read link placeholder */}
      <div className="w-20 h-3 bg-primary/20 dark:bg-primary/10 rounded-full mt-2" />
    </div>
  </div>
);

const FeaturedCardSkeleton = () => (
  <div className="group block glass rounded-2xl overflow-hidden mb-10 bg-card/10 animate-pulse">
    <div className="grid lg:grid-cols-2 gap-0">
      {/* Image placeholder */}
      <div className="relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[320px] bg-slate-200 dark:bg-slate-800" />
      
      {/* Content placeholder */}
      <div className="p-8 lg:p-10 flex flex-col items-start justify-center gap-6">
        {/* Meta badges placeholder */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-24 h-5 bg-primary/15 dark:bg-primary/10 rounded-full border border-primary/20" />
          <div className="w-16 h-5 bg-slate-200 dark:bg-slate-850 rounded-full" />
          <div className="w-20 h-5 bg-slate-200 dark:bg-slate-850 rounded-full" />
        </div>
        
        {/* Title */}
        <div className="flex flex-col items-start gap-3.5 w-full">
          <div className="w-full h-7 bg-slate-250 dark:bg-slate-800 rounded-full" />
          <div className="w-5/6 h-7 bg-slate-250 dark:bg-slate-800 rounded-full" />
        </div>
        
        {/* Description */}
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
          <div className="w-11/12 h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
          <div className="w-4/5 h-3 bg-slate-200 dark:bg-slate-850 rounded-full" />
        </div>
        
        {/* Link placeholder */}
        <div className="w-24 h-4 bg-primary/20 dark:bg-primary/10 rounded-full" />
      </div>
    </div>
  </div>
);

const Blog = () => {
  const posts = getAllPosts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger loading effect when search query or tag changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, activeCategory]);

  // Compute matched categories and posts for suggestions
  const categories = ["AI & Automation", "Compliance", "Fleet", "Operations", "Analytics", "Technology"];
  const matchedCategories = searchTerm.trim() !== "" 
    ? categories.filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  const matchedPosts = searchTerm.trim() !== ""
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (post.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const suggestions: Array<
    | { type: "category"; id: string; title: string; categoryName: string }
    | { type: "post"; id: string; title: string; slug: string; category: string }
  > = [
    ...matchedCategories.map(cat => ({ type: "category" as const, id: cat, title: `Filter by Category: ${cat}`, categoryName: cat })),
    ...matchedPosts.map(post => ({ type: "post" as const, id: post.slug, title: post.title, slug: post.slug, category: getCategory(post.title) }))
  ];

  // Dismiss dropdown on outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1 < suggestions.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[focusedIndex];
        if (selected.type === "post") {
          trackArticleClick(selected.title, selected.slug);
          navigate(`/blog/${selected.slug}/`);
        } else {
          setActiveCategory(selected.categoryName);
          setSearchTerm("");
        }
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      e.currentTarget.blur();
    }
  };

  // Highlighting matching query characters
  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return posts.length;
    return posts.filter(post => getCategory(post.title) === cat).length;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (post.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "All" || 
      getCategory(post.title) === activeCategory;
      
    return matchesSearch && matchesCategory;
  });

  const [featured, ...rest] = filteredPosts;
  const essentialGuides = essentialGuideSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is (typeof posts)[number] => Boolean(post));
  const pageTitle = `Fleet Management Blog | ${SITE_NAME}`;
  const description =
    "Fleet management, AI dispatch, TMS automation, compliance, and logistics operations insights for Indian transporters and shippers.";

  const trackArticleClick = (postTitle: string, postSlug: string) => {
    trackEvent("select_content", {
      content_type: "blog_post",
      item_id: postSlug,
      item_name: postTitle,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={pageTitle}
        description={description}
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: pageTitle,
          description,
          url: absolutePageUrl("/blog"),
          blogPost: posts.slice(0, 20).map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absolutePageUrl(`/blog/${post.slug}`),
            datePublished: post.date,
            author: post.author ? { "@type": "Person", name: post.author } : undefined,
          })),
        }}
      />
      <Navbar />

      <main className="relative pb-20">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />

        <div className="container-tight pt-32">
          {/* ── Page heading ────────────────────────────────── */}
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4 font-semibold">
              From the blog
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
              Insights for the{" "}
              <span className="text-gradient-primary">autonomous era</span>{" "}
              of logistics.
            </h1>
            <p className="text-lg text-muted-foreground">
              Deep dives on AI-powered TMS, fleet intelligence, and the operational future of logistics.
            </p>
          </div>

          <section aria-labelledby="essential-guides-heading" className="mb-10 rounded-2xl border border-primary/15 bg-primary/[0.035] p-6 sm:p-7">
            <div className="flex items-start gap-3 mb-5">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <h2 id="essential-guides-heading" className="font-display text-xl font-bold tracking-tight">Essential fleet and transport guides</h2>
                <p className="text-sm text-muted-foreground mt-1">Start with these practical guides for running compliant, efficient fleet operations in India.</p>
              </div>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {essentialGuides.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}/`}
                    onClick={() => trackArticleClick(post.title, post.slug)}
                    className="group flex h-full items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-3.5 text-sm font-semibold leading-snug hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    {cleanTitle(post.title)}
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Search & Filter Controls ──────────────────────── */}
          <div className="relative z-20 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-12 p-6 glass rounded-2xl">
            {/* Search Bar Container */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setFocusedIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/50 dark:bg-slate-950/40 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl outline-none text-foreground placeholder:text-muted-foreground transition-all"
              />

              {/* Auto-suggestions Dropdown */}
              {showSuggestions && searchTerm.trim() !== "" && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-2 p-2 glass border border-border/80 rounded-2xl shadow-elegant max-h-[320px] overflow-y-auto scrollbar-none animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex flex-col gap-0.5">
                    {suggestions.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.type === "post") {
                            trackArticleClick(item.title, item.slug);
                            navigate(`/blog/${item.slug}/`);
                          } else {
                            setActiveCategory(item.categoryName);
                            setSearchTerm("");
                          }
                          setShowSuggestions(false);
                        }}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors ${
                          focusedIndex === idx
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <span className="truncate flex-1 font-medium">
                          {highlightMatch(item.title, searchTerm)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                          item.type === "category"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                        }`}>
                          {item.type === "category" ? "Category" : item.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["All", "AI & Automation", "Compliance", "Fleet", "Operations", "Analytics", "Technology"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-slate-100/80 dark:bg-slate-900/40 text-slate-600 dark:text-muted-foreground border-border/40 hover:bg-slate-200/50 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeCategory === cat
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/60 dark:bg-slate-800/70 text-slate-500 dark:text-slate-300"
                  }`}>
                    {getCategoryCount(cat)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Featured post ───────────────────────────────── */}
          {isLoading ? (
            featured && <FeaturedCardSkeleton />
          ) : (
            featured && (
              <Link
                to={`/blog/${featured.slug}/`}
                onClick={() => trackArticleClick(featured.title, featured.slug)}
                className="group block glass rounded-2xl overflow-hidden mb-10 hover:border-primary/20 hover:shadow-elegant transition-all duration-300 animate-in fade-in duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[320px]">
                    <img
                      src={featured.coverImage || fallbackImages[0]}
                      alt={cleanTitle(featured.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                  </div>
                  {/* Content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <Tag className="w-3 h-3" />
                        {getCategory(featured.title)}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full glass border border-border/50 text-muted-foreground inline-flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatReadingTime(featured.readingTime)} read
                      </span>
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {featured.date && new Date(featured.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors">
                      {cleanTitle(featured.title)}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {cleanTitle(featured.excerpt)}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read article
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          )}

          {/* ── Rest of posts grid ───────────────────────────── */}
          {isLoading ? (
            rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((_, idx) => (
                  <BlogCardSkeleton key={idx} />
                ))}
              </div>
            )
          ) : (
            rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
                {rest.map((post, i) => (
                  <article
                    key={post.slug}
                    className="group glass rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/blog/${post.slug}/`}
                      className="relative overflow-hidden aspect-[16/10] block shrink-0"
                      onClick={() => trackArticleClick(post.title, post.slug)}
                    >
                      <img
                        src={post.coverImage || fallbackImages[i % fallbackImages.length]}
                        alt={cleanTitle(post.title)}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category badge over image */}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground">
                        {getCategory(post.title)}
                      </span>
                    </Link>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Date + read time */}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                        {post.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatReadingTime(post.readingTime)}
                        </span>
                      </div>

                      <h2 className="font-display font-semibold text-base leading-snug mb-2.5 group-hover:text-primary transition-colors line-clamp-2">
                        <Link
                          to={`/blog/${post.slug}/`}
                          onClick={() => trackArticleClick(post.title, post.slug)}
                        >
                          {cleanTitle(post.title)}
                        </Link>
                      </h2>

                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                        {cleanTitle(post.excerpt || "")}
                      </p>

                      <Link
                        to={`/blog/${post.slug}/`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary group/link"
                        onClick={() => trackArticleClick(post.title, post.slug)}
                      >
                        Read article
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )
          )}

          {!isLoading && (
            posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">
                No blog posts yet. Check back soon!
              </p>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl glass">
                <p className="text-muted-foreground font-medium mb-2">No matching articles found.</p>
                <p className="text-xs text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            ) : null
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
