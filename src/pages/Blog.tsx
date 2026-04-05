import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Insights on logistics, fleet management, and AI-powered operations.
          </p>

          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  {post.coverImage && (
                    <div className="overflow-hidden rounded-2xl mb-4">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <time className="text-sm text-pulse-500 font-medium">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-1 mb-2 group-hover:text-pulse-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="inline-block mt-3 text-pulse-500 font-medium text-sm">
                    Read more &rarr;
                  </span>
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-gray-500 text-center py-16">
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
