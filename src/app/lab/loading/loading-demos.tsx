"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type DemoProps = { onDone: () => void; reduced: boolean };

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/* ------------------------------------------------------------------ */
/* 1. A draft that rewrites itself                                     */
/* ------------------------------------------------------------------ */

type Op =
  | { type: "type"; text: string }
  | { type: "erase"; count: number }
  | { type: "move"; to: number }
  | { type: "wait"; ms: number };

const SCRIPT: Op[] = [
  { type: "wait", ms: 350 },
  { type: "type", text: "A blog, probably" },
  { type: "wait", ms: 600 },
  { type: "erase", count: ", probably".length },
  { type: "wait", ms: 350 },
  { type: "move", to: 2 },
  { type: "wait", ms: 250 },
  { type: "type", text: "personal " },
  { type: "wait", ms: 1100 },
];
const FINAL_TEXT = "A personal blog";

// Small deterministic jitter so the typing feels human, not metronomic.
const keyDelay = (i: number) => 55 + ((i * 37) % 7) * 9;

function DraftDemo({ onDone, reduced }: DemoProps) {
  const [text, setText] = useState(reduced ? FINAL_TEXT : "");
  const [caret, setCaret] = useState(reduced ? FINAL_TEXT.length : 0);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 0;
    let t = "";
    let c = 0;
    let key = 0;
    const push = (fn: () => void, delay: number) => {
      at += delay;
      timers.push(setTimeout(fn, at));
    };

    for (const op of SCRIPT) {
      if (op.type === "wait") push(() => {}, op.ms);
      if (op.type === "move") {
        c = op.to;
        const next = c;
        push(() => setCaret(next), 120);
      }
      if (op.type === "type") {
        for (const ch of op.text) {
          t = t.slice(0, c) + ch + t.slice(c);
          c += 1;
          const [nt, nc] = [t, c];
          push(() => {
            setText(nt);
            setCaret(nc);
          }, keyDelay(key++));
        }
      }
      if (op.type === "erase") {
        for (let i = 0; i < op.count; i++) {
          t = t.slice(0, c - 1) + t.slice(c);
          c -= 1;
          const [nt, nc] = [t, c];
          push(() => {
            setText(nt);
            setCaret(nc);
          }, 32);
        }
      }
    }
    push(onDone, 0);
    return () => timers.forEach(clearTimeout);
  }, [onDone, reduced]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center px-6">
      <p className="text-white text-lg md:text-2xl tracking-tight font-[family-name:var(--font-safiro)] whitespace-pre">
        {text.slice(0, caret)}
        <span
          aria-hidden
          className="inline-block w-[2px] h-[1.1em] -mb-[0.15em] bg-white animate-[caret_1s_steps(1)_infinite]"
        />
        {text.slice(caret)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. The latest cover comes into focus and becomes the home card      */
/* ------------------------------------------------------------------ */

function FocusDemo({ onDone, reduced, cover }: DemoProps & { cover: string }) {
  const [phase, setPhase] = useState<"blur" | "sharp" | "card">(reduced ? "card" : "blur");

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setPhase("sharp"), 300);
    const t2 = setTimeout(() => setPhase("card"), 2100);
    const t3 = setTimeout(onDone, 3300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone, reduced]);

  const isCard = phase === "card";

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      animate={{ backgroundColor: isCard ? "#ffffff" : "#000000" }}
      transition={{ duration: 0.9, ease: EASE_IN_OUT }}
    >
      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{
          width: isCard ? "34%" : "100%",
          height: isCard ? "46%" : "100%",
          borderRadius: isCard ? 16 : 0,
          filter: phase === "blur" ? "blur(48px) saturate(1.6)" : "blur(0px) saturate(1)",
          scale: phase === "blur" ? 1.25 : 1,
        }}
        transition={{
          duration: phase === "sharp" ? 1.6 : 1.1,
          ease: phase === "sharp" ? EASE_OUT : EASE_IN_OUT,
        }}
      >
        <Image src={cover} alt="" fill unoptimized sizes="100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. A paper calendar flipping through the essays' dates to today     */
