"use client";

/**
 * Recipes & resources browser: filter chips (with counts) over an animated
 * grid. The chosen filter is mirrored to ?type= so it can be shared.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import { EASE_EXPO } from "@/lib/motion";
import { KIND_LABEL, type Entry, type EntryKind } from "@/lib/recipes";
import { RecipeCard } from "./RecipeCard";

type Filter = "all" | EntryKind;
const ORDER: Filter[] = ["all", "cocktail", "neat", "pairing", "guide"];
const URL_KEY: Record<Filter, string> = { all: "", cocktail: "cocktails", neat: "neat", pairing: "pairing", guide: "guides" };

/** Filter from ?type= (server snapshot is "all", so hydration stays clean). */
function readUrlFilter(): Filter {
  const t = new URLSearchParams(window.location.search).get("type");
  return ORDER.find((f) => URL_KEY[f] === t) ?? "all";
}
function subscribeUrl(cb: () => void) {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
}

export function RecipesBrowser({ entries }: { entries: Entry[] }) {
  const urlFilter = useSyncExternalStore(subscribeUrl, readUrlFilter, () => "all" as Filter);
  const [chosen, setChosen] = useState<Filter | null>(null);
  const filter = chosen ?? urlFilter;
  const reduce = useReducedMotion();

  const choose = (f: Filter) => {
    setChosen(f);
    const url = new URL(window.location.href);
    if (URL_KEY[f]) url.searchParams.set("type", URL_KEY[f]);
    else url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
  };

  const shown = filter === "all" ? entries : entries.filter((e) => e.kind === filter);
  const count = (f: Filter) => (f === "all" ? entries.length : entries.filter((e) => e.kind === f).length);

  return (
    <div>
      <div role="toolbar" aria-label="Filter recipes and guides" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 [scrollbar-width:none]">
        {ORDER.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => choose(f)}
              className={`relative shrink-0 rounded-pill px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-[400ms] ${
                active ? "text-ink-950" : "text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] hover:text-bone"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="recipe-chip"
                  className="absolute inset-0 rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_50%,#c8783e_100%)]"
                  transition={{ duration: 0.6, ease: EASE_EXPO }}
                />
              )}
              <span className="relative">
                {f === "all" ? "Everything" : KIND_LABEL[f]} <span className={active ? "opacity-60" : "text-smoke"}>{count(f)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "entry" : "entries"}
      </p>

      <motion.ul layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((e) => (
            <motion.li
              key={e.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
            >
              <RecipeCard entry={e} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
