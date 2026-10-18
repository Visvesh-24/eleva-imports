import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AgaveArt, BackdropWord, GoldDust, OrbitRings, TalaveraRosette, WaveLines } from "@/components/art/Art";
import { Counter } from "@/components/content/Counter";
import { PillarIcon, type PillarIconName } from "@/components/content/PillarIcon";
import { Timeline, type Milestone } from "@/components/content/Timeline";
import { PageHero, SectionHeading } from "@/components/editorial/PageHero";
import { PortraitFrame } from "@/components/editorial/PortraitFrame";
import { ClipReveal, Reveal, RevealLines } from "@/components/motion/Reveal";
import { Arrow, Button } from "@/components/ui/Button";
import { getPortrait } from "@/lib/adriana";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Adriana Martinez",
  description:
    "Meet Adriana Martinez, Canada's only Certified Tequila Master and founder of Eleva Imports, bringing additive-free, 100% blue agave tequila from small Mexican producers to Toronto.",
  alternates: { canonical: "/about" },
};

// TODO(client): every figure below is placeholder until Adriana confirms it.
const NUMBERS = [
  { to: 1, label: "Certified Tequila Master in Canada", suffix: "" },
  { to: 100, label: "Blue agave in every tequila we import", suffix: "%" },
  { to: 40, label: "Distilleries visited in Jalisco", suffix: "+" }, // MOCK
  { to: 2000, label: "Guests taught at tastings & masterclasses", suffix: "+" }, // MOCK
];

const PILLARS: { icon: PillarIconName; title: string; body: string }[] = [
  {
    icon: "drop",
    title: "Additive-free, always",
    body: "No caramel, no glycerin, no sugar syrup, no oak extract. If a tequila needs help to taste good, it doesn't make it onto our shelf.",
  },
  {
    icon: "house",
    title: "Small producers",
    body: "Family distilleries with patient methods: mature agave, slow cooking, honest stills. We know the people behind every bottle.",
  },
  {
    icon: "book",
    title: "Education first",
    body: "A great bottle is only half of it. We teach people to taste, so every pour that follows becomes richer.",
  },
  {
    icon: "glasses",
    title: "Hospitality",
    body: "From a single gift to a full restaurant program, we treat every order the way Adriana would welcome you to her table.",
  },
];

// TODO(client): replace with Adriana's real milestones and years.
const MILESTONES: Milestone[] = [
  {
    when: "The beginning",
    title: "A first real sip in Jalisco",
    body: "A glass of tequila poured by a jimador's family changed everything. It tasted of earth, citrus and fire, nothing like the shots back home.",
  },
  {
    when: "The training",
    title: "Becoming a Certified Tequila Master",
    body: "Years of study, tastings and distillery visits led to certification, and made Adriana the only Certified Tequila Master in Canada.",
  },
  {
    when: "The idea",
    title: "Eleva Imports is founded in Toronto",
    body: "Frustrated by shelves full of additive-sweetened tequila, Adriana began importing small-batch, additive-free bottles she'd personally vetted.",
  },
  {
    when: "The classroom",
    title: "The first masterclass",
    body: "A dozen curious guests and three glasses. Today, private tastings and masterclasses run across the city.",
  },
  {
    when: "Today",
    title: "Building agave programs across Canada",
    body: "Restaurants and bars now work with Eleva to build honest tequila lists, train their teams and pour with confidence.",
  },
];

const LOOKS_FOR = [
  "Agave harvested at full maturity, never rushed",
  "Slow cooking in stone ovens or gentle autoclaves",
  "Nothing added after distillation, verified",
  "A family who'd pour it for their own table",
];

