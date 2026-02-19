"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import { Lightbox } from "./lightbox";

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

// Animation variants for initial load
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  // Scroll to top on mount (Lenis doesn't reset automatically on navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
    (window as Window & { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis?.scrollTo(0, { immediate: true });
  }, []);

  // Wrap each image-grid img in a .img-wrap div and inject expand icon
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    container.querySelectorAll<HTMLImageElement>(".image-grid img").forEach((img) => {
      if (img.parentElement?.classList.contains("img-wrap")) return; // already wrapped
      const wrap = document.createElement("div");
      wrap.className = "img-wrap";
      img.parentElement?.insertBefore(wrap, img);
      wrap.appendChild(img);

      // Inject expand icon
      const icon = document.createElement("div");
      icon.className = "img-expand-icon";
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`;
      wrap.appendChild(icon);
    });
  }); // no dependency: re-run after every render to re-inject if React reconciled the DOM

  // Event delegation: catch clicks on image-grid imgs
  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "IMG" &&
      target.closest(".image-grid")
    ) {
      const img = target as HTMLImageElement;
      setLightbox({ src: img.src, alt: img.alt });
    }
  }, []);

  return (
    <>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

      <motion.article
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        {/* Cover Image - Full-bleed with elegant presentation */}
        {cover && (
          <motion.div
            variants={fadeUpVariants}
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
              ref={contentRef}
              className="article-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              onClick={handleContentClick}
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
    </>
  );
}
