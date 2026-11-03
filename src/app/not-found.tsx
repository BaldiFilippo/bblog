import type { Metadata } from "next";
import Link from "next/link";
import { FallenBookmark } from "@/components/fallen-bookmark";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page isn't in the stack.",
  robots: { index: false },
};

// 404: the bookmark has slipped out of its place at the top of the screen and
// lies on the page. Picking it up (clicking it) goes back home.
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
          Pick up the bookmark to go back to the start, or{" "}
          <Link href="/blog" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
            browse every essay
          </Link>
          .
        </p>
      </div>
      <FallenBookmark />
    </main>
  );
}
