/**
 * Collection / shop hero: masked title, intro, the collection's motif drawn
 * behind, and its bottles fanned on a lit plinth (floating gently).
 */
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product, Theme } from "@/lib/catalog-types";
import { CircularText, GoldDust, Motif } from "@/components/art/Art";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

export function CollectionHero({
  eyebrow,
  title,
  intro,
  theme,
  motif,
  bottles,
  count,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  theme: Theme;
  motif: "agave" | "rings" | "waves" | "rays" | "talavera";
  bottles: Product[];
  count: number;
  crumbs?: { href: string; label: string }[];
}) {
  // Split long titles into two balanced lines for the masked reveal.
  const words = title.split(" ");
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [title];
  const fan = bottles.slice(0, 5);

  return (
    <section
      className="relative overflow-hidden pb-6 pt-28 md:pt-36"
      style={{ "--accent": theme.accent, "--glow": theme.glow, "--deep": theme.deep } as CSSProperties}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 72% 45%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%), radial-gradient(70% 60% at 20% 110%, color-mix(in srgb, var(--deep) 95%, transparent), transparent 70%)",
        }}
      />
      <Motif
        motif={motif}
        className={`absolute opacity-60 ${motif === "waves" ? "inset-x-0 bottom-0 h-1/2" : motif === "rays" ? "inset-0" : "right-[-10%] top-[2%] w-[min(880px,100vw)] md:right-[4%]"}`}
      />
      <GoldDust count={24} seed={title.length} />

      <div className="relative mx-auto grid max-w-[1800px] items-end gap-10 px-gutter lg:grid-cols-[1.1fr_1fr]">
        <div className="pb-6 lg:pb-16">
          {crumbs && (
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-smoke">
                  {crumbs.map((c, i) => (
                    <li key={c.href} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden>/</span>}
                      <Link href={c.href} className="link-underline hover:text-parchment">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          )}
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[var(--accent)]" />
              {eyebrow}
            </p>
          </Reveal>
          <RevealLines as="h1" lines={lines} className="font-display text-display-lg font-light text-bone" />
          <Reveal delay={0.25}>
            <p className="mt-7 max-w-[36rem] text-[1.05rem] leading-relaxed text-parchment/90">{intro}</p>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="mt-8 text-[0.7rem] uppercase tracking-[0.3em] text-[var(--glow)]">
              {count} {count === 1 ? "bottle" : "bottles"} · Additive-free selections · Prices in CAD
            </p>
          </Reveal>
        </div>

        {/* Bottle fan on a lit plinth */}
        <Reveal delay={0.15} className="relative mx-auto h-[min(64vh,560px)] w-full max-w-[640px]">
          <div aria-hidden className="absolute inset-x-[8%] bottom-[4%] h-[18%] rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_45%,transparent),transparent)] blur-md" />
          <div aria-hidden className="absolute inset-x-[14%] bottom-[9%] h-px bg-[linear-gradient(90deg,transparent,var(--glow),transparent)] opacity-60" />
          {fan.map((p, i) => {
            const n = fan.length;
            const offset = i === 0 ? 0 : (i % 2 === 1 ? -1 : 1) * Math.ceil(i / 2);
            const spread = n > 3 ? 21 : 26;
            const left = 50 + offset * spread;
            const scale = i === 0 ? 1 : 0.8 - Math.abs(offset) * 0.06;
            return (
              <div
                key={p.handle}
                className="absolute bottom-[8%] h-[86%] w-[42%]"
                style={{
                  left: `${left}%`,
                  zIndex: 10 - Math.abs(offset),
                  transform: `translateX(-50%) scale(${scale})`,
                  transformOrigin: "bottom center",
                }}
              >
                <div className="relative size-full" style={{ animation: `float-y ${6 + i}s var(--ease-silk) ${-i * 1.3}s infinite` }}>
                  <Image
                    src={p.image.src}
                    alt={i === 0 ? p.image.alt : ""}
                    fill
                    preload={i === 0}
                    sizes="(max-width: 1024px) 40vw, 18vw"
                    placeholder={p.image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={p.image.blurDataURL}
                    unoptimized={p.image.src.endsWith(".svg")}
                    className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]"
                    style={{ filter: i === 0 ? undefined : "brightness(.72)" }}
                  />
                </div>
              </div>
            );
          })}
          <CircularText text="Additive-free · 100% agave · Chosen by a master · " className="absolute right-0 top-0 hidden md:block" size={130} />
        </Reveal>
      </div>
    </section>
  );
}
