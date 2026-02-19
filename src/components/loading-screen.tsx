"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";

const LINE = "Fashion Consultancy & Creative Direction";

const preventDefault = (e: Event) => e.preventDefault();

const charDelay = 0.04;
const totalReveal = 0.1 + LINE.length * charDelay + 0.45;
const holdDelay = 1.2;
const exitAfter = (totalReveal + holdDelay) * 1000;

// Module-level flag: persists during client-side navigation (JS bundle stays in memory),
// resets on page refresh/reload (JS bundle is reloaded from scratch).
// This naturally gives us: show on first load + show on refresh, skip on internal navigation.
let animationHasPlayed = false;

type Mode = "pending" | "show" | "hidden";

export function LoadingScreen() {
  // Both SSR and first client render start as 'pending' (renders nothing) — no hydration mismatch.
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    if (animationHasPlayed) {
      // Internal navigation — skip immediately
      setMode("hidden");
      return;
    }

    // First load or page refresh — show animation
    animationHasPlayed = true;
    setMode("show");

    // Block scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    const stopLenis = setTimeout(() => {
      (window as Window & { __lenis?: Lenis }).__lenis?.stop();
    }, 50);

    const t = setTimeout(() => setMode("hidden"), exitAfter);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      clearTimeout(stopLenis);
      clearTimeout(t);
      (window as Window & { __lenis?: Lenis }).__lenis?.start();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unlockScroll = () => {
    document.body.style.overflow = "";
    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    (window as Window & { __lenis?: Lenis }).__lenis?.start();
  };

  return (
    <AnimatePresence>
      {mode === "show" && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={unlockScroll}
        >
          <div className="flex overflow-hidden">
            {LINE.split("").map((char, i) => (
              <motion.span
                key={i}
                className="text-white font-normal tracking-tight"
                style={{ fontSize: "0.85rem", display: "inline-block", whiteSpace: "pre" }}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 + i * charDelay,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
