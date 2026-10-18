import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { CircularText, GoldDust, LightRays, OrbitRings } from "@/components/art/Art";
import { PageHero, SectionHeading } from "@/components/editorial/PageHero";
import { PortraitFrame } from "@/components/editorial/PortraitFrame";
import { BookingForm } from "@/components/learn/BookingForm";
import { Faq } from "@/components/learn/Faq";
import { FormatCards } from "@/components/learn/FormatCards";
import { JourneyTimeline } from "@/components/learn/JourneyTimeline";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { Arrow, Button } from "@/components/ui/Button";
import { getPortrait } from "@/lib/adriana";
import { JOURNEY, MASTERCLASS_FAQ, MASTERCLASS_FORMATS } from "@/lib/experiences";
import { getProduct } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tequila & Mezcal Masterclasses",
  description:
    "Private, corporate and virtual tequila masterclasses in Toronto and across Canada, hosted by Adriana Martinez, Canada's only Certified Tequila Master.",
  alternates: { canonical: "/masterclass" },
};

const THEME = { accent: "#e3a24a", glow: "#f5cf8e", deep: "#2a1608" };

/** The flight poured in a classic masterclass, youngest to oldest. */
const FLIGHT = [
  { handle: "reserva-huizar-plata", label: "Blanco" },
  { handle: "reserva-huizar-cristalino-reposado", label: "Cristalino" },
  { handle: "la-cofradia-las-iguanas-reposado", label: "Reposado" },
  { handle: "casa-cofradia-anejo-black", label: "Añejo" },
];

const STATS = [
  { n: "5", label: "Guided pours" },
  { n: "4", label: "Steps to taste like a master" },
  { n: "100%", label: "Blue agave, additive-free" },
  { n: "0", label: "Lime or salt required" },
];

