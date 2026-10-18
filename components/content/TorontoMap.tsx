"use client";

/**
 * Abstract line-art map of downtown Toronto: a street grid that draws itself
 * on, the Lake Ontario shoreline with drifting water lines, the CN Tower as a
 * glyph and a pulsing pin. Decorative; no external map service.
 */
import { useEffect, useRef, type CSSProperties } from "react";

const H_STREETS = [70, 110, 150, 190, 228];
const V_STREETS = [60, 120, 180, 240, 300, 360, 420, 480, 540];

export function TorontoMap({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let shore = "M-20 268";
  for (let x = 0; x <= 640; x += 40) shore += ` Q${x - 20} ${x % 80 === 0 ? 262 : 276} ${x} 268`;

  return (
    <svg ref={ref} viewBox="0 0 600 400" className={`art-draw ${className}`} fill="none" aria-hidden strokeLinecap="round">
      <defs>
        <radialGradient id="tm-pin" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e3a24a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e3a24a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="tm-lake">
          <rect x="0" y="268" width="600" height="132" />
        </clipPath>
      </defs>

      {/* Street grid (Toronto's grid sits ~16° off true north) */}
      <g transform="rotate(-16 300 160)" stroke="#c9a46a" strokeWidth="0.7">
        {H_STREETS.map((y, i) => (
          <path key={`h${y}`} d={`M-60 ${y} L660 ${y}`} strokeOpacity="0.22" style={{ "--len": 720, "--d": `${i * 0.12}s` } as CSSProperties} />
        ))}
        {V_STREETS.map((x, i) => (
          <path key={`v${x}`} d={`M${x} -40 L${x} 300`} strokeOpacity="0.16" style={{ "--len": 340, "--d": `${0.3 + i * 0.08}s` } as CSSProperties} />
        ))}
        {/* Yonge Street */}
        <path d="M300 -60 L300 300" stroke="#e2c99b" strokeOpacity="0.6" strokeWidth="1.2" style={{ "--len": 360, "--d": "0.9s" } as CSSProperties} />
      </g>

      {/* Shoreline + lake */}
      <path d={shore} stroke="#e2c99b" strokeOpacity="0.55" strokeWidth="1.2" style={{ "--len": 900, "--d": "0.6s" } as CSSProperties} />
      <g clipPath="url(#tm-lake)">
        {[300, 324, 350, 378].map((y, i) => (
          <g key={y} style={{ animation: `wave-x ${18 + i * 6}s linear infinite` }}>
            <path
              d={`M0 ${y} ${Array.from({ length: 12 }, (_, k) => `Q${k * 100 + 25} ${y - 4} ${k * 100 + 50} ${y} T${k * 100 + 100} ${y}`).join(" ")}`}
              stroke="#c9a46a"
              strokeOpacity={0.18 - i * 0.03}
              style={{ "--len": 2400 } as CSSProperties}
            />
          </g>
        ))}
      </g>
      <text x="40" y="372" fill="#8a8073" fontSize="11" letterSpacing="4">
        LAKE ONTARIO
      </text>

      {/* CN Tower glyph */}
      <g stroke="#e2c99b" strokeOpacity="0.75" strokeWidth="1.1" transform="translate(250 92)">
        <path d="M10 0 L10 168" style={{ "--len": 170, "--d": "1.2s" } as CSSProperties} />
        <path d="M4 168 L10 40 L16 168" strokeOpacity="0.45" style={{ "--len": 300, "--d": "1.3s" } as CSSProperties} />
        <ellipse cx="10" cy="70" rx="9" ry="4" />
        <ellipse cx="10" cy="34" rx="4" ry="2" />
      </g>

      {/* Pin */}
      <g transform="translate(332 190)">
        <circle r="46" fill="url(#tm-pin)" style={{ animation: "pulse-glow 3.2s var(--ease-silk) infinite", transformBox: "fill-box", transformOrigin: "center" }} />
        <g style={{ animation: "spin-slow 24s linear infinite", transformBox: "fill-box", transformOrigin: "center" }}>
          {/* Inline dash styles override the draw-on rule for this dotted ring. */}
          <circle r="26" stroke="#e3a24a" strokeOpacity="0.6" style={{ strokeDasharray: "2 6", strokeDashoffset: 0, animation: "none" }} />
        </g>
        <circle r="6" fill="#f8c898" />
        <circle r="11" stroke="#f8c898" strokeOpacity="0.6" style={{ "--len": 80, "--d": "1.6s" } as CSSProperties} />
      </g>
      <text x="368" y="176" fill="#e2c99b" fontSize="12" letterSpacing="3">
        TORONTO
      </text>
      <text x="368" y="194" fill="#8a8073" fontSize="10" letterSpacing="2">
        43.65° N · 79.38° W
      </text>
    </svg>
  );
}
