/**
 * /trade: "Build your agave program" for restaurants, bars and hotels.
 */
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getPortrait } from "@/lib/adriana";
import { getProducts } from "@/lib/products";
import { buildTradeProducts, PILLARS, TIERS, WHY_ADDITIVE_FREE } from "@/lib/trade";
import { BackdropWord, CircularText, GoldDust, OrbitRings, WaveLines } from "@/components/art/Art";
import { PageHero, SectionHeading, type PageTheme } from "@/components/editorial/PageHero";
import { PortraitFrame } from "@/components/editorial/PortraitFrame";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { BackBarBuilder } from "@/components/trade/BackBarBuilder";
import { PillarIcon } from "@/components/trade/PillarIcon";
import { TradeApplicationForm } from "@/components/trade/TradeApplicationForm";
import { TradeFaq } from "@/components/trade/TradeFaq";
import { TradeSubnav } from "@/components/trade/TradeSubnav";
import { Arrow, Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Trade: Build your agave program",
  description:
    "Additive-free tequila for restaurants, bars and hotels in Canada. A curated back bar, staff training with Canada's only Certified Tequila Master, menu development, priority allocation and quick reorder.",
  alternates: { canonical: "/trade" },
};

const THEME: PageTheme = { accent: "#d48358", glow: "#f8c898", deep: "#1f0f08" };

