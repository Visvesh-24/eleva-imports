import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      {/* Review checkpoint: the remaining home sections (collections, featured
          bottles, Meet Adriana, masterclass, trade, recipes, newsletter, footer)
          are built after the hero is signed off. See PLAN.md. */}
      <section className="mx-auto max-w-5xl px-gutter py-section text-center">
        <p className="eyebrow mb-6">Next up</p>
        <p className="font-display text-display-md font-light text-bone">
          A master&rsquo;s recommendation, <em className="text-gold-soft">not a liquor store.</em>
        </p>
      </section>
    </>
  );
}
