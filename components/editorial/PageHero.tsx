/**
 * Editorial hero used by content pages: masked headline, intro, optional
 * CTA row, decorative motif + gold dust, and an optional visual on the right.
 */
import type { CSSProperties, ReactNode } from "react";
import { GoldDust, Motif } from "@/components/art/Art";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

export interface PageTheme {
  accent: string;
  glow: string;
  deep: string;
}

export const DEFAULT_THEME: PageTheme = { accent: "#c9a46a", glow: "#e2c99b", deep: "#1c1308" };

export function PageHero({
  eyebrow,
  lines,
  intro,
  children,
  aside,
  motif = "agave",
  theme = DEFAULT_THEME,
  compact = false,
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  motif?: "agave" | "rings" | "waves" | "rays" | "talavera";
  theme?: PageTheme;
  compact?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "pb-16 pt-32 md:pt-40" : "min-h-[88svh] pb-20 pt-32 md:pt-44"}`}
      style={{ "--accent": theme.accent, "--glow": theme.glow, "--deep": theme.deep } as CSSProperties}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 78% 30%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%), radial-gradient(60% 50% at 10% 100%, color-mix(in srgb, var(--deep) 80%, transparent), transparent 70%)",
        }}
      />
      <Motif
        motif={motif}
        className={`absolute opacity-70 ${
          motif === "waves"
            ? "inset-x-0 bottom-0 h-[45%]"
            : motif === "rays"
              ? "inset-0"
              : "right-[-12%] top-[8%] w-[min(900px,90vw)] md:right-[-6%]"
        }`}
      />
      <GoldDust count={22} seed={motif.length * 7} />

      <div className="relative mx-auto grid max-w-[1800px] items-center gap-14 px-gutter lg:grid-cols-[1.25fr_1fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-7 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[var(--accent)]" />
              {eyebrow}
            </p>
          </Reveal>
          <RevealLines
            as="h1"
            lines={lines}
            className="font-display text-display-lg font-light text-bone"
          />
          {intro && (
            <Reveal delay={0.25}>
              <div className="mt-8 max-w-[38rem] text-[1.05rem] leading-relaxed text-parchment/90 md:text-[1.15rem]">{intro}</div>
            </Reveal>
          )}
          {children && (
            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">{children}</div>
            </Reveal>
          )}
        </div>
        {aside && <Reveal delay={0.2}>{aside}</Reveal>}
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}

/** Section heading: eyebrow + masked display title + optional intro. */
export function SectionHeading({
  eyebrow,
  lines,
  intro,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      <Reveal>
        <p className={`eyebrow mb-6 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span aria-hidden className="h-px w-8 bg-gold/70" />
          {eyebrow}
        </p>
      </Reveal>
      <RevealLines lines={lines} className="font-display text-display-md font-light text-bone" />
      {intro && (
        <Reveal delay={0.2}>
          <div className={`mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-mist ${align === "center" ? "mx-auto" : ""}`}>{intro}</div>
        </Reveal>
      )}
    </div>
  );
}
