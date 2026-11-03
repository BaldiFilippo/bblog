import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home link lab",
  description: "Four candidates for the top-left back-to-home element.",
  robots: { index: false },
};

type State = "home" | "reading" | "hover";
const STATES: { state: State; label: string }[] = [
  { state: "home", label: "On the home" },
  { state: "reading", label: "Reading an article (40%)" },
  { state: "hover", label: "Hover / focus" },
];
const PROGRESS = 0.4;

function Dash({ state }: { state: State }) {
  if (state === "hover") {
    return (
      <svg width="30" height="12" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 6h28M1 6l5-5M1 6l5 5" />
      </svg>
    );
  }
  return (
    <span className="relative block h-[2px] w-5 overflow-hidden rounded-full bg-foreground/20">
      <span
        className="absolute inset-0 origin-left bg-foreground"
        style={{ transform: `scaleX(${state === "reading" ? PROGRESS : 1})` }}
      />
    </span>
  );
}

function Caret({ state }: { state: State }) {
  return (
    <span className="flex items-center gap-0.5 font-mono text-sm">
      {state === "hover" && <span>home</span>}
      <span className="inline-block h-[18px] w-[2px] bg-foreground" />
    </span>
  );
}

function DateMark({ state }: { state: State }) {
  return (
    <span className="font-mono text-sm tabular-nums">{state === "hover" ? "← home" : "03.11"}</span>
  );
}

function Deck({ state }: { state: State }) {
  // Reading: the top card is pulled out of the deck; hover puts it back
  const out = state === "reading";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="12" width="18" height="9" rx="2" />
      <path d="M4.5 9h13" />
      {out ? (
        <rect x="6" y="1" width="12" height="7" rx="1.5" transform="rotate(-8 12 4.5)" />
      ) : (
        <path d="M7 6h8" />
      )}
    </svg>
  );
}

const VARIANTS = [
  { name: "1 · The dash", note: "Same mark as the side index; fills as you read, turns into ← on hover.", C: Dash },
  { name: "2 · The caret", note: "A blinking writing cursor; types “home” on hover.", C: Caret },
  { name: "3 · Today's date", note: "A diary header; becomes “← home” on hover.", C: DateMark },
  { name: "4 · The pulled card", note: "The archive deck; in an article its top card is out, home puts it back.", C: Deck },
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
              <div key={state} className="relative h-28 rounded-xl border border-border">
                <div className="absolute left-6 top-6 flex h-6 items-center">
                  <C state={state} />
                </div>
                <span className="absolute bottom-3 left-6 text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