export default async function TradePage() {
  const products = buildTradeProducts(await getProducts());
  const portrait = getPortrait("barrels");

  return (
    <div style={{ "--accent": THEME.accent, "--glow": THEME.glow, "--deep": THEME.deep } as CSSProperties}>
      <PageHero
        eyebrow="For restaurants, bars & hotels"
        lines={[
          "Build your",
          <em key="a" className="bg-[linear-gradient(100deg,#f8c898_0%,#e3a24a_45%,#d48358_100%)] bg-clip-text pr-[0.08em] italic text-transparent">
            agave program.
          </em>,
        ]}
        intro={
          <p>
            A back bar of verified additive-free tequila, a team that can sell it, and a partner who stocks it. Built with Adriana Martinez, Canada&rsquo;s only Certified Tequila Master.
          </p>
        }
        motif="rings"
        theme={THEME}
        aside={
          <div className="relative mx-auto max-w-[26rem] lg:ml-auto">
            <PortraitFrame portrait={portrait} priority caption="Adriana Martinez · Certified Tequila Master" sizes="(max-width: 1024px) 80vw, 30vw" />
            <div className="absolute -left-10 -top-10 hidden rounded-full bg-ink-950/60 backdrop-blur-sm sm:block">
              <CircularText text="Trade program · Staff training · Allocation · " size={150} />
            </div>
          </div>
        }
      >
        <Button href="#apply">
          Apply for a trade account <Arrow />
        </Button>
        <Button href="/trade/ordering" variant="ghost">
          Trade ordering
        </Button>
      </PageHero>
      <TradeSubnav current="/trade" />

      {/* Why additive-free sells */}
      <section className="relative overflow-hidden py-section">
        <BackdropWord word="Additive-free" className="absolute inset-x-0 top-10 opacity-60" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <SectionHeading
            eyebrow="Why it sells"
            lines={["Guests can taste", <em key="b" className="text-gold-soft">the difference.</em>]}
            intro="The tequila boom brought a lot of flavoured, sweetened bottles. Your guests are learning to tell, and they reward the bars that already can."
          />
          <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-14">
            {WHY_ADDITIVE_FREE.map((w, i) => (
              <Reveal key={w.n} delay={i * 0.12} className="relative border-t border-gold/20 pt-8">
                <span className="text-outline block font-display text-[clamp(4rem,7vw,6.5rem)] font-light leading-none [--outline:rgb(212_131_88/0.55)]">
                  {w.n}
                </span>
                <h3 className="mt-6 font-display text-[1.8rem] font-light leading-tight text-bone">{w.title}</h3>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-mist">{w.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Program pillars */}
      <section className="relative overflow-x-clip bg-ink-900/40 py-section">
        <div className="hairline absolute inset-x-0 top-0" />
        <GoldDust count={16} seed={31} />
        <div className="relative mx-auto grid max-w-[1800px] gap-16 px-gutter lg:grid-cols-[0.9fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="The program"
              lines={["Five things we do", <em key="c" className="text-gold-soft">behind your bar.</em>]}
              intro="One partner for the bottles, the training and the menu, so your agave list earns its place on the back bar."
            />
            <div className="relative mt-12 hidden aspect-square w-[min(22rem,80%)] lg:block">
              <OrbitRings className="absolute inset-0" />
              <span className="absolute inset-0 grid place-items-center font-display text-[5rem] font-light italic text-gold-soft/80">5</span>
            </div>
          </div>
          <ol className="space-y-4">
            {PILLARS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06}>
                <div className="group/p relative flex gap-6 overflow-hidden rounded-card bg-ink-900/80 p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] transition-[box-shadow,transform] duration-[800ms] ease-expo hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(248_200_152/0.5),0_30px_70px_-30px_rgb(212_131_88/0.5)] md:gap-10 md:p-10">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-[800ms] group-hover/p:opacity-100"
                    style={{ background: "radial-gradient(60% 120% at 0% 50%, rgb(212 131 88 / 0.16), transparent 70%)" }}
                  />
                  <div className="relative flex shrink-0 flex-col items-center gap-3">
                    <span className="grid size-16 place-items-center rounded-full text-gold-soft shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] transition-transform duration-[800ms] ease-expo group-hover/p:rotate-[-8deg] group-hover/p:scale-110 md:size-20">
                      <PillarIcon kind={p.icon} className="size-8 md:size-10" />
                    </span>
                    <span className="font-display text-[0.9rem] text-gold">0{i + 1}</span>
                  </div>
                  <div className="relative">
                    <h3 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.2rem)] font-light leading-tight text-bone">{p.title}</h3>
                    <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-mist">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Back bar builder */}
      <section id="builder" className="relative overflow-hidden py-section">
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Back bar builder"
              lines={["Pick your room.", <em key="d" className="text-gold-soft">We&rsquo;ll pour the lineup.</em>]}
              intro="Choose your venue type to see the lineup Adriana would start you with: each bottle's role, the opening order and an estimated trade total."
            />
          </div>
          <BackBarBuilder products={products} />
        </div>
      </section>

      {/* Tiers */}
      <section className="relative overflow-hidden py-section">
        <div className="hairline absolute inset-x-0 top-0" />
        <WaveLines className="absolute inset-x-0 bottom-0 h-[40%] opacity-70" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <SectionHeading
            align="center"
            eyebrow="Trade tiers"
            lines={["Grow the program", <em key="e" className="text-gold-soft">as you pour more.</em>]}
            intro="Every account gets trade pricing by the case. Volume unlocks deeper pricing and more of Adriana's time."
          />
          <div className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div
                  className={`relative h-full overflow-hidden rounded-[1.6rem] p-8 md:p-10 ${
                    t.highlight
                      ? "bg-[linear-gradient(160deg,rgb(212_131_88/0.28),rgb(28_25_22/0.95)_55%)] shadow-[inset_0_0_0_1px_rgb(248_200_152/0.55),0_40px_100px_-40px_rgb(212_131_88/0.7)] md:-translate-y-4"
                      : "bg-ink-900/85 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.18)]"
                  }`}
                >
                  {t.highlight && (
                    <>
                      <OrbitRings className="pointer-events-none absolute -right-28 -top-28 w-80 opacity-70" />
                      <span className="relative mb-6 inline-block rounded-pill bg-rosegold px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-ink-950">
                        Most venues start here
                      </span>
                    </>
                  )}
                  <p className="relative text-[0.65rem] uppercase tracking-[0.3em] text-gold">{t.volume}</p>
                  <h3 className="relative mt-3 font-display text-[2.2rem] font-light text-bone">{t.name}</h3>
                  <p className="relative mt-2 text-[0.95rem] italic text-rosegold">{t.discount}</p>
                  <ul className="relative mt-8 space-y-3 border-t border-gold/15 pt-6">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[0.92rem] text-parchment">
                        <svg viewBox="0 0 16 16" className="mt-1 size-3.5 shrink-0 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                          <path d="M3 8.5l3 3 7-7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[0.75rem] text-smoke">
            Tier thresholds and discounts are indicative and confirmed when your account is set up.
            {/* TODO(client): confirm tier thresholds, discounts and benefits. */}
          </p>
        </div>
      </section>

      {/* Partner stories: placeholder until real venues sign off. */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-[1800px] px-gutter">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-ink-900/70 px-6 py-16 text-center shadow-[inset_0_0_0_1px_rgb(201_164_106/0.16)] md:px-16 md:py-24">
              {/* TODO(client): replace with real partner venues and quotes (with permission). */}
              <span aria-hidden className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 font-display text-[14rem] leading-none text-gold/10">
                &ldquo;
              </span>
              <p className="eyebrow relative">Partner stories</p>
              <RevealLines
                as="p"
                className="relative mx-auto mt-6 max-w-4xl font-display text-[clamp(1.8rem,1.2rem+2.4vw,3.4rem)] font-light italic leading-[1.1] text-bone"
                lines={["Your venue here.", "Your agave story, next."]}
              />
              <p className="relative mx-auto mt-6 max-w-lg text-[0.95rem] text-mist">
                We&rsquo;ll feature the restaurants, bars and hotels building their agave programs with Adriana. Partner stories are coming soon.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-section">
        <div className="mx-auto grid max-w-[1800px] gap-12 px-gutter lg:grid-cols-[0.8fr_1.4fr]">
          <SectionHeading eyebrow="Questions" lines={["Before you", <em key="f" className="text-gold-soft">open an account.</em>]} />
          <Reveal>
            <TradeFaq />
          </Reveal>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="relative scroll-mt-24 overflow-hidden py-section">
        <div className="hairline absolute inset-x-0 top-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(50% 60% at 80% 40%, rgb(212 131 88 / 0.14), transparent 70%)" }}
        />
        <GoldDust count={20} seed={44} />
        <div className="relative mx-auto grid max-w-[1800px] gap-14 px-gutter lg:grid-cols-[0.9fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow="Apply"
              lines={["Let\u2019s build", <em key="g" className="text-gold-soft">your back bar.</em>]}
              intro="Tell us about your venue. We'll set up trade pricing, book a tasting with your team and send a recommended opening order."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <QuickLink href="/trade/ordering" n="02" title="Trade ordering" body="Order by the case from the full catalogue." />
              <QuickLink href="/trade/quick-reorder" n="03" title="Quick reorder" body="Repeat your last order in a tap." />
            </div>
          </div>
          <Reveal delay={0.1}>
            <TradeApplicationForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function QuickLink({ href, n, title, body }: { href: string; n: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group/q relative flex items-center justify-between gap-6 overflow-hidden rounded-card bg-ink-900/80 p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.18)] transition-shadow duration-[600ms] hover:shadow-[inset_0_0_0_1px_rgb(248_200_152/0.6)]"
    >
      <span>
        <span className="font-display text-[0.9rem] text-gold">{n}</span>
        <span className="mt-1 block font-display text-[1.6rem] font-light text-bone">{title}</span>
        <span className="mt-1 block text-[0.85rem] text-mist">{body}</span>
      </span>
      <span className="grid size-11 shrink-0 place-items-center rounded-full text-gold-soft shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-transform duration-[600ms] ease-expo group-hover/q:translate-x-1 group-hover/q:bg-gold-soft group-hover/q:text-ink-950">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
