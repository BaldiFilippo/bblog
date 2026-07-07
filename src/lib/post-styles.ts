// Shared title and author classes - MUST be identical across all components
// for proper animation alignment between Home and Post pages
//
// IMPORTANT: These classes are the SINGLE SOURCE OF TRUTH.
// Import them in parallax.tsx and PostFixedHero.tsx - do NOT duplicate!

// Target size (larger, ending point of animation - matches Post page exactly)
// Fluid (vw) font + vw max-width: the font/container ratio is constant, so every title
// wraps at the same word boundaries at ANY viewport width within a breakpoint range.
// This guarantees the rule "all post titles share the same line count at a given viewport".
// Calibration: 8.4656vw = 128px (old text-9xl) at 1512px; 15.3846vw = 60px (old text-6xl) at 390px.
export const TITLE_CLASSES_TARGET = "text-[15.3846vw] md:text-[8.4656vw] font-black tracking-tighter text-foreground text-center font-[family-name:var(--font-safiro)] max-w-[90vw] leading-[1.1]";

// Home size (smaller, starting point of animation)
// max-width is proportional to font-size ratio so text wraps at the same word boundaries
// Ratio vs TARGET: mobile 0.6, desktop 0.5625 (same ratios as the old fixed sizes)
export const TITLE_CLASSES_HOME = "text-[9.2308vw] md:text-[4.7619vw] font-black tracking-tighter text-foreground text-center font-[family-name:var(--font-safiro)] max-w-[54vw] md:max-w-[50vw] leading-[1.1]";

// Author classes
export const AUTHOR_CLASSES = "text-xl md:text-2xl font-light tracking-wide text-muted-foreground text-center";
