/**
 * Trade FAQ as native <details> disclosures: keyboard and screen-reader
 * friendly with no JS, styled with a rotating plus and gold hairlines.
 */
import { TRADE_FAQ } from "@/lib/trade";

export function TradeFaq() {
  return (
    <div className="divide-y divide-gold/15 border-y border-gold/15">
      {TRADE_FAQ.map((f) => (
        <details key={f.q} className="group/faq py-2 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[clamp(1.25rem,1rem+0.8vw,1.7rem)] font-light text-bone transition-colors hover:text-gold-soft">
            {f.q}
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full text-gold shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] transition-transform duration-[600ms] ease-expo group-open/faq:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-6 pr-12 text-[0.98rem] leading-relaxed text-mist">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
