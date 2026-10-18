import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/products";
import { getEntries } from "@/lib/recipes";
import { SITE } from "@/lib/site";

const STATIC = [
  "",
  "/shop",
  "/masterclass",
  "/events",
  "/recipes",
  "/about",
  "/trade",
  "/trade/ordering",
  "/trade/quick-reorder",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const url = (p: string) => `${SITE.url}${p}`;
  return [
    ...STATIC.map((p) => ({ url: url(p || "/"), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: url(`/collections/${c.handle}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: url(`/products/${p.handle}`),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [url(p.image.src)],
    })),
    ...getEntries().map((e) => ({ url: url(`/recipes/${e.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
