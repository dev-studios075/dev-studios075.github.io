import blogIndex from "../content/blog-index.json";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  readingTime?: number;
}

export function parseFrontmatter(raw: string): { meta: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  }

  return { meta, content: match[2].trim() };
}

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
