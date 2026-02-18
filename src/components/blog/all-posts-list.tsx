"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface PostItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  readingTime: string;
}

interface AllPostsListProps {
  posts: PostItem[];
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function AllPostsList({ posts }: AllPostsListProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Button>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-foreground font-[family-name:var(--font-safiro)]"
          >
            All Posts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </motion.p>
        </div>
      </header>

      {/* Posts list */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease,
                  delay: 0.3 + index * 0.08,
                }}
                className="group border-b border-border pb-8 last:border-0"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Cover image */}
                    {post.cover && (
                      <div className="relative md:w-48 h-48 md:h-32 shrink-0">
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
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
