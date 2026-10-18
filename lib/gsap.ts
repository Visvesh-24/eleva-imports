/**
 * Single GSAP entry point: registers ScrollTrigger exactly once (client only).
 * Import { gsap, ScrollTrigger } from here, never from "gsap" directly.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
