"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";

const RIBBON_CLIP = "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)";

// Where the ribbon hangs normally (Navbar), and its length
const START = { x: 32, y: -20 };
const LENGTH = 72;
const LYING = -112;

// The 404's bookmark: on arrival the navigation ribbon is hidden (see
// globals.css) and this one falls from its usual spot to the lower right of
// the page, tumbling as it goes, and lies there. Clicking it goes home.
export function FallenBookmark() {
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    document.documentElement.dataset.lost = "";
    // Lands right of centre, low on the page, clear of the text column
    const target = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.78 };
    if (reduced) {
      animate(scope.current, { ...target, rotate: LYING }, { duration: 0 });
    } else {
      animate(
        scope.current,
        { ...target, rotate: LYING },
        {
          x: { duration: 1.1, ease: [0.3, 0, 0.4, 1] },
          y: { duration: 1.1, ease: [0.5, 0, 0.75, 0] },
          rotate: { duration: 1.2, ease: [0.2, 0.8, 0.3, 1] },
        }
      );
    }
    return () => {
      delete document.documentElement.dataset.lost;
    };
  }, [animate, scope, reduced]);

  return (
    <motion.div
      ref={scope}
      className="fixed left-0 top-0 z-30"
      style={{ x: START.x, y: START.y, rotate: 0 }}
    >
      <Link href="/" aria-label="Back to the home" className="group -m-4 block p-4 outline-none">
        <span
          className="block w-3 bg-foreground transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
          style={{ height: LENGTH, clipPath: RIBBON_CLIP }}
        />
      </Link>
    </motion.div>
  );
}
