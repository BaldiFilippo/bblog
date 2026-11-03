"use client";

import { AllArticlesLink } from "@/components/all-articles-link";
import { motion, MotionValue, useReducedMotion } from "framer-motion";

type IndexItem = { id: number; title: string };

interface PostIndexProps {
  posts: IndexItem[];
  activeId: number;
  // 0→1 scroll progress through the active post's range
  progress: MotionValue<number>;
  onSelect: (id: number) => void;
  hidden?: boolean;
  // When set, a small "all articles" mark under the dashes links to the archive
  allHref?: string;
}

// Side index for the home: one dash per post. Read posts are dark, upcoming
// ones are light, the active one is longer and fills as you scroll through it.
export function PostIndex({ posts, activeId, progress, onSelect, hidden, allHref }: PostIndexProps) {
  const reduced = useReducedMotion();

  return (
    <nav
      aria-label="Posts"
      className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:block transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : undefined }}
    >
      <ol className="flex flex-col items-end">
        {posts.map((post, i) => {
          const isActive = post.id === activeId;
          const isRead = post.id < activeId;
          const number = String(i + 1).padStart(2, "0");

          return (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => onSelect(post.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${number} ${post.title}`}
                className="group relative flex h-3 w-12 items-center justify-end rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {/* Dash */}
                <motion.span
                  aria-hidden
                  className={`relative block h-[2px] overflow-hidden rounded-full transition-colors duration-300 group-hover:bg-foreground group-focus-visible:bg-foreground ${
                    isRead ? "bg-foreground/70" : "bg-foreground/20"
                  }`}
                  initial={false}
                  animate={{ width: isActive ? 36 : 20 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 origin-left bg-foreground"
                      style={{ scaleX: progress }}
                    />
                  )}
                </motion.span>
              </button>
            </li>
          );
        })}
      </ol>
      {allHref && <AllArticlesLink className="mt-3" />}
    </nav>
  );
}
