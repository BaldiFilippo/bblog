"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 bg-transparent mix-blend-difference">
      <Link
        href="/"
        className="text-xl font-bold tracking-tighter text-white hover:opacity-60 transition-opacity duration-200"
      >
        BBLOG
      </Link>

      <div className="flex items-center gap-5">
        <Link
          href="/contact"
          className="text-sm font-semibold text-black bg-white px-4 py-1.5 rounded-none hover:opacity-70 transition-opacity duration-200"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
