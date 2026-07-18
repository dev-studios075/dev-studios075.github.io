import { useState, useEffect, useMemo, type ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User, Tag, Share2, Twitter, Link2, Check, Facebook } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAllPosts, getPostBySlug, getPostContent } from "@/lib/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL, absolutePageUrl, absoluteUrl, seoDescription, seoTitle } from "@/lib/site";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const fallbackImages = [blog1, blog2, blog3];

const WhatsAppIcon = ({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <title>WhatsApp icon</title>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="-0.06 -0.06 0.72 0.72"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M0.599 0.352v0.221h-0.128v-0.207c0 -0.052 -0.019 -0.087 -0.065 -0.087 -0.035 0 -0.057 0.024 -0.066 0.047 -0.003 0.008 -0.004 0.02 -0.004 0.031v0.216h-0.128s0.002 -0.35 0 -0.386h0.128v0.055l-0.001 0.001h0.001v-0.001c0.017 -0.026 0.047 -0.064 0.116 -0.064 0.084 0 0.148 0.055 0.148 0.174M0.073 0.001C0.029 0.001 0 0.03 0 0.067c0 0.037 0.028 0.067 0.071 0.067h0.001c0.045 0 0.073 -0.03 0.073 -0.067C0.144 0.03 0.117 0.001 0.073 0.001zM0.008 0.573h0.128V0.187H0.008z" />
  </svg>
);

const PinterestIcon = ({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.62 0 11.988-5.367 11.988-11.987C24.005 5.367 18.637 0 12.017 0z" />
  </svg>
);

/** Strip wrapping quotes from YAML-parsed titles */
const cleanTitle = (t = "") => t.replace(/^["'""]|["'""]$/g, "").trim();

/** Rough reading time: 200 wpm */
const readingTime = (content = "") =>
  Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));

const cleanArticleContent = (raw = "") =>
  raw
    // Strip first H1 heading (duplicates the title)
    .replace(/^#\s+.*$/m, "")
    // Strip embedded "By ... | Min Read" meta lines from markdown
    .replace(/^\*\*By[^\n]+Min Read\*\*$/im, "")
    .replace(/^By[^\n]+Min Read$/im, "")
    .trim();

const getNodeText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    return getNodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }

  return "";
};

const stripMarkdownText = (value = "") =>
  value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const slugifyHeading = (value = "") =>
  stripMarkdownText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

const extractTableOfContents = (raw = ""): TocItem[] => {
  return raw
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
      if (!match) return undefined;

      const title = stripMarkdownText(match[2]);
      const baseId = slugifyHeading(title);
      if (!title || !baseId) return undefined;

      return {
        id: baseId,
        title,
        level: match[1].length as 2 | 3,
      };
    })
    .filter((item): item is TocItem => Boolean(item));
};

const normalizeArticleHref = (href?: string) => {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  try {
    const url = new URL(href, SITE_URL);
    if (url.hostname === "fleetcodes.com" || url.hostname === "www.fleetcodes.com") {
      return `${absolutePageUrl(url.pathname)}${url.search}${url.hash}`;
    }
  } catch {
    return href;
  }

  return href;
};

/** Derive a category tag from the title */
const getCategory = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("dispatch") || t.includes("operations")) return "Operations";
  if (t.includes("compliance") || t.includes("permit")) return "Compliance";
  if (t.includes("analytics") || t.includes("data")) return "Analytics";
  if (t.includes("ai") || t.includes("automation")) return "AI & Automation";
  if (t.includes("fleet") || t.includes("vehicle")) return "Fleet Management";
  return "Technology";
};

