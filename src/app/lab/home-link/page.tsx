import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home link lab",
  description: "Candidates for the top-left back-to-home element.",
  robots: { index: false },
};

type State = "home" | "reading" | "hover";
const STATES: { state: State; label: string }[] = [
  { state: "home", label: "On the home" },
  { state: "reading", label: "Reading an article (40%)" },
  { state: "hover", label: "Hover / focus" },
];
const PROGRESS = 0.4;

// Each frame's top-left corner stands in for the screen's top-left corner.

function Bookmark({ state }: { state: State }) {
  // Hangs from the top edge; lowers while reading, pulled up on hover
  const length = state === "hover" ? 18 : state === "reading" ? 30 + PROGRESS * 40 : 30;
  return (
    <svg className="absolute left-8 top-0" width="12" height="80" viewBox="0 0 12 80" fill="currentColor">
      <path d={`M0 0h12v${length}l-6 -6l-6 6z`} />
    </svg>
  );
}

function DogEar({ state }: { state: State }) {
  const size = state === "hover" ? 44 : 28;
  return (
    <svg className="absolute left-0 top-0" width="48" height="48" viewBox="0 0 48 48">
      {/* The fold: the back of the page, then its shadow edge */}
      <path d={`M0 0h${size}L0 ${size}z`} className="fill-background" />
      <path d={`M${size} 0L0 ${size}V0z`} className="fill-neutral-200" />
      <path d={`M${size} 0L0 ${size}`} className="stroke-neutral-400" strokeWidth="1" fill="none" />
    </svg>
  );
}

function Pilcrow({ state }: { state: State }) {
  return (
    <span
      className="absolute left-6 top-4 text-2xl leading-none font-[family-name:var(--font-safiro)]"
    >
      {state === "hover" ? "←" : "¶"}
    </span>
  );
}

function FullStop({ state }: { state: State }) {
  return (
    <span className="absolute left-6 top-3 text-3xl leading-none font-black tracking-tighter font-[family-name:var(--font-safiro)]">
      {state === "hover" ? "home." : "."}
    </span>
  );
}

const VARIANTS = [
  { name: "1 · The bookmark", note: "A ribbon hanging from the top edge; lowers as you read, pulls up on hover.", C: Bookmark },
  { name: "2 · The dog-ear", note: "The screen's corner is folded; folds further on hover, turning back to the home.", C: DogEar },
  { name: "3 · The pilcrow", note: "The proofreader's paragraph mark; flips into an arrow on hover.", C: Pilcrow },
  { name: "4 · The full stop", note: "A single period; becomes “home.” on hover.", C: FullStop },
];

export default function HomeLinkLab() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-24 flex flex-col gap-10">
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter font-[family-name:var(--font-safiro)]">
        Home link lab
      </h1>
      {VARIANTS.map(({ name, note, C }) => (
        <section key={name} className="flex flex-col gap-3">
          <div>
            <h2 className="text-base md:text-lg font-medium tracking-tight">{name}</h2>
            <p className="text-sm text-muted-foreground">{note}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STATES.map(({ state, label }) => (
              <div key={state} className="relative h-32 overflow-hidden rounded-xl border border-border">
                <C state={state} />
                <span className="absolute bottom-3 right-4 text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
