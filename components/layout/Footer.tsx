/**
 * Site footer: closing statement, link columns, compliance notes and a huge
 * outlined wordmark sitting on an agave line drawing.
 */
import Link from "next/link";
import { AgaveArt, GoldDust } from "@/components/art/Art";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All bottles" },
      { href: "/collections/reserva-huizar", label: "Reserva Huizar" },
      { href: "/collections/blanco", label: "Blancos for mixing" },
      { href: "/collections/tasting-minis", label: "Tasting minis" },
      { href: "/collections/boutique-collection", label: "Boutique collection" },
      { href: "/collections/pechery", label: "Pechery liqueurs" },
      { href: "/collections/riedel", label: "Riedel glassware" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/masterclass", label: "Masterclasses" },
      { href: "/events", label: "Events" },
      { href: "/recipes", label: "Recipes & resources" },
      { href: "/about", label: "About Adriana" },
    ],
  },
  {
    title: "Trade",
    links: [
      { href: "/trade", label: "Build your agave program" },
      { href: "/trade/ordering", label: "Trade ordering" },
      { href: "/trade/quick-reorder", label: "Quick reorder" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 pt-section" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as React.CSSProperties}>
      <div className="hairline absolute inset-x-0 top-0" />
      <GoldDust count={18} seed={9} className="opacity-60" />

      <div className="relative mx-auto max-w-[1800px] px-gutter">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="eyebrow mb-6">Eleva Imports · {SITE.city}</p>
            <p className="font-display text-display-md font-light text-bone">
              A master&rsquo;s recommendation,
              <br />
              <em className="text-gold-soft">not a liquor store.</em>
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-pill px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-colors hover:text-gold-soft"
              >
                Instagram
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-pill px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)] transition-colors hover:text-gold-soft"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-5 text-[0.65rem] uppercase tracking-[0.3em] text-gold">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-[0.92rem] text-mist transition-colors hover:text-bone">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Compliance */}
        <div className="mt-20 grid gap-6 border-t border-gold/15 pt-8 text-[0.78rem] leading-relaxed text-smoke md:grid-cols-3">
          <p>
            <strong className="font-medium text-parchment">Please enjoy responsibly.</strong> Must be of legal drinking age in your
            province to purchase or attend tastings.
          </p>
          <p>
            Shipping availability varies by province. {/* TODO(client): confirm provinces and carrier rules. */}
            We&rsquo;ll confirm delivery options for your address at checkout.
          </p>
          <p className="md:text-right">
            © {SITE.year} Eleva Imports. Prices in CAD.
            <br />
            <Link href="/contact" className="link-underline">
              Contact
            </Link>
          </p>
        </div>
      </div>

      {/* Wordmark */}
      <div aria-hidden className="relative mt-16 select-none">
        <AgaveArt className="absolute bottom-[8%] left-1/2 w-[min(900px,120vw)] -translate-x-1/2 opacity-40" seed={4} />
        <p className="text-outline relative text-center font-display text-[24vw] font-light leading-[0.78] tracking-[0.04em] [--outline:rgb(201_164_106/0.22)]">
          ELEVA
        </p>
      </div>
    </footer>
  );
}
