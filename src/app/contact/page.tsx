import { ContactForm } from "@/components/contact-form";
import { getAllPosts } from "@/lib/posts";

interface PageProps {
  searchParams: Promise<{ re?: string | string[] }>;
}

// ?re=<slug> comes from an essay's "Write back" and preselects that essay;
// the reader can still switch to another one or to a general letter.
// Only real posts are offered, so the title shown is never user-supplied text.
export default async function ContactPage({ searchParams }: PageProps) {
  const { re } = await searchParams;
  const posts = getAllPosts().map(({ slug, title }) => ({ slug, title }));
  const initialSlug = posts.some((p) => p.slug === re) ? (re as string) : undefined;

  return <ContactForm posts={posts} initialSlug={initialSlug} />;
}
