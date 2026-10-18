/**
 * Shared hero for recipe and guide detail pages: breadcrumb, masked title,
 * meta strip and a large line-art glass on an orbit dial.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { BackdropWord, GoldDust, OrbitRings } from "@/components/art/Art";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { KIND_LABEL, KIND_SINGULAR, type Entry } from "@/lib/recipes";
import { GlassArt } from "./GlassArt";

export function EntryHero({ entry, meta }: { entry: Entry; meta: { label: string; value: ReactNode }[] }) {
  const typeParam = { cocktail: "cocktails", neat: "neat", pairing: "pairing", guide: "guides" }[entry.kind];
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 75% 40%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%), radial-gradient(60% 50% at 0% 100%, color-mix(in srgb, var(--deep) 85%, transparent), transparent 70%)",
        }}
      />
      <BackdropWord word={KIND_SINGULAR[entry.kind]} className="absolute inset-x-0 top-[18%] opacity-60 [--outline:color-mix(in_srgb,var(--accent)_22%,transparent)]" />
      <GoldDust count={20} seed={entry.slug.length * 3} />

      <div className="relative mx-auto grid max-w-[1800px] items-center gap-12 px-gutter lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-8 text-[0.68rem] uppercase tracking-[0.22em] text-smoke">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/recipes" className="link-underline hover:text-bone">
                    Recipes & resources
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/recipes?type=${typeParam}`} className="link-underline hover:text-bone">
                    {KIND_LABEL[entry.kind]}
                  </Link>
                </li>
              </ol>
            </nav>
          </Reveal>
          <RevealLines as="h1" lines={[entry.title]} className="font-display text-display-lg font-light text-bone [text-wrap:balance]" lineClassName="[text-wrap:balance]" />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl font-display text-[clamp(1.3rem,1rem+1vw,1.9rem)] font-light italic leading-snug text-[var(--glow)]">{entry.subtitle}</p>
          </Reveal>
          <Reveal delay={0.32}>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-gold/15 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label} className="bg-ink-950/80 px-4 py-4 backdrop-blur-sm">
                  <dt className="text-[0.58rem] uppercase tracking-[0.26em] text-smoke">{m.label}</dt>
                  <dd className="mt-1.5 text-[0.9rem] text-parchment">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
          <OrbitRings className="absolute inset-[-6%] size-[112%]" />
          <div aria-hidden className="absolute inset-[18%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_30%,transparent),transparent)] blur-2xl" />
          <div className="absolute inset-[10%] [animation:float-y_8s_var(--ease-silk)_infinite]">
            <GlassArt kind={entry.glass} liquid={entry.liquid} garnish={entry.garnish} ice={entry.ice} className="size-full" title={`Illustration: ${entry.title}`} />
          </div>
        </div>
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}
