import { ContactForm } from "@/components/contact-form";
import { getPostBySlug } from "@/lib/posts";

interface PageProps {
  searchParams: Promise<{ re?: string | string[] }>;
}

// ?re=<slug> comes from an essay's "Write back": the letter becomes a reply to it.
// Only real posts are honoured, so the title shown is never user-supplied text.
export default async function ContactPage({ searchParams }: PageProps) {
  const { re } = await searchParams;
  const post = typeof re === "string" && /^[a-z0-9-]+$/.test(re) ? getPostBySlug(re) : null;

  return <ContactForm replyTo={post ? { slug: post.slug, title: post.title } : undefined} />;
}