/* ------------------------------------------------------------------ */

function CalendarDemo({ onDone, reduced, dates }: DemoProps & { dates: string[] }) {
  const pages = [...dates, new Date().toISOString().slice(0, 10)].filter(
    (d, i, all) => all.indexOf(d) === i
  );
  const pageCount = pages.length;
  const [index, setIndex] = useState(reduced ? pageCount - 1 : 0);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
    const timers = Array.from({ length: pageCount - 1 }, (_, i) =>
      setTimeout(() => setIndex(i + 1), 700 + i * 520)
    );
    timers.push(setTimeout(onDone, 700 + (pageCount - 1) * 520 + 1100));
    return () => timers.forEach(clearTimeout);
  }, [onDone, reduced, pageCount]);

  const date = new Date(pages[index]);
  const isToday = index === pages.length - 1;

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center [perspective:900px]">
      <div className="relative w-36 h-44 md:w-44 md:h-52">
        {/* The page underneath, so a tear always reveals paper. */}
        <div className="absolute inset-0 rounded-md bg-neutral-200" />
        <AnimatePresence initial={false}>
          <motion.div
            key={pages[index]}
            className="absolute inset-0 rounded-md bg-white text-black flex flex-col items-center justify-between py-4 origin-top shadow-[0_1px_0_rgba(0,0,0,0.08)]"
            initial={{ opacity: 1 }}
            exit={{ rotateX: -100, y: -10, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.55, 0, 0.75, 0] }}
          >
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              {date.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" })}
            </span>
            <span className="text-6xl md:text-7xl font-[family-name:var(--font-safiro)] tracking-tighter leading-none">
              {date.getUTCDate()}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              {isToday
                ? "Today"
                : date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage: plays one intro, then reveals a stand-in for the home page   */
/* ------------------------------------------------------------------ */

function Stage({
  label,
  note,
  title,
  exit,
  render,
}: {
  label: string;
  note: string;
  title: string;
  exit: "slide" | "fade";
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
      <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-background">
        {/* Stand-in for the home page that the intro hands over to. */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="text-center text-2xl md:text-4xl font-black tracking-tighter font-[family-name:var(--font-safiro)] max-w-[80%] leading-[1.1]">
            {title}
          </p>
        </div>
        <AnimatePresence>
          {playing && (
            <motion.div
              key={run}
              className="absolute inset-0"
              exit={exit === "slide" ? { y: "-100%" } : { opacity: 0 }}
              transition={{ duration: exit === "slide" ? 0.9 : 0.6, ease: EASE_IN_OUT }}
            >
              {render({ onDone, reduced })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function LoadingDemos({
  dates,
  cover,
  title,
}: {
  dates: string[];
  cover: string;
  title: string;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-24 flex flex-col gap-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter font-[family-name:var(--font-safiro)]">
          Loading lab
        </h1>
        <p className="text-muted-foreground">
          Three intro candidates. Each frame stands in for the full screen; press Replay to watch
          again.
        </p>
      </header>

      <Stage
        label="1 · A draft that rewrites itself"
        note="The line is typed, second-guessed and edited before it settles."
        title={title}
        exit="slide"
        render={(p) => <DraftDemo {...p} />}
      />
      <Stage
        label="2 · Coming into focus"
        note="The latest cover sharpens out of a blur and shrinks into its home card."
        title={title}
        exit="fade"
        render={(p) => <FocusDemo {...p} cover={cover} />}
      />
      <Stage
        label="3 · A paper calendar"
        note="Pages tear away through each essay's date and stop on today."
        title={title}
        exit="slide"
        render={(p) => <CalendarDemo {...p} dates={dates} />}
      />
    </main>
  );
}
