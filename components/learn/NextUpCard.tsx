/**
 * Hero aside for /events: the next event as a luminous "ticket" with a
 * rotating circular badge.
 */
import Link from "next/link";
import type { CSSProperties } from "react";
import type { EventItem } from "@/lib/experiences";
import { CircularText, OrbitRings } from "@/components/art/Art";

export function NextUpCard({ ev }: { ev: EventItem }) {
  return (
    <Link
      href="#calendar"
      className="group relative isolate mx-auto block w-full max-w-[30rem] overflow-hidden rounded-[1.6rem] bg-ink-900/80 p-8 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25),0_40px_100px_-40px_rgb(0_0_0/0.9)] backdrop-blur-sm md:p-10"
      style={{ "--accent": ev.accent, "--glow": ev.glow } as CSSProperties}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_80%_10%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_70%)]" />
      <OrbitRings className="absolute -bottom-40 -right-40 -z-10 w-[30rem] opacity-50" />
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow text-[var(--glow)]">Next up</p>
        <CircularText text="Toronto · GTA · Salud · " size={92} className="-mr-2 -mt-2 opacity-90" />
      </div>
      <p className="mt-2 font-display text-[clamp(5rem,4rem+4vw,8rem)] font-light leading-[0.8] text-bone">{ev.day}</p>
      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.3em] text-gold">
        {ev.month} {ev.year} · {ev.time}
      </p>
      <div className="my-7 h-px bg-[linear-gradient(90deg,var(--accent),transparent)]" />
      <p className="font-display text-[2rem] font-light leading-tight text-bone">{ev.title}</p>
      <p className="mt-2 text-[0.9rem] text-mist">{ev.venue}</p>
      <p className="mt-8 inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-gold-soft">
        See the calendar
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 transition-transform duration-[400ms] ease-expo group-hover:translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M12 4v15M6 13l6 6 6-6" />
        </svg>
      </p>
    </Link>
  );
}
