"use client";

/**
 * Custom cursor: a crisp dot plus a soft amber glow that trails behind and
 * swells over anything interactive (links, buttons, [data-cursor]).
 * Only mounts for fine pointers; touch devices keep the native behaviour.
 */
import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, [data-cursor]";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    const root = document.documentElement;
    const reduced = prefersReducedMotion();
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const g = { x: pos.x, y: pos.y, s: 1 };
    let target = 1;
    let visible = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        // Hide the native pointer only once ours is actually on screen.
        root.classList.add("has-cursor");
        g.x = pos.x;
        g.y = pos.y;
        dot.current?.style.setProperty("opacity", "1");
        glow.current?.style.setProperty("opacity", "1");
      }
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      target = el ? 2.4 : 1;
      root.dataset.cursor = el ? "hover" : "";
    };
    const leave = () => {
      visible = false;
      root.classList.remove("has-cursor");
      dot.current?.style.setProperty("opacity", "0");
      glow.current?.style.setProperty("opacity", "0");
    };
    const down = () => (target = 0.8);
    const up = () => (target = 1);

    const loop = () => {
      const k = reduced ? 1 : 0.16;
      g.x += (pos.x - g.x) * k;
      g.y += (pos.y - g.y) * k;
      g.s += (target - g.s) * 0.14;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (glow.current)
        glow.current.style.transform = `translate3d(${g.x}px, ${g.y}px, 0) translate(-50%, -50%) scale(${g.s})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] size-9 rounded-full opacity-0 transition-opacity duration-300 [background:radial-gradient(circle,rgb(227_162_74/0.32)_0%,rgb(227_162_74/0.12)_45%,transparent_70%)] [box-shadow:0_0_0_1px_rgb(226_201_155/0.28)]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] size-1.5 rounded-full bg-gold-soft opacity-0 mix-blend-difference transition-opacity duration-300"
      />
    </>
  );
}
