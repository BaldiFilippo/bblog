"use client";

import { motion, MotionValue, useReducedMotion } from "framer-motion";

type IndexItem = { id: number; title: string };

interface PostIndexProps {
  posts: IndexItem[];
  activeId: number;
  // 0→1 scroll progress through the active post's range
  progress: MotionValue<number>;
  onSelect: (id: number) => void;
  hidden?: boolean;
}

// Side index for the home: one dash per post. Read posts are dark, upcoming
// ones are light, the active one is longer and fills as you scroll through it.
// Hover/focus shows the post's number and title in a label to the left.
export function PostIndex({ posts, activeId, progress, onSelect, hidden }: PostIndexProps) {
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
                className="group relative flex h-8 w-14 items-center justify-end outline-none"
              >
                {/* Label */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-full mr-3 flex items-center gap-2 whitespace-nowrap rounded-full bg-foreground py-2 pl-3.5 pr-4 text-sm text-background opacity-0 translate-x-1 transition-[opacity,translate] duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 motion-reduce:transition-none"
                >
                  <span className="font-mono text-xs tabular-nums opacity-50">{number}</span>
                  <span className="max-w-[18rem] truncate">{post.title}</span>
                  {/* Arrow pointing at the dash */}
                  <span className="absolute left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[6px] border-y-transparent border-l-foreground" />
                </span>

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
    </nav>
  );
}