export default function AboutPage() {
  const agave = getPortrait("agave");
  const cellar = getPortrait("cellar");
  const barrels = getPortrait("barrels");

  return (
    <>
      <PageHero
        eyebrow="Founder · Canada's only Certified Tequila Master"
        lines={["Adriana", <em key="e" className="text-gold-soft">Martinez.</em>]}
        intro={
          <p>
            {/* TODO(client): confirm bio wording. */}
            Sommelier of agave, teacher by instinct and the founder of Eleva Imports. Adriana brings the tequila she loves in Jalisco
            to tables across Canada, with nothing added and nothing to hide.
          </p>
        }
        motif="agave"
        aside={
          <div className="relative mx-auto w-full max-w-[28rem]">
            <OrbitRings className="absolute left-1/2 top-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <PortraitFrame portrait={agave} priority sizes="(max-width: 1024px) 90vw, 28rem" caption="Jalisco · among the blue agave" />
          </div>
        }
      >
        <Button href="/masterclass">
          Taste with Adriana <Arrow />
        </Button>
        <Button href="/shop" variant="ghost">
          Shop her picks
        </Button>
      </PageHero>

      {/* Story */}
      <section className="relative overflow-hidden py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <div className="mx-auto grid max-w-[1600px] items-start gap-16 px-gutter lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="The story" lines={["A love letter", <em key="e" className="text-gold-soft">to agave.</em>]} />
            {/* TODO(client): placeholder biography. Replace with Adriana's own words. */}
            <div className="mt-12 max-w-[40rem] space-y-6 text-[1.06rem] leading-[1.85] text-parchment/90">
              <Reveal>
                <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.8rem] first-letter:leading-[0.8] first-letter:text-gold-soft">
                  Adriana grew up knowing tequila as a celebration. It took a trip through the Jalisco highlands, standing in a field of
                  blue agave that had taken seven years to grow, for her to understand it as something else entirely: a spirit of place,
                  as expressive as any great wine.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p>
                  She studied it with the same devotion: the plant, the ovens, the stills, the barrels, and the regulations that
                  quietly allow some brands to sweeten and colour their tequila without saying so. That discovery became a mission.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Eleva Imports exists so Canadians can drink tequila the way Adriana first tasted it: honest, additive-free, made by
                  people who care. Every bottle on this site has been tasted, questioned and championed by her personally.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <blockquote className="relative mt-14 max-w-[40rem] border-l border-gold/50 pl-8">
                <p className="font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] font-light italic leading-snug text-bone">
                  &ldquo;Tequila isn&rsquo;t a shot. It&rsquo;s a place, a plant and a family&rsquo;s patience, in a glass.&rdquo;
                </p>
                <footer className="mt-5 text-[0.65rem] uppercase tracking-[0.3em] text-gold">Adriana Martinez</footer>
              </blockquote>
            </Reveal>
          </div>
          <div className="lg:sticky lg:top-28">
            <ClipReveal>
              <PortraitFrame portrait={cellar} sizes="(max-width: 1024px) 90vw, 36rem" caption="Toronto · the cellar" />
            </ClipReveal>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section aria-label="By the numbers" className="relative overflow-hidden border-y border-gold/10 bg-ink-900 py-20 md:py-28" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <WaveLines className="absolute inset-0 opacity-50" />
        <dl className="relative mx-auto grid max-w-[1600px] grid-cols-2 gap-y-14 px-gutter lg:grid-cols-4">
          {NUMBERS.map((n, i) => (
            <Reveal key={n.label} delay={i * 0.08} className="flex flex-col border-l border-gold/20 pl-6 md:pl-8">
              <dt className="order-2 mt-3 max-w-[14rem] text-[0.8rem] leading-snug text-mist">{n.label}</dt>
              <dd className="font-display text-[clamp(3.2rem,2rem+4vw,6rem)] font-light leading-none text-bone">
                <Counter to={n.to} suffix={n.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Philosophy */}
      <section className="relative overflow-hidden py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <GoldDust count={18} seed={52} className="opacity-60" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <SectionHeading
            eyebrow="The philosophy"
            align="center"
            lines={["Four promises", <em key="e" className="text-gold-soft">in every pour.</em>]}
          />
          <ul className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={i * 0.08}
                className="group relative overflow-hidden rounded-card bg-ink-900 p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] transition-shadow duration-[800ms] hover:shadow-[inset_0_0_0_1px_rgb(226_201_155/0.5),0_30px_80px_-40px_rgb(227_162_74/0.6)] md:p-10"
              >
                <div aria-hidden className="absolute -right-24 -top-24 size-64 rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.18),transparent)] opacity-0 transition-opacity duration-[800ms] group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <PillarIcon name={p.icon} className="size-14 text-gold-soft transition-transform duration-[800ms] ease-expo group-hover:-translate-y-1 group-hover:rotate-[-4deg]" />
                  <span className="font-display text-[0.95rem] text-smoke">0{i + 1}</span>
                </div>
                <h3 className="mt-10 font-display text-[1.75rem] font-light leading-tight text-bone">{p.title}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-mist">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Barrel room */}
      <section className="relative overflow-hidden bg-ink-900 py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <TalaveraRosette className="absolute -left-40 top-1/2 w-[46rem] -translate-y-1/2 opacity-25" />
        <div className="relative mx-auto grid max-w-[1600px] items-center gap-16 px-gutter lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <ClipReveal className="mx-auto w-full max-w-[30rem] lg:order-none">
            <PortraitFrame portrait={barrels} sizes="(max-width: 1024px) 90vw, 30rem" caption="Jalisco · the barrel room" />
          </ClipReveal>
          <div>
            <SectionHeading
              eyebrow="How we choose"
              lines={["From the barrel room", <em key="e" className="text-gold-soft">to your glass.</em>]}
              intro={
                <p>
                  Adriana visits the distilleries she imports from: she walks the fields, smells the ovens and tastes from the barrel.
                  A bottle only joins the collection when the people, the process and the glass all tell the same story.
                </p>
              }
            />
            <ul className="mt-10 space-y-4">
              {LOOKS_FOR.map((l, i) => (
                <Reveal as="li" key={l} delay={0.1 + i * 0.06} className="flex items-start gap-4 border-t border-gold/10 pt-4 text-[1rem] text-parchment">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[0.7rem] text-ink-950 [background:linear-gradient(135deg,#f0be7a,#c8783e)]">✓</span>
                  {l}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden py-section" aria-labelledby="journey-title">
        <div className="mx-auto max-w-[1800px] px-gutter">
          <div className="mb-20 text-center">
            <p className="eyebrow mb-6 flex items-center justify-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              The journey
            </p>
            <RevealLines
              lines={["From a single sip", <em key="e" className="text-gold-soft">to a mission.</em>]}
              className="font-display text-display-md font-light text-bone"
            />
            <h2 id="journey-title" className="sr-only">
              The journey
            </h2>
          </div>
          <Timeline items={MILESTONES} />
        </div>
      </section>

      {/* Statement */}
      <section className="relative overflow-hidden border-y border-gold/10 py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <BackdropWord word="Agave" className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-70" />
        <div className="relative mx-auto max-w-5xl px-gutter text-center">
          <RevealLines
            lines={["Drink less, drink better,", <em key="e" className="text-gold-soft">and know exactly why.</em>]}
            className="font-display text-display-lg font-light text-bone"
          />
          <Reveal delay={0.25}>
            <p className="mx-auto mt-8 max-w-xl text-[1.02rem] leading-relaxed text-mist">
              That&rsquo;s the whole philosophy. Everything else, the bottles, the classes and the trade program, follows from it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Next steps */}
      <section className="mx-auto max-w-[1800px] px-gutter py-section" aria-label="Where to next">
        <ul className="grid gap-6 lg:grid-cols-3">
          {[
            { href: "/shop", eyebrow: "Shop", title: "Her picks, in your glass", accent: "#e3b25a", glow: "#f6d48f", art: "rings" },
            { href: "/masterclass", eyebrow: "Learn", title: "Taste with Adriana", accent: "#ec5b8d", glow: "#f6a6c3", art: "agave" },
            { href: "/trade", eyebrow: "Trade", title: "Build your agave program", accent: "#7f9a78", glow: "#b9d0b0", art: "talavera" },
          ].map((c, i) => (
            <Reveal as="li" key={c.href} delay={i * 0.08}>
              <Link
                href={c.href}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-card bg-ink-900 p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] transition-shadow duration-[800ms] hover:shadow-[inset_0_0_0_1px_var(--accent)] md:p-10"
                style={{ "--accent": c.accent, "--glow": c.glow } as CSSProperties}
              >
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_30%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)] opacity-60 transition-opacity duration-[800ms] group-hover:opacity-100" />
                {c.art === "rings" && <OrbitRings className="absolute -right-24 -top-24 w-[26rem] opacity-60 transition-transform duration-[1200ms] ease-expo group-hover:scale-110" />}
                {c.art === "agave" && <AgaveArt className="absolute -right-10 top-0 w-[26rem] opacity-50" seed={i + 60} />}
                {c.art === "talavera" && <TalaveraRosette className="absolute -right-20 -top-20 w-[24rem] opacity-50 transition-transform duration-[1200ms] ease-expo group-hover:rotate-12" />}
                <p className="relative eyebrow text-[var(--glow)]">{c.eyebrow}</p>
                <p className="relative mt-3 max-w-[16rem] font-display text-[2.2rem] font-light leading-[1.05] text-bone">{c.title}</p>
                <span className="relative mt-6 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--accent)]">
                  Explore
                  <svg aria-hidden viewBox="0 0 24 24" className="size-3.5 transition-transform duration-[400ms] group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="mt-12 text-center text-[0.85rem] text-smoke">
          Say hello on{" "}
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="link-underline text-parchment">
            Instagram
          </a>{" "}
          or{" "}
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="link-underline text-parchment">
            WhatsApp
          </a>
          .
        </p>
      </section>
    </>
  );
}
