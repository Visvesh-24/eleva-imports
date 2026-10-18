"use client";

/**
 * Scroll reveals built on Framer Motion, using the shared easing/duration
 * scale. Content is fully visible without JS and for reduced motion.
 */
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { DURATION, EASE_EXPO, STAGGER } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Fade + rise into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" | "article" } & Omit<
  HTMLMotionProps<"div">,
  "children"
>) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.lg, ease: EASE_EXPO, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/**
 * Masked line-by-line heading reveal. Pass each visual line separately.
 * The in-view trigger sits on an unclipped wrapper: the lines themselves start
 * fully outside their overflow-hidden masks, so observing them would never fire.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  delay = 0,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={VIEWPORT}
        variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER, delayChildren: delay } } }}
      >
        {lines.map((line, i) => (
          <span key={i} className="mask-line">
            <motion.span
              className={`block ${lineClassName}`}
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: DURATION.xl * 0.8, ease: EASE_EXPO } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Image/clip reveal: wipes up from the bottom edge. */
export function ClipReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.xl, ease: EASE_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered children container. */
export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.lg, ease: EASE_EXPO } },
};
