import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { DEFAULT_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

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
          <Link to="/blog" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={`${post.title} | ${SITE_NAME}`}
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
          headline: post.title,
          description: post.excerpt,
          image: absoluteUrl(post.coverImage || DEFAULT_IMAGE),
          datePublished: post.date,
          dateModified: post.date,
          author: post.author
            ? {
                "@type": "Person",
                name: post.author,
              }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl("/favicon.png"),
            },
          },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />
      <Navbar />
      <main className="pt-36 pb-20 relative">
        <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />
        <article className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>

          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden glass-strong p-2 shadow-elegant glow-border mb-10">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 sm:h-80 object-cover rounded-xl"
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date && new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {post.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span>By {post.author}</span>
              </>
            )}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
            <ReactMarkdown>
              {post.content ? post.content.replace(/^#\s+.*$/m, "").trim() : ""}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
