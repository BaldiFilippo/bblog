import Link from "next/link";

// The small "all articles" mark under the home's side index and under an
// article's reading bar: a deck seen from the front, the cards behind
// peeking out on top like the home's stack.
// `align="end"` lines it up with the right end of the home's dashes;
// `align="center"` centres it on the single reading bar.
export function AllArticlesLink({ className = "", align = "end" }: { className?: string; align?: "end" | "center" }) {
  const box = align === "center" ? "w-6 justify-center" : "ml-auto w-12 justify-end";
  return (
    <Link
      href="/blog"
      aria-label="All articles"
      className={`${box} flex h-6 items-center text-foreground/40 hover:text-foreground focus-visible:text-foreground outline-none transition-colors duration-200 ${className}`}
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
        <rect x="0.625" y="5.625" width="12.75" height="7.75" rx="1.5" />
        <path d="M2.5 3.375h9" />
        <path d="M4.5 1.125h5" />
      </svg>
    </Link>
  );
}
