"use client";

/**
 * Masterclass formats as editorial cards. Each card glows in its own colour
 * on hover; "Enquire" scrolls to the booking form and pre-selects the format.
 */
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { MasterclassFormat } from "@/lib/experiences";
import { EASE_EXPO } from "@/lib/motion";
import { OrbitRings } from "@/components/art/Art";
import { getLenis } from "@/components/motion/SmoothScroll";

export const FORMAT_EVENT = "eleva:masterclass-format";

export function chooseFormat(id: string) {
  window.dispatchEvent(new CustomEvent(FORMAT_EVENT, { detail: id }));
  const target = document.getElementById("book");
  if (!target) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: -90 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => document.getElementById("mc-name")?.focus({ preventScroll: true }), 900);
}

export function FormatCards({ formats }: { formats: MasterclassFormat[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
      {formats.map((f, i) => (
        <motion.li
          key={f.id}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.2, ease: EASE_EXPO, delay: (i % 2) * 0.12 }}
          className="group relative isolate overflow-hidden rounded-card bg-ink-900 p-7 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] transition-shadow duration-[800ms] ease-expo hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_55%,transparent)] md:p-10"
          style={{ "--accent": f.accent, "--glow": f.glow } as CSSProperties}
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-50 transition-opacity duration-[1200ms] ease-expo group-hover:opacity-100"
            style={{ background: "radial-gradient(70% 60% at 100% 0%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 70%)" }}
          />
          <OrbitRings className="absolute -right-32 -top-32 -z-10 w-[26rem] opacity-30 transition-all duration-[1600ms] ease-expo group-hover:rotate-12 group-hover:opacity-70" />

          <div className="flex items-start justify-between gap-6">
            <span className="font-display text-[1.05rem] italic text-[var(--glow)]">0{i + 1}</span>
            <p className="text-right text-[0.62rem] uppercase tracking-[0.26em] text-smoke">
              {f.duration}
              <br />
              {f.guests}
            </p>
          </div>

          <p className="eyebrow mt-10 text-[var(--glow)]">{f.eyebrow}</p>
          <h3 className="mt-3 max-w-md font-display text-[clamp(2rem,1.5rem+1.6vw,2.9rem)] font-light leading-[1.02] text-bone">{f.title}</h3>
          <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-mist">{f.description}</p>

          <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {f.includes.map((inc) => (
              <li key={inc} className="flex items-center gap-3 text-[0.88rem] text-parchment">
                <span aria-hidden className="h-px w-4 bg-[var(--accent)]" />
                {inc}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-5 border-t border-gold/12 pt-6">
            <p>
              <span className="block text-[0.6rem] uppercase tracking-[0.26em] text-smoke">From</span>
              <span className="font-display text-[2.2rem] leading-none text-bone">${f.fromPrice}</span>
              <span className="ml-2 text-[0.8rem] text-mist">CAD {f.priceUnit}</span>
            </p>
            <button
              type="button"
              onClick={() => chooseFormat(f.id)}
              className="group/b inline-flex h-11 items-center gap-3 rounded-pill px-6 text-[0.7rem] uppercase tracking-[0.18em] text-bone shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition-colors duration-[400ms] hover:bg-[var(--accent)] hover:text-ink-950"
            >
              Enquire
              <svg aria-hidden viewBox="0 0 24 24" className="size-4 transition-transform duration-[400ms] ease-expo group-hover/b:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
