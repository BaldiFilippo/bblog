import type { Metadata } from "next";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Title hover lab",
  description: "Four candidates for the home title's hover state.",
  robots: { index: false },
};

const TITLE = "text-3xl md:text-5xl font-black tracking-tighter leading-[1.1] text-center font-[family-name:var(--font-safiro)]";

type Props = { title: string; meta: string; cover: string; on: boolean };

function Underline({ title, on }: Props) {
  return (
    <h2 className={TITLE}>
      <span
        className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-left-bottom pb-1"
        style={{ backgroundSize: `${on ? 100 : 0}% 3px` }}
      >
        {title}
      </span>
    </h2>
  );
}

function Meta({ title, meta, on }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className={TITLE}>{title}</h2>
      <span
        className="text-sm text-muted-foreground transition-all duration-500"
        style={{ opacity: on ? 1 : 0, filter: on ? "blur(0)" : "blur(6px)" }}
      >
        {meta} →
      </span>
    </div>
  );
}

function Card({ title, cover, on }: Props) {
  // Title unchanged; the card behind leans in
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        className="absolute h-40 w-40 overflow-hidden rounded-xl shadow-2xl transition-transform duration-500"
        style={{ transform: on ? "scale(1.08)" : "scale(1)" }}
      >
        <Image src={cover} alt="" fill sizes="160px" className="object-cover" />
      </div>
      <h2 className={`${TITLE} relative text-white mix-blend-difference`}>{title}</h2>
    </div>
  );
}

function Breathe({ title, on }: Props) {
  return (
    <h2 className={TITLE} style={{ letterSpacing: on ? "-0.01em" : undefined }}>
      {title}
    </h2>
  );
}

const VARIANTS = [
  { name: "1 · Underline that draws itself", C: Underline },
  { name: "2 · Reading time appears", C: Meta },
  { name: "3 · The card reacts", C: Card },
  { name: "4 · The title breathes", C: Breathe },
];

export default function TitleHoverLab() {
  const post = getAllPosts()[0];
  const cover = post.cover?.endsWith(".gif") ? post.cover.replace(/\.gif$/, "-poster.webp") : post.cover ?? "";
  const props = { title: post.title, meta: post.readingTime, cover };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-24 flex flex-col gap-10">
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter font-[family-name:var(--font-safiro)]">
        Title hover lab
      </h1>
      {VARIANTS.map(({ name, C }) => (
        <section key={name} className="flex flex-col gap-3">
          <h2 className="text-base md:text-lg font-medium tracking-tight">{name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[false, true].map((on) => (
              <div key={String(on)} className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl border border-border px-6">
                <C {...props} on={on} />
                <span className="absolute bottom-3 right-4 text-xs text-muted-foreground">{on ? "Hover" : "At rest"}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
