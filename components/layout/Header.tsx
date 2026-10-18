"use client";

/**
 * Site header: transparent over heroes, smoked glass once scrolled.
 * Desktop: Shop opens a mega menu (categories, edits, a featured bottle).
 * Mobile: a full-screen menu. The cart icon shows the live count and opens
 * the cart drawer; it's also the landing target of the bottle-drop animation.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { EASE_EXPO } from "@/lib/motion";
import { NAV, SITE } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

export interface MenuCollection {
  handle: string;
  title: string;
  eyebrow: string;
  kind: "category" | "edit";
}

export interface MenuFeature {
  handle: string;
  name: string;
  expression: string;
  image: string;
  accent: string;
}

export function Header({ collections, feature }: { collections: MenuCollection[]; feature: MenuFeature }) {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close menus on navigation (state adjusted during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMega(false);
    setMenu(false);
  }

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 160);
  };

  const categories = collections.filter((c) => c.kind === "category");
  const edits = collections.filter((c) => c.kind === "edit");
  const solid = scrolled || mega;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-[800ms] ease-expo ${
          solid ? "bg-ink-950/70 shadow-[0_1px_0_rgb(201_164_106/0.14)] backdrop-blur-md" : "bg-transparent"
        }`}
        onKeyDown={(e) => e.key === "Escape" && setMega(false)}
      >
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-gutter md:h-20">
          <Link href="/" className="group flex items-center gap-3" aria-label="Eleva Imports home">
            <Image
              src="/brand/logo-128.webp"
              alt=""
              width={128}
              height={128}
              className="size-9 transition-transform duration-[800ms] ease-expo group-hover:-translate-y-0.5 md:size-11"
              preload
            />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[1.35rem] font-medium tracking-[0.2em] text-rosegold">ELEVA</span>{" "}
              <span className="mt-1 text-[0.55rem] tracking-[0.62em] text-silver">IMPORTS</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((n) => {
                const active = pathname === n.href || pathname.startsWith(`${n.href}/`) || (n.href === "/shop" && (pathname.startsWith("/collections") || pathname.startsWith("/products")));
                const isShop = n.href === "/shop";
                return (
                  <li key={n.href} onMouseEnter={isShop ? openMega : undefined} onMouseLeave={isShop ? closeMega : undefined}>
                    <Link
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={isShop ? mega : undefined}
                      aria-haspopup={isShop ? "true" : undefined}
                      onFocus={isShop ? openMega : undefined}
                      className={`link-underline pb-1 text-[0.75rem] uppercase tracking-[0.22em] transition-colors duration-[400ms] hover:text-bone ${
                        active ? "text-gold-soft" : "text-parchment"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Adriana on Instagram"
              className="hidden size-10 place-items-center rounded-full text-parchment transition-colors hover:text-gold-soft sm:grid"
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
              </svg>
            </a>
            <button
              type="button"
              onClick={cart.open}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
              data-cart-icon
              className="relative grid size-10 place-items-center rounded-full text-parchment transition-colors hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8Z" />
                <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
              </svg>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EXPO }}
                    className="absolute -right-0.5 -top-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-amber px-1 text-[0.62rem] font-semibold leading-[1.15rem] text-ink-950"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menu}
              onClick={() => setMenu(true)}
              className="grid size-10 place-items-center rounded-full text-parchment lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M4 9h16M4 15h10" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="absolute inset-x-0 top-full hidden border-t border-gold/10 shadow-[0_40px_80px_rgba(0,0,0,.6)] lg:block"
              style={{ background: "radial-gradient(40% 80% at 85% 0%, rgb(227 162 74 / 0.08), transparent 70%), #0b0a09" }}
            >
              <div className="mx-auto grid max-w-[1800px] grid-cols-[1.4fr_0.8fr_0.9fr] gap-12 px-gutter py-12">
                <div>
                  <p className="eyebrow mb-6">The catalogue</p>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-3 xl:grid-cols-2">
                    {categories.map((c) => (
                      <li key={c.handle}>
                        <Link href={`/collections/${c.handle}`} className="group/l block">
                          <span className="font-display text-[1.45rem] font-light leading-tight text-bone transition-colors group-hover/l:text-gold-soft">
                            {c.title}
                          </span>
                          <span className="block text-[0.7rem] text-smoke">{c.eyebrow}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow mb-6">Shop by mood</p>
                  <ul className="space-y-3">
                    {edits.map((c) => (
                      <li key={c.handle}>
                        <Link href={`/collections/${c.handle}`} className="group/l block">
                          <span className="font-display text-[1.6rem] font-light italic text-parchment transition-colors group-hover/l:text-gold-soft">
                            {c.title}
                          </span>
                          <span className="block text-[0.7rem] text-smoke">{c.eyebrow}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-4">
                      <Link href="/shop" className="link-underline text-[0.72rem] uppercase tracking-[0.22em] text-gold-soft">
                        View all bottles →
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href={`/products/${feature.handle}`}
                  className="group/f relative overflow-hidden rounded-card p-8"
                  style={{ background: `radial-gradient(70% 60% at 60% 40%, ${feature.accent}33, transparent 70%), #11100e` }}
                >
                  <p className="eyebrow">Adriana&rsquo;s pick</p>
                  <p className="mt-3 max-w-[12rem] font-display text-3xl font-light text-bone">{feature.name}</p>
                  <p className="mt-1 text-sm text-mist">{feature.expression}</p>
                  <div className="absolute -bottom-6 right-4 h-[115%] w-[45%] transition-transform duration-[1200ms] ease-expo group-hover/f:-translate-y-3 group-hover/f:rotate-[-4deg]">
                    <Image src={feature.image} alt="" fill sizes="220px" className="object-contain object-bottom" />
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={menu} onClose={() => setMenu(false)} categories={categories} edits={edits} />
    </>
  );
}
