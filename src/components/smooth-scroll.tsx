"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

type LenisWindow = Window & { __lenis?: Lenis };

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  // Set by browser back/forward, where the browser restores the old position
  const fromHistory = useRef(false);
  // Last path we reset for: the first one is a full load, where a reload keeps
  // the browser's own position (and re-running effects in dev is a no-op)
  const lastPath = useRef(pathname);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      autoResize: true,
    });

    // Expose globally so other components can stop/start scroll
    (window as LenisWindow).__lenis = lenis;

    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPopState);
      lenis.destroy();
      delete (window as LenisWindow).__lenis;
    };
  }, []);

  // A new page always starts at the top. Next resets the window, but Lenis
  // keeps its own target from the previous page and would drag the new one
  // back there on the next wheel tick, so reset both before paint. Back,
  // forward and reloads are left to the browser's own scroll restoration.
  useLayoutEffect(() => {
    const wasHistory = fromHistory.current;
    fromHistory.current = false;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (wasHistory) return;
    window.scrollTo(0, 0);
    const lenis = (window as LenisWindow).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.resize();
  }, [pathname]);

  return <>{children}</>;
}
