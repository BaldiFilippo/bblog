"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";

const LINE = "Fashion Consultancy & Creative Direction";

const preventDefault = (e: Event) => e.preventDefault();

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Block all scroll methods
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    // Stop Lenis after a tick (gives SmoothScroll time to initialize)
    const stopLenis = setTimeout(() => {
      (window as Window & { __lenis?: Lenis }).__lenis?.stop();
    }, 50);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      clearTimeout(stopLenis);
      (window as Window & { __lenis?: Lenis }).__lenis?.start();
    };
  }, []);

  const charDelay = 0.04;
  const totalReveal = 0.1 + LINE.length * charDelay + 0.45;
  const holdDelay = 1.2;
  const exitAfter = (totalReveal + holdDelay) * 1000;

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), exitAfter);
    return () => clearTimeout(t);
  }, [exitAfter]);

  const unlockScroll = () => {
    document.body.style.overflow = "";
    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    (window as Window & { __lenis?: Lenis }).__lenis?.start();
  };

  return (
    <AnimatePresence>
      {visible && (
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
