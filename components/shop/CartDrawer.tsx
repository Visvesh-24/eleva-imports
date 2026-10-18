"use client";

/**
 * Slide-out cart drawer. Focus-trapped, Esc to close, scroll-locked.
 * Checkout is a documented hand-off stub (no payment is faked): once the
 * Shopify Storefront cart is wired, `beginCheckout` redirects to
 * `cart.checkoutUrl`.
 */
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { EASE_EXPO } from "@/lib/motion";
import { getLenis } from "@/components/motion/SmoothScroll";

/**
 * Hook for the future Shopify checkout redirect. Returns false while no
 * checkout is connected so the drawer can explain instead of faking payment.
 */
function beginCheckout(): boolean {
  // TODO(shopify): create/update the Storefront cart, then
  // window.location.href = cart.checkoutUrl; return true;
  return false;
}

export function CartDrawer() {
  const { lines, open, subtotal, count } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("button, a")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.close();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a, button, input, [tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      prev?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Your cart">
          <motion.button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 cursor-default bg-ink-950/70 backdrop-blur-sm"
            onClick={cart.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
          />
          <motion.div
            ref={panel}
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col bg-ink-900 shadow-[-30px_0_80px_rgba(0,0,0,.6)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(70%_100%_at_70%_0%,rgb(227_162_74/0.14),transparent)]" />
            <div className="relative flex items-center justify-between border-b border-gold/15 px-7 py-6">
              <div>
                <p className="eyebrow">Your cart</p>
                <p className="mt-1 font-display text-2xl font-light text-bone">
                  {count} {count === 1 ? "bottle" : "items"}
                </p>
              </div>
              <button
                type="button"
                onClick={cart.close}
                aria-label="Close cart"
                className="grid size-11 place-items-center rounded-full text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] transition-colors hover:text-gold-soft"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto px-7 py-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl font-light italic text-bone">Your glass is empty.</p>
                  <p className="mt-3 max-w-xs text-sm text-mist">Start with a tasting trio, or let Adriana&rsquo;s picks guide you.</p>
                  <Link
                    href="/shop"
                    onClick={cart.close}
                    className="mt-8 rounded-pill bg-amber px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-950"
                  >
                    Explore the collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.variantId}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.5, ease: EASE_EXPO }}
                        className="flex gap-5 rounded-card bg-ink-850/80 p-4 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.12)]"
                      >
                        <Link
                          href={`/products/${l.handle}`}
                          onClick={cart.close}
                          className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl"
                          style={{ background: `radial-gradient(80% 60% at 50% 40%, ${l.accent}44, transparent 70%), #0b0a09` }}
                        >
                          <Image src={l.image} alt="" fill sizes="80px" className="object-contain p-2" unoptimized={l.image.endsWith(".svg")} />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="line-clamp-2 font-display text-lg leading-tight text-bone">{l.name}</p>
                              <p className="text-xs uppercase tracking-[0.18em] text-smoke">{l.variantTitle}</p>
                            </div>
                            <p className="shrink-0 text-sm text-parchment">{formatMoney({ ...l.price, amount: l.price.amount * l.quantity })}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <Qty value={l.quantity} onChange={(q) => cart.setQuantity(l.variantId, q)} label={l.name} />
                            <button
                              type="button"
                              onClick={() => cart.remove(l.variantId)}
                              className="link-underline text-xs uppercase tracking-[0.16em] text-smoke hover:text-bone"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="relative border-t border-gold/15 px-7 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.7rem] uppercase tracking-[0.26em] text-mist">Subtotal</span>
                  <span className="font-display text-3xl text-bone">{formatMoney(subtotal)}</span>
                </div>
                <p className="mt-2 text-xs text-smoke">Taxes and shipping calculated at checkout. Prices in CAD.</p>
                <button
                  type="button"
                  onClick={() => setPending(!beginCheckout())}
                  className="mt-6 h-13 w-full rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] py-4 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-ink-950 shadow-glow transition-shadow hover:shadow-glow-lg"
                >
                  Checkout
                </button>
                {pending && (
                  <p role="status" className="mt-4 rounded-xl bg-ink-850 px-4 py-3 text-center text-[0.8rem] text-parchment">
                    Secure checkout opens soon. Your cart is saved on this device, or{" "}
                    <Link href="/contact" onClick={cart.close} className="link-underline text-gold-soft">
                      order with Adriana directly
                    </Link>
                    .
                  </p>
                )}
                <p className="mt-3 text-center text-[0.68rem] text-smoke">Must be of legal drinking age in your province.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Qty({ value, onChange, label, size = "sm" }: { value: number; onChange: (v: number) => void; label: string; size?: "sm" | "lg" }) {
  const h = size === "lg" ? "h-13" : "h-9";
  const w = size === "lg" ? "w-12" : "w-9";
  return (
    <div className={`inline-flex ${h} items-center rounded-pill shadow-[inset_0_0_0_1px_rgb(201_164_106/0.3)]`}>
      <button type="button" aria-label={`Decrease quantity of ${label}`} onClick={() => onChange(value - 1)} className={`grid ${w} h-full place-items-center text-parchment hover:text-gold-soft`}>
        −
      </button>
      <span aria-live="polite" className="min-w-6 text-center text-sm tabular-nums text-bone">
        {value}
      </span>
      <button type="button" aria-label={`Increase quantity of ${label}`} onClick={() => onChange(value + 1)} className={`grid ${w} h-full place-items-center text-parchment hover:text-gold-soft`}>
        +
      </button>
    </div>
  );
}
