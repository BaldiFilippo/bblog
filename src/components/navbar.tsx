"use client";

import Link from "next/link";

// The back-to-home element: a blinking writing cursor, as if the page were
// still being written. On hover/focus it types "home" before itself.
export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 bg-transparent mix-blend-difference">
      <Link
        href="/"
        aria-label="Home"
        className="group -m-3 flex h-11 items-center p-3 font-mono text-sm text-white outline-none"
      >
        <span
          aria-hidden
          className="inline-block w-0 overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-[steps(4,end)] group-hover:w-[4ch] group-focus-visible:w-[4ch] motion-reduce:transition-none"
        >
          home
        </span>
        <span
          aria-hidden
          className="ml-px inline-block h-[18px] w-[2px] bg-white animate-[caret_1s_steps(1)_infinite] group-hover:animate-none group-focus-visible:animate-none motion-reduce:animate-none"
        />
      </Link>
    </nav>
  );
}
