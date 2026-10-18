"use client";

/** Accessible FAQ accordion (button + region pairs, one open at a time). */
import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { Faq as FaqItem } from "@/lib/experiences";
import { EASE_EXPO } from "@/lib/motion";

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="border-t border-gold/15">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-q${i}`;
        const panel = `${base}-a${i}`;
        return (
          <div key={item.q} className="border-b border-gold/15">
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className={`font-display text-[clamp(1.25rem,1.05rem+0.7vw,1.7rem)] font-light transition-colors duration-[400ms] ${isOpen ? "text-gold-soft" : "text-bone group-hover:text-gold-soft"}`}>
                  {item.q}
                </span>
                <span aria-hidden className="relative grid size-10 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)]">
                  <span className="absolute h-px w-3.5 bg-gold-soft" />
                  <span className={`absolute h-3.5 w-px bg-gold-soft transition-transform duration-[600ms] ease-expo ${isOpen ? "scale-y-0" : "scale-y-100"}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 text-[1rem] leading-relaxed text-mist">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
