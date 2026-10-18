/**
 * Recipe / ritual / pairing detail: ingredients with a servings scaler,
 * numbered method, Adriana's tip, the bottle it's made with, related entries.
 */
import Link from "next/link";
import { AgaveArt } from "@/components/art/Art";
import { SectionHeading } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Portrait } from "@/lib/adriana";
import type { Product } from "@/lib/catalog-types";
import type { Entry, Recipe } from "@/lib/recipes";
import { AdrianaAvatar } from "./AdrianaAvatar";
import { EntryHero } from "./EntryHero";
import { RecipeCard } from "./RecipeCard";
import { entryVars } from "@/lib/recipes";
import { ServingsScaler } from "./ServingsScaler";

export function RecipeDetail({
  recipe,
  product,
  related,
  portrait,
}: {
  recipe: Recipe;
  product?: Product;
  related: Entry[];
  portrait: Portrait;
}) {
  return (
    <article style={entryVars(recipe)}>
      <EntryHero
        entry={recipe}
        meta={[
          { label: "Time", value: recipe.time },
          { label: "Level", value: recipe.difficulty },
          { label: "Glass", value: recipe.glassName.split(" or ")[0] },
          {
            label: "Made with",
            value: product ? (
              <Link href={`/products/${product.handle}`} className="link-underline text-[var(--glow)]">
                {product.brand}
              </Link>
            ) : (
              "Tequila"
            ),
          },
        ]}
      />

      <section className="mx-auto grid max-w-[1800px] gap-14 px-gutter py-section lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <ServingsScaler ingredients={recipe.ingredients} glassName={recipe.glassName} />
          </Reveal>
        </div>

        <div>
          <Reveal>
            <h2 className="font-display text-display-md font-light text-bone">
              Method<span className="text-[var(--accent)]">.</span>
            </h2>
          </Reveal>
          <ol className="mt-10">
            {recipe.method.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 0.06} className="group grid grid-cols-[4.5rem_1fr] gap-4 border-t border-gold/12 py-8 md:grid-cols-[6rem_1fr]">
                <span className="font-display text-[3rem] font-light leading-none text-[color-mix(in_srgb,var(--accent)_55%,transparent)] transition-colors duration-[800ms] group-hover:text-[var(--glow)] md:text-[4rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="self-center text-[1.05rem] leading-relaxed text-parchment md:text-[1.15rem]">{step}</p>
              </Reveal>
            ))}
          </ol>

          {/* Adriana's tip */}
          <Reveal delay={0.1}>
            <figure className="relative mt-14 overflow-hidden rounded-card bg-ink-900 p-8 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_30%,transparent)] md:p-12">
              <AgaveArt className="absolute -bottom-16 -right-16 w-[26rem] opacity-25" seed={recipe.slug.length} />
              <span aria-hidden className="absolute left-6 top-2 font-display text-[7rem] leading-none text-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
                &ldquo;
              </span>
              <blockquote className="relative font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-light italic leading-snug text-bone">
                {recipe.tip}
              </blockquote>
              <figcaption className="relative mt-8 flex items-center gap-4">
                <AdrianaAvatar portrait={portrait} size={52} />
                <span>
                  <span className="block text-[0.9rem] text-parchment">Adriana Martinez</span>
                  <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-smoke">Certified Tequila Master</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {product && (
        <section className="relative overflow-hidden border-y border-gold/10 bg-ink-900/60 py-section">
          <div className="mx-auto grid max-w-[1800px] items-center gap-14 px-gutter md:grid-cols-[1.2fr_1fr] lg:gap-24">
            <SectionHeading
              eyebrow="Made with"
              lines={[product.name, <em key="e" className="text-[var(--glow)]">{product.expression}</em>]}
              intro={
                <>
                  <p>{product.description}</p>
                  <Link href={`/products/${product.handle}`} className="link-underline mt-6 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-[var(--accent)]">
                    Discover the bottle →
                  </Link>
                </>
              }
            />
            <Reveal delay={0.15} className="mx-auto w-full max-w-sm">
              <ProductCard product={product} sizes="(max-width: 768px) 80vw, 24rem" />
            </Reveal>
          </div>
        </section>
      )}

      <RelatedEntries related={related} />
    </article>
  );
}

export function RelatedEntries({ related, title = "Keep pouring" }: { related: Entry[]; title?: string }) {
  if (!related.length) return null;
  return (
    <section className="mx-auto max-w-[1800px] px-gutter py-section" aria-labelledby="related-title">
      <div className="mb-12 flex items-end justify-between gap-6">
        <h2 id="related-title" className="font-display text-display-md font-light text-bone">
          {title}
        </h2>
        <Link href="/recipes" className="link-underline shrink-0 text-[0.68rem] uppercase tracking-[0.22em] text-gold-soft">
          All recipes →
        </Link>
      </div>
      <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((e, i) => (
          <Reveal as="li" key={e.slug} delay={i * 0.08}>
            <RecipeCard entry={e} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
