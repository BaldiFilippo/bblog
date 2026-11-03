import Link from "next/link";

// The small "all articles" mark under the home's side index and under an
// article's reading bar: a deck seen from the front, the cards behind
// peeking out on top like the home's stack.
export function AllArticlesLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/blog"
      aria-label="All articles"
      className={`ml-auto flex h-6 w-12 items-center justify-end text-foreground/40 hover:text-foreground focus-visible:text-foreground outline-none transition-colors duration-200 ${className}`}
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
        <rect x="0.625" y="5.625" width="12.75" height="7.75" rx="1.5" />
        <path d="M2.5 3.375h9" />
        <path d="M4.5 1.125h5" />
      </svg>
    </Link>
  );
}
