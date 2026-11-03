import type { Metadata } from "next";
import Parallax, { PostItem } from "@/components/parallax";
import { getAllPosts } from "@/lib/posts";
import { LoadingScreen } from "@/components/loading-screen";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const posts = getAllPosts();

  // Transform the 5 most recent posts to the format expected by Parallax
  const postItems: PostItem[] = posts.slice(0, 5).map((post, index) => ({
    id: index + 1,
    slug: post.slug,
    title: post.title,
    url: post.url,
    image: post.cover || "/images/image1.webp",
    excerpt: post.excerpt,
    date: post.date,
  }));

  return (
    <main>
      <LoadingScreen />
      <Parallax posts={postItems} />
    </main>
  );
}
