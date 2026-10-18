"use client";

/**
 * Product page story sections (below the hero), all themed by the product:
 * tasting journey + flavour radar, craft specs, serve-it-like + pairings,
 * and Adriana's note.
 */
import Image from "next/image";
import Link from "next/link";
import { animate, AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { FlavourProfile, Product, TastingNote } from "@/lib/catalog-types";
import type { Portrait } from "@/lib/adriana";
import { EASE_EXPO } from "@/lib/motion";
import { AgaveArt, CircularText, GoldDust, WaveLines } from "@/components/art/Art";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

// ---------------------------------------------------------------------------
// Tasting journey
// ---------------------------------------------------------------------------
const STAGES = [
  { key: "aroma", n: "01", title: "Aroma", hint: "Nose the glass slowly, mouth slightly open." },
  { key: "palate", n: "02", title: "Palate", hint: "A small sip. Let it coat the tongue before you swallow." },
  { key: "finish", n: "03", title: "Finish", hint: "Breathe out through the nose and count the seconds." },
] as const;

export function TastingJourney({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof STAGES)[number]["key"]>("aroma");
  if (!product.tasting) return null;
  const note: TastingNote = product.tasting[active];

  return (
    <section className="relative overflow-hidden py-section" aria-labelledby="tasting-title">
      <WaveLines className="absolute inset-x-0 top-[20%] h-[60%] opacity-60" />
      <div className="relative mx-auto grid max-w-[1800px] items-center gap-16 px-gutter lg:grid-cols-[1fr_1fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[var(--accent)]" /> Tasting notes
            </p>
          </Reveal>
          <RevealLines
            lines={["Taste it", <em key="e" className="text-[var(--glow)]">like a master.</em>]}
            className="font-display text-display-md font-light text-bone"
          />
          <h2 id="tasting-title" className="sr-only">
            Tasting notes for {product.name}
          </h2>

          <div role="tablist" aria-label="Tasting stages" className="mt-12 grid grid-cols-3 gap-2">
            {STAGES.map((s) => {
              const on = s.key === active;
              return (
                <button
                  key={s.key}
                  role="tab"
                  id={`tab-${s.key}`}
                  aria-selected={on}
                  aria-controls={`panel-${s.key}`}
                  onClick={() => setActive(s.key)}
                  onKeyDown={(e) => {
                    const i = STAGES.findIndex((x) => x.key === active);
                    if (e.key === "ArrowRight") setActive(STAGES[(i + 1) % 3].key);
                    if (e.key === "ArrowLeft") setActive(STAGES[(i + 2) % 3].key);
                  }}
                  tabIndex={on ? 0 : -1}
                  className="group relative pb-4 pt-2 text-left"
                >
                  <span className={`block font-display text-sm ${on ? "text-[var(--glow)]" : "text-smoke"}`}>{s.n}</span>
                  <span className={`mt-1 block font-display text-[1.6rem] font-light transition-colors md:text-[2rem] ${on ? "text-bone" : "text-mist group-hover:text-parchment"}`}>
                    {s.title}
                  </span>
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold/15" />
                  {on && <motion.span layoutId="tasting-bar" aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]" transition={{ duration: 0.6, ease: EASE_EXPO }} />}
                </button>
              );
            })}
          </div>

          <div className="relative mt-10 min-h-[15rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id={`panel-${active}`}
                role="tabpanel"
                aria-labelledby={`tab-${active}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
              >
                <p className="font-display text-[2rem] font-light italic leading-tight text-bone md:text-[2.4rem]">{note.headline}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {note.notes.map((n, i) => (
                    <motion.li
                      key={n}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.1 + i * 0.06 }}
                      className="rounded-pill bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-4 py-2 text-[0.88rem] text-parchment shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
                    >
                      {n}
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-6 text-[0.85rem] text-smoke">{STAGES.find((s) => s.key === active)?.hint}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {product.profile && (
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-[560px]">
            <FlavourRadar profile={product.profile} />
          </Reveal>
        )}
      </div>
    </section>
  );
}

const AXES: { key: keyof FlavourProfile; label: string }[] = [
  { key: "agave", label: "Agave" },
  { key: "citrus", label: "Citrus" },
  { key: "sweetness", label: "Sweetness" },
  { key: "oak", label: "Oak" },
  { key: "spice", label: "Spice" },
  { key: "body", label: "Body" },
];

/** Animated hexagonal flavour radar (draws on when scrolled into view). */
export function FlavourRadar({ profile }: { profile: FlavourProfile }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const C = 250;
  const R = 170;
  const pt = (i: number, v: number) => {
    const a = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
    // Rounded so server and browser trig agree (hydration).
    return [Math.round((C + Math.cos(a) * R * v) * 100) / 100, Math.round((C + Math.sin(a) * R * v) * 100) / 100] as const;
  };
  const poly = AXES.map((a, i) => pt(i, profile[a.key] / 10).join(",")).join(" ");
  const show = inView || reduce;

  return (
    <figure>
      <svg ref={ref} viewBox="0 0 500 500" className="w-full overflow-visible" role="img" aria-label={`Flavour profile: ${AXES.map((a) => `${a.label} ${profile[a.key]} of 10`).join(", ")}`}>
        <defs>
          <radialGradient id="radar-fill" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="var(--glow)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.12" />
          </radialGradient>
        </defs>
        <g style={{ transformOrigin: "250px 250px", animation: "spin-slow 90s linear infinite" }}>
          <circle cx={C} cy={C} r={R + 40} fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeDasharray="2 8" />
        </g>
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s} points={AXES.map((_, i) => pt(i, s).join(",")).join(" ")} fill="none" stroke="var(--accent)" strokeOpacity={s === 1 ? 0.35 : 0.14} />
        ))}
        {AXES.map((a, i) => {
          const [x, y] = pt(i, 1);
          const [lx, ly] = pt(i, 1.22);
          return (
            <g key={a.key} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <line x1={C} y1={C} x2={x} y2={y} stroke="var(--accent)" strokeOpacity={hover === i ? 0.7 : 0.18} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={hover === i ? "var(--glow)" : "#b5aa99"}
                fontSize="15"
                letterSpacing="3"
                style={{ textTransform: "uppercase", fontFamily: "var(--font-sans)" }}
              >
                {a.label}
              </text>
              <text x={lx} y={ly + 20} textAnchor="middle" fill="var(--glow)" fontSize="13" opacity={hover === i ? 1 : 0} style={{ transition: "opacity .3s" }}>
                {profile[a.key]}/10
              </text>
            </g>
          );
        })}
        <motion.polygon
          points={poly}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={show ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE_EXPO, delay: 0.2 }}
          style={{ transformOrigin: "250px 250px", transformBox: "view-box" }}
          fill="url(#radar-fill)"
          stroke="var(--glow)"
          strokeWidth="1.5"
        />
        {AXES.map((a, i) => {
          const [x, y] = pt(i, profile[a.key] / 10);
          return (
            <motion.circle
              key={a.key}
              cx={x}
              cy={y}
              r={hover === i ? 6 : 4}
              fill="var(--glow)"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: show ? 1 : 0 }}
              transition={{ delay: 1 + i * 0.08 }}
            />
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.3em] text-smoke">Flavour profile · Adriana&rsquo;s tasting</figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Craft specs
// ---------------------------------------------------------------------------
export function CraftSpecs({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden border-y border-gold/10 bg-ink-900/40 py-section" aria-labelledby="craft-title">
      <AgaveArt className="absolute -right-24 bottom-0 w-[min(700px,90vw)] opacity-25" seed={product.rank * 3 + 1} />
      <div className="relative mx-auto max-w-[1800px] px-gutter">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-[var(--accent)]" /> From agave to glass
              </p>
            </Reveal>
            <RevealLines
              lines={["How it’s", <em key="m" className="text-[var(--glow)]">made.</em>]}
              className="font-display text-display-md font-light text-bone"
            />
            <h2 id="craft-title" className="sr-only">
              Production details
            </h2>
            {product.abv && (
              <Reveal delay={0.2}>
                <p className="mt-10 font-display text-[clamp(5rem,10vw,9rem)] font-light leading-none text-[var(--glow)]">
                  <Counter to={product.abv} />
                  <span className="text-[0.4em] text-mist">% ABV</span>
                </p>
              </Reveal>
            )}
          </div>
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-card bg-gold/12 sm:grid-cols-2">
            {product.specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="bg-ink-950 p-7">
                <dt className="text-[0.62rem] uppercase tracking-[0.3em] text-smoke">{s.label}</dt>
                <dd className="mt-3 font-display text-[1.45rem] font-light leading-snug text-bone">{s.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = String(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE_EXPO,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {to}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Serve it like + pairings
// ---------------------------------------------------------------------------
export function ServeIt({ product }: { product: Product }) {
  const serve = product.serve;
  if (!serve) return null;
  return (
    <section className="relative py-section" aria-labelledby="serve-title">
      <div className="mx-auto max-w-[1800px] px-gutter">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[var(--accent)]" /> Serve it like
            </p>
          </Reveal>
          <RevealLines lines={["Two ways to pour."]} className="font-display text-display-md font-light text-bone" />
          <h2 id="serve-title" className="sr-only">
            Serving suggestions
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {serve.neat && (
            <Reveal className="group relative overflow-hidden rounded-[1.6rem] bg-ink-900 p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.12)] md:p-12">
              <GlassArt kind="copita" />
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-[var(--glow)]">Neat</p>
              <p className="mt-4 max-w-[22rem] font-display text-[2rem] font-light leading-tight text-bone">{serve.neat.title}</p>
              <p className="mt-4 max-w-[24rem] text-[0.98rem] leading-relaxed text-mist">{serve.neat.detail}</p>
            </Reveal>
          )}
          {serve.cocktail && (
            <Reveal delay={0.1} className="group relative overflow-hidden rounded-[1.6rem] bg-ink-900 p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.12)] md:p-12">
              <GlassArt kind="rocks" />
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-[var(--glow)]">In a cocktail</p>
              <p className="mt-4 max-w-[22rem] font-display text-[2rem] font-light leading-tight text-bone">{serve.cocktail.name}</p>
              <ul className="mt-5 max-w-[24rem] space-y-2 text-[0.95rem] text-parchment">
                {serve.cocktail.ingredients.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-[var(--accent)]" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[26rem] text-[0.9rem] leading-relaxed text-mist">{serve.cocktail.method}</p>
              <Link href="/recipes" className="link-underline mt-6 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-[var(--glow)]">
                More recipes →
              </Link>
            </Reveal>
          )}
        </div>

        {product.pairsWith && product.pairsWith.length > 0 && (
          <Reveal className="mt-14">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-smoke">Pairs beautifully with</p>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {product.pairsWith.map((p) => (
                <li key={p} className="font-display text-[1.6rem] font-light italic text-parchment md:text-[2rem]">
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Line-art glass that draws in and fills with the product's colour on hover. */
function GlassArt({ kind }: { kind: "copita" | "rocks" }) {
  const path =
    kind === "copita"
      ? "M60 20 C58 70 56 110 62 140 C68 170 82 186 100 188 C118 186 132 170 138 140 C144 110 142 70 140 20 M100 188 L100 268 M62 272 C80 264 120 264 138 272"
      : "M44 70 L52 250 C53 262 60 268 72 268 L128 268 C140 268 147 262 148 250 L156 70";
  const fill = kind === "copita" ? "M64 112 C66 150 80 182 100 184 C120 182 134 150 136 112 Z" : "M50 150 L54 250 C55 258 60 262 70 262 L130 262 C140 262 145 258 146 250 L150 150 Z";
  return (
    <svg aria-hidden viewBox="0 0 200 290" className="pointer-events-none absolute -right-6 bottom-4 h-[60%] opacity-25 sm:-right-2 sm:h-[78%] sm:opacity-80 md:right-8">
      <path d={fill} fill="var(--accent)" fillOpacity="0.22" className="origin-bottom scale-y-[0.6] transition-transform duration-[1400ms] ease-expo group-hover:scale-y-100" style={{ transformBox: "fill-box" }} />
      <path d={path} fill="none" stroke="var(--glow)" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
      {kind === "rocks" && <ellipse cx="100" cy="70" rx="56" ry="9" fill="none" stroke="var(--glow)" strokeOpacity="0.7" strokeWidth="1.4" />}
      {kind === "copita" && <ellipse cx="100" cy="20" rx="40" ry="6" fill="none" stroke="var(--glow)" strokeOpacity="0.7" strokeWidth="1.4" />}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Adriana's note
// ---------------------------------------------------------------------------
export function MastersNote({ product, portrait }: { product: Product; portrait: Portrait }) {
  if (!product.mastersNote) return null;
  return (
    <section className="relative overflow-hidden py-section" aria-label="A note from Adriana">
      <GoldDust count={20} seed={product.rank + 40} />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-gutter md:grid-cols-[auto_1fr]">
        <Reveal className="relative mx-auto size-44 md:size-56">
          <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_50%,transparent),0_30px_80px_-20px_var(--accent)]">
            {portrait.src ? (
              <Image src={portrait.src} alt={portrait.alt} fill sizes="224px" className="object-cover" style={{ objectPosition: portrait.focal }} />
            ) : (
              <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--accent)_35%,transparent),#11100e_70%)]">
                <span className="font-display text-5xl font-light italic text-[var(--glow)]">AM</span>
              </div>
            )}
          </div>
          <CircularText text="Adriana Martinez · Tequila Master · " className="absolute -inset-6 size-[calc(100%+3rem)]" size={300} />
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow mb-6">A note from Adriana</p>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="font-display text-[clamp(1.9rem,1.2rem+2.4vw,3.4rem)] font-light italic leading-[1.15] text-bone">
              <span aria-hidden className="text-[var(--accent)]">“</span>
              {product.mastersNote}
              <span aria-hidden className="text-[var(--accent)]">”</span>
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[0.72rem] uppercase tracking-[0.28em] text-mist">
              Adriana Martinez <span className="text-smoke">· Canada&rsquo;s only Certified Tequila Master</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
