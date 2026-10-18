import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { BackdropWord, GoldDust, LightRays, TalaveraRosette } from "@/components/art/Art";
import { PageHero, SectionHeading } from "@/components/editorial/PageHero";
import { EventsList } from "@/components/learn/EventsList";
import { NextUpCard } from "@/components/learn/NextUpCard";
import { PastGallery } from "@/components/learn/PastGallery";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { Arrow, Button } from "@/components/ui/Button";
import { EVENTS, PAST_EVENTS } from "@/lib/experiences";

export const metadata: Metadata = {
  title: "Tequila Events in Toronto",
  description:
    "Tastings, agave dinner pairings, pop-ups and mezcal nights in Toronto and the GTA, hosted by Adriana Martinez, Canada's only Certified Tequila Master.",
  alternates: { canonical: "/events" },
};

const THEME = { accent: "#d48358", glow: "#f8c898", deep: "#2a1209" };

const PRINCIPLES = [
  {
    n: "01",
    title: "Small rooms",
    body: "Most evenings seat under fifty, so there's time for every question and a second pour of the favourite.",
  },
  {
    n: "02",
    title: "Honest pours",
    body: "Everything in the glass is 100% blue agave and additive-free. You'll taste the difference by the second sip.",
  },
  {
    n: "03",
    title: "Hosted by Adriana",
    body: "Canada's only Certified Tequila Master leads every event: stories from the distilleries included.",
  },
];

export default function EventsPage() {
  const next = EVENTS[0];
  return (
    <>
      <PageHero
        eyebrow="Events · Toronto & GTA"
        theme={THEME}
        motif="talavera"
        lines={["Evenings worth", <em key="e" className="text-rosegold">raising a glass to.</em>]}
        intro={
          <p>
            Seated tastings, chef&rsquo;s-table pairings, holiday pop-ups and the occasional mezcal night. Small rooms, big pours, and
            always someone who knows exactly what&rsquo;s in the glass.
          </p>
        }
        aside={next ? <NextUpCard ev={next} /> : undefined}
      >
        <Button href="#calendar">
          See the calendar <Arrow />
        </Button>
        <Button href="#private" variant="ghost">
          Host a private event
        </Button>
      </PageHero>

      {/* Marquee of what's on */}
      <div aria-hidden className="relative overflow-hidden border-b border-gold/12 py-6" style={{ "--outline": "rgb(212 131 88 / 0.3)" } as CSSProperties}>
        <BackdropWord word="Salud" className="opacity-70 [&_span]:text-[clamp(4rem,10vw,9rem)]" />
      </div>

      {/* Calendar */}
      <section id="calendar" className="relative scroll-mt-24 py-section" aria-labelledby="calendar-title" style={{ "--accent": THEME.accent, "--glow": THEME.glow } as CSSProperties}>
        <GoldDust count={12} seed={55} className="opacity-50" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <div className="mb-14 grid gap-8 md:mb-16 lg:grid-cols-[1fr_auto] lg:items-end">
            <div id="calendar-title">
              <SectionHeading eyebrow="Upcoming" lines={["The calendar,", <em key="c" className="text-rosegold">poured.</em>]} />
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-sm text-[0.95rem] leading-relaxed text-mist">
                Seats are limited and confirmed by email. Request yours below; we&rsquo;ll send details and payment once your place is held.
              </p>
            </Reveal>
          </div>
          <EventsList events={EVENTS} />
        </div>
      </section>

      {/* How our evenings work */}
      <section className="relative overflow-hidden bg-ink-900/40 py-section" aria-labelledby="principles-title" style={{ "--accent": THEME.accent, "--glow": THEME.glow } as CSSProperties}>
        <div className="hairline absolute inset-x-0 top-0" />
        <TalaveraRosette className="pointer-events-none absolute -left-40 top-1/2 w-[38rem] -translate-y-1/2 opacity-25 max-md:hidden" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <div id="principles-title" className="mb-16">
            <SectionHeading eyebrow="How our evenings work" align="center" lines={["Fewer guests.", <em key="b" className="text-rosegold">Better pours.</em>]} />
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.1} className="rounded-card bg-ink-950/60 p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] md:p-10">
                <p className="font-display text-[3.5rem] font-light italic leading-none text-[var(--glow)]">{p.n}</p>
                <h3 className="mt-6 font-display text-[1.9rem] font-light text-bone">{p.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-mist">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="hairline absolute inset-x-0 bottom-0" />
      </section>

      {/* Past events */}
      <section className="py-section" aria-labelledby="past-title">
        <div className="mx-auto max-w-[1800px] px-gutter">
          <div id="past-title" className="mb-14">
            <SectionHeading
              eyebrow="From the archive"
              lines={["Nights we still", <em key="p" className="text-rosegold">talk about.</em>]}
              intro="A few of the evenings that shaped how we host. Photography from each will live here."
            />
          </div>
          <PastGallery items={PAST_EVENTS} />
        </div>
      </section>

      {/* Private events CTA */}
      <section id="private" className="relative scroll-mt-20 pb-section" aria-labelledby="private-title" style={{ "--accent": THEME.accent, "--glow": THEME.glow } as CSSProperties}>
        <div className="mx-auto max-w-[1800px] px-gutter">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink-900 px-7 py-20 text-center shadow-[inset_0_0_0_1px_rgb(201_164_106/0.2)] md:px-14 md:py-28">
            <LightRays className="absolute inset-0 -z-10" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgb(212_131_88/0.28),transparent_70%)]" />
            <GoldDust count={20} seed={88} />
            <Reveal>
              <p className="eyebrow mb-6">Private events</p>
            </Reveal>
            <div id="private-title">
              <RevealLines
                as="h2"
                lines={["Your celebration.", <em key="y" className="text-rosegold">Adriana&rsquo;s pour.</em>]}
                className="mx-auto max-w-4xl font-display text-display-lg font-light text-bone"
              />
            </div>
            <Reveal delay={0.25}>
              <p className="mx-auto mt-8 max-w-xl text-[1.02rem] leading-relaxed text-mist">
                Birthdays, weddings, client evenings and team celebrations, anywhere in the GTA. We bring the glassware, the bottles and
                the stories.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button href="/masterclass#book">
                  Plan a private tasting <Arrow />
                </Button>
                <Button href="/contact" variant="ghost">
                  Talk to us
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
