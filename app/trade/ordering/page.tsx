/**
 * /trade/ordering: the trade order sheet (by the case, ex-HST).
 */
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getProducts } from "@/lib/products";
import { buildTradeProducts } from "@/lib/trade";
import { BackdropWord } from "@/components/art/Art";
import { PageHero, type PageTheme } from "@/components/editorial/PageHero";
import { OrderSheet } from "@/components/trade/OrderSheet";
import { TradeSubnav } from "@/components/trade/TradeSubnav";

export const metadata: Metadata = {
  title: "Trade ordering",
  description: "Order additive-free tequila, liqueurs and Riedel glassware by the case at trade pricing. For licensed venues in Canada.",
  alternates: { canonical: "/trade/ordering" },
};

const THEME: PageTheme = { accent: "#d48358", glow: "#f8c898", deep: "#1f0f08" };

export default async function TradeOrderingPage() {
  const products = buildTradeProducts(await getProducts());
  return (
    <div style={{ "--accent": THEME.accent, "--glow": THEME.glow, "--deep": THEME.deep } as CSSProperties}>
      <PageHero
        compact
        eyebrow="Trade ordering"
        lines={["Order by", <em key="a" className="text-gold-soft">the case.</em>]}
        intro={
          <p>
            The full catalogue at trade pricing. Set your cases, choose a delivery window and we&rsquo;ll confirm availability and invoice by email.
          </p>
        }
        motif="waves"
        theme={THEME}
      />
      <TradeSubnav current="/trade/ordering" />
      {/* overflow-x-clip (not hidden) keeps the sticky summary working */}
      <section className="relative overflow-x-clip pb-section pt-16 md:pt-20">
        <BackdropWord word="Por caja" className="pointer-events-none absolute inset-x-0 top-0 opacity-40" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          {/* Not wrapped in <Reveal>: a transformed ancestor would break the fixed mobile total bar. */}
          <OrderSheet products={products} />
        </div>
      </section>
    </div>
  );
}
