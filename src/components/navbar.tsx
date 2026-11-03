"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { intro } from "./loading-screen";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

// Ribbon length (px) at rest, and how far it reaches toward a nearby cursor
const REST = 72;
const REACH = 12;
const HALF_WIDTH = 6;
const NOTCH = 6;
// The ribbon really starts this far above the screen, so its anchor never shows
const ANCHOR = 120;
// Pull the ribbon this much longer and let go to go home
const PULL_TO_GO = 70;
// Below this much pointer travel a press is a plain click
const CLICK_SLOP = 4;
// The SVG canvas the ribbon is drawn in, centred on where it hangs
const CANVAS_W = 160;
const CANVAS_H = 260;

// The tip swings like a pendulum; the body follows it with a lag, so the
// ribbon bends and ripples like fabric instead of rotating as a rigid bar.
const TIP = { type: "spring", stiffness: 200, damping: 9, mass: 0.6 } as const;
const UPPER = { stiffness: 120, damping: 14, mass: 0.6 };
const LOWER = { stiffness: 180, damping: 14, mass: 0.6 };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// The back-to-home element: a soft bookmark ribbon hanging from the top edge
// of the screen. Brushing past it pushes it the way the cursor moves, harder
// the faster it goes; it reaches toward a cursor that's close. It can be
// pulled down: let go past a threshold (or just click it) to go home.
export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  // First load on the home: the ribbon starts tucked above the screen and
  // drops in as the intro (LoadingScreen holds a blank page meanwhile)
  const [dropIn] = useState(() => pathname === "/");

  // Horizontal offset of the tip, and the two body control points trailing it
  const tipX = useMotionValue(0);
  const upperX = useSpring(useTransform(tipX, (v) => v * 0.2), UPPER);
  const lowerX = useSpring(useTransform(tipX, (v) => v * 0.8), LOWER);
  const length = useSpring(dropIn ? -NOTCH : REST, { stiffness: 300, damping: 18 });

  useEffect(() => {
    intro.played = true;
    if (!dropIn) return;
    if (reduced) {
      length.jump(REST);
      return;
    }
    // A bouncier spring just for the fall, then back to the usual one
    const t = setTimeout(() => {
      animate(length, REST, { type: "spring", stiffness: 260, damping: 11 });
    }, 100);
    return () => clearTimeout(t);
  }, [dropIn, length, reduced]);

  const path = useTransform([tipX, upperX, lowerX, length], ([tip, upper, lower, len]: number[]) => {
    const w = HALF_WIDTH;
    const top = -ANCHOR;
    const span = len + ANCHOR;
    // Leaves the anchor straight down, so the visible part only bends lower
    const y1 = top + span * 0.45;
    const y2 = top + span * 0.75;
    const x1 = upper * 0.3;
    // The end is cut square to the ribbon's direction there, not to the screen,
    // so a swinging tip keeps its full width and a clean swallowtail
    const dx = tip - lower;
    const dy = len - y2;
    const d = Math.hypot(dx, dy) || 1;
    const [tx, ty] = [dx / d, dy / d];
    const [nx, ny] = [ty * w, -tx * w];
    // Right edge down, swallowtail notch, left edge back up
    return [
      `M ${-w} ${top} L ${w} ${top}`,
      `C ${x1 + w} ${y1} ${lower + nx} ${y2 + ny} ${tip + nx} ${len + ny}`,
      `L ${tip - tx * NOTCH} ${len - ty * NOTCH} L ${tip - nx} ${len - ny}`,
      `C ${lower - nx} ${y2 - ny} ${x1 - w} ${y1} ${-w} ${top} Z`,
    ].join(" ");
  });

  const drag = useRef<{ x: number; y: number; moved: boolean; stretch: number } | null>(null);
  // Set when a press turned into a drag, so the click that follows is ignored
  const suppressClick = useRef(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced) return;

    if (drag.current) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.hypot(dx, dy) > CLICK_SLOP) drag.current.moved = true;
      // Rubber band: the further you pull, the harder it gets
      const pull = Math.max(0, dy);
      drag.current.stretch = pull / (1 + pull / 260);
      length.set(REST + drag.current.stretch);
      tipX.set(clamp(dx * 0.7, -50, 50));
      return;
    }

    // Brush: push the tip the way the cursor moves, as hard as it moves
    if (e.movementX !== 0) {
      animate(tipX, 0, { ...TIP, velocity: clamp(e.movementX * 9, -160, 160) });
    }
    // Reach toward the cursor, more the closer it gets to the tip
    const rect = e.currentTarget.getBoundingClientRect();
    const distance = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - REST);
    length.set(REST + REACH * clamp(1 - distance / 70, 0, 1));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Grabbing it stops any swing still in progress, so the ribbon follows the hand
    tipX.stop();
    drag.current = { x: e.clientX, y: e.clientY, moved: false, stretch: 0 };
  };

  const release = () => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    suppressClick.current = state.moved;
    // Judged on the target stretch, not the spring, which may still be catching up
    const pulledFar = state.moved && state.stretch >= PULL_TO_GO;
    // Let go: it springs back up and swings out from where it was released
    length.set(REST);
    animate(tipX, 0, TIP);
    if (pulledFar) router.push("/");
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      suppressClick.current = false;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] h-0 mix-blend-difference">
      <Link
        href="/"
        aria-label="Home"
        draggable={false}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={() => !drag.current && length.set(REST)}
        className="absolute left-3 top-0 block h-28 w-14 touch-none select-none rounded-b-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          aria-hidden
          width={CANVAS_W}
          height={CANVAS_H}
          viewBox={`${-CANVAS_W / 2} 0 ${CANVAS_W} ${CANVAS_H}`}
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 overflow-visible"
        >
          <motion.path d={path} fill="white" />
        </svg>
      </Link>
    </nav>
  );
}
