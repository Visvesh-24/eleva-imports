"use client";

/**
 * "From field to glass": a scroll-driven timeline. A gold thread draws down
 * the page as you scroll (with a glowing bead at its tip), and each stage's
 * line-art icon draws itself on as it enters view.
 */
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { JourneyStep } from "@/lib/experiences";
import { EASE_EXPO } from "@/lib/motion";

const ICONS: Record<JourneyStep["icon"], string[]> = {
  agave: [
    "M60 104 C58 80 40 58 18 44",
    "M60 104 C60 76 52 44 40 18",
    "M60 104 C62 72 64 40 60 10",
    "M60 104 C62 76 70 46 82 18",
    "M60 104 C64 80 80 58 102 44",
    "M60 104 C54 92 38 84 14 82",
    "M60 104 C66 92 82 84 106 82",
    "M30 108 L90 108",
  ],
  oven: [
    "M16 104 L16 60 C16 34 36 16 60 16 C84 16 104 34 104 60 L104 104 Z",
    "M38 104 L38 72 C38 60 48 50 60 50 C72 50 82 60 82 72 L82 104",
    "M48 92 C52 84 56 88 60 80 C64 88 68 84 72 92",
    "M28 40 L36 46 M92 40 L84 46 M60 26 L60 34",
  ],
  still: [
    "M30 100 C14 100 14 60 30 52 L50 52 C66 60 66 100 50 100 Z",
    "M40 52 L40 36 C40 28 48 24 56 26 L96 40",
    "M96 40 L96 84",
    "M86 84 L106 84 L102 104 L90 104 Z",
    "M24 76 L56 76",
  ],
  barrel: [
    "M30 16 C20 40 20 80 30 104 L90 104 C100 80 100 40 90 16 Z",
    "M24 34 L96 34 M22 60 L98 60 M24 86 L96 86",
    "M48 16 C42 40 42 80 48 104 M72 16 C78 40 78 80 72 104",
  ],
  glass: [
    "M38 14 C36 40 38 60 46 72 C52 80 56 82 60 82 C64 82 68 80 74 72 C82 60 84 40 82 14 Z",
    "M60 82 L60 104",
    "M40 106 L80 106",
    "M42 48 C54 52 66 44 78 48",
  ],
};

function Icon({ icon, accent }: { icon: JourneyStep["icon"]; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden viewBox="0 0 120 120" className="size-full" fill="none" stroke={accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[icon].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.8, ease: EASE_EXPO, delay: 0.15 + i * 0.12 }}
        />
      ))}
    </svg>
  );
}

export function JourneyTimeline({ steps }: { steps: JourneyStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const beadTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <ol ref={ref} className="relative mx-auto max-w-6xl">
      {/* The thread */}
      <div aria-hidden className="absolute bottom-0 left-[1.6rem] top-0 w-px bg-gold/15 md:left-1/2">
        <motion.div className="absolute inset-0 origin-top bg-[linear-gradient(180deg,#f8c898,#e3a24a_60%,#d48358)]" style={{ scaleY: reduce ? 1 : progress }} />
        {!reduce && (
          <motion.span
            className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rosegold shadow-[0_0_18px_4px_rgb(227_162_74/0.65)]"
            style={{ top: beadTop }}
          />
        )}
      </div>

      {steps.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li key={s.id} className="relative grid grid-cols-[3.2rem_1fr] gap-6 pb-20 last:pb-0 md:grid-cols-2 md:gap-20 md:pb-28">
            {/* Node */}
            <span aria-hidden className="absolute left-[1.6rem] top-3 z-10 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-ink-950 shadow-[inset_0_0_0_1px_rgb(226_201_155/0.6)] md:left-1/2">
              <span className="size-1.5 rounded-full bg-gold-soft" />
            </span>

            <motion.div
              className={`col-start-2 md:col-start-auto ${right ? "md:col-start-2" : "md:pr-4 md:text-right"}`}
              initial={reduce ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 1.2, ease: EASE_EXPO }}
            >
              <div className={`flex items-center gap-5 ${right ? "" : "md:flex-row-reverse"}`}>
                <div className="size-20 shrink-0 rounded-full bg-ink-900/80 p-3 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.22)] md:size-24">
                  <Icon icon={s.icon} accent="#e2c99b" />
                </div>
                <div>
                  <p className="font-display text-[0.95rem] italic text-gold">{s.n}</p>
                  <h3 className="font-display text-[clamp(1.9rem,1.4rem+1.6vw,2.8rem)] font-light leading-none text-bone">{s.title}</h3>
                </div>
              </div>
              <p className="mt-5 text-[0.65rem] uppercase tracking-[0.3em] text-gold-soft">{s.kicker}</p>
              <p className={`mt-3 max-w-md text-[1rem] leading-relaxed text-mist ${right ? "" : "md:ml-auto"}`}>{s.body}</p>
            </motion.div>

            {/* Ghost numeral on the opposite side */}
            <div aria-hidden className={`hidden select-none items-start md:flex ${right ? "md:col-start-1 md:row-start-1 md:justify-end" : "md:justify-start"}`}>
              <span className="text-outline font-display text-[9rem] font-light italic leading-[0.8] [--outline:rgb(201_164_106/0.18)]">{s.n}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
