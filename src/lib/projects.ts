import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";

// Types
export interface ProjectFrontmatter {
  title: string;
  slug?: string;
  date: string;
  excerpt: string;
  cover?: string;
  tags?: string[];
  published?: boolean;
  author?: string;
  url?: string;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}

export interface ProjectWithHtml extends Project {
  contentHtml: string;
}

// Constants
const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

/**
 * Get all project slugs for static generation
 */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs.readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

/**
 * Get a single project by slug (without HTML conversion)
 */
export function getProjectBySlug(slug: string): Project | null {
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
  const frontmatter = data as ProjectFrontmatter;

  // Skip unpublished projects in production
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
 * Get a single project with HTML content
 */
export async function getProjectWithHtml(slug: string): Promise<ProjectWithHtml | null> {
  const project = getProjectBySlug(slug);

  if (!project) {
    return null;
  }

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(project.content);

  // Add lazy loading + async decoding to all plain <img> tags in markdown output
  const contentHtml = processedContent
    .toString()
    .replace(/<img\s/g, '<img loading="lazy" decoding="async" ');

  return {
    ...project,
    contentHtml,
  };
}

/**
 * Get all projects sorted by date (newest first)
 */
export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs();

  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => project !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return projects;
}

/**
 * Get the next project (chronologically older) given a slug. Wraps to first if at the end.
 */
export function getNextProject(currentSlug: string): Project | null {
  const projects = getAllProjects();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
