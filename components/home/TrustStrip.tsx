/**
 * Trust strip directly under the hero. The amber seam at its top picks up
 * the glow the hero glass ends on, so the hand-off reads as one light.
 */
const ITEMS = [
  "Canada’s only Certified Tequila Master",
  "Additive-free, always",
  "100% blue agave",
  "Hand-selected in Jalisco",
  "Poured in Toronto",
];

function Row() {
  return (
    <ul className="flex shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20">
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center gap-12 whitespace-nowrap md:gap-20">
          <span className="font-display text-[clamp(1.35rem,1rem+1.2vw,2.1rem)] font-light italic text-parchment">{t}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-gold/70" fill="currentColor">
            <path d="M12 2c.6 4.8 2.6 7.6 6 9.9-3.4 2.4-5.4 5.2-6 10.1-.6-4.9-2.6-7.7-6-10.1 3.4-2.3 5.4-5.1 6-9.9Z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export function TrustStrip() {
  return (
    <section aria-label="Why Eleva" className="relative overflow-hidden bg-ink-950 py-10 md:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_38%_50%_at_60%_50%,rgb(227_162_74/0.16),transparent_70%)] max-md:bg-[radial-gradient(ellipse_70%_50%_at_45%_50%,rgb(227_162_74/0.16),transparent_70%)]"
      />
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="relative flex w-max animate-marquee motion-reduce:animate-none">
        <Row />
        <Row />
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}
