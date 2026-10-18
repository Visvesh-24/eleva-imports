/**
 * The ONLY module UI code imports catalogue data from.
 *
 * Every function is async on purpose: today it reads the mock catalogue in
 * ./catalog-data.ts, tomorrow it can call the Shopify Storefront API without
 * any component changes (see README → "Shopify migration path").
 */
import { COLLECTIONS, PRODUCTS } from "./catalog-data";
import type { Collection, CollectionKind, Product } from "./catalog-types";

export type { Collection, Money, Product, ProductType } from "./catalog-types";

const byRank = (a: Product, b: Product) => a.rank - b.rank;

export async function getProducts(): Promise<Product[]> {
  return [...PRODUCTS].sort(byRank);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.handle === handle);
}

export async function getCollections(kind?: CollectionKind): Promise<Collection[]> {
  return COLLECTIONS.filter((c) => !kind || c.kind === kind);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  return COLLECTIONS.find((c) => c.handle === handle);
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.collections.includes(handle)).sort(byRank);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.featured).sort(byRank);
}

/** Same category first, then shared collections, then everything else. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const score = (p: Product) =>
    (p.category === product.category ? 10 : 0) + p.collections.filter((c) => product.collections.includes(c)).length;
  return PRODUCTS.filter((p) => p.handle !== product.handle)
    .sort((a, b) => score(b) - score(a) || a.rank - b.rank)
    .slice(0, limit);
}

export { formatMoney, minPrice, priceLabel } from "./money";
