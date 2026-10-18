import type { Metadata } from "next";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { ShopView } from "@/components/shop/ShopView";
import { getCollections, getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop additive-free tequila",
  description:
    "Every bottle hand-selected by Canada's only Certified Tequila Master: Reserva Huizar, boutique tequilas, tasting minis, Pechery liqueurs and Riedel glassware. Prices in CAD.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const fan = ["reserva-huizar-cristalino-reposado", "reserva-huizar-plata", "la-cofradia-las-iguanas-reposado", "reserva-huizar-plata-rosado", "casa-cofradia-anejo-black"]
    .map((h) => products.find((p) => p.handle === h))
    .filter((p) => p !== undefined);
  return (
    <>
      <CollectionHero
        eyebrow="The collection"
        title="Every bottle, chosen by a master."
        intro="No additives, no shortcuts, no shelf-fillers. Just the bottles Adriana would pour at her own table: tequila that tastes of agave, fire and time."
        theme={{ accent: "#e3a24a", glow: "#f5cf8e", deep: "#251708" }}
        motif="rings"
        bottles={fan}
        count={products.length}
      />
      <ShopView
        products={products}
        chips={collections.map(({ handle, title, kind }) => ({ handle, title, kind }))}
        activeHandle={null}
      />
    </>
  );
}
