import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AgaveArt, GoldDust } from "@/components/art/Art";
import { AdrianaAvatar } from "@/components/content/AdrianaAvatar";
import { GlassArt } from "@/components/content/GlassArt";
import { RecipesBrowser } from "@/components/content/RecipesBrowser";
import { PageHero, SectionHeading } from "@/components/editorial/PageHero";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { Arrow, Button } from "@/components/ui/Button";
import { getPortrait } from "@/lib/adriana";
import { getEntries } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes & Resources",
  description:
    "Tequila cocktails without the sour mix, neat-sipping rituals, food pairings and plain-spoken guides to additive-free tequila, from Canada's only Certified Tequila Master.",
  alternates: { canonical: "/recipes" },
};

const BAR_BASICS = [
  { n: "01", title: "Fresh citrus, always", body: "Squeeze limes and grapefruit the same day. Bottled juice is the fastest way to ruin good tequila." },
  { n: "02", title: "Ice is an ingredient", body: "Big, cold, clear cubes melt slowly. Small wet ice drowns a drink before you finish it." },
  { n: "03", title: "Measure everything", body: "A jigger takes ten seconds and makes every drink taste like the last one you loved." },
  { n: "04", title: "The right glass", body: "A copita or Riedel glass for sipping, a coupe for shaken drinks, a highball for long ones." },
];

export default function RecipesPage() {
  const entries = getEntries();
  const portrait = getPortrait("cellar");

  return (
    <>
      <PageHero
        eyebrow="Recipes & resources"
        lines={["Shake it, stir it,", <em key="e" className="text-gold-soft">sip it slowly.</em>]}
        intro={
          <p>
            Cocktails without the sour mix, rituals for sipping neat, pairings for the table, and plain-spoken guides to what&rsquo;s
            really in your glass.
          </p>
        }
        motif="waves"
        theme={{ accent: "#e3a24a", glow: "#f5cf8e", deep: "#251708" }}
        aside={
          <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.22),transparent)] blur-2xl" />
            <div
              className="absolute left-[2%] top-[22%] w-[34%] [animation:float-y_7s_var(--ease-silk)_infinite]"
              style={{ "--accent": "#b8d46a", "--glow": "#e3f0a8" } as CSSProperties}
            >
              <GlassArt kind="coupe" liquid="#e4ecab" garnish="salt" />
            </div>
            <div
              className="absolute left-[33%] top-[4%] w-[36%] [animation:float-y_8s_var(--ease-silk)_-2s_infinite]"
              style={{ "--accent": "#f08a6c", "--glow": "#ffc2a8" } as CSSProperties}
            >
              <GlassArt kind="highball" liquid="#f6ad92" garnish="grapefruit" ice />
            </div>
            <div
              className="absolute right-[2%] top-[30%] w-[32%] [animation:float-y_6.5s_var(--ease-silk)_-4s_infinite]"
              style={{ "--accent": "#e3b25a", "--glow": "#f6d48f" } as CSSProperties}
            >
              <GlassArt kind="copita" liquid="#f0c46a" />
            </div>
          </div>
        }
      />

      <section className="mx-auto max-w-[1800px] px-gutter py-section" aria-labelledby="library-title">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              The library
            </p>
            <h2 id="library-title" className="font-display text-display-md font-light text-bone">
              Everything we pour, <em className="text-gold-soft">explained.</em>
            </h2>
          </div>
          <p className="max-w-md text-[0.98rem] leading-relaxed text-mist">
            Every spec is written for the bottles we import, but works with any additive-free tequila you love.
          </p>
        </div>
        <RecipesBrowser entries={entries} />
      </section>

      {/* Bar basics */}
      <section className="relative overflow-hidden border-y border-gold/10 bg-ink-900 py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <GoldDust count={16} seed={31} className="opacity-70" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <SectionHeading eyebrow="Before you pour" lines={["Four rules for", <em key="e" className="text-gold-soft">a better home bar.</em>]} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-card bg-gold/15 sm:grid-cols-2 lg:grid-cols-4">
            {BAR_BASICS.map((b, i) => (
              <Reveal as="li" key={b.n} delay={i * 0.08} className="group relative bg-ink-900 p-8 transition-colors duration-[800ms] hover:bg-ink-850 md:p-10">
                <span className="font-display text-[3.5rem] font-light leading-none text-gold/40 transition-colors duration-[800ms] group-hover:text-gold-soft">{b.n}</span>
                <h3 className="mt-6 font-display text-2xl font-light text-bone">{b.title}</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-mist">{b.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Learn in person */}
      <section className="relative overflow-hidden py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <AgaveArt className="absolute -bottom-10 left-1/2 w-[min(1100px,140vw)] -translate-x-1/2 opacity-30" seed={41} />
        <div className="relative mx-auto max-w-4xl px-gutter text-center">
          <Reveal>
            <div className="flex justify-center">
              <AdrianaAvatar portrait={portrait} size={84} />
            </div>
          </Reveal>
          <RevealLines
            className="mt-10 font-display text-display-md font-light text-bone"
            lines={["Recipes are a start.", <em key="e" className="text-gold-soft">Tasting together is the lesson.</em>]}
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-mist">
              Join Adriana for a guided masterclass and learn to taste, mix and talk about tequila with confidence.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/masterclass">
                Book a masterclass <Arrow />
              </Button>
              <Button href="/shop" variant="ghost">
                Shop the bottles
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
