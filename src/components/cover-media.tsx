"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { clsx } from "clsx";

interface CoverMediaProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  // Show only the first frame, never the animation (small thumbnails)
  still?: boolean;
}

// Animated covers are authored as GIFs, but next/image can't optimize them and
// they weigh 2–5 MB each. scripts/convert-covers.sh produces, next to each GIF,
// a looping MP4 and a WebP poster: we show the poster right away and only load
// and play the video while the cover is near the viewport.
export function CoverMedia({ src, alt, sizes, className, priority, still }: CoverMediaProps) {
  const isAnimated = src.endsWith(".gif");
  const base = src.slice(0, -".gif".length);
  const reduced = useReducedMotion();
  const animate = isAnimated && !still && !reduced;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!animate || !video) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "50% 0px",
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [animate]);

  // Runs after the render that attached the source, so play() has something to play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (near) video.play().catch(() => {});
    else video.pause();
  }, [near]);

  if (!isAnimated) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
  }

  return (
    <>
      <Image
        src={`${base}-poster.webp`}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
      {animate && (
        <video
          ref={videoRef}
          // The source is attached only once the cover gets close, so off-screen covers cost nothing
          src={near || priority ? `${base}.mp4` : undefined}
          muted
          loop
          playsInline
          autoPlay={priority}
          preload="none"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className={clsx(
            "absolute inset-0 h-full w-full transition-opacity duration-300",
            className,
            playing ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </>
  );
}
