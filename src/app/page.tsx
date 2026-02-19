import Parallax, { BlogPost } from "@/components/parallax";
import { getAllPosts } from "@/lib/blog";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const posts = getAllPosts();

  // Transform the 5 most recent posts to the format expected by Parallax
  const blogPosts: BlogPost[] = posts.slice(0, 5).map((post, index) => ({
    id: index + 1,
    slug: post.slug,
    title: post.title,
    author: post.author,
    image: post.cover || "/images/image1.webp",
    excerpt: post.excerpt,
    date: post.date,
  }));

  return (
    <>
      <LoadingScreen />
      <Parallax posts={blogPosts} />
    </>
  );
}
