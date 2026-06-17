import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/blog";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const fallbackImages = [blog1, blog2, blog3];

const getCategory = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("trip") || t.includes("dispatch")) return "Operations";
  if (t.includes("fleet") || t.includes("compliance") || t.includes("state")) return "Compliance";
  if (t.includes("analytics") || t.includes("data") || t.includes("report")) return "Analytics";
  return "Technology";
};

const getReadTime = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("trip")) return "5 min read";
  if (t.includes("fleet")) return "6 min read";
  if (t.includes("analytics")) return "4 min read";
  return "5 min read";
};

const Blog = () => {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container-tight relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-semibold">
              From the blog
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
              Insights for the{" "}
              <span className="text-gradient">autonomous era</span> of logistics.
            </h2>
          </div>
          <Button asChild variant="glass" size="lg" className="self-start lg:self-auto group">
            <Link to="/blog">
              View all articles
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative glass rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Premium CSS-only card hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <Link to={`/blog/${post.slug}`} className="relative overflow-hidden aspect-[16/10] block">
                <img
                  src={post.coverImage || fallbackImages[i % fallbackImages.length]}
                  alt={post.title}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Floating category badge inside image */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 text-slate-200 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold font-mono">
                  {getCategory(post.title)}
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-1 relative z-10">
                {/* Article info row */}
                <div className="flex items-center gap-3.5 text-[10px] text-muted-foreground mb-3 font-mono font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {post.date && new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {getReadTime(post.title)}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-[15px] sm:text-base leading-snug mb-3 text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                
                <p className="text-[12px] sm:text-xs text-muted-foreground leading-relaxed mb-5 flex-1">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group/link mt-auto"
                >
                  Read article
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
