/**
 * Pill navigation between the three trade pages, shown under each hero.
 */
import Link from "next/link";

const LINKS = [
  { href: "/trade", label: "Agave program", n: "01" },
  { href: "/trade/ordering", label: "Trade ordering", n: "02" },
  { href: "/trade/quick-reorder", label: "Quick reorder", n: "03" },
];

export function TradeSubnav({ current }: { current: "/trade" | "/trade/ordering" | "/trade/quick-reorder" }) {
  return (
    <nav aria-label="Trade" className="relative z-10 mx-auto max-w-[1800px] px-gutter">
      <ul className="-mt-7 flex gap-2 overflow-x-auto rounded-pill bg-ink-900/80 p-1.5 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.2),0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md [scrollbar-width:none] sm:inline-flex">
        {LINKS.map((l) => {
          const active = l.href === current;
          return (
            <li key={l.href} className="shrink-0">
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-pill px-5 py-3 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-[400ms] ${
                  active
                    ? "bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] text-ink-950"
                    : "text-parchment hover:text-gold-soft"
                }`}
              >
                <span className={`font-display text-[0.85rem] tracking-normal ${active ? "text-ink-950/70" : "text-gold"}`}>{l.n}</span>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
