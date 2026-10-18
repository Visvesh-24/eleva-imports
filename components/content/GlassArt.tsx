"use client";

/**
 * Line-art cocktail glasses (coupe, rocks, highball, copita, wine, snifter)
 * that draw themselves on when scrolled into view, then hold a gently
 * moving liquid surface, rising bubbles, ice and garnish. Outline colours come
 * from --accent / --glow on a parent; the liquid colour is a prop.
 */
import { useEffect, useId, useRef, type CSSProperties } from "react";
import type { Garnish, GlassKind } from "@/lib/recipes";

interface Spec {
  outline: string[];
  rim: [number, number, number, number];
  foot?: [number, number, number, number];
  clip: string;
  surface: number;
  highlight: string;
  anchor: [number, number];
  ice?: [number, number, number, number][];
}

const SPECS: Record<GlassKind, Spec> = {
  coupe: {
    outline: ["M36 62 C38 104 70 122 100 122 C130 122 162 104 164 62", "M100 122 L100 214"],
    rim: [100, 62, 64, 7],
    foot: [100, 222, 40, 7],
    clip: "M36 62 C38 104 70 122 100 122 C130 122 162 104 164 62 Z",
    surface: 76,
    highlight: "M50 74 C54 96 70 108 86 113",
    anchor: [150, 60],
  },
  rocks: {
    outline: ["M46 112 L54 232 Q100 240 146 232 L154 112", "M53 218 Q100 225 147 218"],
    rim: [100, 112, 54, 7],
    clip: "M47 112 L54 218 Q100 225 146 218 L153 112 Z",
    surface: 156,
    highlight: "M60 126 L66 206",
    anchor: [146, 110],
    ice: [
      [74, 150, 34, -8],
      [108, 158, 30, 10],
    ],
  },
  highball: {
    outline: ["M60 40 L65 236 Q100 242 135 236 L140 40", "M64.5 222 Q100 228 135.5 222"],
    rim: [100, 40, 40, 6],
    clip: "M61 40 L64.5 222 Q100 228 135.5 222 L139 40 Z",
    surface: 70,
    highlight: "M72 54 L76 212",
    anchor: [134, 38],
    ice: [
      [74, 76, 28, -6],
      [100, 104, 26, 9],
      [78, 136, 26, 4],
      [104, 168, 24, -10],
    ],
  },
  copita: {
    outline: [
      "M74 42 C68 84 68 112 78 132 C86 148 94 154 100 154 C106 154 114 148 122 132 C132 112 132 84 126 42",
      "M100 154 L100 222",
    ],
    rim: [100, 42, 26, 4],
    foot: [100, 228, 34, 6],
    clip: "M74 42 C68 84 68 112 78 132 C86 148 94 154 100 154 C106 154 114 148 122 132 C132 112 132 84 126 42 Z",
    surface: 110,
    highlight: "M80 58 C76 90 78 116 86 134",
    anchor: [124, 40],
  },
  wine: {
    outline: [
      "M54 36 C46 92 54 132 80 148 C90 154 96 156 100 156 C104 156 110 154 120 148 C146 132 154 92 146 36",
      "M100 156 L100 224",
    ],
    rim: [100, 36, 46, 6],
    foot: [100, 230, 40, 7],
    clip: "M54 36 C46 92 54 132 80 148 C90 154 96 156 100 156 C104 156 110 154 120 148 C146 132 154 92 146 36 Z",
    surface: 92,
    highlight: "M62 52 C58 90 64 120 80 138",
    anchor: [144, 34],
    ice: [
      [78, 98, 28, -8],
      [106, 108, 26, 12],
    ],
  },
  snifter: {
    outline: ["M72 72 C42 96 40 150 66 174 C80 186 120 186 134 174 C160 150 158 96 128 72", "M100 184 L100 214"],
    rim: [100, 72, 28, 5],
    foot: [100, 222, 40, 7],
    clip: "M72 72 C42 96 40 150 66 174 C80 186 120 186 134 174 C160 150 158 96 128 72 Z",
    surface: 140,
    highlight: "M60 108 C54 130 58 152 70 166",
    anchor: [126, 70],
  },
};

