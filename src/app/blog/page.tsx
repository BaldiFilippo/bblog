import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { AllPostsList } from "@/components/posts/all-posts-list";

const SITE_NAME = "BDESIGN";

export const metadata: Metadata = {
  title: `Progetti | ${SITE_NAME}`,
  description: "Tutti i progetti realizzati da BDESIGN",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <AllPostsList posts={posts} />;
}
