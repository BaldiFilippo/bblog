import Parallax, { PostItem, SeeAllVariant } from "@/components/parallax";
import { getAllPosts } from "@/lib/posts";
import { LoadingScreen } from "@/components/loading-screen";

// Demo switch: /?seeAll=1|2|3 previews the "see all" redesign candidates
const SEE_ALL_VARIANTS: Record<string, SeeAllVariant> = { "1": "title", "2": "index", "3": "archive" };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ seeAll?: string }>;
}) {
  const { seeAll } = await searchParams;
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
    <>
      <LoadingScreen />
      <Parallax
        posts={postItems}
        seeAll={seeAll ? SEE_ALL_VARIANTS[seeAll] : undefined}
        archive={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
      />
    </>
  );
}
