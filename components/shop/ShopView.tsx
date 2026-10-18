"use client";

/**
 * Catalogue browser used by /shop and /collections/[handle].
 * - Category chips are real links (each collection is its own URL / page).
 * - Type, size and price filters + sort are local, mirrored to the query
 *   string, and the grid re-flows with shared-layout animations.
 */
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog-types";
import { minPrice } from "@/lib/money";
import { EASE_EXPO } from "@/lib/motion";
import { ProductCard } from "./ProductCard";

export interface ChipCollection {
  handle: string;
  title: string;
  kind: "category" | "edit";
}

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const PRICE_BUCKETS = [
  { id: "u50", label: "Under $50", test: (c: number) => c < 5000 },
  { id: "50-100", label: "$50 – $100", test: (c: number) => c >= 5000 && c < 10000 },
  { id: "100-150", label: "$100 – $150", test: (c: number) => c >= 10000 && c < 15000 },
  { id: "150p", label: "$150 +", test: (c: number) => c >= 15000 },
] as const;

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Adriana’s order" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A–Z" },
];

function sizeLabel(ml?: number, title?: string) {
  if (!ml) return title === "Set of 2" || title === "Single" ? "Glassware" : title ?? "Other";
  if (ml === 300) return "Tasting set";
  return `${ml} ml`;
}

