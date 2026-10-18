/** Money helpers (en-CA, CAD). Client-safe: no catalogue data imported. */
import type { Money, Product } from "./catalog-types";

const formatter = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export function formatMoney(m: Money): string {
  return formatter.format(m.amount / 100);
}

/** Lowest variant price (for cards and sorting). */
export function minPrice(p: Product): Money {
  return p.variants.reduce((lo, v) => (v.price.amount < lo.amount ? v.price : lo), p.variants[0].price);
}

export function priceLabel(p: Product): string {
  const lo = minPrice(p);
  const hasRange = p.variants.some((v) => v.price.amount !== lo.amount);
  return `${hasRange ? "From " : ""}${formatMoney(lo)}`;
}
