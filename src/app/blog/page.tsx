import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { AllPostsList } from "@/components/blog/all-posts-list";

const SITE_NAME = "My Blog";

export const metadata: Metadata = {
  title: `All Posts | ${SITE_NAME}`,
  description: "Browse all blog posts",
};

export default function AllPostsPage() {
  const posts = getAllPosts();

  return <AllPostsList posts={posts} />;
}
