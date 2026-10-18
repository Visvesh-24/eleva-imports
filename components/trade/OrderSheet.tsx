"use client";

/**
 * Trade order sheet. Every product by the case, with steppers, live line
 * and order totals, delivery preference and notes. A table on desktop,
 * stacked cards on mobile, plus a sticky total bar on small screens.
 * `?venue=<id>` (from the back bar builder) pre-loads a lineup.
 */
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { submitForm } from "@/lib/forms";
import { formatMoney } from "@/lib/money";
import { EASE_EXPO } from "@/lib/motion";
import { DELIVERY_WINDOWS, VENUES, type TradeProduct } from "@/lib/trade";
import { Button } from "@/components/ui/Button";
import { CaseStepper, Field, Input, Select, Spinner, TextArea } from "./fields";

const cad = (amount: number) => formatMoney({ amount, currencyCode: "CAD" });

export function OrderSheet({ products }: { products: TradeProduct[] }) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState<string | null>(null);
  const [window_, setWindow] = useState<string>(DELIVERY_WINDOWS[0]);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Pre-load a lineup from the back bar builder (?venue=cocktail-bar).
  // Read after hydration (the server render has no query string) and apply on
  // the next frame so the initial paint matches the server HTML.
  useEffect(() => {
    const venue = VENUES.find((v) => v.id === new URLSearchParams(window.location.search).get("venue"));
    if (!venue) return;
    const raf = requestAnimationFrame(() => {
      setQty(Object.fromEntries(venue.lineup.map((l) => [l.handle, l.cases])));
      setLoaded(venue.label);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const lines = useMemo(() => products.filter((p) => (qty[p.handle] ?? 0) > 0), [products, qty]);
  const cases = lines.reduce((n, p) => n + qty[p.handle], 0);
  const subtotal = lines.reduce((n, p) => n + qty[p.handle] * p.casePrice, 0);
  const set = (h: string, v: number) => setQty((q) => ({ ...q, [h]: v }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cases) return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) {
      setEmailError("Please enter a valid email so we can confirm your order.");
      e.currentTarget.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }
    setEmailError(null);
    setState("sending");
    await submitForm("trade-order", {
      ...data,
      lines: lines.map((p) => ({ handle: p.handle, cases: qty[p.handle], casePrice: p.casePrice })),
      subtotal,
    });
    setState("done");
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (state === "done") {
    return (
      <motion.div
        ref={summaryRef}
        role="status"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_EXPO }}
        className="mx-auto max-w-2xl rounded-[1.6rem] bg-ink-900/85 p-8 text-center shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] md:p-14"
      >
        <svg viewBox="0 0 64 64" className="mx-auto size-16 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
          <circle cx="32" cy="32" r="30" strokeDasharray="190" strokeDashoffset="190" style={{ animation: "draw 1.4s var(--ease-expo) forwards" }} />
          <path d="M20 33l8 8 16-18" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "draw 1s var(--ease-expo) 0.6s forwards" }} />
        </svg>
        <p className="mt-6 font-display text-[2.4rem] font-light text-bone">Order request received.</p>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-mist">
          {cases} {cases === 1 ? "case" : "cases"} · {cad(subtotal)} ex. HST. We&rsquo;ll confirm availability, delivery and your invoice by email.
        </p>
        <ul className="mx-auto mt-8 max-w-md divide-y divide-gold/12 text-left text-[0.9rem]">
          {lines.map((p) => (
            <li key={p.handle} className="flex justify-between gap-4 py-3">
              <span className="text-parchment">
                {qty[p.handle]} × {p.name}
              </span>
              <span className="tabular-nums text-mist">{cad(qty[p.handle] * p.casePrice)}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            setQty({});
            setState("idle");
          }}
          className="link-underline mt-8 text-[0.72rem] uppercase tracking-[0.22em] text-gold-soft"
        >
          Start a new order
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Trade order sheet" className="grid gap-10 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_27rem]">
      <div>
        <AnimatePresence>
          {loaded && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center justify-between gap-4 rounded-pill bg-[rgb(227_162_74/0.1)] px-5 py-3 text-[0.82rem] text-parchment shadow-[inset_0_0_0_1px_rgb(227_162_74/0.3)]"
              role="status"
            >
              <span>
                Loaded the <span className="text-gold-soft">{loaded}</span> lineup. Adjust anything you like.
              </span>
              <button type="button" onClick={() => setLoaded(null)} aria-label="Dismiss" className="text-gold">
                ×
              </button>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Desktop table */}
        <table className="hidden w-full border-separate border-spacing-y-2 md:table">
          <caption className="sr-only">Trade catalogue by the case, prices in CAD excluding HST</caption>
          <thead>
            <tr className="text-left text-[0.62rem] uppercase tracking-[0.26em] text-smoke">
              <th scope="col" className="pb-3 pl-4 font-normal">
                Product
              </th>
              <th scope="col" className="pb-3 font-normal">
                Case
              </th>
              <th scope="col" className="pb-3 text-right font-normal">
                Per case
              </th>
              <th scope="col" className="pb-3 text-center font-normal">
                Cases
              </th>
              <th scope="col" className="pb-3 pr-4 text-right font-normal">
                Line total
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const q = qty[p.handle] ?? 0;
              return (
                <tr
                  key={p.handle}
                  className={`group/r transition-colors duration-[400ms] [&>td]:bg-ink-900/70 [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl ${q ? "[&>td]:bg-ink-800" : ""}`}
                  style={{ "--accent": p.accent } as CSSProperties}
                >
                  <td className="py-3 pl-3">
                    <div className="flex items-center gap-4">
                      <Thumb p={p} />
                      <div>
                        <p className="font-display text-[1.3rem] font-light leading-tight text-bone">{p.name}</p>
                        <p className="text-[0.78rem] text-smoke">
                          {p.expression} · {p.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-[0.85rem] text-mist">{p.caseLabel}</td>
                  <td className="py-3 text-right text-[0.9rem] tabular-nums text-parchment">
                    {cad(p.casePrice)}
                    <span className="block text-[0.7rem] text-smoke">{cad(p.unitPrice)} / unit</span>
                  </td>
                  <td className="py-3 text-center">
                    <CaseStepper value={q} onChange={(v) => set(p.handle, v)} label={p.name} />
                  </td>
                  <td className={`py-3 pr-5 text-right text-[0.95rem] tabular-nums ${q ? "text-bone" : "text-smoke"}`}>{q ? cad(q * p.casePrice) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile cards */}
        <ul className="space-y-3 md:hidden" aria-label="Trade catalogue by the case">
          {products.map((p) => {
            const q = qty[p.handle] ?? 0;
            return (
              <li
                key={p.handle}
                className={`rounded-2xl p-4 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] transition-colors ${q ? "bg-ink-800" : "bg-ink-900/70"}`}
                style={{ "--accent": p.accent } as CSSProperties}
              >
                <div className="flex gap-4">
                  <Thumb p={p} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1.25rem] font-light leading-tight text-bone">{p.name}</p>
                    <p className="text-[0.75rem] text-smoke">{p.caseLabel}</p>
                    <p className="mt-1 text-[0.88rem] tabular-nums text-parchment">{cad(p.casePrice)} / case</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <CaseStepper value={q} onChange={(v) => set(p.handle, v)} label={p.name} />
                  <span className={`text-[0.95rem] tabular-nums ${q ? "text-bone" : "text-smoke"}`}>{q ? cad(q * p.casePrice) : "—"}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-[0.75rem] leading-relaxed text-smoke">
          Trade prices are per case in CAD and exclude HST. They are subject to provincial liquor regulations.
          {/* TODO(client): confirm LCBO / provincial agency ordering rules and final licensee pricing. */}
        </p>
      </div>

      {/* Summary + details */}
      <div ref={summaryRef} className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-ink-900/90 p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] md:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.2),transparent)]" />
          <p className="eyebrow relative">Order summary</p>
          <div className="relative mt-4 flex items-baseline justify-between">
            <span className="text-[0.85rem] text-mist">
              {lines.length} {lines.length === 1 ? "product" : "products"} · {cases} {cases === 1 ? "case" : "cases"}
            </span>
          </div>
          <p className="relative mt-2 font-display text-[2.8rem] font-light leading-none tabular-nums text-bone" aria-live="polite">
            {cad(subtotal)}
          </p>
          <p className="relative mt-1 text-[0.72rem] text-smoke">Subtotal, excluding HST and delivery</p>

          <div className="relative mt-8 grid gap-6">
            <Field label="Venue / account">
              <Input name="venue" autoComplete="organization" placeholder="Venue name or account number" />
            </Field>
            <Field label="Email for confirmation">
              <Input
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "os-email-err" : undefined}
              />
              {emailError && (
                <span id="os-email-err" role="alert" className="mt-2 block text-[0.75rem] text-[#f0a090]">
                  {emailError}
                </span>
              )}
            </Field>
            <Field label="Delivery window">
              <Select name="window" value={window_} onChange={(e) => setWindow(e.target.value)}>
                {DELIVERY_WINDOWS.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </Select>
            </Field>
            {window_ === "Specific date" && (
              <Field label="Preferred date">
                <Input name="date" type="date" className="[color-scheme:dark]" />
              </Field>
            )}
            <Field label="Notes (optional)">
              <TextArea name="notes" placeholder="Receiving hours, loading dock, substitutions…" />
            </Field>
          </div>

          <div className="relative mt-8 [&>span]:!flex">
            <Button type="submit" className={`w-full ${cases ? "" : "pointer-events-none opacity-40"}`}>
              {state === "sending" ? (
                <>
                  <Spinner /> Sending order
                </>
              ) : (
                "Submit order request"
              )}
            </Button>
            {!cases && <p className="mt-3 text-center text-[0.75rem] text-smoke">Add at least one case to submit.</p>}
          </div>
        </div>
      </div>

      {/* Mobile sticky total */}
      <AnimatePresence>
        {cases > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="fixed bottom-5 left-3 right-[5.75rem] z-[60] flex items-center justify-between gap-4 rounded-pill bg-ink-900/95 py-2 pl-6 pr-2 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35),0_20px_50px_-10px_rgb(0_0_0/0.9)] backdrop-blur-md lg:hidden"
          >
            <span className="text-[0.85rem] text-parchment">
              {cases} {cases === 1 ? "case" : "cases"} · <span className="tabular-nums text-bone">{cad(subtotal)}</span>
            </span>
            <button
              type="button"
              onClick={() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink-950"
            >
              Review
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Thumb({ p }: { p: TradeProduct }) {
  return (
    <span
      className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-xl"
      style={{ background: "radial-gradient(80% 60% at 50% 45%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 72%), #0b0a09" }}
    >
      <Image src={p.image.src} alt="" fill sizes="64px" className="object-contain p-1.5" unoptimized={p.image.src.endsWith(".svg")} />
    </span>
  );
}
