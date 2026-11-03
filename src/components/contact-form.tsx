"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const SAFIRO = "font-[family-name:var(--font-safiro)]";
const FIELD =
  "w-full border-b border-foreground/15 bg-transparent pb-2 text-foreground placeholder:text-foreground/25 outline-none transition-colors duration-200 focus:border-foreground";
const LABEL = "font-mono text-xs text-muted-foreground";

type Topic = { slug: string; title: string };

interface ContactFormProps {
  // Every essay the letter can be about, newest first
  posts: Topic[];
  // Preselected when the reader arrives from an essay's "Write back"
  initialSlug?: string;
}

// The contact page reads like the end of a letter: the message first, then who
// it's from, then a send that matches "Write back". It fits one screen, centred:
// min-h (not h + overflow-hidden) so a very short screen can still scroll.
export function ContactForm({ posts, initialSlug }: ContactFormProps) {
  const reduced = useReducedMotion();
  // "" = a general letter, otherwise the slug of the essay it answers
  const [topic, setTopic] = useState(initialSlug ?? "");
  const replyTo = posts.find((p) => p.slug === topic);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay } };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: replyTo ? `Re: ${replyTo.title}\n\n${data.get("message")}` : data.get("message"),
          // Honeypot: hidden from people, filled by bots (see /api/contact)
          company: data.get("company"),
        }),
      });
      if (res.status === 429) throw new Error("rate");
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message === "rate"
          ? "Too many messages in a row. Please try again in a few minutes."
          : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-gutter pt-20 pb-8 md:py-20">
      <div className="w-full max-w-lg" aria-live="polite">
        <motion.div key={sent ? "sent" : "write"} {...rise(0.1)} className="flex flex-col gap-3 md:gap-4">
          {sent ? (
            <span className="font-mono text-sm text-muted-foreground">
              {replyTo ? `Re: ${replyTo.title}` : "Sent"}
            </span>
          ) : (
            // What the letter is about: in general, or a reply to one essay
            <div className="flex min-w-0 items-baseline gap-2 font-mono text-sm text-muted-foreground">
              <label htmlFor="topic" className="shrink-0">
                Re:
              </label>
              <div className="relative min-w-0">
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full max-w-full cursor-pointer appearance-none truncate rounded-sm border-b border-dashed border-foreground/30 bg-transparent py-0.5 pr-5 text-foreground outline-none transition-colors hover:border-foreground focus-visible:border-solid focus-visible:border-foreground"
                >
                  <option value="">General</option>
                  {posts.map((post) => (
                    <option key={post.slug} value={post.slug}>
                      {post.title}
                    </option>
                  ))}
                </select>
                <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className="pointer-events-none absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
          <h1 className={`text-[2.75rem] md:text-6xl font-black tracking-tighter leading-[1.05] ${SAFIRO}`}>
            {sent ? "Thank you." : replyTo ? "Write back." : "Let's talk."}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            {sent
              ? "Your letter is on its way. I read every one, and I'll answer as soon as I can."
              : replyTo
                ? "Thoughts, disagreements, ideas. I read everything, and I answer."
                : "About an essay, an idea, or anything else."}
          </p>
        </motion.div>

        {sent ? (
          <motion.p {...rise(0.25)} className="mt-8 text-sm text-muted-foreground">
            {replyTo ? (
              <>
                Back to{" "}
                <Link href={`/blog/${replyTo.slug}`} className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
                  {replyTo.title}
                </Link>
                , or{" "}
              </>
            ) : null}
            <Link href="/blog" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
              {replyTo ? "browse every essay" : "Browse every essay"}
            </Link>
            .
          </motion.p>
        ) : (
          <motion.form {...rise(0.22)} onSubmit={handleSubmit} className="relative mt-8 md:mt-10 flex flex-col gap-6 md:gap-8">
            {/* The letter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className={LABEL}>
                Dear Filippo,
              </label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={5000}
                rows={3}
                placeholder={replyTo ? "What did it make you think of?" : "Write here…"}
                className={`${FIELD} resize-none [field-sizing:content] min-h-20 md:min-h-24 max-h-[30svh] text-[clamp(1.0625rem,0.95rem+0.5vw,1.1875rem)] leading-[1.6]`}
              />
            </div>

            {/* The signature */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className={LABEL}>
                  From
                </label>
                <input id="name" name="name" type="text" autoComplete="name" maxLength={100} required placeholder="Your name" className={`${FIELD} text-base`} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={LABEL}>
                  Reply to
                </label>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" className={`${FIELD} text-base`} />
              </div>
            </div>

            {/* Honeypot: off-screen and skipped by the tab order, so only bots fill it */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col gap-2">
              <p role="status" className="text-sm text-red-600 empty:hidden">
                {error}
              </p>
              <button
                type="submit"
                disabled={sending}
                className={`group self-start inline-flex items-baseline gap-2 text-2xl md:text-3xl font-black tracking-tighter ${SAFIRO} transition-opacity disabled:opacity-40 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground`}
              >
                {sending ? "Sending…" : "Send"}
                {!sending && (
                  <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                    →
                  </span>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </main>
  );
}
