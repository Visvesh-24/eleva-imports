/**
 * Motion system: the single easing curve and duration scale used across the
 * site (mirrors the CSS tokens in app/globals.css). Import from here instead of
 * hard-coding numbers so CSS, GSAP and Framer Motion all move the same way.
 */

/** cubic-bezier(0.22, 1, 0.36, 1): confident start, long silky settle. */
export const EASE_EXPO = [0.22, 1, 0.36, 1] as const;
/** Symmetric in-out for scrubbed/looping motion. */
export const EASE_SILK = [0.65, 0, 0.35, 1] as const;

/** GSAP equivalents (CustomEase-free approximations of the curves above). */
export const GSAP_EASE = "expo.out";
export const GSAP_EASE_INOUT = "sine.inOut";

/** Duration scale in seconds. */
export const DURATION = {
  xs: 0.2,
  sm: 0.4,
  md: 0.8,
  lg: 1.2,
  xl: 1.8,
} as const;

/** Stagger used for line / item reveals. */
export const STAGGER = 0.09;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
