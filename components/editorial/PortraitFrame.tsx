/**
 * Framed portrait of Adriana with a gold hairline frame, offset shadow plate
 * and a slow light sweep. Falls back to an art-directed placeholder until the
 * photo exists in /public/adriana (see lib/adriana.ts).
 */
import Image from "next/image";
import type { Portrait } from "@/lib/adriana";
import { AgaveArt } from "@/components/art/Art";

export function PortraitFrame({
  portrait,
  className = "",
  sizes = "(max-width: 768px) 90vw, 40vw",
  priority = false,
  caption,
}: {
  portrait: Portrait;
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div aria-hidden className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[1.6rem] border border-gold/25" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-ink-850 shadow-card">
        {portrait.src ? (
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            sizes={sizes}
            preload={priority}
            className="object-cover"
            style={{ objectPosition: portrait.focal }}
          />
        ) : (
          <div className="absolute inset-0" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as React.CSSProperties}>
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgb(227_162_74/0.25),transparent_70%),linear-gradient(180deg,#1c1916,#0b0a09)]" />
            <AgaveArt className="absolute inset-x-0 bottom-0 w-full opacity-80" seed={21} />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-[clamp(4rem,9vw,8rem)] font-light italic text-gold-soft/80">AM</span>
            </div>
            <span className="sr-only">{portrait.alt}</span>
          </div>
        )}
        {/* light sweep */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_236_200/0.14)_50%,transparent_65%)] bg-[length:250%_100%] [animation:sweep_7s_var(--ease-silk)_infinite]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_10_9/0.55))]" />
      </div>
      {caption && (
        <figcaption className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-smoke">{caption}</figcaption>
      )}
    </figure>
  );
}
