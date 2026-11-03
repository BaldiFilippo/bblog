import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favicon lab",
  description: "Favicon candidates shown at real tab sizes.",
  robots: { index: false },
};

// Every candidate is a 32×32 SVG, built from the site's own marks
type Icon = { name: string; note: string; svg: (fg: string, bg: string) => React.ReactNode };

const ICONS: Icon[] = [
  {
    name: "1 · Bookmark",
    note: "The navigation ribbon, alone.",
    svg: (fg) => <path d="M10 0h12v28l-6-5-6 5z" fill={fg} />,
  },
  {
    name: "2 · Bookmark on a tile",
    note: "The ribbon cut out of a rounded square, so it reads on any tab colour.",
    svg: (fg, bg) => (
      <>
        <rect width="32" height="32" rx="7" fill={fg} />
        <path d="M11 0h10v22l-5-4-5 4z" fill={bg} />
      </>
    ),
  },
  {
    name: "3 · The index",
    note: "The home's side index: one long dash, three short ones.",
    svg: (fg) => (
      <g fill={fg}>
        <rect x="6" y="7" width="20" height="3" rx="1.5" />
        <rect x="14" y="13" width="12" height="3" rx="1.5" opacity="0.35" />
        <rect x="14" y="19" width="12" height="3" rx="1.5" opacity="0.35" />
        <rect x="14" y="25" width="12" height="3" rx="1.5" opacity="0.35" />
      </g>
    ),
  },
  {
    name: "4 · The stack",
    note: "The archive icon: a deck of cards seen from the front.",
    svg: (fg) => (
      <g fill="none" stroke={fg} strokeWidth="2.5" strokeLinecap="round">
        <rect x="3" y="13" width="26" height="16" rx="3" />
        <path d="M7 8.5h18M11 4h10" />
      </g>
    ),
  },
  {
    name: "5 · The dot",
    note: "A single full stop. As quiet as it gets.",
    svg: (fg) => <circle cx="16" cy="16" r="7" fill={fg} />,
  },
  {
    name: "6 · Ribbon in a page",
    note: "A page outline with the bookmark hanging from its top edge.",
    svg: (fg) => (
      <>
        <rect x="5" y="3" width="22" height="26" rx="3" fill="none" stroke={fg} strokeWidth="2.5" />
        <path d="M18 3h5v13l-2.5-2-2.5 2z" fill={fg} />
      </>
    ),
  },
];

function Glyph({ icon, size, fg, bg }: { icon: Icon; size: number; fg: string; bg: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      {icon.svg(fg, bg)}
    </svg>
  );
}

function Tab({ icon, dark }: { icon: Icon; dark: boolean }) {
  const fg = dark ? "#fff" : "#000";
  const bg = dark ? "#000" : "#fff";
  return (
    <div className={`flex items-center gap-2 rounded-t-lg px-3 py-2 w-48 ${dark ? "bg-neutral-800 text-white" : "bg-neutral-100 text-black"}`}>
      <Glyph icon={icon} size={16} fg={fg} bg={bg} />
      <span className="truncate text-xs">Advancing Is Not Progressing | BBLOG</span>
    </div>
  );
}

export default function FaviconLab() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-24 flex flex-col gap-8">
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter font-[family-name:var(--font-safiro)]">
        Favicon lab
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ICONS.map((icon) => (
          <section key={icon.name} className="flex flex-col gap-4 rounded-xl border border-border p-5">
            <div>
              <h2 className="text-base font-medium tracking-tight">{icon.name}</h2>
              <p className="text-sm text-muted-foreground">{icon.note}</p>
            </div>
            <div className="flex items-end gap-5">
              <Glyph icon={icon} size={64} fg="#000" bg="#fff" />
              <Glyph icon={icon} size={32} fg="#000" bg="#fff" />
              <Glyph icon={icon} size={16} fg="#000" bg="#fff" />
              <span className="ml-2 rounded-md bg-black p-2">
                <Glyph icon={icon} size={32} fg="#fff" bg="#000" />
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tab icon={icon} dark={false} />
              <Tab icon={icon} dark />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
