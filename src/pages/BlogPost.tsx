import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAllPosts, getPostBySlug, getPostContent } from "@/lib/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL, absolutePageUrl, absoluteUrl } from "@/lib/site";

/** Strip wrapping quotes from YAML-parsed titles */
const cleanTitle = (t = "") => t.replace(/^["'""]|["'""]$/g, "").trim();

/** Rough reading time: 200 wpm */
const readingTime = (content = "") =>
  Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));

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
    .slice(0, 4);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      setLoadError(false);
      getPostContent(slug)
        .then((text) => {
          setContent(text);
          setIsLoading(false);
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Seo
        title={`${title} | ${SITE_NAME}`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverImage || DEFAULT_IMAGE}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.date}
        author={post.author}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: post.excerpt,
          image: absoluteUrl(post.coverImage || DEFAULT_IMAGE),
          datePublished: post.date,
          dateModified: post.date,
          author: post.author ? { "@type": "Person", name: post.author } : undefined,
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
        }}
      />
      <Navbar />

      <main className="relative pb-24 overflow-x-hidden">
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
            </div>
          </div>
        </div>



        {/* ── Article body ───────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-12">
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
              <div className="space-y-4 animate-pulse py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-4/5"></div>
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
                }}
              >
                {content
                  ? content
                      // Strip first H1 heading (duplicates the title)
                      .replace(/^#\s+.*$/m, "")
                      // Strip embedded "By ... | Min Read" meta lines from markdown
                      .replace(/^\*\*By[^\n]+Min Read\*\*$/im, "")
                      .replace(/^By[^\n]+Min Read$/im, "")
                      .trim()
                  : ""}
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
            <section className="mt-12" aria-labelledby="related-articles">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                    Keep reading
                  </p>
                  <h2 id="related-articles" className="font-display text-xl font-bold tracking-tight text-foreground">
                    Related fleet guides
                  </h2>
                </div>
                <Link
                  to="/blog/"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  All articles
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}/`}
                    className="group rounded-lg border border-border/60 bg-card/40 p-4 hover:border-primary/30 transition-colors"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                      {getCategory(related.title)}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {cleanTitle(related.title)}
                    </h3>
                    {related.excerpt && (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {cleanTitle(related.excerpt)}
                      </p>
                    )}
                  </Link>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
