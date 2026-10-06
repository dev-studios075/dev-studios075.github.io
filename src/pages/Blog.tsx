import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Calendar, Clock, ArrowUpRight, Tag, Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { SITE_NAME, absolutePageUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { BLOG_CATEGORIES, getBlogCategory, resolveBlogCategoryParam } from "@/lib/blogCategory.mjs";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import { useTranslation } from "@/hooks/useTranslation";

const fallbackImages = [blog1, blog2, blog3];
const POSTS_PER_PAGE = 10;

const getPaginationItems = (currentPage: number, totalPages: number): Array<number | "ellipsis-start" | "ellipsis-end"> => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "ellipsis-end"];
  if (currentPage >= totalPages - 2) {
    return ["ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return ["ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end"];
};

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

const formatReadingTime = (minutes?: number) => minutes || 1;

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
  const { t, language, localizePath } = useTranslation();
  const locale = language === "hi" ? "hi-IN" : "en-US";
  const blogBasePath = language === "hi" ? "/hi/blog/" : "/blog/";
  const categoryLabel = (category: string) => t(`pages.blog.categories.${category}`);
  const posts = getAllPosts();
  const navigate = useNavigate();
  const { page: pageParam } = useParams<{ page?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = resolveBlogCategoryParam(searchParams.get("category"));
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(() => initialCategory);
  const [filterPage, setFilterPage] = useState(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    return Number.isFinite(page) && page > 0 ? page : 1;
  });
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

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const category = resolveBlogCategoryParam(searchParams.get("category"));
    const pageParamValue = Number.parseInt(searchParams.get("page") || "1", 10);
    const page = Number.isFinite(pageParamValue) && pageParamValue > 0 ? pageParamValue : 1;

    setSearchTerm((current) => current === query ? current : query);
    setActiveCategory((current) => current === category ? current : category);
    setFilterPage((current) => current === page ? current : page);
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextParams = new URLSearchParams();
      const query = searchTerm.trim();
      if (query) nextParams.set("q", query);
      if (activeCategory !== "All") nextParams.set("category", activeCategory);
      if ((query || activeCategory !== "All") && filterPage > 1) {
        nextParams.set("page", String(filterPage));
      }

      if (pageParam && nextParams.toString()) {
        navigate(`${blogBasePath}?${nextParams.toString()}`, { replace: true });
      } else if (nextParams.toString() !== searchParams.toString()) {
        setSearchParams(nextParams, { replace: true });
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [activeCategory, blogBasePath, filterPage, navigate, pageParam, searchParams, searchTerm, setSearchParams]);

  // Compute matched categories and posts for suggestions
  const categories = BLOG_CATEGORIES;
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
    ...matchedCategories.map(cat => ({ type: "category" as const, id: cat, title: t("pages.blog.filterCategory", { category: categoryLabel(cat) }), categoryName: cat })),
    ...matchedPosts.map(post => ({ type: "post" as const, id: post.slug, title: post.title, slug: post.slug, category: getBlogCategory(post.title) }))
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
          navigate(localizePath(`/blog/${selected.slug}/`));
        } else {
          setActiveCategory(selected.categoryName);
          setSearchTerm("");
          setFilterPage(1);
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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesSearch = (post: (typeof posts)[number]) =>
    normalizedSearch === "" ||
    post.title.toLowerCase().includes(normalizedSearch) ||
    (post.excerpt || "").toLowerCase().includes(normalizedSearch);

  const getCategoryCount = (cat: string) => {
    const searchMatches = posts.filter(matchesSearch);
    if (cat === "All") return searchMatches.length;
    return searchMatches.filter(post => getBlogCategory(post.title) === cat).length;
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = 
      activeCategory === "All" || 
      getBlogCategory(post.title) === activeCategory;
      
    return matchesSearch(post) && matchesCategory;
  });

  const isFiltering = searchTerm.trim() !== "" || activeCategory !== "All";
  const requestedPage = Number.parseInt(pageParam || "1", 10);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const routePage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const currentPage = isFiltering ? Math.min(filterPage, totalPages) : routePage;
  const pagePosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const [featured, ...rest] = pagePosts;
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const essentialGuides = essentialGuideSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is (typeof posts)[number] => Boolean(post));
  const seoPage = isFiltering ? 1 : currentPage;
  const pageTitle = seoPage > 1
    ? `${t("pages.blog.seoTitle")} - ${t("pages.blog.page", { page: seoPage })} | ${SITE_NAME}`
    : `${t("pages.blog.seoTitle")} | ${SITE_NAME}`;
  const basePagePath = seoPage > 1 ? `/blog/page/${seoPage}` : "/blog";
  const pagePath = localizePath(basePagePath);
  const description = t("pages.blog.seoDescription");

  const trackArticleClick = (postTitle: string, postSlug: string) => {
    trackEvent("select_content", {
      content_type: "blog_post",
      item_id: postSlug,
      item_name: postTitle,
    });
  };

  const changeFilterPage = (page: number) => {
    setFilterPage(Math.min(Math.max(page, 1), totalPages));
    window.requestAnimationFrame(() => {
      document.getElementById("blog-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={pageTitle}
        description={description}
        path={pagePath}
        noindex={isFiltering || requestedPage !== currentPage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: pageTitle,
          description,
          url: absolutePageUrl(pagePath),
          blogPost: pagePosts.map((post) => ({
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
              {t("pages.blog.eyebrow")}
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
              {t("pages.blog.titlePrefix")}{" "}
              <span className="text-gradient-primary">{t("pages.blog.titleAccent")}</span>{" "}
              {t("pages.blog.titleSuffix")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("pages.blog.description")}
            </p>
          </div>

          {currentPage === 1 && !isFiltering && (
          <section aria-labelledby="essential-guides-heading" className="mb-8 rounded-xl border border-primary/15 bg-primary/[0.035] p-4 sm:mb-10 sm:rounded-2xl sm:p-7">
            <div className="mb-4 flex items-start gap-3 sm:mb-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:rounded-xl">
                <BookOpen className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h2 id="essential-guides-heading" className="font-display text-lg font-bold tracking-tight sm:text-xl">{t("pages.blog.guidesTitle")}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("pages.blog.guidesDescription")}</p>
              </div>
            </div>
            <ul className="divide-y divide-border/60 border-y border-border/60 sm:grid sm:grid-cols-2 sm:gap-2.5 sm:divide-y-0 sm:border-0 lg:grid-cols-3">
              {essentialGuides.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={localizePath(`/blog/${post.slug}/`)}
                    onClick={() => trackArticleClick(post.title, post.slug)}
                    className="group flex h-full min-h-16 items-center justify-between gap-3 px-1 py-3 text-sm font-semibold leading-snug transition-colors hover:text-primary sm:min-h-0 sm:items-start sm:rounded-xl sm:border sm:border-border/60 sm:bg-background/60 sm:p-3.5 sm:hover:border-primary/30"
                  >
                    <span className="line-clamp-2 sm:line-clamp-3">{cleanTitle(post.title)}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          )}

          {/* ── Search & Filter Controls ──────────────────────── */}
          <div className="relative z-20 mb-9 flex flex-col items-stretch gap-3 rounded-xl p-4 glass sm:mb-12 sm:gap-4 sm:rounded-2xl sm:p-6 md:flex-row md:items-center md:justify-between">
            {/* Search Bar Container */}
            <div ref={searchContainerRef} className="relative w-full md:w-64 md:shrink-0 xl:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("pages.blog.search")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFilterPage(1);
                  setShowSuggestions(true);
                  setFocusedIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-border/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 dark:bg-slate-950/40 sm:rounded-xl sm:py-2"
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
                            navigate(localizePath(`/blog/${item.slug}/`));
                        } else {
                          setActiveCategory(item.categoryName);
                          setSearchTerm("");
                          setFilterPage(1);
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
                          {item.type === "category" ? t("pages.blog.category") : categoryLabel(item.category)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Categories */}
            <div className="flex min-w-0 touch-pan-x items-center gap-2 overflow-x-auto pb-1 scrollbar-none md:flex-1 md:flex-wrap md:gap-1.5 md:overflow-visible md:pb-0">
              {["All", ...BLOG_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setFilterPage(1);
                  }}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold tracking-wide transition-all sm:py-1.5 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-slate-100/80 dark:bg-slate-900/40 text-slate-600 dark:text-muted-foreground border-border/40 hover:bg-slate-200/50 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <span>{cat === "All" ? t("pages.blog.all") : categoryLabel(cat)}</span>
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

          <div id="blog-results" className="scroll-mt-28" />

          {/* ── Featured post ───────────────────────────────── */}
          {isLoading ? (
            featured && <FeaturedCardSkeleton />
          ) : (
            featured && (
              <Link
                to={localizePath(`/blog/${featured.slug}/`)}
                onClick={() => trackArticleClick(featured.title, featured.slug)}
                className="group block glass rounded-2xl overflow-hidden mb-10 hover:border-primary/20 hover:shadow-elegant transition-all duration-300 animate-in fade-in"
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
                        {categoryLabel(getBlogCategory(featured.title))}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full glass border border-border/50 text-muted-foreground inline-flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {t("pages.blogPost.minuteRead", { minutes: formatReadingTime(featured.readingTime) })}
                      </span>
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {featured.date && new Date(featured.date).toLocaleDateString(locale, {
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
                      {t("pages.blog.readArticle")}
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
                      to={localizePath(`/blog/${post.slug}/`)}
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
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white shadow-lg">
                        {categoryLabel(getBlogCategory(post.title))}
                      </span>
                    </Link>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Date + read time */}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                        {post.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString(locale, {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t("pages.blogPost.minuteRead", { minutes: formatReadingTime(post.readingTime) })}
                        </span>
                      </div>

                      <h2 className="font-display font-semibold text-base leading-snug mb-2.5 group-hover:text-primary transition-colors line-clamp-2">
                        <Link
                          to={localizePath(`/blog/${post.slug}/`)}
                          onClick={() => trackArticleClick(post.title, post.slug)}
                        >
                          {cleanTitle(post.title)}
                        </Link>
                      </h2>

                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                        {cleanTitle(post.excerpt || "")}
                      </p>

                      <Link
                        to={localizePath(`/blog/${post.slug}/`)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary group/link"
                        onClick={() => trackArticleClick(post.title, post.slug)}
                      >
                        {t("pages.blog.readArticle")}
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )
          )}

          {filteredPosts.length > POSTS_PER_PAGE && (
            <nav aria-label="Blog pagination" className="mt-14 mx-auto flex w-fit max-w-full items-center justify-center gap-1 sm:gap-2 rounded-2xl glass border border-border/60 p-2 shadow-card">
              {currentPage > 1 ? (
                isFiltering ? (
                  <button
                    type="button"
                    onClick={() => changeFilterPage(currentPage - 1)}
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{t("pages.blog.previous")}</span>
                  </button>
                ) : (
                  <Link
                    to={localizePath(currentPage === 2 ? "/blog/" : `/blog/page/${currentPage - 1}/`)}
                    rel="prev"
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{t("pages.blog.previous")}</span>
                  </Link>
                )
              ) : (
                <span aria-disabled="true" className="inline-flex h-11 items-center gap-1.5 rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold text-muted-foreground/30 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{t("pages.blog.previous")}</span>
                </span>
              )}
              {paginationItems.map((item) => item === "ellipsis-start" || item === "ellipsis-end" ? (
                <span key={item} aria-hidden="true" className="grid h-11 w-7 sm:w-9 place-items-center text-sm font-bold tracking-wider text-muted-foreground">•••</span>
              ) : (
                  isFiltering ? (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeFilterPage(item)}
                      aria-current={item === currentPage ? "page" : undefined}
                      aria-label={t("pages.blog.pageLabel", { page: item })}
                      className={`grid h-11 w-9 sm:w-11 place-items-center rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-all ${
                        item === currentPage
                          ? "border border-primary/25 bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <Link
                      key={item}
                      to={localizePath(item === 1 ? "/blog/" : `/blog/page/${item}/`)}
                      aria-current={item === currentPage ? "page" : undefined}
                      aria-label={t("pages.blog.pageLabel", { page: item })}
                      className={`grid h-11 w-9 sm:w-11 place-items-center rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-all ${
                        item === currentPage
                          ? "border border-primary/25 bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {item}
                    </Link>
                  )
              ))}
              {currentPage < totalPages ? (
                isFiltering ? (
                  <button
                    type="button"
                    onClick={() => changeFilterPage(currentPage + 1)}
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
                  >
                    <span className="hidden sm:inline">{t("pages.blog.next")}</span> <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <Link
                    to={localizePath(`/blog/page/${currentPage + 1}/`)}
                    rel="next"
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
                  >
                    <span className="hidden sm:inline">{t("pages.blog.next")}</span> <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                )
              ) : (
                <span aria-disabled="true" className="inline-flex h-11 items-center gap-1.5 rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold text-muted-foreground/30 cursor-not-allowed">
                  <span className="hidden sm:inline">{t("pages.blog.next")}</span> <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              )}
            </nav>
          )}

          {!isLoading && (
            posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">
                {t("pages.blog.empty")}
              </p>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl glass">
                <p className="text-muted-foreground font-medium mb-2">{t("pages.blog.noResults")}</p>
                <p className="text-xs text-muted-foreground">{t("pages.blog.adjust")}</p>
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
