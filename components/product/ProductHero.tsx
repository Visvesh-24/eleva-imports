"use client";

/**
 * Product hero: sticky bottle stage on the left, buy box + story on the right.
 * Owns variant / quantity state (shared with the sticky add-to-cart bar).
 */
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog-types";
import { cart, flyToCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { EASE_EXPO } from "@/lib/motion";
import { SITE } from "@/lib/site";
import { Qty } from "@/components/shop/CartDrawer";
import { ProductStage } from "./ProductStage";

export function ProductHero({ product, categoryTitle }: { product: Product; categoryTitle: string }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const bottle = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Let floating UI (WhatsApp) step aside while the sticky bar is up.
  useEffect(() => {
    document.documentElement.dataset.stickyBar = showSticky ? "on" : "";
    return () => {
      document.documentElement.dataset.stickyBar = "";
    };
  }, [showSticky]);

  const add = () => {
    flyToCart(bottle.current);
    cart.add(
      {
        variantId: variant.id,
        handle: product.handle,
        name: product.name,
        variantTitle: variant.title,
        image: product.image.src,
        price: variant.price,
        accent: product.theme.accent,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const waText = encodeURIComponent(`Hi Adriana! I have a question about ${product.name} (${variant.title}).`);

  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[1800px] lg:grid-cols-[1.15fr_1fr]">
        {/* Stage */}
        <div className="relative lg:sticky lg:top-0 lg:h-svh">
          <ProductStage ref={bottle} product={product} />
        </div>

        {/* Buy box + story */}
        <div className="relative px-gutter pb-20 pt-10 lg:pb-32 lg:pl-16 lg:pt-36 xl:pr-[6vw]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.22em] text-smoke">
              <li>
                <Link href="/shop" className="link-underline hover:text-parchment">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/collections/${product.category}`} className="link-underline hover:text-parchment">
                  {categoryTitle}
                </Link>
              </li>
            </ol>
          </nav>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.2 }}>
            <p className="eyebrow mt-8 text-[var(--glow)]">
              {product.brand} · {product.type}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,1.8rem+3.6vw,5.4rem)] font-light leading-[0.95] text-bone">{product.name}</h1>
            <p className="mt-3 font-display text-[1.5rem] font-light italic text-[var(--glow)]">{product.expression}</p>
            <p className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-parchment/90">{product.tagline}</p>
          </motion.div>

          <motion.div
            ref={buyRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.35 }}
            className="mt-10 rounded-[1.4rem] bg-ink-900/70 p-6 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_28%,transparent)] backdrop-blur-sm md:p-8"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-smoke">Price</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={variant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: EASE_EXPO }}
                    className="mt-1 font-display text-[2.6rem] leading-none text-bone"
                  >
                    {formatMoney(variant.price)}
                  </motion.p>
                </AnimatePresence>
              </div>
              {product.abv && (
                <p className="text-right text-[0.72rem] uppercase tracking-[0.2em] text-mist">
                  {product.abv}% ABV
                  <br />
                  <span className="text-smoke">{variant.title}</span>
                </p>
              )}
            </div>

            {product.variants.length > 1 && (
              <fieldset className="mt-7">
                <legend className="mb-3 text-[0.62rem] uppercase tracking-[0.3em] text-smoke">Size</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {product.variants.map((v) => {
                    const on = v.id === variant.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setVariantId(v.id)}
                        className={`relative rounded-pill px-5 py-2.5 text-[0.85rem] transition-colors duration-[400ms] ${on ? "text-ink-950" : "text-parchment hover:text-bone"}`}
                      >
                        {on && <motion.span layoutId="variant-pill" className="absolute inset-0 rounded-pill bg-[var(--glow)]" transition={{ duration: 0.5, ease: EASE_EXPO }} />}
                        {!on && <span aria-hidden className="absolute inset-0 rounded-pill shadow-[inset_0_0_0_1px_rgb(201_164_106/0.3)]" />}
                        <span className="relative">
                          {v.title} · {formatMoney(v.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Qty value={qty} onChange={(q) => setQty(Math.max(1, Math.min(24, q)))} label={product.name} size="lg" />
              <button
                type="button"
                onClick={add}
                className="group relative h-13 flex-1 basis-full overflow-hidden whitespace-nowrap rounded-pill px-8 sm:basis-auto text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink-950 shadow-[0_14px_50px_-14px_var(--accent)] transition-shadow hover:shadow-[0_18px_70px_-12px_var(--accent)]"
                style={{ background: "linear-gradient(135deg, var(--glow), var(--accent))" }}
              >
                <span aria-hidden className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgb(255_255_255/0.55)_50%,transparent_70%)] transition-transform duration-[1200ms] ease-expo group-hover:translate-x-full" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={added ? "added" : "add"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative block"
                  >
                    {added ? "Added to your cart ✓" : `Add to cart · ${formatMoney({ ...variant.price, amount: variant.price.amount * qty })}`}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            <p aria-live="polite" className="sr-only">
              {added ? `${qty} × ${product.name} ${variant.title} added to cart` : ""}
            </p>

            <div className="mt-6 grid gap-2 text-[0.8rem] text-mist sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Dot /> Taxes and shipping calculated at checkout
              </p>
              <p className="flex items-center gap-2">
                <Dot /> Shipping availability varies by province
              </p>
            </div>
            <a
              href={`${SITE.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="link-underline mt-5 inline-block text-[0.72rem] uppercase tracking-[0.2em] text-[var(--glow)]"
            >
              Not sure? Ask Adriana on WhatsApp →
            </a>
          </motion.div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <li key={b} className="rounded-pill px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-parchment shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-12 space-y-5 text-[1.02rem] leading-[1.75] text-parchment/85">
            <p className="font-display text-[1.45rem] leading-snug text-bone">{product.description}</p>
            {product.story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky add-to-cart (appears once the buy box scrolls away) */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[min(680px,92vw)] md:-translate-x-1/2"
          >
            <div className="flex items-center gap-4 rounded-pill bg-ink-900/90 py-2 pl-5 pr-2 shadow-[0_20px_60px_rgba(0,0,0,.6),inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)] backdrop-blur-xl">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[1.05rem] text-bone">{product.name}</p>
                <p className="truncate text-[0.7rem] uppercase tracking-[0.16em] text-smoke">
                  {variant.title} · {formatMoney(variant.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={add}
                className="h-11 shrink-0 rounded-pill px-6 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-950"
                style={{ background: "linear-gradient(135deg, var(--glow), var(--accent))" }}
              >
                {added ? "Added ✓" : "Add to cart"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Dot() {
  return <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />;
}
