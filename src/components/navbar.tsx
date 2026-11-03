"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";

// Ribbon length (px) at rest, and how far it reaches toward the cursor on hover
const REST = 48;
const REACH = 8;

// The back-to-home element: a bookmark ribbon hanging from the top edge of the
// screen. On hover/focus it reaches down toward you and sways, as if brushed;
// on click it gets a short tug, like pulling a bookmark, then goes home. The
// tug stretches the ribbon rather than moving it, so it never leaves the edge.
export function Navbar() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate();
  const [active, setActive] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let cmd/ctrl/shift-click open a new tab as usual
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    await animate(scope.current, { scaleY: [1, 1.3, 1] }, { duration: 0.35, ease: "easeInOut" });
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] h-0 mix-blend-difference">
      <Link
        href="/"
        aria-label="Home"
        onClick={handleClick}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="absolute left-5 top-0 flex h-20 w-11 justify-center outline-none"
      >
        <span ref={scope} className="block origin-top">
          <motion.span
            aria-hidden
            className="block w-3 origin-top bg-white"
            style={{
              // Swallowtail notch at the bottom end
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)",
            }}
            initial={false}
            animate={{
              height: active ? REST + REACH : REST,
              rotate: active && !reduced ? [0, 7, -5, 3, -1, 0] : 0,
            }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    height: { type: "spring", stiffness: 400, damping: 22 },
                    rotate: { duration: 1.1, ease: "easeOut" },
                  }
            }
          />
        </span>
      </Link>
    </nav>
  );
}
