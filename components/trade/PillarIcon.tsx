/** Line icons for the trade program pillars (draw on when revealed). */
import type { PillarIcon as Kind } from "@/lib/trade";

export function PillarIcon({ kind, className = "" }: { kind: Kind; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} {...common}>
      {kind === "bar" && (
        <>
          <path d="M6 40h36M8 34h32" />
          <path d="M13 34V18l2-4V8h3v6l2 4v16M24 34V20l1.5-3V11h3v6L30 20v14M35 34V22l1-2v-4h2v4l1 2v12" />
        </>
      )}
      {kind === "train" && (
        <>
          <circle cx="24" cy="14" r="6" />
          <path d="M12 40c0-7 5.4-12 12-12s12 5 12 12" />
          <path d="M34 8l6 3-6 3M40 11v8" />
        </>
      )}
      {kind === "menu" && (
        <>
          <rect x="11" y="6" width="26" height="36" rx="2" />
          <path d="M17 14h14M17 20h10M17 26h14M17 32h8" />
          <path d="M33 30l4 4 6-8" />
        </>
      )}
      {kind === "allocation" && (
        <>
          <path d="M24 5l5.6 11.4L42 18.2l-9 8.8 2.1 12.5L24 33.6l-11.1 5.9L15 27l-9-8.8 12.4-1.8z" />
          <circle cx="24" cy="22" r="3" />
        </>
      )}
      {kind === "reorder" && (
        <>
          <path d="M38 18a15 15 0 0 0-27-4M10 30a15 15 0 0 0 27 4" />
          <path d="M11 6v8h8M37 42v-8h-8" />
        </>
      )}
    </svg>
  );
}
