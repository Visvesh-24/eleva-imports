"use client";

/**
 * Product card: a small lit "stage" per bottle. On hover the bottle lifts and
 * tilts toward the pointer, the product's own light comes up, a dial ring
 * fades in and a quick-add button slides out. Colours come from the product
 * theme so every card glows in its own bottle's light.
 */
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import type { Product } from "@/lib/catalog-types";
import { cart, flyToCart } from "@/lib/cart";
import { formatMoney, minPrice } from "@/lib/money";
import { isFinePointer } from "@/lib/motion";
import { OrbitRings } from "@/components/art/Art";

export function themeVars(theme: Product["theme"]): CSSProperties {
  return { "--accent": theme.accent, "--glow": theme.glow, "--deep": theme.deep } as CSSProperties;
}

export function ProductCard({ product, priority = false, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const shadowX = useTransform(sry, (v) => `${-v * 1.2}px`);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isFinePointer()) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const first = product.variants[0];
  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    flyToCart(imgRef.current);
    cart.add({
      variantId: first.id,
      handle: product.handle,
      name: product.name,
      variantTitle: first.title,
      image: product.image.src,
      price: first.price,
      accent: product.theme.accent,
    });
  };
  const lo = minPrice(product);
  const range = product.variants.some((v) => v.price.amount !== lo.amount);

  return (
    <article className="group relative" style={themeVars(product.theme)} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Link href={`/products/${product.handle}`} className="block focus-visible:outline-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink-900 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.12)] transition-shadow duration-[800ms] ease-expo group-hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_45%,transparent)] group-focus-visible:shadow-[inset_0_0_0_1px_var(--accent)]">
          {/* Stage light in the bottle's own colour */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 transition-opacity duration-[800ms] ease-expo group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 45% at 50% 38%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%), radial-gradient(70% 30% at 50% 100%, color-mix(in srgb, var(--deep) 90%, transparent), transparent), linear-gradient(180deg, #11100e, #0b0a09)",
            }}
          />
          <OrbitRings className="absolute left-1/2 top-[42%] w-[118%] -translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 transition-all duration-[1200ms] ease-expo group-hover:scale-100 group-hover:opacity-100" />
          {/* Floor glow + reflection line */}
          <div aria-hidden className="absolute inset-x-[18%] bottom-[9%] h-6 rounded-[50%] bg-[color-mix(in_srgb,var(--accent)_40%,transparent)] blur-xl transition-opacity duration-[800ms] group-hover:opacity-100 md:opacity-60" />

          <motion.div
            ref={imgRef}
            className="absolute inset-x-[12%] bottom-[8%] top-[7%]"
            style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
          >
            <motion.div className="relative size-full transition-transform duration-[1200ms] ease-expo group-hover:-translate-y-[3%] group-hover:scale-[1.04]" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.55))", x: shadowX }}>
              <Image
                src={product.image.src}
                alt={product.image.alt}
                fill
                preload={priority}
                sizes={sizes ?? "(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 28vw"}
                placeholder={product.image.blurDataURL ? "blur" : "empty"}
                blurDataURL={product.image.blurDataURL}
                className="object-contain"
                unoptimized={product.image.src.endsWith(".svg")}
              />
            </motion.div>
          </motion.div>

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 1).map((b) => (
              <span key={b} className="rounded-pill bg-ink-950/60 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--glow)] backdrop-blur-sm">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.625rem] uppercase tracking-[0.26em] text-smoke">
              {product.type}
              {product.abv ? ` · ${product.abv}% ABV` : ""}
            </p>
            <h3 className="mt-1.5 font-display text-[1.6rem] font-light leading-tight text-bone transition-colors duration-[400ms] group-hover:text-[var(--glow)]">
              {product.name}
            </h3>
            <p className="mt-0.5 truncate text-[0.85rem] text-mist">{product.expression}</p>
          </div>
          <p className="shrink-0 pt-5 text-right text-[0.95rem] text-parchment">
            {range && <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-smoke">From</span>}
            {formatMoney(lo)}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={quickAdd}
        aria-label={`Add ${product.name} ${first.title} to cart`}
        className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-ink-950/70 text-bone shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] backdrop-blur-md transition-all duration-[400ms] ease-expo hover:bg-[var(--accent)] hover:text-ink-950 focus-visible:opacity-100 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </article>
  );
}
