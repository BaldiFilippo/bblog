import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page isn't in the stack.",
  robots: { index: false },
};

// 404: you lost your place. The bookmark, top left, takes you back to the start.
export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden px-gutter">
      <div className="mx-auto flex min-h-[100svh] max-w-article flex-col justify-center gap-6 py-24">
        <span className="font-mono text-sm tabular-nums text-muted-foreground">404</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] font-[family-name:var(--font-safiro)]">
          You lost your place.
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          This page isn&apos;t in the stack. Maybe it moved, maybe it was never written.
        </p>
        <p className="text-sm text-muted-foreground">
          The bookmark up top takes you back to the start, or{" "}
          <Link href="/blog" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            browse every article
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
