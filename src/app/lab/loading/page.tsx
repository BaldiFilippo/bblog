import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { LoadingDemos } from "./loading-demos";

export const metadata: Metadata = {
  title: "Loading lab",
  description: "Three candidate intro animations, side by side.",
  robots: { index: false },
};

export default function LoadingLab() {
  const posts = getAllPosts();
  // Oldest first: the calendar flips forward through the essays to today.
  const dates = posts.map((p) => p.date).reverse();
  const latestCover = posts[0]?.cover ?? "/images/image1.webp";
  const latestTitle = posts[0]?.title ?? "";

  return <LoadingDemos dates={dates} cover={latestCover} title={latestTitle} />;
}
