"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useAnimation, useVelocity, useTransform, useSpring, MotionValue, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { TiltCard } from "./tilt-card";
import { TITLE_CLASSES_TARGET, AUTHOR_CLASSES } from "@/lib/post-styles";

// Blog post type for the parallax component
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author?: string;
  image: string;
  excerpt?: string;
  date?: string;
  isSeeAll?: boolean;
}

interface ParallaxProps {
  posts: BlogPost[];
}

const COVER_HEIGHT_VH = 40;
// How far down (in vh) the first card starts from the top of the page
const FIRST_CARD_TOP_VH = 80;
// Gap between cards (in vh)
const CARD_GAP_VH = 100;

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

function SeeMoreButton() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="w-full flex items-center justify-center py-8 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/blog"
          className="group flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors duration-200"
        >
          See all posts
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function Parallax({ posts }: ParallaxProps) {
  const router = useRouter();
  const { scrollY } = useScroll();

  // -- SCROLL STATE --
  // Controlled by scroll position
  const [activeId, setActiveId] = useState(1);
  const activePost = posts.find((p) => p.id === activeId) || posts[0];

  // -- TRANSITION STATE --
  // Frozen snapshot for the transition sequence
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "running">("idle");
  const [transitionData, setTransitionData] = useState<BlogPost | null>(null);

  // Animation Controls for the Transition Layer
  const titleControls = useAnimation();

  // Refs for Transition Layer measurement
  const transitionTitleRef = useRef<HTMLHeadingElement>(null);
  const ghostTitleRef = useRef<HTMLHeadingElement>(null);

  // Robust cleanup
  useEffect(() => {
    return () => {
      unlockScroll();
    };
  }, []);

  // Sync Active Post with Scroll (ONLY if idle)
  // Title changes when a card's TOP edge exits the TOP of the viewport
  useMotionValueEvent(scrollY, "change", (latest) => {
    const vh = window.innerHeight;
    const firstCardTop = (FIRST_CARD_TOP_VH / 100) * vh;
    const cardHeight = (COVER_HEIGHT_VH / 100) * vh;
    const gap = (CARD_GAP_VH / 100) * vh;

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
  });

  const handlePostClick = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    if (transitionPhase !== "idle") return;

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
        scale: 0.6,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    });

    // -- PHASE 3: SCALE UP TO MATCH BLOG PAGE --
    if (ghostTitleRef.current) {
        const targetRect = ghostTitleRef.current.getBoundingClientRect();

        const targetCX = targetRect.left + targetRect.width / 2;
        const targetCY = targetRect.top + targetRect.height / 2;

        const viewportCX = window.innerWidth / 2;
        const moveX = targetCX - viewportCX;
        const moveY = targetCY - window.innerHeight / 2;

        const finalX = Math.round(centerXOffset + moveX);
        const finalY = Math.round(moveY);

        await titleControls.start({
            x: finalX,
            y: finalY,
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        });
    }

    // -- NAVIGATION --
    router.push(`/blog/${post.slug}`);
  };

  // Guard against empty posts
  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen preserve-3d">

      {/* ------------------------------------------------------- */}
      {/* TRANSITION OVERLAY (Only visible during transition)     */}
      {/* ------------------------------------------------------- */}
      {transitionPhase === "running" && transitionData && (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* GHOST for Measurement (Hidden) - Must match blog page structure exactly */}
            <div aria-hidden="true" className="fixed inset-0 invisible">
                <div className="relative w-full">
                    <div className="h-[100svh] bg-background flex flex-col">
                        <div className="flex-1 flex items-center justify-center px-4">
                            <div className="flex flex-col items-center gap-2 md:gap-4">
                                <h1 ref={ghostTitleRef} className={TITLE_CLASSES_TARGET}>
                                    {transitionData.title}
                                </h1>
                                <p className={AUTHOR_CLASSES}>
                                    by Author Name
                                </p>
                                <div className="flex gap-4 text-sm md:text-base mt-2">
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
            </div>

            {/* ANIMATING ELEMENTS — h-[100svh] must match the home fixed title layer */}
            <div className="fixed top-0 left-0 right-0 h-[100svh] flex items-center justify-center">
                 <div className="relative w-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2 md:gap-4 px-4 w-full">
                         {/* Transition Title - starts at scale 0.6 (home size), animates to scale 1 (target size) */}
                         <motion.h2
                            ref={transitionTitleRef}
                            initial={{ x: 0, opacity: 1, filter: "blur(0px)", scale: 0.6 }}
                            animate={titleControls}
                            className={TITLE_CLASSES_TARGET}
                            style={{ transformOrigin: "center center" }}
                         >
                            {transitionData.title}
                         </motion.h2>
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
        className="fixed top-0 left-0 right-0 h-[100svh] flex items-center justify-center pointer-events-none z-0 transition-opacity duration-200"
        style={{ opacity: transitionPhase === "running" ? 0 : 1 }}
      >
        <div className="relative w-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
            <motion.div
                key={activePost.id}
                className="flex flex-col items-center justify-center px-4 w-full"
                style={{ scale: 0.6 }}
            >
                <motion.h2
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={TITLE_CLASSES_TARGET}
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

      {/* SCROLLABLE CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center pointer-events-none">
        {posts.map((post, index) => {
          if (post.isSeeAll) return null;

          return (
            <div
              key={post.id}
              className="w-full flex justify-center perspective-container"
              style={{
                  marginTop: index === 0 ? `${FIRST_CARD_TOP_VH}vh` : `${CARD_GAP_VH}vh`,
                  height: `${COVER_HEIGHT_VH}vh`,
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
        <div style={{ height: "80vh" }} />

        {/* See More Button */}
        <SeeMoreButton />

        <div style={{ height: "20vh" }} />
      </div>
    </div>
  );
}
