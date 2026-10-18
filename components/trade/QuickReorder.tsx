"use client";

/**
 * Quick reorder. Look up a trade account, see the last order, reorder it in
 * one tap or tweak quantities first.
 *
 * MOCK: there are no trade accounts or order history yet, so any lookup
 * returns the sample order in lib/trade.ts (labelled as a sample in the UI).
 * TODO(shopify): replace `lookup` with Shopify customer-account auth (or B2B
 * company location) and the customer's most recent order; submit as a draft
 * order / B2B order instead of the form stub.
 */
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties, type FormEvent } from "react";
import { submitForm } from "@/lib/forms";
import { formatMoney } from "@/lib/money";
import { EASE_EXPO } from "@/lib/motion";
import { MOCK_LAST_ORDER, type TradeProduct } from "@/lib/trade";
import { Button } from "@/components/ui/Button";
import { CaseStepper, Field, Input, Spinner } from "./fields";

const cad = (amount: number) => formatMoney({ amount, currencyCode: "CAD" });

type Stage = "lookup" | "looking" | "order" | "sending" | "done";

export function QuickReorder({ products }: { products: TradeProduct[] }) {
  const [stage, setStage] = useState<Stage>("lookup");
  const [account, setAccount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});

  const lines = MOCK_LAST_ORDER.lines.flatMap((l) => {
    const p = products.find((x) => x.handle === l.handle);
    return p ? [{ product: p, last: l.cases }] : [];
  });
  const cases = lines.reduce((n, l) => n + (qty[l.product.handle] ?? 0), 0);
  const total = lines.reduce((n, l) => n + (qty[l.product.handle] ?? 0) * l.product.casePrice, 0);
  const changed = lines.some((l) => (qty[l.product.handle] ?? 0) !== l.last);

  const lookup = async (e: FormEvent) => {
    e.preventDefault();
    if (!account.trim()) {
      setError("Enter your trade account number or the email on your account.");
      return;
    }
    setError(null);
    setStage("looking");
    // Simulated lookup (see TODO above).
    await new Promise((r) => setTimeout(r, 900));
    setQty(Object.fromEntries(MOCK_LAST_ORDER.lines.map((l) => [l.handle, l.cases])));
    setStage("order");
  };

  const reorder = async () => {
    if (!cases) return;
    setStage("sending");
    await submitForm("quick-reorder", {
      account,
      basedOn: MOCK_LAST_ORDER.reference,
      lines: lines.map((l) => ({ handle: l.product.handle, cases: qty[l.product.handle] ?? 0 })),
      total,
    });
    setStage("done");
  };

  return (
    <div className="relative mx-auto max-w-4xl">
      <AnimatePresence mode="wait" initial={false}>
        {(stage === "lookup" || stage === "looking") && (
          <motion.form
            key="lookup"
            onSubmit={lookup}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
            className="relative overflow-hidden rounded-[1.6rem] bg-ink-900/85 p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] sm:p-10 md:p-14"
            aria-label="Find your trade account"
          >
            <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.18),transparent)]" />
            <p className="eyebrow relative">Step 1 · Find your account</p>
            <p className="relative mt-4 max-w-xl font-display text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] font-light leading-tight text-bone">
              Your last order, ready to pour again.
            </p>
            <div className="relative mt-10 flex flex-col gap-6 sm:flex-row sm:items-end">
              <Field label="Trade account number or email" className="flex-1">
                <Input
                  name="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  autoComplete="email"
                  placeholder="e.g. ELV-T-1042 or orders@yourvenue.ca"
                  aria-invalid={!!error}
                  aria-describedby={error ? "qr-err" : "qr-hint"}
                />
              </Field>
              <Button type="submit">
                {stage === "looking" ? (
                  <>
                    <Spinner /> Finding
                  </>
                ) : (
                  "Find my last order"
                )}
              </Button>
            </div>
            {error ? (
              <p id="qr-err" role="alert" className="relative mt-3 text-[0.78rem] text-[#f0a090]">
                {error}
              </p>
            ) : (
              <p id="qr-hint" className="relative mt-3 text-[0.75rem] text-smoke">
                Preview: account sign-in arrives with the Shopify trade portal. For now this shows a sample order.
              </p>
            )}
          </motion.form>
        )}

        {(stage === "order" || stage === "sending") && (
          <motion.div
            key="order"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
            className="relative overflow-hidden rounded-[1.6rem] bg-ink-900/85 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)]"
          >
            <div className="flex flex-col gap-4 border-b border-gold/15 p-6 sm:flex-row sm:items-end sm:justify-between md:p-10">
              <div>
                <p className="eyebrow">Step 2 · Your last order</p>
                <p className="mt-3 font-display text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] font-light leading-tight text-bone">{MOCK_LAST_ORDER.venue}</p>
                <p className="mt-1 text-[0.8rem] text-smoke">
                  {MOCK_LAST_ORDER.placed} · Ref. {MOCK_LAST_ORDER.reference}
                </p>
              </div>
              <span className="w-max rounded-pill bg-[rgb(227_162_74/0.12)] px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.24em] text-gold-soft shadow-[inset_0_0_0_1px_rgb(227_162_74/0.35)]">
                Sample data
              </span>
            </div>

            <ul className="divide-y divide-gold/10">
              {lines.map((l, i) => {
                const q = qty[l.product.handle] ?? 0;
                return (
                  <motion.li
                    key={l.product.handle}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.1 + i * 0.07 }}
                    className="grid grid-cols-[4rem_1fr] items-center gap-x-4 gap-y-3 px-6 py-5 sm:grid-cols-[4.5rem_1fr_auto_7rem] md:px-10"
                    style={{ "--accent": l.product.accent } as CSSProperties}
                  >
                    <span
                      className="relative row-span-2 block h-20 w-16 overflow-hidden rounded-xl sm:row-span-1"
                      style={{ background: "radial-gradient(80% 60% at 50% 45%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 72%), #0b0a09" }}
                    >
                      <Image src={l.product.image.src} alt="" fill sizes="64px" className="object-contain p-1.5" unoptimized={l.product.image.src.endsWith(".svg")} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-[1.3rem] font-light text-bone">{l.product.name}</p>
                      <p className="text-[0.75rem] text-smoke">
                        {l.product.caseLabel} · last time {l.last} {l.last === 1 ? "case" : "cases"}
                      </p>
                    </div>
                    <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:contents">
                      <CaseStepper value={q} onChange={(v) => setQty((s) => ({ ...s, [l.product.handle]: v }))} label={l.product.name} />
                      <span className={`text-right text-[0.95rem] tabular-nums ${q ? "text-bone" : "text-smoke"}`}>{q ? cad(q * l.product.casePrice) : "—"}</span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-5 border-t border-gold/15 bg-[linear-gradient(110deg,rgb(227_162_74/0.1),transparent_60%)] p-6 sm:flex-row sm:items-center sm:justify-between md:p-10">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-mist">
                  {cases} {cases === 1 ? "case" : "cases"} · ex. HST
                </p>
                <p className="mt-1 font-display text-[2.4rem] font-light leading-none tabular-nums text-bone" aria-live="polite">
                  {cad(total)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {changed && (
                  <button
                    type="button"
                    onClick={() => setQty(Object.fromEntries(MOCK_LAST_ORDER.lines.map((l) => [l.handle, l.cases])))}
                    className="link-underline text-[0.7rem] uppercase tracking-[0.2em] text-mist hover:text-bone"
                  >
                    Reset to last order
                  </button>
                )}
                <Button onClick={reorder} className={cases ? "" : "pointer-events-none opacity-40"}>
                  {stage === "sending" ? (
                    <>
                      <Spinner /> Sending
                    </>
                  ) : changed ? (
                    "Send updated order"
                  ) : (
                    "Reorder the same"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_EXPO }}
            className="rounded-[1.6rem] bg-ink-900/85 p-8 text-center shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] md:p-14"
          >
            <svg viewBox="0 0 64 64" className="mx-auto size-16 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <path d="M52 22a22 22 0 0 0-40-6M12 42a22 22 0 0 0 40 6" strokeDasharray="80" strokeDashoffset="80" style={{ animation: "draw 1.2s var(--ease-expo) forwards" }} />
              <path d="M12 6v10h10M52 58V48H42" strokeDasharray="30" strokeDashoffset="30" style={{ animation: "draw 0.8s var(--ease-expo) 0.6s forwards" }} />
            </svg>
            <p className="mt-6 font-display text-[2.4rem] font-light text-bone">Reorder sent.</p>
            <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-mist">
              {cases} {cases === 1 ? "case" : "cases"} · {cad(total)} ex. HST. We&rsquo;ll confirm delivery by email.
            </p>
            <button type="button" onClick={() => setStage("lookup")} className="link-underline mt-8 text-[0.72rem] uppercase tracking-[0.22em] text-gold-soft">
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
