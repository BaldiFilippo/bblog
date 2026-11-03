import Link from "next/link";
import { CoverMedia } from "@/components/cover-media";

interface PostItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  readingTime: string;
}

const SAFIRO = "font-[family-name:var(--font-safiro)]";

// "Nov 3, 2026 · 9 min" in UTC (frontmatter dates are plain YYYY-MM-DD)
function meta(post: PostItem) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${date} · ${post.readingTime.replace(" read", "")}`;
}

// The archive as a book's index: same column as the articles, one numbered row
// per article, no icons or arrows. On hover/focus the home side index's dash
// grows in and the title steps aside for it.
export function AllPostsList({ posts }: { posts: PostItem[] }) {
  return (
    <main className="min-h-screen px-gutter pt-page-top pb-section">
      <div className="mx-auto max-w-article">
        <header className="flex flex-col gap-6">
          <span className="font-mono text-sm text-muted-foreground">
            Index · {posts.length} {posts.length === 1 ? "article" : "articles"}
          </span>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] ${SAFIRO}`}>Articles.</h1>
        </header>

        {posts.length === 0 ? (
          <p className="mt-section text-muted-foreground">Nothing here yet. The first article is on its way.</p>
        ) : (
          <ol className="mt-section">
            {posts.map((post, i) => (
              <li key={post.slug} className="border-t border-foreground/10 last:border-b">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-[2rem_1fr] md:grid-cols-[3rem_1fr] gap-x-3 py-7 md:py-8 outline-none focus-visible:bg-foreground/[0.03]"
                >
                  <span className="pt-[0.55em] font-mono text-xs md:text-sm tabular-nums text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
                    {String(posts.length - i).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 items-start gap-5">
                    <div className="relative min-w-0 flex-1">
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.72em] h-[2px] w-4 origin-left scale-x-0 rounded-full bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                      />
                      <h2 className={`pr-6 text-2xl md:text-3xl font-black tracking-tighter leading-[1.1] transition-[color,translate] duration-300 ease-out group-hover:translate-x-6 group-hover:text-foreground/60 group-focus-visible:translate-x-6 motion-reduce:transition-none ${SAFIRO}`}>
                        {post.title}
                      </h2>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        <time dateTime={post.date}>{meta(post)}</time>
                      </p>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                    {/* Hidden on phones, where the titles need the width */}
                    {post.cover && (
                      <div className="relative hidden sm:block size-20 md:size-24 shrink-0 overflow-hidden rounded-lg">
                        <CoverMedia
                          src={post.cover}
                          alt=""
                          sizes="96px"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
