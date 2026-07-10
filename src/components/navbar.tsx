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
    </nav>
  );
}
