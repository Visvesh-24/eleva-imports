"use client";

/**
 * Upcoming events as large date-led rows. Hovering (or focusing) a row
 * floods it with the event's own light and draws its motif; "Request a seat"
 * expands an inline RSVP form under the row. Area chips filter the list with
 * animated layout transitions.
 */
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import type { EventItem } from "@/lib/experiences";
import { submitForm } from "@/lib/forms";
import { EASE_EXPO } from "@/lib/motion";
import { Motif } from "@/components/art/Art";
import { isEmail, SubmitButton, TextField } from "./Fields";

const AREAS = ["All", "Toronto", "GTA"] as const;

export function EventsList({ events }: { events: EventItem[] }) {
  const [area, setArea] = useState<(typeof AREAS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const shown = events.filter((e) => area === "All" || e.area === area);

  return (
    <div>
      <div role="group" aria-label="Filter events by area" className="mb-10 flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={area === a}
            onClick={() => setArea(a)}
            className={`h-10 rounded-pill px-5 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-[400ms] ${
              area === a ? "bg-gold-soft text-ink-950" : "text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] hover:text-bone"
            }`}
          >
            {a === "All" ? "All events" : a}
          </button>
        ))}
      </div>

      <LayoutGroup>
        <motion.ul layout className="border-t border-gold/15">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((ev, i) => (
              <motion.li
                layout={!reduce}
                key={ev.id}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.9, ease: EASE_EXPO, delay: reduce ? 0 : (i % 3) * 0.06 }}
                className="border-b border-gold/15"
              >
                <EventRow ev={ev} open={openId === ev.id} onToggle={() => setOpenId(openId === ev.id ? null : ev.id)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      {shown.length === 0 && <p className="py-16 text-center text-mist">No events in this area yet. Check back soon.</p>}
    </div>
  );
}

function EventRow({ ev, open, onToggle }: { ev: EventItem; open: boolean; onToggle: () => void }) {
  const panelId = `rsvp-${ev.id}`;
  return (
    <article
      className={`group relative isolate overflow-hidden ${open ? "[--lit:1]" : "[--lit:0] focus-within:[--lit:1] hover:[--lit:1]"}`}
      style={{ "--accent": ev.accent, "--glow": ev.glow } as CSSProperties}
    >
      {/* Light flood + motif */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[var(--lit)] transition-opacity duration-[900ms] ease-expo"
        style={{ background: "radial-gradient(60% 120% at 85% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)" }}
      />
      <div aria-hidden className="absolute -right-24 top-1/2 -z-10 w-[34rem] -translate-y-1/2 opacity-[calc(var(--lit)*0.6)] transition-opacity duration-[1200ms] ease-expo max-md:hidden">
        <Motif motif={ev.motif} className={ev.motif === "waves" ? "h-48 w-full" : ev.motif === "rays" ? "relative h-[34rem] w-full" : "w-full"} />
      </div>

      <div className="grid grid-cols-[5.5rem_1fr] items-start gap-x-5 gap-y-4 py-8 md:grid-cols-[11rem_1fr_auto] md:items-center md:gap-x-10 md:py-10">
        {/* Date */}
        <div className="leading-none">
          <span className="block font-display text-[clamp(3.6rem,2.4rem+4vw,6.5rem)] font-light leading-[0.8] text-bone transition-colors duration-[600ms] group-hover:text-[var(--glow)]">
            {ev.day}
          </span>
          <span className="mt-2 block text-[0.62rem] uppercase tracking-[0.3em] text-gold">
            {ev.month} {ev.year}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[0.62rem] uppercase tracking-[0.26em] text-smoke">
            {ev.weekday} · {ev.time} · {ev.kind}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.8rem,1.3rem+1.8vw,3rem)] font-light leading-[1.02] text-bone">{ev.title}</h3>
          <p className="mt-2 text-[0.9rem] text-parchment">
            {ev.venue}, {ev.area}
          </p>
          <p
            className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed text-mist md:overflow-hidden md:transition-all md:duration-[900ms] md:ease-expo ${
              open
                ? "md:max-h-40 md:opacity-100"
                : "md:max-h-0 md:opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100 md:group-focus-within:max-h-40 md:group-focus-within:opacity-100"
            }`}
          >
            {ev.description}
          </p>
        </div>

        <div className="col-span-2 flex items-center justify-between gap-6 md:col-span-1 md:flex-col md:items-end">
          <p className="text-right">
            <span className="font-display text-[1.7rem] leading-none text-bone">{ev.price === null ? "Free" : `$${ev.price}`}</span>
            <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-smoke">{ev.price === null ? ev.seats : `CAD · ${ev.seats}`}</span>
          </p>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className={`inline-flex h-11 items-center gap-3 rounded-pill px-6 text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-[400ms] ${
              open ? "bg-[var(--accent)] text-ink-950" : "text-bone shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_60%,transparent)] hover:bg-[var(--accent)] hover:text-ink-950"
            }`}
          >
            {open ? "Close" : ev.price === null ? "Register interest" : "Request a seat"}
            <span aria-hidden className={`transition-transform duration-[500ms] ease-expo ${open ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
            className="overflow-hidden"
          >
            <Rsvp ev={ev} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function Rsvp({ ev }: { ev: EventItem }) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const id = (k: string) => `${ev.id}-${k}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const next: typeof errors = {};
    if (!data[id("name")]?.trim()) next.name = "Please add your name.";
    if (!isEmail(data[id("email")] ?? "")) next.email = "Please enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    await submitForm("event", { event: ev.id, ...data });
    setPending(false);
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="mb-10 rounded-card bg-ink-900/80 p-7 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_40%,transparent)] md:ml-[13.5rem]">
        <p className="eyebrow text-[var(--glow)]">You&rsquo;re on the list</p>
        <p className="mt-3 font-display text-[1.8rem] font-light text-bone">
          We&rsquo;ll hold a place for you at <em className="text-[var(--glow)]">{ev.title}</em>.
        </p>
        <p className="mt-2 text-[0.9rem] text-mist">Look out for a confirmation email with details and payment.</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label={`Request a seat at ${ev.title}`}
      className="mb-10 grid gap-5 rounded-card bg-ink-900/80 p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.16)] sm:grid-cols-2 md:ml-[13.5rem] md:grid-cols-[1fr_1fr_8rem_auto] md:items-end md:p-7"
    >
      <TextField id={id("name")} label="Name" autoComplete="name" error={errors.name} />
      <TextField id={id("email")} label="Email" type="email" autoComplete="email" error={errors.email} />
      <TextField id={id("guests")} label="Seats" type="number" min={1} max={12} defaultValue={2} inputMode="numeric" />
      <div className="sm:col-span-2 md:col-span-1">
        <SubmitButton pending={pending}>{ev.price === null ? "Count me in" : "Hold my seat"}</SubmitButton>
      </div>
    </form>
  );
}
