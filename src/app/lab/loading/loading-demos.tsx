"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type DemoProps = { onDone: () => void; reduced: boolean };
type HomeProps = { title: string; cover: string; dashes: number };

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const RIBBON_CLIP = "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 5px), 0 100%)";

// Runs `onDone` after `ms`, or almost at once with reduced motion
function useDone(onDone: () => void, reduced: boolean, ms: number) {
  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 200 : ms);
    return () => clearTimeout(t);
  }, [onDone, reduced, ms]);
}

/* ------------------------------------------------------------------ */
/* Stand-in for the home: bookmark, title, side index, card           */
/* ------------------------------------------------------------------ */

function Ribbon() {
  return <span className="block h-12 w-[9px] bg-foreground" style={{ clipPath: RIBBON_CLIP }} />;
}

function Dashes({ count }: { count: number }) {
  return (
    <span className="flex flex-col items-end gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`block h-[2px] rounded-full ${i === 0 ? "w-7 bg-foreground" : "w-4 bg-foreground/20"}`}
        />
      ))}
    </span>
  );
}

function Home({ title, cover, dashes, intro }: HomeProps & { intro?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <span className="absolute left-5 top-0">
        <Ribbon />
      </span>
      <span className="absolute right-5 top-1/2 -translate-y-1/2">
        <Dashes count={dashes} />
      </span>
      <motion.p
        className="absolute inset-x-0 top-[30%] mx-auto max-w-[70%] text-center text-2xl md:text-4xl font-black tracking-tighter leading-[1.1] font-[family-name:var(--font-safiro)]"
        initial={intro ? { opacity: 0, filter: "blur(12px)" } : false}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        {title}
      </motion.p>
      <motion.div
        className="absolute bottom-[-18%] left-1/2 aspect-square w-[26%] -translate-x-1/2 overflow-hidden rounded-xl shadow-2xl"
        initial={intro ? { y: 60, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: intro ? 0.1 : 0 }}
      >
        <Image src={cover} alt="" fill sizes="300px" className="object-cover" />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. The bookmark drops in                                           */
/* ------------------------------------------------------------------ */

function BookmarkDemo({ onDone, reduced }: DemoProps) {
  useDone(onDone, reduced, 750);
  return (
    <div className="absolute inset-0 bg-background">
      <motion.span
        className="absolute left-5 top-0"
        initial={reduced ? false : { y: -70 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 11, delay: 0.1 }}
      >
        <Ribbon />
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. The dashes count in, then slide to the edge as the index        */
/* ------------------------------------------------------------------ */

function DashesDemo({ onDone, reduced, count }: DemoProps & { count: number }) {
  const [docked, setDocked] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setDocked(true), 120 + count * 90 + 150);
    return () => clearTimeout(t);
  }, [reduced, count]);
  useDone(onDone, reduced, 120 + count * 90 + 150 + 550);

  return (
    <div className="absolute inset-0 bg-background">
      <motion.span
        layout
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={`absolute top-1/2 -translate-y-1/2 ${docked ? "right-5" : "right-1/2 translate-x-1/2"}`}
      >
        <span className="flex flex-col items-end gap-2.5">
          {Array.from({ length: count }, (_, i) => (
            <motion.span
              key={i}
              className={`block h-[2px] origin-right rounded-full ${i === 0 ? "w-7 bg-foreground" : "w-4 bg-foreground/20"}`}
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.25, ease: EASE_OUT, delay: 0.12 + i * 0.09 }}
            />
          ))}
        </span>
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. A line fills like the reading bar, then the page opens along it */
/* ------------------------------------------------------------------ */

function LineDemo({ onDone, reduced }: DemoProps) {
  const [open, setOpen] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setOpen(true), 550);
    return () => clearTimeout(t);
  }, [reduced]);
  useDone(onDone, reduced, 1000);

  const halves = { duration: 0.45, ease: [0.76, 0, 0.24, 1] as const };
  return (
    <div className="absolute inset-0">
      <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-black" animate={{ y: open ? "-100%" : 0 }} transition={halves} />
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-black" animate={{ y: open ? "100%" : 0 }} transition={halves} />
      <motion.span
        className="absolute left-1/2 top-1/2 h-px w-2/5 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white/25"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <motion.span
          className="absolute inset-0 origin-left bg-white"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
        />
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. No curtain: the home animates in on its own                     */
/* ------------------------------------------------------------------ */

function NoCurtainDemo({ onDone, reduced, home }: DemoProps & { home: HomeProps }) {
  useDone(onDone, reduced, 800);
  return <Home {...home} intro={!reduced} />;
}

/* ------------------------------------------------------------------ */
/* Stage: plays one intro over the stand-in home, Replay to rewatch   */
/* ------------------------------------------------------------------ */

function Stage({
  label,
  note,
  home,
  exit,
  render,
}: {
  label: string;
  note: string;
  home: HomeProps;
  exit: "fade" | "none";
  render: (props: DemoProps) => React.ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Stable so the demo's effect doesn't restart on re-render; `run` remounts it.
  const onDone = useCallback(() => setPlaying(false), []);

  const replay = () => {
    setPlaying(true);
    setRun((r) => r + 1);
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-medium tracking-tight">{label}</h2>
          <p className="text-sm text-muted-foreground">{note}</p>
        </div>
        <button
          onClick={replay}
          className="shrink-0 rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors"
        >
          Replay
        </button>
      </div>
      <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
        <Home {...home} />
        <AnimatePresence>
          {playing && (
            <motion.div
              key={run}
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              transition={{ duration: exit === "fade" ? 0.35 : 0 }}
            >
              {render({ onDone, reduced })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function LoadingDemos({ title, cover, dashes }: HomeProps) {
  const home = { title, cover, dashes };
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-24 flex flex-col gap-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter font-[family-name:var(--font-safiro)]">
          Loading lab
        </h1>
        <p className="text-muted-foreground">
          Four quick intros, all under a second. Each frame stands in for the full screen; press
          Replay to watch again.
        </p>
      </header>

      <Stage
        label="1 · The bookmark drops in"
        note="The ribbon falls from the top edge and settles with a small bounce, then the page appears."
        home={home}
        exit="fade"
        render={(p) => <BookmarkDemo {...p} />}
      />
      <Stage
        label="2 · The dashes"
        note="One dash per post counts in at the centre, then they slide to the edge and become the index."
        home={home}
        exit="fade"
        render={(p) => <DashesDemo {...p} count={dashes} />}
      />
      <Stage
        label="3 · The filling line"
        note="A thin line fills like the reading bar, and the page opens along it."
        home={home}
        exit="none"
        render={(p) => <LineDemo {...p} />}
      />
      <Stage
        label="4 · No curtain"
        note="No loading screen: the title comes out of the blur and the card rises into place."
        home={home}
        exit="none"
        render={(p) => <NoCurtainDemo {...p} home={home} />}
      />
    </main>
  );
}
