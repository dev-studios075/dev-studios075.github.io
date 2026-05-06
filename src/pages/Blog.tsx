import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const fallbackImages = [blog1, blog2, blog3];

const Blog = () => {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-36 pb-16 relative">
        <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">From the blog</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
              Insights for the <span className="text-gradient-primary">autonomous era</span> of logistics.
            </h1>
            <p className="text-lg text-muted-foreground">
              Deep dives on AI-powered TMS, fleet intelligence, and the operational future of logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <article
                key={post.slug}
                className="group glass rounded-2xl overflow-hidden hover:shadow-elegant transition-all duration-300 flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="relative overflow-hidden aspect-[16/10] block">
                  <img
                    src={post.coverImage || fallbackImages[i % fallbackImages.length]}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date && new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="font-display font-semibold text-xl leading-snug mb-3 group-hover:text-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group/link"
                  >
                    Read article
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-muted-foreground text-center py-16">
              No blog posts yet. Check back soon!
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
