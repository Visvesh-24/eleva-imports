"use client";

/**
 * Featured bottles: a pinned horizontal gallery on desktop (scroll drives the
 * track sideways while each bottle turns slowly and parallaxes), and a native
 * snap carousel on touch / narrow screens. Each panel is lit in its bottle's
 * colour and carries tasting-note chips.
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import type { Product } from "@/lib/catalog-types";
import { gsap } from "@/lib/gsap";
import { formatMoney, minPrice } from "@/lib/money";
import { prefersReducedMotion } from "@/lib/motion";
import { OrbitRings } from "@/components/art/Art";

export function FeaturedBottles({ products }: { products: Product[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const el = track.current;
    if (!root || !el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (hover: hover)", () => {
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Each bottle turns and drifts as its panel crosses the screen.
        gsap.utils.toArray<HTMLElement>("[data-bottle]", root).forEach((b) => {
          gsap.fromTo(
            b,
            { rotate: 6, yPercent: 6, rotateY: -18 },
            {
              rotate: -6,
              yPercent: -6,
              rotateY: 18,
              ease: "none",
              scrollTrigger: { trigger: b.closest("[data-panel]"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-ink-950" aria-labelledby="featured-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-gutter pt-24 lg:pt-28">
        <div className="mx-auto flex max-w-[1800px] items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" /> Adriana&rsquo;s shelf
            </p>
            <h2 id="featured-title" className="font-display text-display-md font-light text-bone">
              Featured <em className="text-gold-soft">bottles</em>
            </h2>
          </div>
          <Link href="/shop" className="link-underline pointer-events-auto hidden text-[0.7rem] uppercase tracking-[0.24em] text-gold-soft md:inline">
            Shop all →
          </Link>
        </div>
      </div>

      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-gutter pb-16 pt-56 [scrollbar-width:none] lg:h-svh lg:snap-none lg:items-center lg:gap-8 lg:overflow-visible lg:pb-0 lg:pt-36"
        data-lenis-prevent-touch
      >
        {products.map((p, i) => (
          <article
            key={p.handle}
            data-panel
            className="group relative flex w-[84vw] shrink-0 snap-center flex-col overflow-hidden rounded-[1.8rem] sm:w-[60vw] lg:h-[72vh] lg:w-[min(64vw,980px)] lg:flex-row"
            style={{ "--accent": p.theme.accent, "--glow": p.theme.glow, "--deep": p.theme.deep } as CSSProperties}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 70% at 30% 50%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%), linear-gradient(120deg, color-mix(in srgb, var(--deep) 100%, #000), #0b0a09 75%)",
              }}
            />
            <div className="relative h-[52vh] max-h-[460px] lg:h-full lg:max-h-none lg:w-1/2" style={{ perspective: 900 }}>
              <OrbitRings className="absolute left-1/2 top-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-50" />
              <div data-bottle className="absolute inset-x-[14%] bottom-[8%] top-[8%]">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes="(max-width: 1024px) 70vw, 32vw"
                  placeholder={p.image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.image.blurDataURL}
                  unoptimized={p.image.src.endsWith(".svg")}
                  className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,.6)]"
                />
              </div>
            </div>
            <div className="relative flex flex-1 flex-col justify-center gap-5 p-7 lg:p-12">
              <p className="font-display text-sm text-[var(--glow)]">{String(i + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</p>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-mist">
                  {p.brand} · {p.type}
                </p>
                <h3 className="mt-3 font-display text-[clamp(2rem,1.4rem+2vw,3.6rem)] font-light leading-[0.98] text-bone">{p.name}</h3>
                <p className="mt-2 font-display text-[1.2rem] italic text-[var(--glow)]">{p.expression}</p>
              </div>
              <p className="max-w-[26rem] text-[0.95rem] leading-relaxed text-parchment/85">{p.tagline}</p>
              {p.tasting && (
                <ul className="flex flex-wrap gap-2" aria-label="Tasting notes">
                  {[...p.tasting.aroma.notes.slice(0, 2), ...p.tasting.palate.notes.slice(0, 2)].map((n) => (
                    <li key={n} className="rounded-pill bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-1.5 text-[0.75rem] text-parchment shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
                      {n}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-5 pt-2">
                <Link
                  href={`/products/${p.handle}`}
                  className="rounded-pill px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-950 transition-shadow hover:shadow-[0_10px_40px_-8px_var(--accent)]"
                  style={{ background: "linear-gradient(135deg, var(--glow), var(--accent))" }}
                >
                  Discover
                </Link>
                <span className="text-[0.95rem] text-parchment">{formatMoney(minPrice(p))}</span>
              </div>
            </div>
          </article>
        ))}
        <div aria-hidden className="w-[6vw] shrink-0" />
      </div>
    </section>
  );
}
