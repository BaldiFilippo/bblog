"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useAnimation, useVelocity, useTransform, useSpring, MotionValue, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { TiltCard } from "./tilt-card";
import { PostIndex } from "./post-index";
import {
  TITLE_CLASSES_TARGET,
  AUTHOR_CLASSES,
  POST_HERO_CLASSES,
  POST_HERO_STACK_CLASSES,
  POST_META_CLASSES,
} from "@/lib/post-styles";

// Post type for the parallax component
export interface PostItem {
  id: number;
  slug: string;
  title: string;
  url?: string;
  image: string;
  excerpt?: string;
  date?: string;
  isSeeAll?: boolean;
}

interface ParallaxProps {
  posts: PostItem[];
}

// All vertical layout uses svh (small viewport height): it stays constant while
// mobile browser URL bars show/hide, so nothing shifts with the bar state.
const COVER_HEIGHT_SVH = 40;
// How far down (in svh) the first card starts from the top of the page
const FIRST_CARD_TOP_SVH = 80;
// Gap between cards (in svh)
const CARD_GAP_SVH = 100;

// Vertical anchor of the home title. The title's TOP edge sits at a fixed point
// (instead of the block being vertically centered), so the first line never moves
// when consecutive posts have titles with a different number of lines: extra lines
// just grow downwards. The offset is chosen so a title of typical length is exactly
// centered: one scaled line = 0.6 scale × leading 1.1 × font size (TITLE_CLASSES_TARGET).
// Mobile: typical 5 lines → 2.5 × 0.66 × 15.3846vw = 25.3846vw
// Desktop: typical 3 lines → 1.5 × 0.66 × 8.4656vw = 8.3809vw
// Shared by the fixed title layer and the transition overlay: they MUST match,
// or the title jumps when a post is clicked.
const HOME_TITLE_SCALE = 0.6;
const TITLE_ANCHOR_CLASSES =
  "absolute left-0 right-0 flex justify-center top-[calc(50svh_-_25.3846vw)] md:top-[calc(50svh_-_8.3809vw)]";

// Measure 100svh in px. Unlike window.innerHeight, this value does not change
// when the mobile browser URL bar collapses/expands, keeping the JS scroll math
// in sync with the svh-based CSS layout.
// Scroll range (px) in which post `id` is the active one: from where the
// previous card leaves the top of the viewport to where this one does.
function activeRange(id: number, vh: number): [number, number] {
  const top = ((FIRST_CARD_TOP_SVH + (id - 1) * (COVER_HEIGHT_SVH + CARD_GAP_SVH)) / 100) * vh;
  const start = id === 1 ? 0 : top - (CARD_GAP_SVH / 100) * vh;
  return [start, top + (COVER_HEIGHT_SVH / 100) * vh];
}

function measureSvhPx(): number {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:100svh;pointer-events:none;visibility:hidden";
  document.body.appendChild(probe);
  const px = probe.offsetHeight;
  probe.remove();
  return px || window.innerHeight;
}

// Squeeze Card component that reacts to scroll velocity
function SqueezeCard({
  children,
  scrollY
}: {
  children: React.ReactNode;
  scrollY: MotionValue<number>;
}) {
  const scrollVelocity = useVelocity(scrollY);

  // Map velocity to squeeze effect
  // Compress horizontally (narrower) and stretch vertically (taller)
  const scaleX = useTransform(
    scrollVelocity,
    [-2000, 0, 2000],
    [0.85, 1, 0.85]
  );

  const scaleY = useTransform(
    scrollVelocity,
    [-2000, 0, 2000],
    [1.15, 1, 1.15]
  );

  // Smooth out the effect
  const smoothScaleX = useSpring(scaleX, { stiffness: 400, damping: 30 });
  const smoothScaleY = useSpring(scaleY, { stiffness: 400, damping: 30 });

  return (
    <motion.div
      style={{
        scaleX: smoothScaleX,
        scaleY: smoothScaleY,
        transformOrigin: "center center",
      }}
      className="h-full aspect-square"
    >
      {children}
    </motion.div>
  );
}

