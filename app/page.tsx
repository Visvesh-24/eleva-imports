import { Hero } from "@/components/hero/Hero";
import { CollectionsShowcase, type ShowcaseItem } from "@/components/home/CollectionsShowcase";
import { FeaturedBottles } from "@/components/home/FeaturedBottles";
import { MasterclassBanner, MeetAdriana, TradeSection } from "@/components/home/HomeSections";
import { HomeRecipes } from "@/components/home/HomeRecipes";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustStrip } from "@/components/home/TrustStrip";
import { getPortrait } from "@/lib/adriana";
import { ldScript, organizationJsonLd } from "@/lib/jsonld";
import { getCollection, getFeaturedProducts, getProduct } from "@/lib/products";

/** Edits shown in "Five ways in", each paired with the bottle that leads it. */
const SHOWCASE: [collection: string, bottle: string][] = [
  ["sip-neat", "casa-cofradia-anejo-black"],
  ["mix-and-pour", "reserva-huizar-plata"],
  ["gift-and-share", "la-cofradia-las-iguanas-reposado"],
  ["start-here", "reserva-huizar-tasting-trio"],
  ["boutique-collection", "reserva-huizar-plata-rosado"],
];

export default async function Home() {
  const items: ShowcaseItem[] = [];
  for (const [ch, ph] of SHOWCASE) {
    const c = await getCollection(ch);
    const p = await getProduct(ph);
    if (!c || !p) continue;
    items.push({
      handle: c.handle,
      title: c.title,
      eyebrow: c.eyebrow,
      description: c.description,
      theme: p.theme,
      motif: c.motif,
      image: { src: p.image.src, alt: p.image.alt, blurDataURL: p.image.blurDataURL },
    });
  }
  const [featured, trio] = await Promise.all([getFeaturedProducts(), getProduct("reserva-huizar-tasting-trio")]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(organizationJsonLd())} />
      <Hero />
      <TrustStrip />
      <CollectionsShowcase items={items} />
      <FeaturedBottles products={featured} />
      <MeetAdriana portrait={getPortrait("agave")} />
      {trio && <MasterclassBanner bottle={trio} />}
      <TradeSection />
      <HomeRecipes />
      <Newsletter />
    </>
  );
}
