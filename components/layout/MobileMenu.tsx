"use client";

/**
 * Full-screen mobile menu: big serif links that rise in, the catalogue as a
 * disclosure list, and contact shortcuts. Focus-trapped; Esc closes.
 */
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_EXPO } from "@/lib/motion";
import { NAV, SITE } from "@/lib/site";
import { AgaveArt } from "@/components/art/Art";
import { getLenis } from "@/components/motion/SmoothScroll";
import type { MenuCollection } from "./Header";

export function MobileMenu({
  open,
  onClose,
  categories,
  edits,
}: {
  open: boolean;
  onClose: () => void;
  categories: MenuCollection[];
  edits: MenuCollection[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>("button, a")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("a, button");
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
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          className="fixed inset-0 z-[75] overflow-y-auto bg-ink-950 lg:hidden"
          style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as React.CSSProperties}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
        >
          <AgaveArt className="pointer-events-none absolute -bottom-10 left-1/2 w-[140%] -translate-x-1/2 opacity-30" seed={13} />
          <div className="relative flex min-h-full flex-col px-gutter pb-10 pt-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)]"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-10">
              <ul className="space-y-1">
                {NAV.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.15 + i * 0.05 }}
                  >
                    {n.href === "/shop" ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={shopOpen}
                          onClick={() => setShopOpen((v) => !v)}
                          className="flex w-full items-center justify-between py-2 font-display text-[2.6rem] font-light text-bone"
                        >
                          Shop
                          <span aria-hidden className={`text-2xl text-gold transition-transform duration-500 ${shopOpen ? "rotate-45" : ""}`}>
                            +
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {shopOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: EASE_EXPO }}
                              className="overflow-hidden border-l border-gold/25 pl-5"
                            >
                              <li>
                                <Link href="/shop" onClick={onClose} className="block py-2 text-[0.95rem] text-gold-soft">
                                  All bottles
                                </Link>
                              </li>
                              {[...categories, ...edits].map((c) => (
                                <li key={c.handle}>
                                  <Link href={`/collections/${c.handle}`} onClick={onClose} className="block py-2 text-[0.95rem] text-parchment">
                                    {c.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={n.href} onClick={onClose} className="block py-2 font-display text-[2.6rem] font-light text-bone">
                        {n.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
                <motion.li initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.5 }}>
                  <Link href="/contact" onClick={onClose} className="block py-2 font-display text-[2.6rem] font-light italic text-gold-soft">
                    Contact
                  </Link>
                </motion.li>
              </ul>
            </nav>

            <div className="mt-auto flex flex-wrap gap-3 pt-12">
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="rounded-pill px-5 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)]">
                WhatsApp
              </a>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="rounded-pill px-5 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)]">
                Instagram
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
