"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function ContactPage() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-dvh bg-background flex items-center justify-center overflow-hidden px-6">
      <div className="w-full max-w-lg">

        {/* Header */}
        <motion.div
          key={sent ? "sent" : "default"}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground font-[family-name:var(--font-safiro)] leading-[0.95]">
            {sent ? <>Thank<br />you.</> : <>Get in<br />touch</>}
          </h1>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            {sent
              ? <>Your message has been received.<br />I will get back to you shortly.</>
              : <>Fashion consultancy, creative direction,<br />collaborations.</>
            }
          </p>
        </motion.div>

        {/* Form */}
        {!sent ? (
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-200 ${
                  focused === "name" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className="border-b border-foreground/15 bg-transparent pb-2 text-foreground placeholder:text-foreground/20 text-base outline-none transition-colors duration-200 focus:border-foreground/60"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-200 ${
                  focused === "email" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="border-b border-foreground/15 bg-transparent pb-2 text-foreground placeholder:text-foreground/20 text-base outline-none transition-colors duration-200 focus:border-foreground/60"
                placeholder="your@email.com"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-200 ${
                  focused === "message" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={3}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                className="border-b border-foreground/15 bg-transparent pb-2 text-foreground placeholder:text-foreground/20 text-base outline-none resize-none transition-colors duration-200 focus:border-foreground/60"
                placeholder="Your message..."
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-3 pt-1">
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/30 tracking-wide">
                  hello@justinoctaviano.com
                </span>
                <button
                  type="submit"
                  disabled={sending}
                  className="group flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors duration-200 disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Send"}
                  {!sending && <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                </button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
          >
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors duration-200"
            >
              Back to home
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
