import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostSlugs, getPostBySlug, getPostWithHtml, getNextPost, formatDate, ogImageFor } from "@/lib/posts";
import { PostContent } from "@/components/posts/post-content";
import { PostFixedHero } from "@/components/posts/PostFixedHero";
import { SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  const og = ogImageFor(post.cover);
  const metadata: Metadata = {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
    },
    twitter: {
      card: og ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
    },
  };

  if (og) {
    metadata.openGraph!.images = [{ ...og, alt: post.title }];
    metadata.twitter!.images = [og.url];
  }

  return metadata;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);

  if (!post) {
    notFound();
  }

  const nextPost = getNextPost(slug);

  // JSON-LD structured data for SEO
  const og = ogImageFor(post.cover);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author ?? "Filippo Baldi", url: SITE_URL },
    image: og ? (og.url.startsWith("http") ? og.url : `${SITE_URL}${og.url}`) : undefined,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Hero - Title + Author + Meta (scrolls naturally) */}
        <PostFixedHero
          title={post.title}
          url={post.url}
          date={post.date}
          formattedDate={formatDate(post.date)}
          readingTime={post.readingTime}
        />

        {/* Content (cover, body, back button) - follows the hero at a fixed gap */}
        <PostContent
          cover={post.cover}
          title={post.title}
          contentHtml={post.contentHtml}
          nextPost={nextPost ? { slug: nextPost.slug, title: nextPost.title, cover: nextPost.cover, excerpt: nextPost.excerpt } : undefined}
        />

      </main>
    </>
  );
}