export function ShopView({
  products,
  chips,
  activeHandle,
}: {
  products: Product[];
  chips: ChipCollection[];
  activeHandle: string | null;
}) {
  const [types, setTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [panel, setPanel] = useState(false);

  // Restore filters from the URL on first mount.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const list = (k: string) => q.get(k)?.split(",").filter(Boolean) ?? [];
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from the URL */
    setTypes(list("type"));
    setSizes(list("size"));
    setPrices(list("price"));
    const s = q.get("sort") as SortKey | null;
    if (s && SORTS.some((x) => x.id === s)) setSort(s);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Mirror filters into the URL (shareable, back-button friendly).
  useEffect(() => {
    const q = new URLSearchParams();
    if (types.length) q.set("type", types.join(","));
    if (sizes.length) q.set("size", sizes.join(","));
    if (prices.length) q.set("price", prices.join(","));
    if (sort !== "featured") q.set("sort", sort);
    const qs = q.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [types, sizes, prices, sort]);

  const facets = useMemo(() => {
    const t = new Map<string, number>();
    const s = new Map<string, number>();
    for (const p of products) {
      t.set(p.type, (t.get(p.type) ?? 0) + 1);
      const seen = new Set<string>();
      for (const v of p.variants) seen.add(sizeLabel(v.sizeMl, v.title));
      seen.forEach((k) => s.set(k, (s.get(k) ?? 0) + 1));
    }
    return { types: [...t.entries()], sizes: [...s.entries()].sort((a, b) => parseInt(a[0]) - parseInt(b[0])) };
  }, [products]);

  const visible = useMemo(() => {
    const out = products.filter((p) => {
      if (types.length && !types.includes(p.type)) return false;
      if (sizes.length && !p.variants.some((v) => sizes.includes(sizeLabel(v.sizeMl, v.title)))) return false;
      if (prices.length && !p.variants.some((v) => prices.some((id) => PRICE_BUCKETS.find((b) => b.id === id)?.test(v.price.amount)))) return false;
      return true;
    });
    const sorted = [...out];
    if (sort === "price-asc") sorted.sort((a, b) => minPrice(a).amount - minPrice(b).amount);
    if (sort === "price-desc") sorted.sort((a, b) => minPrice(b).amount - minPrice(a).amount);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, types, sizes, prices, sort]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const activeCount = types.length + sizes.length + prices.length;
  const clear = () => {
    setTypes([]);
    setSizes([]);
    setPrices([]);
  };

  const categories = chips.filter((c) => c.kind === "category");
  const edits = chips.filter((c) => c.kind === "edit");

  return (
    <section aria-labelledby="shop-products-title" className="relative mx-auto max-w-[1800px] px-gutter pb-section pt-12 md:pt-16">
      <h2 id="shop-products-title" className="sr-only">
        Products
      </h2>
      {/* Collection chips */}
      <nav aria-label="Collections" className="-mx-gutter overflow-x-auto px-gutter [scrollbar-width:none]" data-lenis-prevent>
        <ul className="flex w-max items-center gap-2 pb-2">
          <ChipLink href="/shop" active={activeHandle === null} label="All bottles" />
          {categories.map((c) => (
            <ChipLink key={c.handle} href={`/collections/${c.handle}`} active={activeHandle === c.handle} label={c.title} />
          ))}
          <li aria-hidden className="mx-2 h-6 w-px bg-gold/25" />
          {edits.map((c) => (
            <ChipLink key={c.handle} href={`/collections/${c.handle}`} active={activeHandle === c.handle} label={c.title} italic />
          ))}
        </ul>
      </nav>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-gutter mt-6 flex items-center justify-between gap-4 border-y border-gold/12 bg-ink-950/80 px-gutter py-3 backdrop-blur-md md:top-20">
        <p className="whitespace-nowrap text-[0.72rem] uppercase tracking-[0.24em] text-mist" aria-live="polite">
          <span className="text-bone">{visible.length}</span> {visible.length === 1 ? "bottle" : "bottles"}
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-expanded={panel}
            aria-controls="shop-filters"
            onClick={() => setPanel((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-pill px-3 text-[0.68rem] uppercase tracking-[0.16em] text-parchment sm:px-4 sm:tracking-[0.2em] shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] transition-colors hover:text-bone"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="10" cy="17" r="2" />
            </svg>
            <span className="max-sm:sr-only">Refine</span>
            {activeCount > 0 && <span className="text-gold-soft">({activeCount})</span>}
          </button>
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 max-w-[44vw] appearance-none truncate rounded-pill bg-transparent pl-3 pr-8 text-[0.68rem] uppercase tracking-[0.14em] text-parchment sm:max-w-none sm:pl-4 sm:pr-9 sm:tracking-[0.2em] shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] focus:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--color-gold-soft)]"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id} className="bg-ink-900 normal-case tracking-normal">
                  {s.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gold">⌄</span>
          </label>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence initial={false}>
        {panel && (
          <motion.div
            id="shop-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-b border-gold/12 py-8 sm:grid-cols-3">
              <FilterGroup title="Type" options={facets.types} selected={types} onToggle={(v) => toggle(types, setTypes, v)} />
              <FilterGroup title="Size" options={facets.sizes} selected={sizes} onToggle={(v) => toggle(sizes, setSizes, v)} />
              <FilterGroup
                title="Price"
                options={PRICE_BUCKETS.map((b) => [b.id, products.filter((p) => p.variants.some((v) => b.test(v.price.amount))).length] as [string, number])}
                labels={Object.fromEntries(PRICE_BUCKETS.map((b) => [b.id, b.label]))}
                selected={prices}
                onToggle={(v) => toggle(prices, setPrices, v)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[...types, ...sizes].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => (types.includes(v) ? toggle(types, setTypes, v) : toggle(sizes, setSizes, v))}
              className="rounded-pill bg-ink-850 px-3 py-1.5 text-[0.72rem] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] hover:text-bone"
              aria-label={`Remove filter ${v}`}
            >
              {v} ×
            </button>
          ))}
          {prices.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggle(prices, setPrices, id)}
              className="rounded-pill bg-ink-850 px-3 py-1.5 text-[0.72rem] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] hover:text-bone"
              aria-label={`Remove price filter ${PRICE_BUCKETS.find((b) => b.id === id)?.label}`}
            >
              {PRICE_BUCKETS.find((b) => b.id === id)?.label} ×
            </button>
          ))}
          <button type="button" onClick={clear} className="link-underline ml-2 text-[0.7rem] uppercase tracking-[0.2em] text-gold-soft">
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      <LayoutGroup>
        <motion.ul layout className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                key={p.handle}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.35 } }}
                transition={{ duration: 0.9, ease: EASE_EXPO, delay: Math.min(i, 8) * 0.05 }}
              >
                <ProductCard product={p} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {visible.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-display text-4xl font-light italic text-bone">Nothing poured here, yet.</p>
          <p className="mt-3 text-mist">Try loosening a filter, or ask Adriana for a recommendation.</p>
          <button type="button" onClick={clear} className="mt-8 rounded-pill bg-amber px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-950">
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

function ChipLink({ href, active, label, italic = false }: { href: string; active: boolean; label: string; italic?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-current={active ? "page" : undefined}
        className={`relative block whitespace-nowrap rounded-pill px-4 py-2.5 text-[0.82rem] transition-colors duration-[400ms] ${
          italic ? "font-display text-[1.02rem] italic" : ""
        } ${active ? "text-ink-950" : "text-parchment hover:text-bone"}`}
      >
        {active && (
          <motion.span
            layoutId="chip-active"
            className="absolute inset-0 rounded-pill bg-[linear-gradient(135deg,#f0be7a,#e3a24a_50%,#c8783e)]"
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          />
        )}
        {!active && <span aria-hidden className="absolute inset-0 rounded-pill shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)]" />}
        <span className="relative">{label}</span>
      </Link>
    </li>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  labels,
}: {
  title: string;
  options: [string, number][];
  selected: string[];
  onToggle: (v: string) => void;
  labels?: Record<string, string>;
}) {
  return (
    <fieldset>
      <legend className="mb-4 text-[0.65rem] uppercase tracking-[0.3em] text-gold">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, count]) => {
          const on = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              disabled={count === 0 && !on}
              onClick={() => onToggle(value)}
              className={`rounded-pill px-3.5 py-2 text-[0.8rem] transition-all duration-[400ms] disabled:opacity-35 ${
                on ? "bg-gold-soft text-ink-950" : "text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.3)] hover:text-bone"
              }`}
            >
              {labels?.[value] ?? value} <span className={on ? "text-ink-700" : "text-smoke"}>{count}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
