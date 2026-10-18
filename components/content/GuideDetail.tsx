/**
 * Long-form guide layout: lede, sticky table of contents, drop cap, pull
 * quotes, optional comparison table, then bottles to taste it with.
 */
import { SectionHeading } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Portrait } from "@/lib/adriana";
import type { Product } from "@/lib/catalog-types";
import type { Entry, Guide } from "@/lib/recipes";
import { AdrianaAvatar } from "./AdrianaAvatar";
import { EntryHero } from "./EntryHero";
import { entryVars } from "@/lib/recipes";
import { RelatedEntries } from "./RecipeDetail";

const anchor = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function GuideDetail({ guide, products, related, portrait }: { guide: Guide; products: Product[]; related: Entry[]; portrait: Portrait }) {
  return (
    <article style={entryVars(guide)}>
      <EntryHero
        entry={guide}
        meta={[
          { label: "Format", value: "Guide" },
          { label: "Reading", value: guide.readTime.replace(" read", "") },
          { label: "Sections", value: guide.sections.length },
          { label: "By", value: "Adriana M." },
        ]}
      />

      <div className="mx-auto grid max-w-[1400px] gap-14 px-gutter py-section lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
        <aside className="hidden lg:block">
          <nav aria-label="In this guide" className="sticky top-28">
            <p className="eyebrow mb-5">In this guide</p>
            <ol className="space-y-3 border-l border-gold/20 pl-5">
              {guide.sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#${anchor(s.heading)}`} className="group flex gap-3 text-[0.88rem] leading-snug text-mist transition-colors hover:text-bone">
                    <span className="font-display text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
              {guide.table && (
                <li>
                  <a href="#at-a-glance" className="flex gap-3 text-[0.88rem] text-mist hover:text-bone">
                    <span className="font-display text-[var(--accent)]">—</span>
                    At a glance
                  </a>
                </li>
              )}
            </ol>
            <div className="mt-10 flex items-center gap-3">
              <AdrianaAvatar portrait={portrait} size={44} />
              <span className="text-[0.75rem] leading-snug text-smoke">
                Written by <span className="text-parchment">Adriana Martinez</span>
                <br />
                Certified Tequila Master
              </span>
            </div>
          </nav>
        </aside>

        <div className="mx-auto w-full max-w-[44rem]">
          <Reveal>
            <p className="font-display text-[clamp(1.45rem,1.15rem+1vw,2.1rem)] font-light leading-snug text-bone">{guide.excerpt}</p>
          </Reveal>

          {guide.sections.map((s, si) => (
            <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-28 pt-16">
              <Reveal>
                <p className="eyebrow mb-4 text-[var(--accent)]">Part {String(si + 1).padStart(2, "0")}</p>
                <h2 className="font-display text-[clamp(1.9rem,1.5rem+1.4vw,2.8rem)] font-light leading-tight text-bone">{s.heading}</h2>
              </Reveal>
              {s.body.map((p, pi) => (
                <Reveal key={pi} delay={0.05}>
                  <p
                    className={`mt-6 text-[1.06rem] leading-[1.8] text-parchment/90 ${
                      si === 0 && pi === 0
                        ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-[var(--glow)]"
                        : ""
                    }`}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
              {s.quote && (
                <Reveal delay={0.1}>
                  <blockquote className="relative my-14 border-y border-[color-mix(in_srgb,var(--accent)_35%,transparent)] py-10 md:-mx-12">
                    <span aria-hidden className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink-950 px-4 font-display text-6xl leading-none text-[var(--accent)]">
                      &ldquo;
                    </span>
                    <p className="text-center font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] font-light italic leading-snug text-bone">{s.quote}</p>
                  </blockquote>
                </Reveal>
              )}
            </section>
          ))}

          {guide.table && (
            <section id="at-a-glance" className="scroll-mt-28 pt-16">
              <Reveal>
                <h2 className="font-display text-[clamp(1.9rem,1.5rem+1.4vw,2.8rem)] font-light text-bone">At a glance</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="-mx-gutter mt-8 overflow-x-auto px-gutter md:mx-0 md:px-0" tabIndex={0} role="region" aria-label={guide.table.caption}>
                  <table className="w-full min-w-[38rem] border-collapse text-left">
                    <caption className="sr-only">{guide.table.caption}</caption>
                    <thead>
                      <tr>
                        {guide.table.headers.map((h) => (
                          <th key={h} scope="col" className="border-b border-[color-mix(in_srgb,var(--accent)_45%,transparent)] pb-4 pr-6 text-[0.62rem] font-normal uppercase tracking-[0.24em] text-smoke">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guide.table.rows.map((row) => (
                        <tr key={row[0]} className="group transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]">
                          {row.map((cell, ci) =>
                            ci === 0 ? (
                              <th key={ci} scope="row" className="border-b border-gold/10 py-5 pr-6 font-display text-[1.35rem] font-light text-[var(--glow)]">
                                {cell}
                              </th>
                            ) : (
                              <td key={ci} className="border-b border-gold/10 py-5 pr-6 text-[0.95rem] text-parchment">
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </section>
          )}
        </div>
      </div>

      {products.length > 0 && (
        <section className="border-y border-gold/10 bg-ink-900/60 py-section">
          <div className="mx-auto max-w-[1800px] px-gutter">
            <SectionHeading eyebrow="Taste it yourself" lines={["The bottles", <em key="e" className="text-[var(--glow)]">behind this guide.</em>]} />
            <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal as="li" key={p.handle} delay={i * 0.08}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <RelatedEntries related={related} title="Read next" />
    </article>
  );
}
