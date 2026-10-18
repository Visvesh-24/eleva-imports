/** "You may also pour" row at the end of a product page. */
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="relative border-t border-gold/10 py-section" aria-labelledby="related-title">
      <div className="mx-auto max-w-[1800px] px-gutter">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-gold/70" /> Keep exploring
          </p>
        </Reveal>
        <RevealLines lines={["You may also pour"]} className="font-display text-display-md font-light text-bone" />
        <h2 id="related-title" className="sr-only">
          Related products
        </h2>
        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal as="li" key={p.handle} delay={i * 0.08}>
              <ProductCard product={p} sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 22vw" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
