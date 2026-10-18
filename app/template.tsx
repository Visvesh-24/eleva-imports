"use client";

/**
 * Page transition: on every client-side navigation a warm amber panel wipes
 * up off the incoming page. Skipped on the very first load (the hero and age
 * gate own that moment) and for reduced motion.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { EASE_EXPO } from "@/lib/motion";
import { getLenis } from "@/components/motion/SmoothScroll";

let firstLoad = true;

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const skip = firstLoad || reduce;
  useEffect(() => {
    firstLoad = false;
    // New page starts at the top (Lenis keeps its own scroll position).
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, []);
  return (
    <>
      {!skip && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] origin-top"
          style={{ background: "linear-gradient(180deg, #e3a24a 0%, #c8783e 55%, #2a1608 100%)" }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1, ease: EASE_EXPO, delay: 0.05 }}
        />
      )}
      {children}
    </>
  );
}
