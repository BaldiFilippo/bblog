import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { LoadingDemos } from "./loading-demos";

export const metadata: Metadata = {
  title: "Loading lab",
  description: "Four quick candidate intro animations, side by side.",
  robots: { index: false },
};

export default function LoadingLab() {
  const posts = getAllPosts();
  const latest = posts[0];
  // Animated covers ship as GIF + a WebP poster; the poster is enough here
  const cover = latest?.cover?.endsWith(".gif")
    ? latest.cover.replace(/\.gif$/, "-poster.webp")
    : latest?.cover ?? "/images/image1.webp";

  return <LoadingDemos title={latest?.title ?? ""} cover={cover} dashes={Math.min(posts.length, 5)} />;
}
