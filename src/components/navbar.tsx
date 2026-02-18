"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 bg-transparent">
      <Link
        href="/"
        className="text-xl font-bold tracking-tighter mix-blend-difference text-foreground hover:opacity-60 transition-opacity duration-200"
      >
        JUSTIN OCTAVIANO
      </Link>

      <div className="flex items-center gap-5">
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-muted-foreground transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </Link>
        <Link
          href="/contact"
          className="text-sm font-semibold bg-foreground text-background px-4 py-1.5 rounded-full hover:opacity-70 transition-opacity duration-200"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
