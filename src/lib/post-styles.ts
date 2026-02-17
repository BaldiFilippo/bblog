// Shared title and author classes - MUST be identical across all components
// for proper animation alignment between Home and Post pages
//
// IMPORTANT: These classes are the SINGLE SOURCE OF TRUTH.
// Import them in parallax.tsx and PostFixedHero.tsx - do NOT duplicate!

// Target size (larger, ending point of animation - matches Post page exactly)
export const TITLE_CLASSES_TARGET = "text-6xl md:text-9xl font-black tracking-tighter text-foreground text-center font-[family-name:var(--font-safiro)] max-w-[90vw] leading-[1.1]";

// Home size (smaller, starting point of animation)
// max-width is proportional to font-size ratio so text wraps at the same word boundaries
// Ratio: mobile 2.25rem/3.75rem=0.6, desktop 4.5rem/8rem=0.5625
export const TITLE_CLASSES_HOME = "text-4xl md:text-7xl font-black tracking-tighter text-foreground text-center font-[family-name:var(--font-safiro)] max-w-[54vw] md:max-w-[50vw] leading-[1.1]";

// Author classes
export const AUTHOR_CLASSES = "text-xl md:text-2xl font-light tracking-wide text-muted-foreground text-center";
