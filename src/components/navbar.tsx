"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// Ribbon length (px) at rest, and how far it reaches toward a nearby cursor
const REST = 48;
const REACH = 12;
// Pull the ribbon this much longer and let go to go home
const PULL_TO_GO = 70;
// Below this much pointer travel a press is a plain click
const CLICK_SLOP = 4;

// Pendulum feel: low damping so a brush keeps swinging for a moment
const SWING = { type: "spring", stiffness: 140, damping: 5, mass: 0.6 } as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// The back-to-home element: a bookmark ribbon hanging from the top edge of the
// screen, with a bit of physics. Brushing past it makes it swing with the
// direction and speed of the cursor, and it reaches toward a cursor that's
// close. It can be grabbed and pulled down: let go past a threshold (or just
// click it) to go home.
export function Navbar() {
  const router = useRouter();
  const reduced = useReducedMotion();

  const rotate = useMotionValue(0);
  const length = useSpring(REST, { stiffness: 380, damping: 24 });
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
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
      length.jump(REST + pull / (1 + pull / 260));
      rotate.jump(clamp(-dx * 0.35, -30, 30));
      return;
    }

    // Brush: kick the pendulum with the cursor's horizontal speed
    if (e.movementX !== 0) {
      animate(rotate, 0, { ...SWING, velocity: clamp(-e.movementX * 18, -260, 260) });
    }
    // Reach toward the cursor, more the closer it gets to the ribbon's tip
    const rect = e.currentTarget.getBoundingClientRect();
    const distance = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - REST);
    length.set(REST + REACH * clamp(1 - distance / 70, 0, 1));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };

  const release = () => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    suppressClick.current = state.moved;
    const pulledFar = state.moved && length.get() - REST >= PULL_TO_GO;
    // Let go: spring back, swinging from wherever it was released
    length.set(REST);
    animate(rotate, 0, { ...SWING, velocity: -rotate.get() * 4 });
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
        className="absolute left-3 top-0 flex h-24 w-14 touch-none select-none justify-center outline-none cursor-grab active:cursor-grabbing"
      >
        <motion.span
          aria-hidden
          className="block w-3 origin-top bg-white"
          style={{
            height: length,
            rotate,
            // Swallowtail notch at the bottom end
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)",
          }}
        />
      </Link>
    </nav>
  );
}
