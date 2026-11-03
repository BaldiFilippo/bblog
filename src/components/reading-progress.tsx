"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { AllArticlesLink } from "@/components/all-articles-link";

// In an article, the home's side index collapses into a single vertical bar
// in the same spot: a light track that fills as you read, with the same
// "all articles" mark underneath.
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="fixed right-4 lg:right-8 top-1/2 z-30 flex -translate-y-1/2 flex-col items-end"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    >
      <motion.div
        aria-hidden
        className="relative h-32 w-[2px] origin-top overflow-hidden rounded-full bg-foreground/20"
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        <motion.div className="absolute inset-0 origin-top bg-foreground" style={{ scaleY: scrollYProgress }} />
      </motion.div>
      <AllArticlesLink className="mt-3" />
    </motion.div>
  );
}
