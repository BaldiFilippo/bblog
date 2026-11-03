"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

// Ribbon length (px): at rest, and how much it grows across a full article
const REST = 30;
const GROWTH = 40;

// The back-to-home element: a bookmark ribbon hanging from the top edge of the
// screen. In an article it lowers as you read, marking your place; on
// hover/focus it's pulled up, as if closing the book to go back to the start.
export function Navbar() {
  const pathname = usePathname();
  const inArticle = pathname.startsWith("/blog/");
  const { scrollYProgress } = useScroll();
  const readingHeight = useTransform(scrollYProgress, (p) => REST + p * GROWTH);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] h-0 mix-blend-difference">
      <Link
        href="/"
        aria-label="Home"
        className="group absolute left-5 top-0 flex h-20 w-11 justify-center outline-none"
      >
        <motion.span
          aria-hidden
          className="block w-3 bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-focus-visible:-translate-y-3 motion-reduce:transition-none"
          style={{
            height: inArticle ? readingHeight : REST,
            // Swallowtail notch at the bottom end
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)",
          }}
        />
      </Link>
    </nav>
  );
}
