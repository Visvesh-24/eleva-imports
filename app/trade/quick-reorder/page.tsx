/**
 * /trade/quick-reorder: repeat a trade account's last order in one tap.
 * Currently a preview with sample data; see components/trade/QuickReorder.tsx.
 */
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getProducts } from "@/lib/products";
import { buildTradeProducts } from "@/lib/trade";
import { OrbitRings } from "@/components/art/Art";
import { PageHero, type PageTheme } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { QuickReorder } from "@/components/trade/QuickReorder";
import { TradeSubnav } from "@/components/trade/TradeSubnav";

export const metadata: Metadata = {
  title: "Quick reorder",
  description: "Trade accounts: repeat your last Eleva Imports order in one tap, or adjust quantities before service.",
  alternates: { canonical: "/trade/quick-reorder" },
};

const THEME: PageTheme = { accent: "#d48358", glow: "#f8c898", deep: "#1f0f08" };

const STEPS = [
  { n: "01", title: "Find your account", body: "Use your trade account number or the email on file." },
  { n: "02", title: "Check last order", body: "Your previous cases are loaded, ready to adjust." },
  { n: "03", title: "Reorder", body: "Send it in one tap. We confirm delivery by email." },
];

export default async function QuickReorderPage() {
  const products = buildTradeProducts(await getProducts());
  return (
    <div style={{ "--accent": THEME.accent, "--glow": THEME.glow, "--deep": THEME.deep } as CSSProperties}>
      <PageHero
        compact
        eyebrow="Quick reorder"
        lines={["Same again,", <em key="a" className="text-gold-soft">before service.</em>]}
        intro={<p>Busy Friday ahead? Reorder last month&rsquo;s cases in seconds, or tweak quantities first.</p>}
        motif="rays"
        theme={THEME}
      />
      <TradeSubnav current="/trade/quick-reorder" />
      <section className="relative overflow-hidden pb-section pt-16 md:pt-20">
        <OrbitRings className="pointer-events-none absolute -left-[25%] top-[10%] w-[min(900px,120vw)] opacity-40" />
        <div className="relative mx-auto max-w-[1800px] px-gutter">
          <ol className="mx-auto mb-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.08} className="border-t border-gold/20 pt-5">
                <span className="font-display text-[0.95rem] text-gold">{s.n}</span>
                <p className="mt-1 font-display text-[1.4rem] font-light text-bone">{s.title}</p>
                <p className="mt-1 text-[0.85rem] text-mist">{s.body}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <QuickReorder products={products} />
          </Reveal>
          <p className="mx-auto mt-8 max-w-4xl text-center text-[0.8rem] text-smoke">
            No trade account yet?{" "}
            <Link href="/trade#apply" className="link-underline text-gold-soft">
              Apply here
            </Link>{" "}
            or{" "}
            <Link href="/trade/ordering" className="link-underline text-gold-soft">
              place a new order
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
