import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { ProductHero } from "@/components/product/ProductHero";
import { CraftSpecs, MastersNote, ServeIt, TastingJourney } from "@/components/product/ProductSections";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getPortrait } from "@/lib/adriana";
import { ldScript, productJsonLd } from "@/lib/jsonld";
import { getCollection, getProduct, getProducts, getRelatedProducts, priceLabel } from "@/lib/products";

/**
 * Every handle is prerendered via generateStaticParams; opt out of the
 * instant-navigation dev validation for this dynamic segment.
 */
export const instant = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) return {};
  const title = `${p.name} ${p.expression}`;
  const description = `${p.tagline} ${p.description}`.slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: {
      title: `${title} · ${priceLabel(p)} | Eleva Imports`,
      description,
      images: [{ url: p.image.src, width: p.image.width, height: p.image.height, alt: p.image.alt }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const [category, related] = await Promise.all([getCollection(product.category), getRelatedProducts(product, 4)]);
  const portrait = getPortrait("cellar");
  const theme = {
    "--accent": product.theme.accent,
    "--glow": product.theme.glow,
    "--deep": product.theme.deep,
  } as CSSProperties;

  return (
    <div style={theme} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(productJsonLd(product))} />
      {/* Page tint in the bottle's colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[180vh]"
        style={{ background: "radial-gradient(60% 40% at 70% 10%, color-mix(in srgb, var(--deep) 90%, transparent), transparent 75%)" }}
      />
      <ProductHero product={product} categoryTitle={category?.title ?? "Shop"} />
      <TastingJourney product={product} />
      <CraftSpecs product={product} />
      <ServeIt product={product} />
      <MastersNote product={product} portrait={portrait} />
      <RelatedProducts products={related} />
    </div>
  );
}
