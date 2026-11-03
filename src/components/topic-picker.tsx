"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Option = { value: string; label: string };

interface TopicPickerProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// "Re: …" picker for the contact letter. A listbox drawn like the home's side
// index: one dash per option, the chosen one longer and filled. Keyboard: Enter,
// Space or ↓ opens; ↑/↓, Home/End move; Enter picks; Esc or Tab closes.
export function TopicPicker({ options, value, onChange }: TopicPickerProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  const show = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    close();
  };

  // Focus the list once it's open; close on a click anywhere else
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option in view in a long list
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      " ": () => pick(active),
      Escape: () => close(),
      Tab: () => close(false),
    };
    const action = keys[e.key];
    if (!action) return;
    if (e.key !== "Tab") e.preventDefault();
    action();
  };

  return (
    <div ref={root} className="relative flex min-w-0 items-baseline gap-2 font-mono text-sm text-muted-foreground">
      <span id={`${id}-label`} className="shrink-0">
        Re:
      </span>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Re: ${selected.label}. Choose what your message is about`}
        onClick={() => (open ? close() : show())}
        onKeyDown={onTriggerKey}
        className="group inline-flex min-w-0 items-baseline gap-1.5 rounded-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <span
          id={`${id}-value`}
          className="truncate underline decoration-dashed decoration-foreground/30 underline-offset-4 transition-colors group-hover:decoration-foreground"
        >
          {selected.label}
        </span>
        <motion.svg
          aria-hidden
          width="10"
          height="10"
          viewBox="0 0 10 10"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.3, ease }}
          className="shrink-0 self-center text-muted-foreground"
        >
          <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            aria-activedescendant={`${id}-${active}`}
            onKeyDown={onListKey}
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
            className="absolute left-0 right-0 top-full z-20 mt-3 max-h-[50svh] overflow-y-auto overscroll-contain rounded-xl border border-foreground/10 bg-background p-2 font-sans shadow-2xl outline-none"
          >
            {options.map((option, i) => {
              const isSelected = i === selectedIndex;
              const isActive = i === active;
              return (
                <li
                  key={option.value || "general"}
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => pick(i)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] leading-snug transition-colors ${
                    isActive ? "bg-foreground/[0.05] text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {/* The side index's dash: longer and filled when chosen */}
                  <span
                    aria-hidden
                    className={`block h-[2px] shrink-0 rounded-full transition-all duration-300 ${
                      isSelected ? "w-5 bg-foreground" : "w-3 bg-foreground/20"
                    }`}
                  />
                  <span className={`min-w-0 ${isSelected ? "font-medium text-foreground" : ""} ${i === 0 ? "font-mono text-sm" : ""}`}>
                    {option.label}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
