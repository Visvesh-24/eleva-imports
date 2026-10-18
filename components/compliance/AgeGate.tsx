"use client";

/**
 * Full-screen age gate. Server-rendered visible; hidden before paint for
 * verified visitors (html[data-age="ok"], see lib/age.ts). The visitor picks
 * their province, sees its legal age, and confirms. "Not yet" leaves the site.
 */
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { isAgeVerified, markAgeVerified, PROVINCES } from "@/lib/age";
import { EASE_EXPO } from "@/lib/motion";
import { AgaveArt, GoldDust, OrbitRings } from "@/components/art/Art";
import { getLenis } from "@/components/motion/SmoothScroll";

const EXIT_URL = "https://www.ccsa.ca/canadas-guidance-alcohol-and-health";

export function AgeGate() {
  const [visible, setVisible] = useState(true);
  const [province, setProvince] = useState("ON");
  const dialog = useRef<HTMLDivElement>(null);
  const age = PROVINCES.find((p) => p.code === province)?.age ?? 19;

  useEffect(() => {
    // Verified visitors never see the gate (hidden by CSS before paint).
    if (isAgeVerified()) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>("select")?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const confirm = () => {
    markAgeVerified();
    setVisible(false);
    document.documentElement.style.overflow = "";
    getLenis()?.start();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="age-gate"
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink-950 px-gutter py-10"
          style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as React.CSSProperties}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE_EXPO }}
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_42%,rgb(227_162_74/0.16),transparent_70%)]" />
          <OrbitRings className="absolute left-1/2 top-1/2 w-[min(860px,130vw)] -translate-x-1/2 -translate-y-1/2 opacity-60" />
          <AgaveArt className="absolute bottom-0 left-1/2 w-[min(1000px,140vw)] -translate-x-1/2 opacity-40" seed={17} />
          <GoldDust count={30} seed={5} />

          <div className="relative w-full max-w-[34rem] text-center">
            <Image src="/brand/logo-256.webp" alt="Eleva Imports" width={256} height={256} className="mx-auto size-24 md:size-28" preload />
            <p className="eyebrow mt-8">Canada&rsquo;s only Certified Tequila Master</p>
            <h2 id="age-title" className="mt-4 font-display text-[clamp(2.4rem,1.6rem+3vw,3.8rem)] font-light leading-[1.02] text-bone">
              Before we pour,
              <br />
              <em className="text-gold-soft">are you of age?</em>
            </h2>

            <div className="mx-auto mt-9 max-w-sm">
              <label htmlFor="age-province" className="block text-[0.65rem] uppercase tracking-[0.3em] text-mist">
                Your province or territory
              </label>
              <div className="relative mt-3">
                <select
                  id="age-province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="h-12 w-full appearance-none rounded-pill bg-ink-900 px-6 text-center text-[0.95rem] text-bone shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] focus:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--color-gold-soft)]"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gold">⌄</span>
              </div>
              <p className="mt-3 text-[0.8rem] text-smoke" aria-live="polite">
                The legal drinking age here is <span className="text-parchment">{age}</span>.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirm}
                className="h-12 rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] px-8 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink-950 shadow-glow transition-shadow hover:shadow-glow-lg"
              >
                Yes, I&rsquo;m {age} or older
              </button>
              <a
                href={EXIT_URL}
                className="h-12 rounded-pill px-8 text-[0.75rem] uppercase leading-[3rem] tracking-[0.16em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] hover:text-bone"
              >
                Not yet
              </a>
            </div>
            <p className="mx-auto mt-8 max-w-sm text-[0.72rem] leading-relaxed text-smoke">
              By entering you confirm you are of legal drinking age in your province. Please enjoy responsibly. We remember your answer on this device.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
