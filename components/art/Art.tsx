"use client";

/**
 * Decorative, animated vector art used behind collection and product heroes.
 * Everything is aria-hidden, pointer-events-none, transform/opacity-only and
 * honours prefers-reduced-motion (via the global rule in globals.css).
 * Colours come from the --accent / --glow CSS variables of the parent.
 */
import { useEffect, useRef, type CSSProperties } from "react";

/** Round generated coordinates: Node and browsers can differ in the last
 *  digits of Math.sin/cos, which would otherwise cause hydration mismatches. */
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Deterministic PRNG so server and client render identical art. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Adds .is-in when the element scrolls into view (triggers draw-on). */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ---------------------------------------------------------------------------
/** A blue-agave rosette in line art that draws itself on, then sways. */
export function AgaveArt({ className = "", seed = 7, leaves = 15 }: { className?: string; seed?: number; leaves?: number }) {
  const ref = useInView<SVGSVGElement>();
  const r = rng(seed);
  const paths: { d: string; len: number; delay: number; w: number }[] = [];
  for (let i = 0; i < leaves; i++) {
    const t = i / (leaves - 1);
    const ang = -168 + t * 156 + (r() - 0.5) * 8; // fan from left to right
    const len = 170 + Math.sin(t * Math.PI) * 190 + r() * 40;
    const a = (ang * Math.PI) / 180;
    const bx = 300;
    const by = 470;
    const tipX = bx + Math.cos(a) * len;
    const tipY = by + Math.sin(a) * len;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    const width = 18 + Math.sin(t * Math.PI) * 16;
    const bend = (r() - 0.5) * 40;
    const mx = bx + Math.cos(a) * len * 0.55 + nx * bend;
    const my = by + Math.sin(a) * len * 0.55 + ny * bend;
    const d = `M${r2(bx - nx * width * 0.5)},${r2(by - ny * width * 0.5)} Q${r2(mx - nx * width)},${r2(my - ny * width)} ${r2(tipX)},${r2(tipY)} Q${r2(mx + nx * width)},${r2(my + ny * width)} ${r2(bx + nx * width * 0.5)},${r2(by + ny * width * 0.5)}`;
    paths.push({ d, len: Math.round(len * 2.4), delay: 0.04 * i, w: 1 });
    // central vein
    paths.push({ d: `M${bx},${by} Q${r2(mx)},${r2(my)} ${r2(tipX)},${r2(tipY)}`, len: Math.round(len * 1.2), delay: 0.04 * i + 0.4, w: 0.5 });
  }
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 600 500"
      className={`art-draw pointer-events-none ${className}`}
      fill="none"
      stroke="var(--accent, #c9a46a)"
      strokeLinecap="round"
    >
      <g style={{ transformOrigin: "300px 470px", animation: "sway 9s var(--ease-silk) infinite" }}>
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            strokeWidth={p.w}
            strokeOpacity={p.w < 1 ? 0.35 : 0.55}
            style={{ "--len": p.len, "--d": `${p.delay}s` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
/** Concentric dial: dashed rings + tick marks rotating at different speeds. */
export function OrbitRings({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  return (
    <svg aria-hidden viewBox="0 0 800 800" className={`pointer-events-none ${className}`} fill="none">
      <g style={{ transformOrigin: "400px 400px", animation: "spin-slow 120s linear infinite" }}>
        <circle cx="400" cy="400" r="380" stroke="var(--accent)" strokeOpacity="0.22" strokeDasharray="2 10" />
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          const long = i % 6 === 0;
          const rr1 = 352;
          const rr2 = long ? 336 : 344;
          return (
            <line
              key={i}
              x1={r2(400 + Math.cos(a) * rr1)}
              y1={r2(400 + Math.sin(a) * rr1)}
              x2={r2(400 + Math.cos(a) * rr2)}
              y2={r2(400 + Math.sin(a) * rr2)}
              stroke="var(--accent)"
              strokeOpacity={long ? 0.5 : 0.22}
            />
          );
        })}
      </g>
      <g style={{ transformOrigin: "400px 400px", animation: "spin-rev 80s linear infinite" }}>
        <circle cx="400" cy="400" r="300" stroke="var(--accent)" strokeOpacity="0.16" />
        <circle cx="400" cy="100" r="4" fill="var(--glow)" fillOpacity="0.9" />
        <circle cx="400" cy="700" r="2.5" fill="var(--accent)" fillOpacity="0.7" />
      </g>
      <g style={{ transformOrigin: "400px 400px", animation: "spin-slow 50s linear infinite" }}>
        <circle cx="400" cy="400" r="230" stroke="var(--glow)" strokeOpacity="0.12" strokeDasharray="60 18 4 18" />
        <circle cx="630" cy="400" r="3" fill="var(--glow)" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
/** Rising gold dust (CSS-animated, deterministic positions). */
export function GoldDust({ count = 26, seed = 3, className = "" }: { count?: number; seed?: number; className?: string }) {
  const r = rng(seed);
  const motes = Array.from({ length: count }, (_, i) => ({
    i,
    left: r2(r() * 100),
    top: r2(30 + r() * 70),
    size: r2(1 + r() * 2.6),
    dur: r2(7 + r() * 9),
    delay: r2(-r() * 16),
    dx: r2((r() - 0.5) * 80),
    dy: r2(-(80 + r() * 220)),
    o: r2(0.35 + r() * 0.55),
  }));
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {motes.map((m) => (
        <span
          key={m.i}
          className="absolute rounded-full"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              background: "var(--glow)",
              boxShadow: "0 0 6px var(--glow)",
              animation: `dust ${m.dur}s linear ${m.delay}s infinite`,
              "--dx": `${m.dx}px`,
              "--dy": `${m.dy}px`,
              "--o": m.o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
/** Circular rotating text badge. */
export function CircularText({
  text,
  className = "",
  size = 160,
}: {
  text: string;
  className?: string;
  size?: number;
}) {
  const id = `ct-${text.length}-${size}`;
  return (
    <svg aria-hidden viewBox="0 0 200 200" width={size} height={size} className={`pointer-events-none ${className}`}>
      <defs>
        <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <g style={{ transformOrigin: "100px 100px", animation: "spin-slow 28s linear infinite" }}>
        <text fill="var(--accent)" fontSize="13" letterSpacing="5.2" style={{ textTransform: "uppercase" }}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="3" fill="var(--glow)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
/** Flowing horizontal sine lines (liquid motif). */
export function WaveLines({ className = "", lines = 9 }: { className?: string; lines?: number }) {
  const r = rng(11);
  const rows = Array.from({ length: lines }, (_, i) => {
    const amp = 8 + r() * 18;
    const wl = 160 + r() * 140;
    let d = `M0 ${50 + i * 26}`;
    for (let x = 0; x <= 2400; x += 20) d += ` L${x} ${(50 + i * 26 + Math.sin((x / wl) * Math.PI * 2) * amp).toFixed(1)}`;
    return { d, dur: 26 + r() * 30, o: 0.08 + r() * 0.16 };
  });
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      <svg viewBox={`0 0 2400 ${80 + lines * 26}`} preserveAspectRatio="none" className="h-full w-[200%]" fill="none">
        {rows.map((row, i) => (
          <path
            key={i}
            d={row.d}
            stroke="var(--accent)"
            strokeOpacity={row.o}
            strokeWidth="1"
            style={{ animation: `wave-x ${row.dur}s linear infinite` }}
          />
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
/** Slowly rotating light rays (conic gradient). */
export function LightRays({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-60"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, color-mix(in srgb, var(--glow) 16%, transparent) 0deg 3deg, transparent 3deg 14deg)",
          maskImage: "radial-gradient(circle, black 0%, transparent 62%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 62%)",
          animation: "spin-slow 140s linear infinite",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
/** Talavera-inspired rosette tile, rotating very slowly. */
export function TalaveraRosette({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i);
  const dots = Array.from({ length: 36 }, (_, i) => i);
  return (
    <svg aria-hidden viewBox="0 0 600 600" className={`pointer-events-none ${className}`} fill="none">
      <g style={{ transformOrigin: "300px 300px", animation: "spin-slow 160s linear infinite" }}>
        {petals.map((i) => (
          <path
            key={i}
            d="M300 300 C 270 230, 280 150, 300 110 C 320 150, 330 230, 300 300 Z"
            transform={`rotate(${i * 30} 300 300)`}
            stroke="var(--accent)"
            strokeOpacity="0.38"
          />
        ))}
        {dots.map((i) => {
          const a = (i / dots.length) * Math.PI * 2;
          return <circle key={i} cx={r2(300 + Math.cos(a) * 225)} cy={r2(300 + Math.sin(a) * 225)} r={i % 3 === 0 ? 7 : 3.5} fill="var(--glow)" fillOpacity={i % 3 === 0 ? 0.35 : 0.2} />;
        })}
        <circle cx="300" cy="300" r="262" stroke="var(--accent)" strokeOpacity="0.25" strokeDasharray="1 9" strokeLinecap="round" />
        <circle cx="300" cy="300" r="190" stroke="var(--glow)" strokeOpacity="0.14" />
        <circle cx="300" cy="300" r="34" stroke="var(--accent)" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
/** Huge outlined word drifting slowly behind content. */
export function BackdropWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none overflow-hidden whitespace-nowrap ${className}`}>
      <div className="flex w-max" style={{ animation: "marquee-x 60s linear infinite" }}>
        {[0, 1].map((k) => (
          <span key={k} className="text-outline pr-[0.3em] font-display text-[clamp(8rem,22vw,22rem)] font-light italic leading-none">
            {word}&nbsp;·&nbsp;{word}&nbsp;·&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
/** Picks the motif for a collection. */
export function Motif({ motif, className = "" }: { motif: "agave" | "rings" | "waves" | "rays" | "talavera"; className?: string }) {
  switch (motif) {
    case "agave":
      return <AgaveArt className={className} />;
    case "rings":
      return <OrbitRings className={className} />;
    case "waves":
      return <WaveLines className={className} />;
    case "rays":
      return <LightRays className={className} />;
    case "talavera":
      return <TalaveraRosette className={className} />;
  }
}
