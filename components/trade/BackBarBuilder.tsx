"use client";

/**
 * Interactive back bar builder: pick a venue type and the recommended
 * lineup re-deals itself (well, signature, sipping, statement) with a
 * suggested opening order and live trade total, which can be loaded
 * straight into the order sheet.
 */
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { formatMoney } from "@/lib/money";
import { EASE_EXPO } from "@/lib/motion";
import { VENUES, type TradeProduct, type VenueType } from "@/lib/trade";
import { Arrow, Button } from "@/components/ui/Button";
import { OrbitRings } from "@/components/art/Art";

function VenueIcon({ id }: { id: VenueType }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="size-6" {...p}>
      {id === "cocktail-bar" && <path d="M6 7h20L16 18v8M11 27h10M10 11h12" />}
      {id === "fine-dining" && <path d="M5 23h22M7 23a9 9 0 0 1 18 0M16 12v2M14 11h4M9 27h14" />}
      {id === "hotel" && <path d="M7 27V7h18v20M5 27h22M12 12h2M18 12h2M12 17h2M18 17h2M14 27v-5h4v5" />}
      {id === "restaurant" && <path d="M10 5v9a3 3 0 0 0 6 0V5M13 5v22M22 5c-2 2-3 5-3 9h3v13" />}
    </svg>
  );
}

export function BackBarBuilder({ products }: { products: TradeProduct[] }) {
  const [venue, setVenue] = useState<VenueType>("cocktail-bar");
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = VENUES.find((v) => v.id === venue)!;
  const byHandle = (h: string) => products.find((p) => p.handle === h);
  const slots = current.lineup.flatMap((s) => {
    const p = byHandle(s.handle);
    return p ? [{ ...s, product: p }] : [];
  });
  const totalCases = slots.reduce((n, s) => n + s.cases, 0);
  const total = slots.reduce((n, s) => n + s.cases * s.product.casePrice, 0);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = VENUES.findIndex((v) => v.id === venue);
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % VENUES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + VENUES.length) % VENUES.length;
    else return;
    e.preventDefault();
    setVenue(VENUES[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <div className="relative">
      <OrbitRings className="pointer-events-none absolute -right-[20%] -top-[30%] w-[min(900px,110vw)] opacity-50" />

      {/* Venue picker */}
      <div role="radiogroup" aria-label="Venue type" onKeyDown={onKey} className="relative grid grid-cols-2 gap-3 lg:grid-cols-4">
        {VENUES.map((v, i) => {
          const on = v.id === venue;
          return (
            <button
              key={v.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setVenue(v.id)}
              className={`group/v relative overflow-hidden rounded-card p-5 text-left transition-[box-shadow,background-color] duration-[600ms] ease-expo md:p-6 ${
                on
                  ? "bg-ink-800 shadow-[inset_0_0_0_1px_rgb(226_201_155/0.7),0_20px_60px_-25px_rgb(227_162_74/0.6)]"
                  : "bg-ink-900/70 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.16)] hover:shadow-[inset_0_0_0_1px_rgb(201_164_106/0.45)]"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="venue-glow"
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(80%_90%_at_0%_0%,rgb(227_162_74/0.22),transparent_70%)]"
                  transition={{ duration: 0.7, ease: EASE_EXPO }}
                />
              )}
              <span className={`relative flex items-center gap-3 ${on ? "text-gold-soft" : "text-gold/70"}`}>
                <VenueIcon id={v.id} />
                <span className="font-display text-[1.45rem] font-light text-bone md:text-[1.65rem]">{v.label}</span>
              </span>
              <span className="relative mt-2 hidden text-[0.82rem] leading-snug text-mist sm:block">{v.blurb}</span>
            </button>
          );
        })}
      </div>

      {/* Lineup */}
      <div className="relative mt-10" aria-live="polite">
        <p className="sr-only">
          Recommended lineup for a {current.label.toLowerCase()}: {slots.map((s) => `${s.role}, ${s.product.name}`).join("; ")}.
        </p>
        <motion.ul layout className="grid gap-4 [perspective:1200px] sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {slots.map((s, i) => (
              <motion.li
                key={`${venue}-${s.role}`}
                layout
                initial={reduce ? false : { opacity: 0, y: 40, rotateX: -12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24, transition: { duration: 0.3 } }}
                transition={{ duration: 0.9, ease: EASE_EXPO, delay: reduce ? 0 : i * 0.07 }}
                className="group/s relative flex flex-col overflow-hidden rounded-card bg-ink-900 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)]"
                style={{ "--accent": s.product.accent, "--glow": s.product.glow } as CSSProperties}
              >
                <div className="relative h-56 overflow-hidden md:h-64">
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-[800ms] group-hover/s:opacity-100 md:opacity-80"
                    style={{
                      background:
                        "radial-gradient(60% 55% at 50% 45%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 72%), linear-gradient(180deg, #14120f, #0b0a09)",
                    }}
                  />
                  <span className="absolute left-4 top-4 z-10 font-display text-[2.4rem] font-light leading-none text-outline [--outline:color-mix(in_srgb,var(--accent)_60%,transparent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-[22%] bottom-3 top-6 transition-transform duration-[1200ms] ease-expo group-hover/s:-translate-y-2 group-hover/s:scale-[1.04]">
                    <Image
                      src={s.product.image.src}
                      alt={s.product.image.alt}
                      fill
                      sizes="(max-width: 640px) 60vw, 22vw"
                      className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,.6)]"
                      unoptimized={s.product.image.src.endsWith(".svg")}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--glow)]">{s.role}</p>
                  <p className="mt-2 font-display text-[1.45rem] font-light leading-tight text-bone">{s.product.name}</p>
                  <p className="text-[0.8rem] text-smoke">{s.product.expression}</p>
                  <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-mist">{s.why}</p>
                  <div className="mt-5 flex items-end justify-between border-t border-gold/12 pt-4 text-[0.8rem]">
                    <span className="text-parchment">
                      <span className="font-display text-[1.4rem] text-bone">{s.cases}</span> {s.cases === 1 ? "case" : "cases"}
                      <span className="block text-[0.7rem] text-smoke">{s.product.caseLabel}</span>
                    </span>
                    <span className="text-right tabular-nums text-parchment">{formatMoney({ amount: s.cases * s.product.casePrice, currencyCode: "CAD" })}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Summary */}
        <div className="mt-6 flex flex-col gap-6 rounded-card bg-[linear-gradient(110deg,rgb(227_162_74/0.12),rgb(28_25_22/0.6)_45%)] p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-mist">Suggested opening order</p>
              <p className="mt-1 font-display text-[2rem] font-light text-bone">
                {totalCases} cases <span className="text-[1rem] italic text-gold-soft">· {current.label}</span>
              </p>
            </div>
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-mist">Estimated trade total</p>
              <p className="mt-1 font-display text-[2rem] font-light tabular-nums text-bone">
                {formatMoney({ amount: total, currencyCode: "CAD" })} <span className="text-[0.8rem] not-italic text-smoke">ex. HST</span>
              </p>
            </div>
          </div>
          <Button href={`/trade/ordering?venue=${venue}`}>
            Load into order sheet <Arrow />
          </Button>
        </div>
        <p className="mt-3 text-[0.72rem] text-smoke">Sample lineup and pricing for planning only. Your account manager will tailor the final program.</p>
      </div>
    </div>
  );
}
