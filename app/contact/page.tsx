import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GoldDust } from "@/components/art/Art";
import { AdrianaAvatar } from "@/components/content/AdrianaAvatar";
import { ContactForm } from "@/components/content/ContactForm";
import { TorontoMap } from "@/components/content/TorontoMap";
import { PageHero, SectionHeading } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow, Button } from "@/components/ui/Button";
import { getPortrait } from "@/lib/adriana";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Eleva Imports about bottles, gifts, private tastings, masterclasses or your restaurant's agave program. Based in Toronto, reachable on WhatsApp.",
  alternates: { canonical: "/contact" },
};

// TODO(client): add a public email address and opening hours when confirmed.
const EMAIL: string | null = null;

const FAQ = [
  {
    q: "Which provinces do you ship to?",
    a: "Shipping availability varies by province because of provincial alcohol rules. Tell us your postal code and we'll confirm the options for your address.",
    // TODO(client): confirm provinces and carriers.
  },
  {
    q: "Can I book a private tasting or corporate masterclass?",
    a: "Yes. Adriana hosts private tastings at home, in the office or at your venue across the GTA. Choose “Masterclasses & private tastings” in the form, or browse formats on the masterclass page.",
    link: { href: "/masterclass", label: "See masterclass formats" },
  },
  {
    q: "I run a restaurant or bar. How do trade accounts work?",
    a: "We build agave programs with venues: list curation, staff training and trade pricing. Start with the trade page or send us a note.",
    link: { href: "/trade", label: "Build your agave program" },
  },
  {
    q: "Do you offer gifting and custom messages?",
    a: "Our Talavera bottles, crystal decanters and the Tasting Trio make memorable gifts. Mention the occasion in your message and we'll help with wrapping and a handwritten note.",
    link: { href: "/collections/gift-and-share", label: "Shop gifts" },
  },
  {
    q: "How old do I need to be to order?",
    a: "You must be of legal drinking age in your province (18 in Alberta, Manitoba and Québec; 19 elsewhere). ID may be checked on delivery.",
  },
];

export default function ContactPage() {
  const portrait = getPortrait("cellar");

  const methods = [
    {
      href: SITE.whatsapp,
      label: "WhatsApp",
      value: "+1 905 718 1247",
      note: "Fastest reply, usually same day",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Z" />
        </svg>
      ),
    },
    {
      href: SITE.instagram,
      label: "Instagram",
      value: "@adrianatequilamaster",
      note: "Tastings, new arrivals, behind the scenes",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
        </svg>
      ),
    },
    ...(EMAIL
      ? [
          {
            href: `mailto:${EMAIL}`,
            label: "Email",
            value: EMAIL,
            note: "For orders, press and partnerships",
            icon: (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        lines={["Let’s talk", <em key="e" className="text-gold-soft">agave.</em>]}
        intro={
          <p>
            Questions about a bottle, a gift, a private tasting or your bar&rsquo;s tequila list? Adriana&rsquo;s team answers every
            message personally.
          </p>
        }
        motif="rings"
      >
        <Button href={SITE.whatsapp}>
          Message on WhatsApp <Arrow />
        </Button>
        <Button href="#enquiry" variant="ghost">
          Send a note
        </Button>
      </PageHero>

      <section id="enquiry" className="relative scroll-mt-24 py-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as CSSProperties}>
        <div className="mx-auto grid max-w-[1600px] gap-16 px-gutter lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Enquiries" lines={["Send a note,", <em key="e" className="text-gold-soft">we&rsquo;ll pour the answer.</em>]} />
            <Reveal delay={0.15} className="mt-12">
              <ContactForm />
            </Reveal>
          </div>

          <div className="space-y-6 lg:pt-6">
            <ul className="space-y-3">
              {methods.map((m, i) => (
                <Reveal as="li" key={m.label} delay={i * 0.08}>
                  <a
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-5 rounded-card bg-ink-900 p-5 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.15)] transition-shadow duration-[800ms] hover:shadow-[inset_0_0_0_1px_rgb(226_201_155/0.55)]"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full text-gold-soft shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-colors duration-[400ms] group-hover:bg-gold-soft group-hover:text-ink-950">
                      {m.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.6rem] uppercase tracking-[0.26em] text-smoke">{m.label}</span>
                      <span className="block truncate font-display text-[1.45rem] font-light text-bone">{m.value}</span>
                      <span className="block text-[0.8rem] text-mist">{m.note}</span>
                    </span>
                    <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0 text-gold transition-transform duration-[400ms] group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <div className="relative overflow-hidden rounded-card bg-ink-900 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.15)]">
                <GoldDust count={10} seed={77} />
                <TorontoMap className="relative block w-full" />
                <div className="relative flex flex-wrap items-end justify-between gap-6 border-t border-gold/10 p-6 md:p-8">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.26em] text-smoke">Based in</p>
                    <p className="mt-1 font-display text-[1.6rem] font-light text-bone">Toronto, Ontario</p>
                    {/* TODO(client): confirm address / hours. */}
                    <p className="mt-1 text-[0.85rem] text-mist">Tastings and pick-ups by appointment</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AdrianaAvatar portrait={portrait} size={48} />
                    <p className="text-[0.78rem] leading-snug text-smoke">
                      Replies from
                      <br />
                      <span className="text-parchment">Adriana&rsquo;s team</span>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gold/10 bg-ink-900/60 py-section" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-gutter lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              Good to know
            </p>
            <h2 id="faq-title" className="font-display text-display-md font-light text-bone">
              Before you <em className="text-gold-soft">ask.</em>
            </h2>
          </div>
          <ul className="divide-y divide-gold/12 border-y border-gold/12">
            {FAQ.map((f, i) => (
              <Reveal as="li" key={f.q} delay={i * 0.05}>
                <details className="group py-2 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[1.45rem] font-light text-bone transition-colors hover:text-gold-soft">
                    {f.q}
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full text-gold shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-transform duration-[600ms] ease-expo group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pb-6 pr-12 text-[0.98rem] leading-relaxed text-mist">
                    <p>{f.a}</p>
                    {f.link && (
                      <Link href={f.link.href} className="link-underline mt-4 inline-block text-[0.68rem] uppercase tracking-[0.22em] text-gold-soft">
                        {f.link.label} →
                      </Link>
                    )}
                  </div>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
