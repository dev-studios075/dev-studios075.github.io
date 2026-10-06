import blogIndex from "../content/blog-index.json";
import { parseFrontmatter } from "@/lib/parseFrontmatter.mjs";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  coverImage?: string;
  keywords?: string;
  content: string;
  readingTime?: number;
}

export { parseFrontmatter } from "@/lib/parseFrontmatter.mjs";

// Dynamic lazy-loading glob of raw markdown content
const contentModules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', eager: false, import: 'default' });

export function getAllPosts(): BlogPost[] {
  return (blogIndex as unknown as Omit<BlogPost, "content">[]).map((post) => ({
    ...post,
    content: "",
  }));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export async function getPostContent(slug: string): Promise<string> {
  const path = `/src/content/blog/${slug}.md`;
  const loader = contentModules[path];
  if (!loader) {
    throw new Error(`Blog post not found: ${slug}`);
  }
  const raw = await loader() as string;
  const { content } = parseFrontmatter(raw);
  return content;
}
