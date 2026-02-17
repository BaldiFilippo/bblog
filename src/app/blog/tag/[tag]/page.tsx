import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag as TagIcon } from "lucide-react";
import { getAllTags, getPostsByTag, formatDate } from "@/lib/blog";
import { Button } from "@/components/ui/button";

const SITE_NAME = "My Blog";

interface PageProps {
  params: Promise<{ tag: string }>;
}

// Generate static paths for all tags
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Posts tagged "${decodedTag}" | ${SITE_NAME}`,
    description: `All blog posts tagged with "${decodedTag}"`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <TagIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground font-[family-name:var(--font-safiro)]">
              {decodedTag}
            </h1>
          </div>
          <p className="mt-4 text-muted-foreground text-lg">
            {posts.length} {posts.length === 1 ? "post" : "posts"} found
          </p>
        </div>
      </header>

      {/* Posts list */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts found with this tag.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group border-b border-border pb-8 last:border-0"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Cover image */}
                    {post.cover && (
                      <div className="relative md:w-48 h-48 md:h-32 flex-shrink-0">
                        <Image
                          src={post.cover}
                          alt={post.title}
                          fill
                          className="object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                          sizes="(max-width: 768px) 100vw, 192px"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors font-[family-name:var(--font-safiro)]">
                        {post.title}
                      </h2>

                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </div>
                        <span>{post.readingTime}</span>
                      </div>

                      <p className="mt-3 text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                                t.toLowerCase() === decodedTag.toLowerCase()
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
