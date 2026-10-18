/**
 * Home page editorial sections (server components; interactive bits are
 * client children): Meet Adriana, Masterclass banner, Trade, Recipes teaser.
 */
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Portrait } from "@/lib/adriana";
import type { Product } from "@/lib/catalog-types";
import { AgaveArt, BackdropWord, CircularText, GoldDust, LightRays, OrbitRings, WaveLines } from "@/components/art/Art";
import { PortraitFrame } from "@/components/editorial/PortraitFrame";
import { ClipReveal, Reveal, RevealLines } from "@/components/motion/Reveal";
import { Arrow, Button } from "@/components/ui/Button";

const GOLD = { "--accent": "#c9a46a", "--glow": "#e2c99b", "--deep": "#1c1308" } as CSSProperties;

// ---------------------------------------------------------------------------
export function MeetAdriana({ portrait }: { portrait: Portrait }) {
  return (
    <section className="relative overflow-hidden py-section" style={GOLD} aria-labelledby="adriana-title">
      <BackdropWord word="Maestra" className="absolute inset-x-0 top-[12%] opacity-50" />
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-16 px-gutter lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <ClipReveal className="relative mx-auto w-full max-w-[520px]">
          <PortraitFrame portrait={portrait} sizes="(max-width: 1024px) 90vw, 40vw" />
          <CircularText text="Canada’s only Certified Tequila Master · " className="absolute -right-6 -top-10 md:-right-14" size={150} />
        </ClipReveal>
        <div>
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" /> Meet the master
            </p>
          </Reveal>
          <RevealLines
            lines={["Adriana", <em key="m" className="text-gold-soft">Martinez</em>]}
            className="font-display text-display-lg font-light text-bone"
          />
          <h2 id="adriana-title" className="sr-only">
            Meet Adriana Martinez
          </h2>
          {/* TODO(client): replace with Adriana's approved bio. */}
          <Reveal delay={0.15}>
            <p className="mt-8 font-display text-[1.6rem] font-light leading-snug text-parchment md:text-[1.9rem]">
              Canada&rsquo;s only Certified Tequila Master, and the palate behind every bottle on this site.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-6 max-w-[36rem] space-y-4 text-[1rem] leading-relaxed text-mist">
              <p>
                Adriana trained in Jalisco, among the agave fields, distilleries and barrel rooms where tequila is made, and earned the
                certification few people in the world hold. She founded Eleva Imports to bring Canadians the kind of tequila she drinks
                herself: additive-free, 100% blue agave, made by people who take their time.
              </p>
              <p>Today she teaches masterclasses, builds agave programs for restaurants and bars, and chooses every bottle by taste alone.</p>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-gold/15 pt-8">
              {[
                ["1", "Certified Tequila Master in Canada"],
                ["100%", "Blue agave, additive-free"],
                ["0", "Shortcuts on the shelf"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-[2.6rem] font-light leading-none text-gold-soft">{n}</dd>
                  <dd className="mt-2 text-[0.72rem] leading-snug text-smoke">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.45}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/about">
                Her story <Arrow />
              </Button>
              <Button href="/masterclass" variant="ghost">
                Taste with Adriana
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function MasterclassBanner({ bottle }: { bottle: Product }) {
  return (
    <section className="relative px-gutter py-12" aria-labelledby="mc-title">
      <div
        className="relative mx-auto min-h-[78svh] max-w-[1800px] overflow-hidden rounded-[2rem] shadow-[inset_0_0_0_1px_rgb(201_164_106/0.18)]"
        style={{ "--accent": "#e39a52", "--glow": "#f5c48c", "--deep": "#28160a" } as CSSProperties}
      >
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_70%_50%,rgb(227_154_82/0.28),transparent_70%),linear-gradient(120deg,#1a0f07,#0b0a09_70%)]" />
        <LightRays className="absolute inset-0" />
        <GoldDust count={34} seed={77} />
        <OrbitRings className="absolute right-[-10%] top-1/2 w-[min(900px,110vw)] -translate-y-1/2 opacity-60 md:right-[2%]" />

        <div className="relative grid min-h-[78svh] items-center gap-10 p-8 md:p-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Masterclasses &amp; events</p>
            </Reveal>
            <RevealLines
              lines={["Taste with", <em key="m" className="text-[var(--glow)]">a master.</em>]}
              className="font-display text-display-xl font-light text-bone"
            />
            <h2 id="mc-title" className="sr-only">
              Book a tequila masterclass
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[32rem] text-[1.05rem] leading-relaxed text-parchment/90">
                Private tastings at home, corporate evenings and agave dinners. Adriana guides you from field to glass, and you&rsquo;ll
                never order tequila the same way again.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/masterclass#book">
                  Book your experience <Arrow />
                </Button>
                <Button href="/events" variant="ghost">
                  Upcoming events
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="relative mx-auto h-[46svh] w-full max-w-[520px]">
            <div className="relative size-full [animation:float-y_7s_var(--ease-silk)_infinite]">
              <Image src={bottle.image.src} alt={bottle.image.alt} fill sizes="(max-width: 1024px) 80vw, 36vw" className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.6)]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function TradeSection() {
  const points: [string, string][] = [
    ["Curated back bar", "Well blanco to statement añejo, chosen for your menu and margins."],
    ["Staff training", "Adriana teaches your team to taste, describe and sell agave."],
    ["Cocktail development", "Signature serves built around additive-free tequila."],
    ["Quick reorder", "Your usual cases, in two taps."],
  ];
  return (
    <section className="relative overflow-hidden border-y border-gold/10 bg-[#080706] py-section" style={GOLD} aria-labelledby="trade-title">
      <WaveLines className="absolute inset-x-0 bottom-0 h-1/2 opacity-50" />
      <AgaveArt className="absolute -left-20 top-10 w-[min(640px,90vw)] opacity-20" seed={33} />
      <div className="relative mx-auto grid max-w-[1800px] gap-16 px-gutter lg:grid-cols-[1fr_1fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" /> For restaurants &amp; bars
            </p>
          </Reveal>
          <RevealLines
            lines={["Build your", <em key="a" className="text-gold-soft">agave program.</em>]}
            className="font-display text-display-lg font-light text-bone"
          />
          <h2 id="trade-title" className="sr-only">
            Trade program for restaurants and bars
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[34rem] text-[1.05rem] leading-relaxed text-mist">
              Guests are asking what&rsquo;s in their tequila. Give your team the answer, and a back bar of honest agave that earns its
              place on the menu.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/trade">
                Trade program <Arrow />
              </Button>
              <Button href="/trade/ordering" variant="ghost">
                Trade ordering
              </Button>
              <Link href="/trade/quick-reorder" className="link-underline self-center text-[0.72rem] uppercase tracking-[0.22em] text-gold-soft">
                Quick reorder →
              </Link>
            </div>
          </Reveal>
        </div>
        <ol className="grid gap-px self-center overflow-hidden rounded-card bg-gold/12 sm:grid-cols-2">
          {points.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 0.08} className="group bg-[#0b0a09] p-8 transition-colors duration-[800ms] hover:bg-ink-900">
              <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-6 font-display text-[1.7rem] font-light text-bone transition-colors group-hover:text-gold-soft">{t}</p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-mist">{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export interface TeaserRecipe {
  href: string;
  title: string;
  kicker: string;
  blurb: string;
  accent: string;
  glow: string;
  art: ReactNode;
}

export function RecipesTeaser({ recipes }: { recipes: TeaserRecipe[] }) {
  return (
    <section className="relative py-section" aria-labelledby="recipes-title">
      <div className="mx-auto max-w-[1800px] px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gold/70" /> Recipes &amp; resources
              </p>
            </Reveal>
            <RevealLines lines={["Shake it", <em key="h" className="text-gold-soft">honestly.</em>]} className="font-display text-display-lg font-light text-bone" />
            <h2 id="recipes-title" className="sr-only">
              Tequila cocktail recipes
            </h2>
          </div>
          <Reveal delay={0.2}>
            <Link href="/recipes" className="link-underline text-[0.72rem] uppercase tracking-[0.24em] text-gold-soft">
              All recipes &amp; guides →
            </Link>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {recipes.map((r, i) => (
            <Reveal key={r.href} delay={i * 0.1}>
              <Link
                href={r.href}
                className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.6rem] p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] md:p-12"
                style={{ "--accent": r.accent, "--glow": r.glow } as CSSProperties}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-80 transition-opacity duration-[1200ms] group-hover:opacity-100"
                  style={{ background: "radial-gradient(60% 60% at 70% 35%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%), #0f0e0c" }}
                />
                <div aria-hidden className="absolute right-6 top-6 h-[70%] w-[46%] transition-transform duration-[1400ms] ease-expo group-hover:-translate-y-3 group-hover:rotate-[-4deg]">
                  {r.art}
                </div>
                <div className="relative max-w-[60%]">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-[var(--glow)]">{r.kicker}</p>
                  <h3 className="mt-3 font-display text-[clamp(2.2rem,1.6rem+1.8vw,3.4rem)] font-light leading-none text-bone">{r.title}</h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-mist">{r.blurb}</p>
                  <span className="mt-6 inline-block text-[0.68rem] uppercase tracking-[0.24em] text-bone">
                    Get the recipe <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