export default async function MasterclassPage() {
  const trio = await getProduct("reserva-huizar-tasting-trio");
  const flight = (await Promise.all(FLIGHT.map(async (f) => ({ ...f, product: await getProduct(f.handle) })))).filter(
    (f): f is typeof f & { product: NonNullable<typeof f.product> } => Boolean(f.product),
  );
  const portrait = getPortrait("cellar");

  return (
    <>
      <PageHero
        eyebrow="Tequila & mezcal masterclasses"
        theme={THEME}
        motif="rings"
        lines={[
          "Learn tequila from",
          <em key="e" className="text-gold-soft">
            Canada&rsquo;s only
          </em>,
          "Certified Tequila Master.",
        ]}
        intro={
          <p>
            Two hours, five pours and a lifetime of knowing what&rsquo;s really in your glass. Adriana Martinez guides you from the
            agave field to the finish, at your table, your office or on screen.
          </p>
        }
        aside={
          trio ? (
            <div className="relative mx-auto aspect-square w-full max-w-[34rem]" style={{ "--accent": THEME.accent, "--glow": THEME.glow } as CSSProperties}>
              <div aria-hidden className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.32),transparent)] blur-2xl" />
              <OrbitRings className="absolute inset-0 size-full" />
              <CircularText text="Nose · Sip · Breathe · Finish · " size={150} className="absolute -left-2 top-[6%] md:left-[2%]" />
              <div className="absolute inset-[14%] [animation:float-y_7s_var(--ease-silk)_infinite]">
                <Image
                  src={trio.image.src}
                  alt={trio.image.alt}
                  fill
                  preload
                  sizes="(max-width: 1024px) 80vw, 34rem"
                  placeholder={trio.image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={trio.image.blurDataURL}
                  className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          ) : undefined
        }
      >
        <Button href="#book">
          Book your experience <Arrow />
        </Button>
        <Button href="#formats" variant="ghost">
          Explore formats
        </Button>
      </PageHero>

      {/* Stats */}
      <section aria-label="At a glance" className="relative border-b border-gold/12">
        <ul className="mx-auto grid max-w-[1800px] grid-cols-2 px-gutter md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 0.08} className="border-gold/12 py-10 text-center max-md:[&:nth-child(-n+2)]:border-b md:border-r md:py-14 md:last:border-r-0 max-md:odd:border-r">
              <p className="font-display text-[clamp(3rem,2.2rem+3vw,5.5rem)] font-light leading-none text-bone">{s.n}</p>
              <p className="mx-auto mt-3 max-w-[12rem] text-[0.65rem] uppercase tracking-[0.26em] text-mist">{s.label}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Journey */}
      <section className="relative overflow-hidden py-section" aria-labelledby="journey-title">
        <GoldDust count={14} seed={41} className="opacity-60" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <div id="journey-title">
            <SectionHeading
              eyebrow="What you'll learn"
              align="center"
              lines={[
                "From field",
                <em key="g" className="text-gold-soft">
                  to glass.
                </em>,
              ]}
              intro="Every masterclass follows the agave's journey, so by the final pour you can taste each decision a distiller made, and spot the ones additives try to hide."
              className="mb-20 md:mb-28"
            />
          </div>
          <JourneyTimeline steps={JOURNEY} />
        </div>
      </section>

      {/* Formats */}
      <section id="formats" className="relative scroll-mt-24 bg-ink-900/40 py-section" aria-labelledby="formats-title">
        <div className="hairline absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-[1800px] px-gutter">
          <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 lg:flex-row lg:items-end">
            <div id="formats-title">
              <SectionHeading
                eyebrow="Choose your experience"
                lines={["Four ways", <em key="p" className="text-gold-soft">to pour.</em>]}
              />
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-sm text-[0.95rem] leading-relaxed text-mist">
                Every format can be tailored: bilingual hosting, paired bites, gifting add-ons or a mezcal flight. Prices are a guide; we
                confirm before anything is booked.
              </p>
            </Reveal>
          </div>
          <FormatCards formats={MASTERCLASS_FORMATS} />
        </div>
        <div className="hairline absolute inset-x-0 bottom-0" />
      </section>

      {/* Host */}
      <section className="relative overflow-hidden py-section" aria-labelledby="host-title" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <div className="mx-auto grid max-w-[1800px] items-center gap-16 px-gutter lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal className="relative mx-auto w-full max-w-[30rem]">
            <PortraitFrame portrait={portrait} caption="Adriana Martinez · Founder, Eleva Imports" sizes="(max-width: 1024px) 90vw, 30rem" />
            <CircularText text="Certified Tequila Master · Canada · " size={140} className="absolute -right-6 -top-10 md:-right-14" />
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gold/70" />
                Your host
              </p>
            </Reveal>
            <div id="host-title">
              <RevealLines
                lines={["Adriana pours", <em key="h" className="text-gold-soft">the way she teaches:</em>, "honestly."]}
                className="font-display text-display-md font-light text-bone"
              />
            </div>
            <Reveal delay={0.2}>
              {/* TODO(client): replace with Adriana's approved bio. */}
              <div className="mt-8 max-w-xl space-y-5 text-[1.02rem] leading-relaxed text-mist">
                <p>
                  Adriana Martinez is Canada&rsquo;s only Certified Tequila Master. She founded Eleva Imports to bring additive-free,
                  100% blue agave tequila from the small houses of Jalisco to Canadian glasses.
                </p>
                <p>
                  Her masterclasses are warm, unhurried and a little mischievous. Expect stories from the distilleries, side-by-side
                  pours that make the differences obvious, and permission to finally put the lime down.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <blockquote className="mt-10 border-l border-gold/40 pl-6">
                <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-light italic leading-snug text-parchment">
                  &ldquo;Once you taste agave without additives, you can&rsquo;t un-taste it. That&rsquo;s the whole point.&rdquo;
                </p>
                <footer className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-gold">Adriana Martinez</footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Flight */}
      {flight.length > 0 && (
        <section className="relative overflow-hidden bg-ink-900/40 py-section" aria-labelledby="flight-title">
          <div className="hairline absolute inset-x-0 top-0" />
          <div className="mx-auto max-w-[1800px] px-gutter">
            <div className="mb-14 md:mb-20" id="flight-title">
              <SectionHeading
                eyebrow="A typical flight"
                lines={["Youngest to oldest,", <em key="f" className="text-gold-soft">left to right.</em>]}
                intro="A classic masterclass pours across the ages of tequila. Every bottle here is in our shop, so you can take your favourite home."
              />
            </div>
            <ol className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {flight.map((f, i) => (
                <Reveal as="li" key={f.handle} delay={i * 0.1}>
                  <p className="mb-4 flex items-baseline gap-3">
                    <span className="font-display text-[1.1rem] italic text-gold">Pour 0{i + 1}</span>
                    <span className="h-px flex-1 bg-gold/20" />
                    <span className="text-[0.62rem] uppercase tracking-[0.26em] text-mist">{f.label}</span>
                  </p>
                  <ProductCard product={f.product} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" />
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-section" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1800px] gap-14 px-gutter lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div id="faq-title" className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Good to know" lines={["Questions,", <em key="q" className="text-gold-soft">answered.</em>]} />
            <Reveal delay={0.2}>
              <p className="mt-8 text-[0.95rem] text-mist">
                Something else on your mind?{" "}
                <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="link-underline text-gold-soft">
                  Message us on WhatsApp
                </a>
                .
              </p>
            </Reveal>
          </div>
          <Reveal>
            <Faq items={MASTERCLASS_FAQ} />
          </Reveal>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="relative scroll-mt-20 overflow-hidden pb-section" aria-labelledby="book-title" style={{ "--accent": THEME.accent, "--glow": THEME.glow } as CSSProperties}>
        <div className="mx-auto max-w-[1800px] px-gutter">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink-900 p-7 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.2)] md:p-14 lg:p-20">
            <LightRays className="absolute inset-0 -z-10 opacity-60" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_0%_0%,rgb(227_162_74/0.2),transparent_70%)]" />
            <GoldDust count={16} seed={77} />
            <div className="relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <Reveal>
                  <p className="eyebrow mb-6">Book your experience</p>
                </Reveal>
                <div id="book-title">
                  <RevealLines
                    as="h2"
                    lines={["Pull up a chair.", <em key="b" className="text-gold-soft">We&rsquo;ll bring the agave.</em>]}
                    className="font-display text-display-md font-light text-bone"
                  />
                </div>
                <Reveal delay={0.2}>
                  <p className="mt-8 max-w-md text-[1rem] leading-relaxed text-mist">
                    Tell us about your occasion and we&rsquo;ll come back with dates, a tailored flight and a confirmed price. Prefer to
                    talk?
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="rounded-pill px-5 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-colors hover:text-gold-soft">
                      WhatsApp
                    </a>
                    <a href={SITE.instagram} target="_blank" rel="noreferrer" className="rounded-pill px-5 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-colors hover:text-gold-soft">
                      Instagram
                    </a>
                  </div>
                </Reveal>
              </div>
              <BookingForm formats={MASTERCLASS_FORMATS.map(({ id, title }) => ({ id, title }))} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
