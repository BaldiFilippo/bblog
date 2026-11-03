"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const SAMPLE = { slug: "advancing-is-not-progressing", title: "Advancing Is Not Progressing" };
const replyHref = `/contact?re=${SAMPLE.slug}`;
const SAFIRO = "font-[family-name:var(--font-safiro)]";
const FOCUS = "outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-sm";

// 1 · The end of a letter: a reply line right under "Next article"
function WriteBack() {
  return (
    <div className="max-w-article">
      <div className="border-t border-foreground/10 pt-8">
        <span className="text-sm text-muted-foreground font-medium">Next article</span>
        <p className="mt-3 font-semibold text-foreground/40">The Design You Can&apos;t Take Off…</p>
      </div>
      <div className="mt-12">
        <p className="text-sm text-muted-foreground">Did this make you think of something?</p>
        <Link
          href={replyHref}
          className={`group mt-2 inline-flex items-baseline gap-2 text-3xl md:text-4xl font-black tracking-tighter ${SAFIRO} ${FOCUS}`}
        >
          Write back
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">→</span>
        </Link>
        <p className="mt-2 text-xs text-muted-foreground">Opens the form as a reply: “Re: {SAMPLE.title}”.</p>
      </div>
    </div>
  );
}

// 2 · The back of the bookmark: pull past a second, deeper stop and it turns over
const REST = 72;
const FLIP_AT = 120;
function BookmarkBack() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const length = useSpring(REST, { stiffness: 300, damping: 18 });
  const [flipped, setFlipped] = useState(false);
  const drag = useRef<{ y: number; stretch: number } | null>(null);
  const path = useTransform(length, (len) => `M -6 -40 L 6 -40 L 6 ${len} L 0 ${len - 6} L -6 ${len} Z`);
  const labelOpacity = useTransform(length, [REST + 30, FLIP_AT], [0, 1]);

  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, stretch: 0 };
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const pull = Math.max(0, e.clientY - drag.current.y);
    drag.current.stretch = pull / (1 + pull / 260);
    length.set(REST + drag.current.stretch);
    setFlipped(REST + drag.current.stretch >= FLIP_AT);
  };
  const onUp = () => {
    const went = drag.current && REST + drag.current.stretch >= FLIP_AT;
    drag.current = null;
    if (went) {
      animate(length, 300, { duration: 0.35 }).then(() => router.push(replyHref));
    } else {
      length.set(REST);
      setFlipped(false);
    }
  };

  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        aria-label="Write to me (pull the bookmark down)"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => e.key === "Enter" && router.push(replyHref)}
        className={`absolute left-6 top-0 h-56 w-14 touch-none select-none ${FOCUS}`}
      >
        <svg aria-hidden width="60" height="320" viewBox="-30 -40 60 320" className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 overflow-visible">
          <motion.path d={path} className={flipped ? "fill-muted-foreground" : "fill-foreground"} />
        </svg>
        <motion.span
          aria-hidden
          style={{ opacity: labelOpacity }}
          className={`pointer-events-none absolute left-12 top-24 whitespace-nowrap text-sm font-semibold ${SAFIRO}`}
        >
          {flipped ? "Let go to write ✉" : "Keep pulling…"}
        </motion.span>
      </button>
      <p className="absolute bottom-4 left-6 right-6 text-xs text-muted-foreground">
        Today: pull a little and let go to go home. Here: pull further, past the first stop, and it turns over.
      </p>
    </div>
  );
}

// 3 · The last card of the deck: after the final post, a card that's yours
function LastCard() {
  const reduced = useReducedMotion();
  const tilt = useMotionValue(0);
  const rotate = useSpring(tilt, { stiffness: 150, damping: 15 });
  return (
    <div className="flex h-72 items-center justify-center rounded-xl border border-border bg-muted/40">
      <Link
        href={replyHref}
        onPointerEnter={() => !reduced && tilt.set(-3)}
        onPointerLeave={() => tilt.set(0)}
        className={`group ${FOCUS} rounded-xl`}
      >
        <motion.div
          style={{ rotate }}
          className="relative flex h-48 w-48 flex-col justify-between rounded-xl border border-foreground/10 bg-background p-4 shadow-2xl"
        >
          <span className="self-end rounded-sm border border-dashed border-foreground/30 px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Postage paid
          </span>
          <div>
            <p className={`text-2xl font-black tracking-tighter ${SAFIRO}`}>Your turn.</p>
            <p className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              Write to me ↗
            </p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

// 4 · The signature: every essay ends signed, and the signature answers back
function Signature() {
  return (
    <div className="max-w-article">
      <p className="text-foreground/80 leading-relaxed">
        …and maybe that&apos;s the whole point: not to move faster, but to notice where we&apos;re going.
      </p>
      <Link href={replyHref} className={`group mt-8 inline-flex flex-col ${FOCUS}`}>
        <span className={`text-4xl tracking-tight ${SAFIRO} -rotate-2 origin-left`}>— Filippo</span>
        <span className="mt-1 text-xs text-muted-foreground opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-focus-visible:opacity-100">
          write back ↗
        </span>
      </Link>
    </div>
  );
}

const VARIANTS = [
  { name: "1 · Write back", note: "A reply line after the last paragraph, under “Next article”. Recommended.", C: WriteBack },
  { name: "2 · The back of the bookmark", note: "Pull the ribbon past a second, deeper stop: it turns over and sends you to write.", C: BookmarkBack },
  { name: "3 · The last card", note: "After the final post in the home stack, one more card: yours.", C: LastCard },
  { name: "4 · The signature", note: "Every essay ends signed. The signature is the link.", C: Signature },
];

export function ContactLab() {
  return (
    <main className="mx-auto max-w-5xl px-gutter pt-28 pb-24 flex flex-col gap-16">
      <div>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tighter ${SAFIRO}`}>Contact link lab</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Every variant really goes to the form, pre-filled as a reply to “{SAMPLE.title}”.
        </p>
      </div>
      {VARIANTS.map(({ name, note, C }) => (
        <section key={name} className="flex flex-col gap-5">
          <div>
            <h2 className="text-base md:text-lg font-medium tracking-tight">{name}</h2>
            <p className="text-sm text-muted-foreground">{note}</p>
          </div>
          <C />
        </section>
      ))}
    </main>
  );
}