// Centralized scroll management
const lockScroll = () => {
  document.body.style.overflow = "hidden";
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
};

const unlockScroll = () => {
  document.body.style.overflow = "";
  document.body.removeEventListener('touchmove', preventDefault);
};

const preventDefault = (e: Event) => e.preventDefault();

export default function Parallax({ posts }: ParallaxProps) {
  const router = useRouter();
  const { scrollY } = useScroll();

  // -- SCROLL STATE --
  // Controlled by scroll position
  const [activeId, setActiveId] = useState(1);
  const activePost = posts.find((p) => p.id === activeId) || posts[0];
  const activeProgress = useMotionValue(0);

  // -- TRANSITION STATE --
  // Frozen snapshot for the transition sequence
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "running">("idle");
  const [transitionData, setTransitionData] = useState<PostItem | null>(null);

  // Animation Controls for the Transition Layer
  const titleControls = useAnimation();

  // Refs for Transition Layer measurement
  const transitionTitleRef = useRef<HTMLHeadingElement>(null);
  const ghostTitleRef = useRef<HTMLHeadingElement>(null);

  // Stable viewport height (100svh in px) for scroll math — see measureSvhPx
  const svhPxRef = useRef(0);
  useEffect(() => {
    const update = () => { svhPxRef.current = measureSvhPx(); };
    update();
    // Re-measuring on resize is safe: URL-bar resizes yield the same svh value,
    // only orientation changes / real window resizes produce a new one.
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Robust cleanup
  useEffect(() => {
    return () => {
      unlockScroll();
    };
  }, []);

  // Sync Active Post with Scroll (ONLY if idle)
  // Title changes when a card's TOP edge exits the TOP of the viewport
  useMotionValueEvent(scrollY, "change", (latest) => {
    const vh = svhPxRef.current || measureSvhPx();
    const firstCardTop = (FIRST_CARD_TOP_SVH / 100) * vh;
    const cardHeight = (COVER_HEIGHT_SVH / 100) * vh;
    const gap = (CARD_GAP_SVH / 100) * vh;

    let newActiveId = 1;

    if (latest < firstCardTop + cardHeight) {
        newActiveId = 1;
    } else {
        let cardTopPosition = firstCardTop;

        for (let i = 1; i <= posts.length; i++) {
            const cardBottomExit = cardTopPosition + cardHeight;

            if (latest < cardBottomExit) {
                newActiveId = i;
                break;
            }

            cardTopPosition = cardBottomExit + gap;
            newActiveId = i + 1;
        }

        newActiveId = Math.min(newActiveId, posts.length);
    }

    if (newActiveId !== activeId) {
      setActiveId(newActiveId);
    }

    const [start, end] = activeRange(newActiveId, vh);
    activeProgress.set(Math.min(1, Math.max(0, (latest - start) / (end - start))));
  });

  // Side index: bring the chosen card to the centre of the viewport
  const scrollToPost = (id: number) => {
    const vh = svhPxRef.current || measureSvhPx();
    const cardTop = activeRange(id, vh)[1] - (COVER_HEIGHT_SVH / 100) * vh;
    const target = cardTop - ((100 - COVER_HEIGHT_SVH) / 200) * vh;
    const lenis = (window as Window & { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Prefetch ALL article routes on mount so every router.push() is instant
  useEffect(() => {
    posts.forEach(post => {
      router.prefetch(`/blog/${post.slug}`);
    });
  }, [posts, router]);

  const handlePostClick = async (e: React.MouseEvent, post: PostItem) => {
    e.preventDefault();
    if (transitionPhase !== "idle") return;

    // Prefetch in parallel with the FLIP animation so the route is cached by navigation time
    router.prefetch(`/blog/${post.slug}`);

    // 1. FREEZE STATE
    setTransitionData(post);
    setTransitionPhase("running");
    lockScroll();

    // 2. WAIT FOR FONTS TO BE LOADED (critical for consistent measurements)
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 3. WAIT FOR RENDER of Transition Layer
    await new Promise(resolve => setTimeout(resolve, 20));

    // 4. START SEQUENCE (2 PHASES)

    // -- PHASE 1: CLEANUP SCENE (Cover OUT) --
    // Title must remain perfectly STABLE here.
    // Cover opacity is handled by the "running" state in the list mapping.
    // Small delay to let the cover fade out
    await new Promise(resolve => setTimeout(resolve, 400));

    // -- PHASE 2: CENTER TITLE --
    let centerXOffset = 0;
    if (transitionTitleRef.current) {
        const titleRect = transitionTitleRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const titleCenterX = titleRect.left + titleRect.width / 2;
        centerXOffset = Math.round(centerX - titleCenterX);
    }

    // Move to center (keep scale at 0.6)
    await titleControls.start({
        x: centerXOffset,
        opacity: 1,
        scale: HOME_TITLE_SCALE,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    });

    // -- PHASE 3: SCALE UP TO MATCH BLOG PAGE --
    // Measure actual visual centers instead of assuming viewport midpoints
    // (on mobile, 100svh ≠ window.innerHeight due to browser chrome)
    if (ghostTitleRef.current && transitionTitleRef.current) {
        const targetRect = ghostTitleRef.current.getBoundingClientRect();
        const currentRect = transitionTitleRef.current.getBoundingClientRect();

        const targetCX = targetRect.left + targetRect.width / 2;
        const currentCX = currentRect.left + currentRect.width / 2;

        // Exact (unrounded) deltas: the title must land on the same sub-pixel
        // position as the post page h1, otherwise glyph antialiasing differs
        // and the swap is visible as a subtle "font change".
        // Vertical delta uses TOP edges: the title scales from its top edge
        // (transformOrigin "50% 0"), so its top stays put while it grows.
        const finalX = centerXOffset + (targetCX - currentCX);
        const finalY = targetRect.top - currentRect.top;

        await titleControls.start({
            x: finalX,
            y: finalY,
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        });
    }

    // -- NAVIGATION --
    // Reset scroll to top BEFORE navigating, while the z-50 overlay is still visible.
    // Without this, the blog page initially renders at the old scroll position (200-400vh)
    // which is past the hero, causing a visible flash before ProjectContent scrolls to top.
    window.scrollTo(0, 0);
    const lenis = (window as Window & { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true });

    // Inject a bg-background layer at z-55 (above content z-50, below navbar z-60).
    // The navbar uses mix-blend-difference, so its colors depend on the pixels behind it.
    // During the page swap the content behind it changes for 1-2 frames, causing a blink.
    // This layer gives the navbar a stable background to blend with during the transition.
    const navCover = document.createElement("div");
    navCover.id = "__nav-transition-cover";
    navCover.className = "fixed inset-0 z-[55] bg-background pointer-events-none";
    document.body.appendChild(navCover);

    router.push(`/blog/${post.slug}`);
  };

  // Guard against empty posts
  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen preserve-3d">

      {/* ------------------------------------------------------- */}
      {/* TRANSITION OVERLAY (Only visible during transition)     */}
      {/* ------------------------------------------------------- */}
      {transitionPhase === "running" && transitionData && (
        <div className="fixed inset-0 z-58 pointer-events-none">
            {/* GHOST for Measurement (Hidden) - Must match blog page structure exactly */}
            <div aria-hidden="true" className="fixed inset-0 invisible">
                <div className="relative w-full">
                    <div className={`bg-background ${POST_HERO_CLASSES}`}>
                        <div className={POST_HERO_STACK_CLASSES}>
                            <h1 ref={ghostTitleRef} className={TITLE_CLASSES_TARGET}>
                                {transitionData.title}
                            </h1>
                            {transitionData.url && (
                              <p className={AUTHOR_CLASSES}>
                                {transitionData.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                              </p>
                            )}
                            <div className={POST_META_CLASSES}>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <time>Date placeholder</time>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Reading time</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ANIMATING ELEMENTS — layout must match the home fixed title layer */}
            <div className="fixed top-0 left-0 right-0 h-[100svh]">
                 <div className={TITLE_ANCHOR_CLASSES}>
                    <div className="flex flex-col items-center gap-2 md:gap-4 px-4 w-full">
                         {/* Transition Title - starts at scale 0.6 (home size), animates to scale 1 (target size) */}
                         {/* No `filter` here: even blur(0px) forces GPU rasterization
                             and makes the text render differently from the post page h1 */}
                         <motion.h1
                            ref={transitionTitleRef}
                            initial={{ x: 0, opacity: 1, scale: HOME_TITLE_SCALE }}
                            animate={titleControls}
                            className={TITLE_CLASSES_TARGET}
                            style={{ transformOrigin: "50% 0" }}
                         >
                            {transitionData.title}
                         </motion.h1>
                    </div>
                 </div>
            </div>
        </div>
      )}


      {/* ------------------------------------------------------- */}
      {/* NORMAL STATE (Scrollable List + Fixed Title)            */}
      {/* ------------------------------------------------------- */}

      {/* FIXED TITLE LAYER (Hidden during transition) */}
      <div
        className="fixed top-0 left-0 right-0 h-[100svh] pointer-events-none z-20 mix-blend-difference transition-opacity duration-200"
        style={{ opacity: transitionPhase === "running" ? 0 : 1 }}
      >
        <div className={TITLE_ANCHOR_CLASSES}>
            <AnimatePresence mode="popLayout">
            <motion.div
                key={activePost.id}
                className="flex flex-col items-center px-4 w-full"
                style={{ scale: HOME_TITLE_SCALE, transformOrigin: "50% 0" }}
            >
                <motion.h2
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={TITLE_CLASSES_TARGET}
                    style={{ color: "#fff" }}
                >
                    <Link
                        href={`/blog/${activePost.slug}`}
                        className="pointer-events-auto cursor-pointer hover:text-muted-foreground transition-colors duration-200"
                        onClick={(e) => handlePostClick(e, activePost)}
                    >
                        {activePost.title}
                    </Link>
                </motion.h2>
            </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <PostIndex
        posts={posts.filter((p) => !p.isSeeAll)}
        activeId={activeId}
        progress={activeProgress}
        onSelect={scrollToPost}
        hidden={transitionPhase === "running"}
        allHref="/blog"
      />

      {/* SCROLLABLE CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center pointer-events-none">
        {posts.map((post, index) => {
          if (post.isSeeAll) return null;

          return (
            <div
              key={post.id}
              className="w-full flex justify-center perspective-container"
              style={{
                  marginTop: index === 0 ? `${FIRST_CARD_TOP_SVH}svh` : `${CARD_GAP_SVH}svh`,
                  height: `${COVER_HEIGHT_SVH}svh`,
                  perspective: "1200px"
              }}
            >
              <SqueezeCard scrollY={scrollY}>
                <Link
                    href={`/blog/${post.slug}`}
                    className={`block h-full w-full transition-opacity duration-500 pointer-events-auto ${
                        transitionPhase === "running" && transitionData?.id !== post.id
                        ? "opacity-0 pointer-events-none"
                        : ""
                    }`}
                    onClick={(e) => handlePostClick(e, post)}
                >
                  <motion.div
                    animate={
                        transitionPhase === "running" && transitionData?.id === post.id
                        ? { opacity: 0 }
                        : { opacity: 1 }
                    }
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                      <TiltCard image={post.image} title={post.title} priority={index === 0} />
                  </motion.div>
                </Link>
              </SqueezeCard>
            </div>
          );
        })}
        {/* Extra space so the last card can scroll past the middle of the viewport */}
        <div style={{ height: "80svh" }} />

        <div style={{ height: "20svh" }} />
      </div>
    </div>
  );
}
