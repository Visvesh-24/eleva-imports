"use client";

/**
 * Ingredient list with a servings stepper that rescales every quantity.
 * Also offers a "copy list" shortcut for shopping.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE_EXPO } from "@/lib/motion";
import { formatQty, type Ingredient } from "@/lib/recipes";

const MAX = 12;

export function ServingsScaler({ ingredients, glassName }: { ingredients: Ingredient[]; glassName: string }) {
  const [servings, setServings] = useState(1);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ingredients
      .map((i) => [formatQty(i, servings), i.item, i.note ? `(${i.note})` : ""].filter(Boolean).join(" "))
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-card bg-ink-900/90 p-7 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_28%,transparent)] md:p-9">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_100%_at_80%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent)]" />
      <div className="relative flex items-center justify-between gap-4">
        <h2 className="font-display text-[1.9rem] font-light text-bone">Ingredients</h2>
        <div className="flex items-center gap-3">
          <span id="servings-label" className="hidden text-[0.62rem] uppercase tracking-[0.24em] text-smoke sm:inline">
            Serves
          </span>
          <div role="group" aria-labelledby="servings-label" className="inline-flex h-10 items-center rounded-pill shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
            <button
              type="button"
              aria-label="Fewer servings"
              disabled={servings <= 1}
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="grid h-full w-10 place-items-center text-parchment transition-colors hover:text-[var(--glow)] disabled:opacity-30"
            >
              −
            </button>
            <span className="relative min-w-7 overflow-hidden text-center tabular-nums text-bone" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={servings}
                  className="inline-block"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_EXPO }}
                >
                  {servings}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              aria-label="More servings"
              disabled={servings >= MAX}
              onClick={() => setServings((s) => Math.min(MAX, s + 1))}
              className="grid h-full w-10 place-items-center text-parchment transition-colors hover:text-[var(--glow)] disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <ul className="relative mt-7 divide-y divide-gold/10">
        {ingredients.map((ing) => {
          const q = formatQty(ing, servings);
          return (
            <li key={ing.item} className="flex items-baseline gap-5 py-4">
              <span className="w-24 shrink-0 font-display text-[1.35rem] tabular-nums text-[var(--glow)]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={q ?? "–"}
                    className="inline-block"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE_EXPO }}
                  >
                    {q ?? "·"}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-[0.98rem] leading-snug text-parchment">
                {ing.item}
                {ing.note && <span className="block text-[0.8rem] text-smoke">{ing.note}</span>}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gold/10 pt-6">
        <p className="text-[0.78rem] text-smoke">
          Glass: <span className="text-parchment">{glassName}</span>
        </p>
        <button type="button" onClick={copy} className="link-underline text-[0.68rem] uppercase tracking-[0.2em] text-[var(--accent)]">
          {copied ? "Copied ✓" : "Copy shopping list"}
        </button>
      </div>
    </div>
  );
}
