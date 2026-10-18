"use client";

/**
 * Card for a recipe, ritual, pairing or guide: a small lit stage with the
 * entry's own line-art glass, which lifts and gains an orbit ring on hover.
 */
import Link from "next/link";
import { KIND_SINGULAR, type Entry } from "@/lib/recipes";
import { OrbitRings } from "@/components/art/Art";
import { GlassArt } from "./GlassArt";
import { entryVars } from "@/lib/recipes";

export function RecipeCard({ entry }: { entry: Entry }) {
  const meta = entry.kind === "guide" ? entry.readTime : `${entry.time} · ${entry.difficulty}`;
  return (
    <article className="group relative h-full" style={entryVars(entry)}>
      <Link href={`/recipes/${entry.slug}`} className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink-900 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.12)] transition-shadow duration-[800ms] ease-expo group-hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_45%,transparent)] group-focus-visible:shadow-[inset_0_0_0_1px_var(--accent)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 transition-opacity duration-[800ms] ease-expo group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 45% at 50% 42%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 70%), radial-gradient(80% 35% at 50% 100%, color-mix(in srgb, var(--deep) 90%, transparent), transparent), linear-gradient(180deg, #11100e, #0b0a09)",
            }}
          />
          <OrbitRings className="absolute left-1/2 top-[46%] w-[120%] -translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 transition-all duration-[1200ms] ease-expo group-hover:scale-100 group-hover:opacity-100" />
          <div className="absolute inset-x-[16%] bottom-[6%] top-[10%] transition-transform duration-[1200ms] ease-expo group-hover:-translate-y-[3%] group-hover:scale-[1.04]">
            <GlassArt kind={entry.glass} liquid={entry.liquid} garnish={entry.garnish} ice={entry.ice} className="size-full" />
          </div>
          <span className="absolute left-4 top-4 rounded-pill bg-ink-950/60 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--glow)] backdrop-blur-sm">
            {KIND_SINGULAR[entry.kind]}
          </span>
        </div>
        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-[0.625rem] uppercase tracking-[0.26em] text-smoke">{meta}</p>
          <h3 className="mt-1.5 font-display text-[1.65rem] font-light leading-tight text-bone transition-colors duration-[400ms] group-hover:text-[var(--glow)]">
            {entry.title}
          </h3>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-mist">{entry.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent)]">
            {entry.kind === "guide" ? "Read the guide" : "Get the recipe"}
            <svg aria-hidden viewBox="0 0 24 24" className="size-3.5 transition-transform duration-[400ms] ease-expo group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
