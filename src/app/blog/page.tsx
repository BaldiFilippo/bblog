import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { AllPostsList } from "@/components/posts/all-posts-list";

const SITE_NAME = "BBLOG";

export const metadata: Metadata = {
  title: `Articles | ${SITE_NAME}`,
  description: "All articles from BBLOG, the personal blog of Filippo Baldi",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <AllPostsList posts={posts} />;
}
