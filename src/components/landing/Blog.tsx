import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/blog";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const fallbackImages = [blog1, blog2, blog3];

const Blog = () => {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="py-24 lg:py-32 relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
              From the blog
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
              Insights for the{" "}
              <span className="text-gradient-primary">autonomous era</span> of logistics.
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
              className="group glass rounded-2xl overflow-hidden hover:shadow-elegant transition-all duration-300 flex flex-col"
            >
              <Link to={`/blog/${post.slug}`} className="relative overflow-hidden aspect-[16/10] block">
                <img
                  src={post.coverImage || fallbackImages[i % fallbackImages.length]}
                  alt={post.title}
                  loading="lazy"
                  width={1024}
                  height={640}
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

                <h3 className="font-display font-semibold text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
