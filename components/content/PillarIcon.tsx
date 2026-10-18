/** Line icons for the About philosophy pillars. Stroke uses currentColor. */
export type PillarIconName = "drop" | "house" | "book" | "glasses";

export function PillarIcon({ name, className = "" }: { name: PillarIconName; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden {...common}>
      {name === "drop" && (
        <>
          <path d="M24 6c6 9 12 15 12 23a12 12 0 0 1-24 0c0-8 6-14 12-23Z" />
          <path d="M18 31a6 6 0 0 0 6 6" />
          <path d="M8 8l32 32" strokeOpacity="0.5" />
        </>
      )}
      {name === "house" && (
        <>
          <path d="M8 22 24 9l16 13" />
          <path d="M12 19v20h24V19" />
          <path d="M20 39v-9h8v9" />
          <path d="M24 9V4M21 6h6" strokeOpacity="0.6" />
        </>
      )}
      {name === "book" && (
        <>
          <path d="M24 13c-4-3-10-4-16-3v26c6-1 12 0 16 3 4-3 10-4 16-3V10c-6-1-12 0-16 3Z" />
          <path d="M24 13v26" />
          <path d="M12 17c3-.4 6 0 8 1M12 23c3-.4 6 0 8 1M28 18c2-1 5-1.4 8-1M28 24c2-1 5-1.4 8-1" strokeOpacity="0.6" />
        </>
      )}
      {name === "glasses" && (
        <>
          <path d="M10 8h10l-1 10a4 4 0 0 1-8 0L10 8Z" />
          <path d="M15 22v12M11 34h8" />
          <path d="M28 8h10l-1 10a4 4 0 0 1-8 0L28 8Z" />
          <path d="M33 22v12M29 34h8" />
          <path d="M20 4l4 3 4-3" strokeOpacity="0.6" />
        </>
      )}
    </svg>
  );
}