/** A wave strip 0..400 wide (period 50) so a -50% shift loops seamlessly. */
function wavePath(y: number, amp: number, bottom = 260) {
  let d = `M0 ${y}`;
  for (let x = 0; x < 400; x += 50) d += ` Q${x + 12.5} ${y - amp} ${x + 25} ${y} T${x + 50} ${y}`;
  return `${d} L400 ${bottom} L0 ${bottom} Z`;
}
function waveLine(y: number, amp: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x < 400; x += 50) d += ` Q${x + 12.5} ${y - amp} ${x + 25} ${y} T${x + 50} ${y}`;
  return d;
}

/** Round trig-derived coordinates so server and client markup match exactly. */
const r2 = (v: number) => Math.round(v * 100) / 100;

const BUBBLES = [
  [86, 0.35, 1.6, 0],
  [112, 0.6, 1.2, -1.4],
  [98, 0.8, 1.9, -2.6],
  [120, 0.45, 1, -0.7],
  [80, 0.7, 1.3, -3.4],
] as const;

export function GlassArt({
  kind,
  liquid,
  garnish = "none",
  ice = false,
  className = "",
  title,
}: {
  kind: GlassKind;
  liquid: string;
  garnish?: Garnish;
  ice?: boolean;
  className?: string;
  /** Accessible label; omit for decorative use. */
  title?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = SPECS[kind];

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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [ax, ay] = s.anchor;
  const bottom = 240;
  const depth = bottom - s.surface;

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 260"
      className={`art-draw overflow-visible ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <clipPath id={`c${uid}`}>
          <path d={s.clip} />
        </clipPath>
        <linearGradient id={`l${uid}`} x1="0" y1={s.surface} x2="0" y2={bottom} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={liquid} stopOpacity="0.95" />
          <stop offset="1" stopColor={liquid} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`g${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={liquid} stopOpacity="0.55" />
          <stop offset="1" stopColor={liquid} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow pooled under the glass */}
      <ellipse cx="100" cy={s.foot ? s.foot[1] + 6 : 240} rx="70" ry="14" fill={`url(#g${uid})`} opacity="0.7" />

      {/* Liquid */}
      <g clipPath={`url(#c${uid})`}>
        <g style={{ animation: "wave-x 7s linear infinite" }}>
          <path d={wavePath(s.surface, 2.2)} fill={`url(#l${uid})`} />
          <path d={waveLine(s.surface, 2.2)} stroke="var(--glow, #fff)" strokeOpacity="0.7" strokeWidth="0.9" />
        </g>
        {ice &&
          s.ice?.map(([x, y, w, r], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={w}
              rx="5"
              transform={`rotate(${r} ${x + w / 2} ${y + w / 2})`}
              fill="#fff"
              fillOpacity="0.1"
              stroke="var(--glow, #fff)"
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
          ))}
        {BUBBLES.map(([x, t, r, delay], i) => (
          <circle
            key={i}
            cx={x}
            cy={r2(s.surface + depth * t)}
            r={r}
            fill="#fff"
            fillOpacity="0.55"
            style={{ animation: `dust ${3.2 + i * 0.4}s linear ${delay}s infinite`, "--dx": "0px", "--dy": `${r2(-depth * t * 0.8)}px`, "--o": 0.8 } as CSSProperties}
          />
        ))}
        {garnish === "pistachio" &&
          [72, 84, 95, 108, 118, 129].map((x, i) => <circle key={i} cx={x} cy={s.surface + 1 + (i % 2)} r="2" fill="#9db35a" />)}
        {garnish === "cherry" && (
          <g>
            <circle cx="112" cy={s.surface + 26} r="8" fill="#7a1420" stroke="var(--glow)" strokeOpacity="0.4" />
            <path d={`M112 ${s.surface + 18} C114 ${s.surface + 4} 120 ${s.surface - 2} 128 ${s.surface - 10}`} stroke="#5a3a1a" strokeWidth="1.4" />
          </g>
        )}
      </g>

      {/* Glass outline (draws on) */}
      <g stroke="var(--accent, #c9a46a)" strokeWidth="1.5">
        {s.outline.map((d, i) => (
          <path key={d} d={d} style={{ "--len": 420, "--d": `${i * 0.25}s` } as CSSProperties} />
        ))}
        <ellipse cx={s.rim[0]} cy={s.rim[1]} rx={s.rim[2]} ry={s.rim[3]} strokeOpacity="0.9" />
        {s.foot && <ellipse cx={s.foot[0]} cy={s.foot[1]} rx={s.foot[2]} ry={s.foot[3]} strokeOpacity="0.8" />}
      </g>
      <path d={s.highlight} stroke="var(--glow, #fff)" strokeOpacity="0.55" strokeWidth="2.4" style={{ "--len": 200, "--d": "0.8s" } as CSSProperties} />

      {/* Garnish on the rim */}
      {garnish === "salt" &&
        Array.from({ length: 16 }, (_, i) => {
          const a = Math.PI + (i / 15) * Math.PI * 0.55;
          return <circle key={i} cx={r2(s.rim[0] + Math.cos(a) * s.rim[2])} cy={r2(s.rim[1] + Math.sin(a) * s.rim[3] + (i % 3) * 0.6)} r="1.3" fill="#f3ebdd" fillOpacity="0.85" />;
        })}
      {garnish === "lime" && (
        <g transform={`translate(${ax - 4} ${ay - 12})`}>
          <circle r="15" fill="#c9de7a" fillOpacity="0.85" stroke="#e8f3b8" strokeWidth="1.2" />
          <circle r="11.5" fill="none" stroke="#f3f9d6" strokeOpacity="0.7" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="0" y1="0" x2={r2(Math.cos((i / 8) * Math.PI * 2) * 11)} y2={r2(Math.sin((i / 8) * Math.PI * 2) * 11)} stroke="#f3f9d6" strokeOpacity="0.8" strokeWidth="0.8" />
          ))}
        </g>
      )}
      {garnish === "grapefruit" && (
        <g transform={`translate(${ax - 2} ${ay - 2}) rotate(-24)`}>
          <path d="M-20 0 A20 20 0 0 1 20 0 Z" fill="#f2856a" fillOpacity="0.9" stroke="#ffd2c2" strokeWidth="1.2" />
          {[-60, -30, 0, 30, 60].map((d) => (
            <line key={d} x1="0" y1="0" x2={r2(Math.sin((d * Math.PI) / 180) * 16)} y2={r2(-Math.cos((d * Math.PI) / 180) * 16)} stroke="#ffd2c2" strokeOpacity="0.8" strokeWidth="0.8" />
          ))}
        </g>
      )}
      {garnish === "orange" && (
        <path
          d={`M${ax - 6} ${ay - 2} C${ax + 14} ${ay - 18} ${ax + 22} ${ay + 6} ${ax + 6} ${ay + 18} C${ax - 6} ${ay + 28} ${ax + 8} ${ay + 40} ${ax - 2} ${ay + 54}`}
          stroke="#f0a24a"
          strokeWidth="4"
          style={{ "--len": 160, "--d": "1s" } as CSSProperties}
        />
      )}
      {garnish === "strawberry" && (
        <g transform={`translate(${ax - 4} ${ay - 10})`}>
          <path d="M0 -12 C10 -12 14 -2 10 6 C7 12 2 16 0 18 C-2 16 -7 12 -10 6 C-14 -2 -10 -12 0 -12 Z" fill="#e2435f" fillOpacity="0.9" stroke="#ffb3c2" strokeWidth="1" />
          <path d="M-6 -12 L0 -17 L6 -12" stroke="#7fa65a" strokeWidth="1.6" />
          {[
            [-4, -4],
            [3, -2],
            [-2, 5],
            [4, 7],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.9" fill="#ffe3a8" />
          ))}
        </g>
      )}
    </svg>
  );
}
