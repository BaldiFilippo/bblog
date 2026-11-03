"use client";

import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import {
  TITLE_CLASSES_TARGET,
  AUTHOR_CLASSES,
  POST_HERO_CLASSES,
  POST_HERO_STACK_CLASSES,
  POST_META_CLASSES,
} from "@/lib/post-styles";

interface PostFixedHeroProps {
  title: string;
  url?: string;
  date: string;
  formattedDate: string;
  readingTime: string;
}

// Strip protocol and trailing slash for a cleaner visible label
function formatUrlLabel(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
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
  url,
  date,
  formattedDate,
  readingTime,
}: PostFixedHeroProps) {
  return (
    <header className="relative w-screen left-1/2 -translate-x-1/2">
      <div className={`bg-background ${POST_HERO_CLASSES}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={POST_HERO_STACK_CLASSES}
        >
          {/* Title - DO NOT change classes, must match parallax target */}
          <h1 id="post-title-target" className={TITLE_CLASSES_TARGET}>
            {title}
          </h1>

          {/* Live site link */}
          {url && (
            <motion.a
              variants={itemVariants}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${AUTHOR_CLASSES} hover:text-foreground transition-colors duration-200`}
            >
              {formatUrlLabel(url)} ↗
            </motion.a>
          )}

          {/* Meta info */}
          <motion.div
            variants={itemVariants}
            className={POST_META_CLASSES}
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
    </header>
  );
}
