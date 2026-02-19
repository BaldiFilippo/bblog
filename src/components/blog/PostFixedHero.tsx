"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { TITLE_CLASSES_TARGET, AUTHOR_CLASSES } from "@/lib/post-styles";

interface PostFixedHeroProps {
  title: string;
  author?: string;
  date: string;
  formattedDate: string;
  readingTime: string;
}

// Smooth easing
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Staggered animation variants
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

export function PostFixedHero({
  title,
  author,
  date,
  formattedDate,
  readingTime,
}: PostFixedHeroProps) {
  // Capture viewport height once to prevent jumps from browser bar changes
  const [stableVh, setStableVh] = useState<number | null>(null);
  useEffect(() => {
    setStableVh(window.innerHeight);
  }, []);

  return (
    <header className="relative w-screen left-1/2 -translate-x-1/2">
      <div
        className="bg-background flex flex-col"
        style={{ height: stableVh ? `${stableVh}px` : '100svh', overflowAnchor: 'none' }}
      >
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-2 md:gap-4"
          >
            {/* Title - DO NOT change classes, must match parallax target */}
            <h1 id="post-title-target" className={TITLE_CLASSES_TARGET}>
              {title}
            </h1>

            {/* Author */}
            {author && (
              <motion.p variants={itemVariants} className={AUTHOR_CLASSES}>
                by {author}
              </motion.p>
            )}

            {/* Meta info */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 text-sm md:text-base mt-2"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <time dateTime={date}>{formattedDate}</time>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{readingTime}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
