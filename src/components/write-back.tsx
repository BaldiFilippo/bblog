import Link from "next/link";

// End of an essay: the reader answers it like a letter. Opens the contact
// form as a reply to this post (see src/app/contact/page.tsx).
export function WriteBack({ slug }: { slug: string }) {
  return (
    <div className="max-w-article mx-auto mt-section">
      <p className="text-sm text-muted-foreground">Did this make you think of something?</p>
      <Link
        href={`/contact?re=${slug}`}
        className="group mt-2 inline-flex items-baseline gap-2 text-3xl md:text-4xl font-black tracking-tighter font-[family-name:var(--font-safiro)] rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        Write back
        <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
          →
        </span>
      </Link>
    </div>
  );
}
