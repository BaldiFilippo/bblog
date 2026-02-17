import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostSlugs, getPostWithHtml, formatDate } from "@/lib/blog";
import { PostContent } from "@/components/blog/post-content";
import { PostFixedHero } from "@/components/blog/PostFixedHero";

const SITE_NAME = "My Blog";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
  const post = await getPostWithHtml(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const metadata: Metadata = {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
    },
    twitter: {
      card: post.cover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
    },
  };

  if (post.cover) {
    metadata.openGraph!.images = [
      {
        url: post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`,
        width: 1200,
        height: 630,
        alt: post.title,
      },
    ];
    metadata.twitter!.images = [post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`];
  }

  return metadata;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);

  if (!post) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.cover ? (post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`) : undefined,
    url: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen  bg-background relative overflow-x-hidden">
        {/* Hero - Title + Author + Meta (scrolls naturally) */}
        <PostFixedHero
          title={post.title}
          author={post.author}
          date={post.date}
          formattedDate={formatDate(post.date)}
          readingTime={post.readingTime}
        />

        {/* Content (tags, cover, body, back button) */}
        <div className="mt-[-10vh]">
          <PostContent
            tags={post.tags}
            cover={post.cover}
            title={post.title}
            contentHtml={post.contentHtml}
          />
        </div>
      
      </article>
    </>
  );
}
