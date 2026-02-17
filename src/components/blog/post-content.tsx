"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface PostContentProps {
  tags?: string[];
  cover?: string;
  title: string;
  contentHtml: string;
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
  tags,
  cover,
  title,
  contentHtml,
}: PostContentProps) {
  return (
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
            className="article-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </AnimatedSection>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <AnimatedSection className="max-w-[680px] mx-auto mt-16" delay={0.1}>
            <div className="border-t border-foreground/10 pt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">
                  Tagged:
                </span>
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Footer Navigation */}
        <AnimatedSection className="max-w-[680px] mx-auto mt-12 pb-24" delay={0.15}>
          <div className="border-t border-foreground/10 pt-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 -ml-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all posts
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </motion.article>
  );
}
