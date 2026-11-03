"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";

// The back-to-home element: a short dash, the same mark as the home's side
// index. In an article it fills with reading progress; on hover/focus it
// stretches into a ← arrow.
export function Navbar() {
  const pathname = usePathname();
  const inArticle = pathname.startsWith("/blog/");
  const { scrollYProgress } = useScroll();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 bg-transparent mix-blend-difference">
      <Link
        href="/"
        aria-label="Home"
        className="group -m-3 flex h-11 w-14 items-center p-3 text-white outline-none"
      >
        <span aria-hidden className="relative flex h-3 items-center">
          {/* Arrowhead, hidden until hover */}
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="absolute left-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <path d="M6 1L1 6l5 5" />
          </svg>
          <span className="relative block h-[2px] w-5 overflow-hidden rounded-full bg-white/30 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-7 group-focus-visible:w-7 motion-reduce:transition-none">
            <motion.span
              className="absolute inset-0 origin-left bg-white"
              style={{ scaleX: inArticle ? scrollYProgress : 1 }}
            />
            {/* Solid shaft while it's an arrow */}
            <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
          </span>
        </span>
      </Link>
    </nav>
  );
}
