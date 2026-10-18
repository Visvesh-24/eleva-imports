"use client";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so Lenis, ScrollTrigger and
 * every tween share one requestAnimationFrame loop. Disabled entirely for
 * prefers-reduced-motion (native scrolling).
 */
import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

let instance: Lenis | null = null;
/** Access the active Lenis instance (null when reduced motion / SSR). */
export const getLenis = () => instance;

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);
  return null;
}
