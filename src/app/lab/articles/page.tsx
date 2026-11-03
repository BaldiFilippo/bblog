import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { ArticlesLab } from "./articles-lab";

export const metadata: Metadata = {
  title: "Articles lab",
  description: "Two candidates for the articles page: an index with or without covers.",
  robots: { index: false },
};

export default function ArticlesLabPage() {
  const posts = getAllPosts().map(({ slug, title, date, excerpt, cover, readingTime }) => ({
    slug,
    title,
    date,
    excerpt,
    cover,
    readingTime,
  }));
  return <ArticlesLab posts={posts} />;
}
