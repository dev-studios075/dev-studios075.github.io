import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link to="/blog" className="text-pulse-500 hover:underline">
            &larr; Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-block text-sm text-pulse-500 hover:underline mb-6"
          >
            &larr; Back to blog
          </Link>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 sm:h-72 object-cover rounded-2xl mb-8"
            />
          )}

          <time className="text-sm text-pulse-500 font-medium">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-2">
            {post.title}
          </h1>
          <p className="text-gray-500 mb-8">By {post.author}</p>

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-a:text-pulse-500 prose-strong:text-gray-900">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
