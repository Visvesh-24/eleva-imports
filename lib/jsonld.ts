/** JSON-LD builders (schema.org) for SEO. */
import type { Product } from "./catalog-types";
import { SITE } from "./site";

export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} ${p.expression}`,
    brand: { "@type": "Brand", name: p.brand },
    description: p.description,
    image: [`${SITE.url}${p.image.src}`],
    category: p.type,
    sku: p.variants[0].sku,
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      name: v.title,
      sku: v.sku,
      price: (v.price.amount / 100).toFixed(2),
      priceCurrency: v.price.currencyCode,
      availability: v.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE.url}/products/${p.handle}`,
      seller: { "@type": "Organization", name: SITE.name },
    })),
    ...(p.abv ? { additionalProperty: [{ "@type": "PropertyValue", name: "Alcohol by volume", value: `${p.abv}%` }] } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo-512.webp`,
    description: SITE.tagline,
    founder: { "@type": "Person", name: "Adriana Martinez", jobTitle: "Certified Tequila Master" },
    address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
    sameAs: [SITE.instagram],
  };
}

/** Serialise for a <script type="application/ld+json"> (escapes "<"). */
export function ldScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
