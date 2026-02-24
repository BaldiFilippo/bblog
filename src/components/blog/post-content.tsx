"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useEffect, useLayoutEffect } from "react";

interface NextPostInfo {
  slug: string;
  title: string;
  cover?: string;
  excerpt: string;
}

interface PostContentProps {
  cover?: string;
  title: string;
  contentHtml: string;
  nextPost?: NextPostInfo;
}

// Smooth easing curve
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Animation variants for cover - matches hero stagger pattern (opacity + y, same duration/ease)
const coverVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: 0.54 },
  },
};

// Scroll-triggered section component
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PostContent({
  cover,
  title,
  contentHtml,
  nextPost,
}: PostContentProps) {
  // Remove the nav transition cover and reset scroll BEFORE the browser paints,
  // so the user never sees a frame with the cover hiding content.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as Window & { __lenis?: { scrollTo: (target: number, opts?: object) => void; resize: () => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true });
    document.getElementById("__nav-transition-cover")?.remove();
  }, []);

  // Force Lenis to recalculate scroll limits after content is painted.
  useEffect(() => {
    const lenis = (window as Window & { __lenis?: { resize: () => void } }).__lenis;
    const raf = requestAnimationFrame(() => {
      lenis?.resize();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Cover Image - Full-bleed with elegant presentation */}
      {cover && (
        <motion.div
          variants={coverVariants}
          className="w-full mb-16 md:mb-24"
        >
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-xl md:rounded-2xl">
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                priority
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Container */}
      <div className="px-5 md:px-8">
        {/* Article Body with custom typography */}
        <AnimatedSection>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </AnimatedSection>

        {/* Next Post Preview */}
        {nextPost && (
          <AnimatedSection className="max-w-[680px] mx-auto mt-16" delay={0.1}>
            <div className="border-t border-foreground/10 pt-8">
              <span className="text-sm text-muted-foreground font-medium">Next post</span>
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group mt-4 flex items-center gap-5"
              >
                {nextPost.cover && (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={nextPost.cover}
                      alt={nextPost.title}
                      fill
                      className="object-cover transition-opacity duration-200 group-hover:opacity-70"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-muted-foreground">
                    {nextPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{nextPost.excerpt}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </AnimatedSection>
        )}

        {/* Footer Navigation */}
        <AnimatedSection className="max-w-[680px] mx-auto mt-8 pb-24" delay={0.15}>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            See all posts
          </Link>
        </AnimatedSection>
      </div>
    </motion.article>
  );
}
