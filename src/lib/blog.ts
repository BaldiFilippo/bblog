import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";

// Types
export interface PostFrontmatter {
  title: string;
  slug?: string;
  date: string;
  excerpt: string;
  cover?: string;
  tags?: string[];
  published?: boolean;
  author?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}

export interface PostWithHtml extends Post {
  contentHtml: string;
}

// Constants
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Get all post slugs for static generation
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs.readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

/**
 * Get a single post by slug (without HTML conversion)
 */
export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.md`);
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);

  let filePath = "";
  if (fs.existsSync(fullPath)) {
    filePath = fullPath;
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  // Skip unpublished posts in production
  if (frontmatter.published === false && process.env.NODE_ENV === "production") {
    return null;
  }

  const stats = readingTime(content);

  return {
    ...frontmatter,
    slug: frontmatter.slug || slug,
    content,
    readingTime: stats.text,
  };
}

/**
 * Get a single post with HTML content
 */
export async function getPostWithHtml(slug: string): Promise<PostWithHtml | null> {
  const post = getPostBySlug(slug);

  if (!post) {
    return null;
  }

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(post.content);

  const contentHtml = processedContent.toString();

  return {
    ...post,
    contentHtml,
  };
}

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Get the next post (chronologically older) given a slug. Wraps to first if at the end.
 */
export function getNextPost(currentSlug: string): Post | null {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;
  const nextIndex = (currentIndex + 1) % posts.length;
  return posts[nextIndex];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
