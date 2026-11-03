import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { AllPostsList } from "@/components/posts/all-posts-list";

export const metadata: Metadata = {
  title: "Articles",
  description: "All articles from BBLOG, the personal blog of Filippo Baldi",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <AllPostsList posts={posts} />;
}