const getRelatedPosts = (currentSlug: string, currentCategory: string) =>
  getAllPosts()
    .filter((candidate) => candidate.slug !== currentSlug)
    .sort((a, b) => {
      const aSameCategory = getCategory(a.title) === currentCategory ? 1 : 0;
      const bSameCategory = getCategory(b.title) === currentCategory ? 1 : 0;

      if (aSameCategory !== bSameCategory) {
        return bSameCategory - aSameCategory;
      }

      return (b.date || "").localeCompare(a.date || "");
    })
    .slice(0, 3);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const articleContent = useMemo(() => cleanArticleContent(content), [content]);
  const tocItems = useMemo(() => extractTableOfContents(articleContent), [articleContent]);
  const showTOC = isLoading || tocItems.length > 0;

  const [activeId, setActiveId] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = () => {
    const postUrl = post ? absolutePageUrl(`/blog/${post.slug}`) : "";
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      // Check if scroll has reached the bottom of the page (with 120px buffer)
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;

      let currentActiveId = tocItems[0].id;

      if (isBottom && headingElements.length > 0) {
        currentActiveId = headingElements[headingElements.length - 1].id;
      } else {
        // Find the last heading that has scrolled past the trigger point (180px from viewport top)
        for (const el of headingElements) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            currentActiveId = el.id;
          } else {
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial scroll check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  useEffect(() => {
    const handleScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    handleScrollProgress();

    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, [content]);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      setLoadError(false);
      
      const startTime = Date.now();
      getPostContent(slug)
        .then((text) => {
          setContent(text);
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 450 - elapsed);
          
          setTimeout(() => {
            setIsLoading(false);
          }, remaining);
        })
        .catch((err) => {
          console.error("Failed to load post content:", err);
          setLoadError(true);
          setIsLoading(false);
        });
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Seo
          title={`Post Not Found | ${SITE_NAME}`}
          description="The requested Fleetcodes blog article could not be found."
          noindex
        />
        <Navbar />
        <main className="pt-36 pb-16 text-center container-tight">
          <h1 className="font-display text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/blog/" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title    = cleanTitle(post.title);
  const mins     = post.readingTime || readingTime(content);
  const category = getCategory(title);
  const relatedPosts = getRelatedPosts(post.slug, category);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-primary z-[100] transition-all duration-75 ease-out shadow-[0_0_8px_hsl(var(--primary))]" 
        style={{ width: `${scrollProgress}%` }}
      />
      <Seo
        title={seoTitle(title)}
        description={seoDescription(post.excerpt)}
        path={`/blog/${post.slug}`}
        image={post.coverImage || DEFAULT_IMAGE}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.date}
        author={post.author}
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [{
          "@type": "BlogPosting",
          headline: title,
          description: seoDescription(post.excerpt),
          image: absoluteUrl(post.coverImage || DEFAULT_IMAGE),
          datePublished: post.date,
          dateModified: post.date,
          author: post.author ? {
            "@type": post.author.toLowerCase().includes("fleetcodes") ? "Organization" : "Person",
            name: post.author,
          } : undefined,
          inLanguage: "en-IN",
          wordCount: content ? content.trim().split(/\s+/).length : undefined,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: { 
              "@type": "ImageObject", 
              url: absoluteUrl("/favicon.png"),
              width: 32,
              height: 32
            },
          },
          mainEntityOfPage: absolutePageUrl(`/blog/${post.slug}`),
          isPartOf: {
            "@type": "Blog",
            name: `Fleet Management Blog | ${SITE_NAME}`,
            url: absolutePageUrl("/blog"),
          },
          relatedLink: relatedPosts.map((related) => absolutePageUrl(`/blog/${related.slug}`)),
        }, {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absolutePageUrl("/") },
            { "@type": "ListItem", position: 2, name: "Blog", item: absolutePageUrl("/blog") },
            { "@type": "ListItem", position: 3, name: title, item: absolutePageUrl(`/blog/${post.slug}`) },
          ],
        }],
        }}
      />
      <Navbar />

      <main className="relative pb-24 overflow-x-clip">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />

        {/* ── Hero: 2-col on desktop ─────────────────────────────── */}
        <div className="container-tight pt-28 pb-10">
          {/* Back link */}
          <Link
            to="/blog/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to blog
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Cover image — shows first on mobile, second on desktop */}
            {post.coverImage && (
              <div className="lg:order-last rounded-2xl overflow-hidden border border-border/50 shadow-elegant">
                <img
                  src={post.coverImage}
                  alt={title}
                  className="w-full object-cover"
                  style={{ maxHeight: "360px" }}
                />
              </div>
            )}

            {/* Left — title & meta */}
            <div>
              {/* Category + reading time pills */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <Tag className="w-3 h-3" />
                  {category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full glass border border-border/50 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {mins} min read
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15] mb-5 text-slate-900 dark:text-white">
                {title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-7">
                  {cleanTitle(post.excerpt)}
                </p>
              )}

              {/* Author + date row */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {post.author && (
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 grid place-items-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </span>
                    {post.author}
                  </span>
                )}
                {post.date && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Mobile Share Widget */}
              {post && (
                <div className="lg:hidden mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Share2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Share Article:</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on LinkedIn"
                      className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#0077B5] hover:border-[#0077B5] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-250 shrink-0 shadow-sm"
                    >
                      <LinkedInIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + absolutePageUrl(`/blog/${post.slug}`))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on WhatsApp"
                      className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#25D366] hover:border-[#25D366] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-250 shrink-0 shadow-sm"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on X"
                      className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-black dark:hover:bg-white hover:border-black dark:hover:border-white text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-black transition-all duration-250 shrink-0 shadow-sm"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on Facebook"
                      className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#1877F2] hover:border-[#1877F2] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-250 shrink-0 shadow-sm"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}&media=${encodeURIComponent(absoluteUrl(post.coverImage || DEFAULT_IMAGE))}&description=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Pin on Pinterest"
                      className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#BD081C] hover:border-[#BD081C] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-250 shrink-0 shadow-sm"
                    >
                      <PinterestIcon className="w-4 h-4" />
                    </a>
                    <button
                      onClick={handleCopyLink}
                      title="Copy Link"
                      className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-primary hover:border-primary text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-250 flex items-center justify-center min-w-[34px] shrink-0 shadow-sm"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-success animate-scale-in" />
                      ) : (
                        <Link2 className="w-4 h-4 hover:rotate-45 transition-transform duration-200" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* ── Article body ───────────────────────────────────────── */}
        <div className="container-tight px-6 lg:px-8 pt-12">
          {isLoading ? (
            <nav className="lg:hidden mb-8 rounded-2xl glass p-5 shadow-elegant animate-pulse">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3 font-sans">
                On this page
              </p>
              <div className="space-y-3">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </nav>
          ) : (
            tocItems.length > 0 && (
              <nav
                aria-label="Table of contents"
                className="lg:hidden mb-8 rounded-2xl glass p-5 shadow-elegant animate-in fade-in duration-300"
              >
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3 font-sans">
                  On this page
                </p>
                <ol className="space-y-2.5">
                  {tocItems.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                      <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                        <a
                          href={`#${item.id}`}
                          className={`text-sm leading-snug transition-all duration-200 hover:text-primary font-sans ${
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                          }`}
                        >
                          {item.title}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )
          )}

          <div
            className={`grid gap-10 justify-center items-start ${
              showTOC
                ? "lg:grid-cols-[220px_minmax(0,768px)] xl:grid-cols-[260px_minmax(0,768px)]"
                : "lg:grid-cols-[minmax(0,768px)]"
            }`}
          >
            {showTOC && (
              <aside className="hidden lg:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none pr-2">
                <nav aria-label="Table of contents" className="border-l border-border/70 pl-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-4 font-sans">
                    On this page
                  </p>
                  <ol className="space-y-3">
                    {isLoading ? (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 pl-3" />
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 pl-3" />
                      </div>
                    ) : (
                      tocItems.map((item) => {
                        const isActive = item.id === activeId;
                        return (
                          <li key={item.id} className={`${item.level === 3 ? "pl-3" : ""} relative transition-all duration-200`}>
                            {isActive && (
                              <span 
                                className="absolute w-[2px] h-3.5 bg-primary rounded-full animate-scale-in"
                                style={{ 
                                  left: item.level === 3 ? "-28px" : "-16px",
                                  top: "50%",
                                  transform: "translateY(-50%)"
                                }}
                              />
                            )}
                            <a
                              href={`#${item.id}`}
                              className={`block leading-snug transition-all duration-200 hover:text-primary font-sans ${
                                isActive
                                  ? "text-primary font-semibold translate-x-1"
                                  : item.level === 3
                                  ? "text-xs text-muted-foreground/75"
                                  : "text-sm font-medium text-muted-foreground"
                              }`}
                            >
                              {item.title}
                            </a>
                          </li>
                        );
                      })
                    )}
                  </ol>

                  {/* Sidebar Share buttons */}
                  {post && (
                    <div className="mt-8 pt-6 border-t border-border/60">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 font-sans flex items-center gap-1.5">
                        <Share2 className="w-3 h-3 text-primary" />
                        Share article
                      </p>
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share on LinkedIn"
                          className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#0077B5] hover:border-[#0077B5] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-255 shrink-0 shadow-sm"
                        >
                          <LinkedInIcon className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + absolutePageUrl(`/blog/${post.slug}`))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share on WhatsApp"
                          className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#25D366] hover:border-[#25D366] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-255 shrink-0 shadow-sm"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share on X"
                          className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-black dark:hover:bg-white hover:border-black dark:hover:border-white text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-black transition-all duration-255 shrink-0 shadow-sm"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share on Facebook"
                          className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#1877F2] hover:border-[#1877F2] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-255 shrink-0 shadow-sm"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(absolutePageUrl(`/blog/${post.slug}`))}&media=${encodeURIComponent(absoluteUrl(post.coverImage || DEFAULT_IMAGE))}&description=${encodeURIComponent(title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Pin on Pinterest"
                          className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-[#BD081C] hover:border-[#BD081C] text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-255 shrink-0 shadow-sm"
                        >
                          <PinterestIcon className="w-4 h-4" />
                        </a>
                        <button
                          onClick={handleCopyLink}
                          title="Copy Link"
                          className="p-2 rounded-xl border border-border/80 bg-card/60 hover:bg-primary hover:border-primary text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-255 flex items-center justify-center min-w-[34px] shrink-0 shadow-sm"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-success animate-scale-in" />
                          ) : (
                            <Link2 className="w-4 h-4 hover:rotate-45 transition-transform duration-200" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </nav>
              </aside>
            )}

            <article className="min-w-0">
              <div className="prose prose-base lg:prose-lg dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:text-xl prose-h2:lg:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-li:text-muted-foreground
            prose-hr:border-border/40
            prose-blockquote:border-l-primary/50 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
            {isLoading ? (
              <div className="space-y-10 animate-pulse py-4">
                {/* Paragraph 1 */}
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
                </div>

                {/* Subheading placeholder */}
                <div className="space-y-2 pt-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/5"></div>
                </div>

                {/* Paragraph 2 */}
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-11/12"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                </div>

                {/* List items placeholder */}
                <div className="space-y-3.5 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/5" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
                  </div>
                </div>

                {/* Paragraph 3 */}
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
            ) : loadError ? (
              <p className="text-destructive font-medium">Failed to load article content. Please refresh the page.</p>
            ) : (
              <ReactMarkdown
                components={{
                  a: ({ href, children, ...props }) => {
                    const normalizedHref = normalizeArticleHref(href);
                    const isExternal =
                      !!normalizedHref &&
                      /^https?:\/\//i.test(normalizedHref) &&
                      !normalizedHref.startsWith(SITE_URL);

                    return (
                      <a
                        {...props}
                        href={normalizedHref}
                        rel={isExternal ? "nofollow noopener noreferrer" : props.rel}
                      >
                        {children}
                      </a>
                    );
                  },
                  h2: ({ children, ...props }) => {
                    const id = slugifyHeading(getNodeText(children));

                    return (
                      <h2 {...props} id={id} className="scroll-mt-28">
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children, ...props }) => {
                    const id = slugifyHeading(getNodeText(children));

                    return (
                      <h3 {...props} id={id} className="scroll-mt-28">
                        {children}
                      </h3>
                    );
                  },
                }}
              >
                {articleContent}
              </ReactMarkdown>
            )}
              </div>



              {/* CTA bar */}
              <div className="mt-16 glass rounded-2xl border border-primary/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Ready to automate your fleet operations?</p>
              <p className="text-xs text-muted-foreground">See how Fleetcodes can cut costs and replace manual work.</p>
            </div>
            <Link
              to="/book-demo/"
              className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Book a Demo
            </Link>
              </div>

              {relatedPosts.length > 0 && (
                <section className="mt-16 pt-12 border-t border-border/40" aria-labelledby="related-articles">
                  <div className="flex items-end justify-between gap-4 mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-semibold">
                        Keep reading
                      </p>
                      <h2 id="related-articles" className="font-display text-2xl font-bold tracking-tight text-foreground">
                        Related fleet guides
                      </h2>
                    </div>
                    <Link
                      to="/blog/"
                      className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary group"
                    >
                      All articles
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((related, idx) => (
                      <article
                        key={related.slug}
                        className="group glass rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/blog/${related.slug}/`}
                          className="relative overflow-hidden aspect-[16/10] block shrink-0"
                        >
                          <img
                            src={related.coverImage || fallbackImages[idx % fallbackImages.length]}
                            alt={cleanTitle(related.title)}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Category badge over image */}
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground">
                            {getCategory(related.title)}
                          </span>
                        </Link>

                        {/* Body */}
                        <div className="p-5 flex flex-col flex-1">
                          {/* Date + read time */}
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                            {related.date && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(related.date).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {related.readingTime ? `${related.readingTime} min` : "1 min"}
                            </span>
                          </div>

                          <h3 className="font-display font-semibold text-sm leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            <Link to={`/blog/${related.slug}/`}>
                              {cleanTitle(related.title)}
                            </Link>
                          </h3>

                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                            {cleanTitle(related.excerpt || "")}
                          </p>

                          <Link
                            to={`/blog/${related.slug}/`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary group/link"
                          >
                            Read article
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom nav */}
              <div className="mt-10 pt-8 border-t border-border/40">
            <Link
              to="/blog/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to all articles
            </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
