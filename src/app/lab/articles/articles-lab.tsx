"use client";

import Link from "next/link";
import { useState } from "react";
import { CoverMedia } from "@/components/cover-media";

type Post = { slug: string; title: string; date: string; excerpt: string; cover?: string; readingTime: string };

const SAFIRO = "font-[family-name:var(--font-safiro)]";
const VARIANTS = [
  { id: "covers", label: "With covers" },
  { id: "type", label: "Type only" },
] as const;
type Variant = (typeof VARIANTS)[number]["id"];

// "Nov 3, 2026 · 9 min" in UTC (frontmatter dates are plain YYYY-MM-DD)
function meta(post: Post) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${date} · ${post.readingTime.replace(" read", "")}`;
}

function Row({ post, number, covers }: { post: Post; number: string; covers: boolean }) {
  return (
    <li className="border-t border-foreground/10 last:border-b">
      <Link
        href={`/blog/${post.slug}`}
        className="group grid grid-cols-[2rem_1fr] md:grid-cols-[3rem_1fr] gap-x-3 py-7 md:py-8 outline-none focus-visible:bg-foreground/[0.03]"
      >
        <span className="pt-[0.55em] font-mono text-xs md:text-sm tabular-nums text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
          {number}
        </span>
        <div className="flex min-w-0 items-start gap-5">
          <div className="relative min-w-0 flex-1">
            {/* The side index's dash grows in, and the title (only) steps aside for it */}
            <span
              aria-hidden
              className="absolute left-0 top-[0.72em] h-[2px] w-4 origin-left scale-x-0 rounded-full bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
            />
            <h2 className={`pr-6 text-2xl md:text-3xl font-black tracking-tighter leading-[1.1] transition-[color,translate] duration-300 ease-out group-hover:translate-x-6 group-hover:text-foreground/60 group-focus-visible:translate-x-6 motion-reduce:transition-none ${SAFIRO}`}>
              {post.title}
            </h2>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{meta(post)}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-1">{post.excerpt}</p>
          </div>
          {covers && post.cover && (
            <div className="relative hidden sm:block size-20 md:size-24 shrink-0 overflow-hidden rounded-lg">
              <CoverMedia
                src={post.cover}
                alt=""
                still
                sizes="96px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

export function ArticlesLab({ posts }: { posts: Post[] }) {
  const [variant, setVariant] = useState<Variant>("covers");

  return (
    <main className="min-h-screen px-gutter pt-page-top pb-section">
      <div className="mx-auto max-w-article">
        {/* Lab only: switch between the two candidates */}
        <div role="radiogroup" aria-label="Variant" className="mb-12 inline-flex gap-1 rounded-full border border-foreground/10 p-1 font-mono text-xs">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={variant === v.id}
              onClick={() => setVariant(v.id)}
              className={`rounded-full px-3 py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                variant === v.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <header className="flex flex-col gap-6">
          <span className="font-mono text-sm text-muted-foreground">
            Index · {posts.length} {posts.length === 1 ? "essay" : "essays"}
          </span>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] ${SAFIRO}`}>Articles.</h1>
        </header>

        <ol className="mt-section">
          {posts.map((post, i) => (
            <Row
              key={post.slug}
              post={post}
              number={String(posts.length - i).padStart(2, "0")}
              covers={variant === "covers"}
            />
          ))}
        </ol>
      </div>
    </main>
  );
}
