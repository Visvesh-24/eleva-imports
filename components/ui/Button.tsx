"use client";

/**
 * Magnetic button / link. The element leans toward the pointer (with its
 * label leaning a little further) and springs back on leave. Two looks:
 * "primary" (warm amber fill with a glow) and "ghost" (gold hairline).
 */
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { isFinePointer } from "@/lib/motion";

type Variant = "primary" | "ghost";

interface Props {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
  /** Pull strength in px at the edge of the element. */
  strength?: number;
  type?: "button" | "submit";
  "aria-label"?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-pill font-medium uppercase transition-[color,background-color,box-shadow] duration-[400ms] ease-expo";

const sizes = {
  md: "h-12 px-7 text-[0.8125rem] tracking-[0.14em]",
  sm: "h-11 px-[1.1rem] text-[0.66rem] tracking-[0.11em]",
};

const looks: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] text-ink-950 shadow-[0_0_0_1px_rgb(248_200_152/0.35),0_12px_40px_-12px_rgb(227_162_74/0.65)] hover:shadow-[0_0_0_1px_rgb(248_200_152/0.6),0_16px_60px_-10px_rgb(227_162_74/0.85)]",
  ghost:
    "text-bone shadow-[inset_0_0_0_1px_rgb(201_164_106/0.45)] hover:shadow-[inset_0_0_0_1px_rgb(226_201_155/0.9)] hover:text-gold-soft bg-ink-950/20 backdrop-blur-[2px]",
};

export function Button({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  strength = 14,
  type = "button",
  ...rest
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const lx = useTransform(sx, (v) => v * 0.45);
  const ly = useTransform(sy, (v) => v * 0.45);

  const onMove = (e: React.PointerEvent) => {
    if (!ref.current || !isFinePointer()) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * strength * 0.6);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgb(255_244_224/0.55)_50%,transparent_70%)] transition-transform duration-[1200ms] ease-expo group-hover:translate-x-full"
        />
      )}
      <motion.span style={{ x: lx, y: ly }} className="relative inline-flex items-center gap-3">
        {children}
      </motion.span>
    </>
  );

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-flex"
    >
      {href ? (
        <Link href={href} className={`${base} ${sizes[size]} ${looks[variant]} ${className}`} {...rest}>
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={`${base} ${sizes[size]} ${looks[variant]} ${className}`} {...rest}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}

/** Small arrow glyph used inside CTAs. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`size-4 transition-transform duration-[400ms] ease-expo group-hover:translate-x-1 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
