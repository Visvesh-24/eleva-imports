/**
 * Archive of past evenings as art-directed panels (gradient light + motif)
 * until real event photography is supplied (TODO(client)).
 */
import type { CSSProperties } from "react";
import type { PastEvent } from "@/lib/experiences";
import { GoldDust, Motif } from "@/components/art/Art";
import { Reveal } from "@/components/motion/Reveal";

const SPAN: Record<PastEvent["span"], string> = {
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  square: "",
};

export function PastGallery({ items }: { items: PastEvent[] }) {
  return (
    <ul className="grid auto-rows-[15rem] gap-4 sm:grid-cols-2 md:auto-rows-[17rem] md:grid-cols-4 md:gap-5">
      {items.map((p, i) => (
        <Reveal as="li" key={p.title} delay={(i % 4) * 0.08} className={`${SPAN[p.span]} min-h-0`}>
          <figure
            className="group relative isolate size-full overflow-hidden rounded-card bg-ink-900 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.12)]"
            style={{ "--accent": p.accent, "--glow": p.glow } as CSSProperties}
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 transition-transform duration-[1600ms] ease-expo group-hover:scale-110"
              style={{
                background:
                  "radial-gradient(70% 70% at 30% 20%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 70%), radial-gradient(60% 60% at 90% 100%, color-mix(in srgb, var(--glow) 18%, transparent), transparent 70%), #11100e",
              }}
            />
            <div aria-hidden className="absolute inset-0 -z-10 grid place-items-center opacity-60 transition-opacity duration-[1200ms] group-hover:opacity-100">
              <Motif
                motif={p.motif}
                className={p.motif === "waves" ? "absolute inset-x-0 bottom-0 h-1/2" : p.motif === "rays" ? "absolute inset-0" : "w-[90%] max-w-[26rem]"}
              />
            </div>
            <GoldDust count={8} seed={i + 30} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgb(11_10_9/0.8))] p-6">
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-[var(--glow)]">
                {p.when} · {p.where}
              </p>
              <p className="mt-1.5 font-display text-[1.6rem] font-light leading-tight text-bone">{p.title}</p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
