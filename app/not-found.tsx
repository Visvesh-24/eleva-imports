import Link from "next/link";
import { AgaveArt, GoldDust, OrbitRings } from "@/components/art/Art";

export default function NotFound() {
  return (
    <section
      className="relative grid min-h-svh place-items-center overflow-hidden px-gutter py-32 text-center"
      style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as React.CSSProperties}
    >
      <OrbitRings className="absolute left-1/2 top-1/2 w-[min(900px,130vw)] -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <AgaveArt className="absolute bottom-0 left-1/2 w-[min(1000px,140vw)] -translate-x-1/2 opacity-30" seed={44} />
      <GoldDust count={24} seed={404} />
      <div className="relative">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-display text-display-lg font-light text-bone">
          This glass is <em className="text-gold-soft">empty.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-mist">The page you&rsquo;re looking for has been poured elsewhere. Let&rsquo;s find you something real.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="rounded-pill bg-[linear-gradient(135deg,#f0be7a,#e3a24a_45%,#c8783e)] px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink-950">
            Shop the collection
          </Link>
          <Link href="/" className="rounded-pill px-7 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.4)]">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
