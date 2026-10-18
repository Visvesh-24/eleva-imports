import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { ShopView } from "@/components/shop/ShopView";
import { getCollection, getCollectionProducts, getCollections, getProduct } from "@/lib/products";

/**
 * Every handle is prerendered via generateStaticParams; opt out of the
 * instant-navigation dev validation for this dynamic segment.
 */
export const instant = false;

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const c = await getCollection(handle);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/collections/${c.handle}` },
    openGraph: { title: `${c.title} | Eleva Imports`, description: c.description },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();
  const [products, collections] = await Promise.all([getCollectionProducts(handle), getCollections()]);
  const heroBottles = (await Promise.all(collection.heroProducts.map((h) => getProduct(h)))).filter((p) => p !== undefined);

  return (
    <>
      <CollectionHero
        eyebrow={collection.eyebrow}
        title={collection.title}
        intro={collection.intro}
        theme={collection.theme}
        motif={collection.motif}
        bottles={heroBottles}
        count={products.length}
        crumbs={[
          { href: "/shop", label: "Shop" },
          { href: `/collections/${collection.handle}`, label: collection.title },
        ]}
      />
      <ShopView
        products={products}
        chips={collections.map(({ handle: h, title, kind }) => ({ handle: h, title, kind }))}
        activeHandle={collection.handle}
      />
    </>
  );
}
