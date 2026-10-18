"use client";

/**
 * Site header: transparent over the hero, gains a smoked-glass backdrop once
 * the page scrolls. Nav targets are the routes in PLAN.md (built after the
 * hero review).
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-[800ms] ease-expo ${
        scrolled ? "bg-ink-950/55 shadow-[0_1px_0_rgb(201_164_106/0.14)] backdrop-blur-md" : "bg-transparent"
      }`}
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
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="link-underline pb-1 text-[0.75rem] uppercase tracking-[0.22em] text-parchment transition-colors duration-[400ms] hover:text-bone"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Adriana on Instagram"
            className="grid size-10 place-items-center rounded-full text-parchment transition-colors hover:text-gold-soft"
          >
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
            </svg>
          </a>
          <button
            type="button"
            aria-label="Open cart"
            className="relative grid size-10 place-items-center rounded-full text-parchment transition-colors hover:text-gold-soft"
          >
            <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8Z" />
              <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-full text-parchment lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M4 9h16M4 15h10" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
