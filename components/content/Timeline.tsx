"use client";

/**
 * Vertical timeline whose gold spine fills as you scroll through it.
 * Milestones alternate sides on desktop and stack on mobile.
 */
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

export interface Milestone {
  when: string;
  title: string;
  body: string;
}

export function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-5xl">
      <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-gold/15 md:left-1/2" />
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-[linear-gradient(180deg,#f8c898,#e3a24a)] md:left-1/2"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
      {items.map((m, i) => {
        const right = i % 2 === 1;
        return (
          <li key={m.title} className="relative grid pb-16 pl-12 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0">
            <span aria-hidden className="absolute left-[5px] top-2 grid size-[13px] place-items-center rounded-full bg-ink-950 shadow-[0_0_0_1px_#e3a24a,0_0_18px_rgb(227_162_74/0.6)] md:left-1/2 md:-translate-x-1/2">
              <span className="size-[5px] rounded-full bg-rosegold" />
            </span>
            <Reveal className={right ? "md:col-start-2" : "md:text-right"}>
              <p className="font-display text-[1.1rem] italic text-gold-soft">{m.when}</p>
              <h3 className="mt-2 font-display text-[1.9rem] font-light leading-tight text-bone">{m.title}</h3>
              <p className={`mt-3 max-w-md text-[0.97rem] leading-relaxed text-mist ${right ? "" : "md:ml-auto"}`}>{m.body}</p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
