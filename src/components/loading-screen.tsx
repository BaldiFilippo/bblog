"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Lenis from "lenis";

const preventDefault = (e: Event) => e.preventDefault();

// How long the blank page holds while the bookmark (Navbar) drops into place
const HOLD_MS = 750;

// Module-level flag: persists during client-side navigation (JS bundle stays in memory),
// resets on page refresh/reload (JS bundle is reloaded from scratch). The Navbar
// also sets it on mount, so the intro only plays when the home is the page the
// visit starts on, never when arriving at it from another page.
export const intro = { played: false };

// The intro: a blank page while the bookmark falls from the top edge and
// settles (see Navbar, which sits above this layer), then the home fades in.
export function LoadingScreen() {
  const reduced = useReducedMotion();
  // Shown from the very first (server) render so the page never flashes before
  // the intro; on internal navigation the flag is already set and it's skipped.
  const [show, setShow] = useState(() => !intro.played);

  useEffect(() => {
    if (!show) return;
    intro.played = true;

    // A reload must always start from the top: the browser would otherwise
    // restore the previous scroll position (and keeps re-applying it even
    // after a reset while the page loads). Disable restoration for the
    // duration of the intro and reset behind the opaque overlay.
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    (window as Window & { __lenis?: Lenis }).__lenis?.scrollTo(0, { immediate: true });

    // Block scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    const stopLenis = setTimeout(() => {
      (window as Window & { __lenis?: Lenis }).__lenis?.stop();
    }, 50);

    const t = setTimeout(() => setShow(false), reduced ? 200 : HOLD_MS);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      clearTimeout(stopLenis);
      clearTimeout(t);
      (window as Window & { __lenis?: Lenis }).__lenis?.start();
      window.history.scrollRestoration = "auto";
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unlockScroll = () => {
    document.body.style.overflow = "";
    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    (window as Window & { __lenis?: Lenis }).__lenis?.start();
    // Intro finished: re-enable native restoration so browser back/forward
    // keeps its normal scroll behavior.
    window.history.scrollRestoration = "auto";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          // Under the Navbar (z-60) so the bookmark stays visible, above everything else
          className="fixed inset-0 z-[55] bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={unlockScroll}
        />
      )}
    </AnimatePresence>
  );
}
