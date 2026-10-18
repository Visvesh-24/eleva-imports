"use client";

/**
 * Masterclass enquiry form. Client-side validation with inline, announced
 * errors; submits through the shared stub (lib/forms.ts). Formats picked on
 * the cards above pre-select here via a window event.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { MasterclassFormat } from "@/lib/experiences";
import { submitForm } from "@/lib/forms";
import { EASE_EXPO } from "@/lib/motion";
import { isEmail, SelectField, SubmitButton, TextArea, TextField } from "./Fields";
import { FORMAT_EVENT } from "./FormatCards";

type Errors = Partial<Record<"name" | "email" | "date" | "guests" | "age", string>>;

export function BookingForm({ formats }: { formats: Pick<MasterclassFormat, "id" | "title">[] }) {
  const [format, setFormat] = useState(formats[0]?.id ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ name: string; format: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const on = (e: Event) => setFormat((e as CustomEvent<string>).detail);
    window.addEventListener(FORMAT_EVENT, on);
    return () => window.removeEventListener(FORMAT_EVENT, on);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const next: Errors = {};
    if (!data["mc-name"]?.trim()) next.name = "Please tell us your name.";
    if (!isEmail(data["mc-email"] ?? "")) next.email = "Please enter a valid email address.";
    if (!data["mc-date"]) next.date = "Choose a preferred date (we'll confirm availability).";
    const guests = Number(data["mc-guests"]);
    if (!guests || guests < 1) next.guests = "How many guests are you expecting?";
    if (!fd.get("mc-age")) next.age = "All guests must be of legal drinking age.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`#mc-${first}`)?.focus();
      return;
    }
    setPending(true);
    await submitForm("masterclass", { ...data, format });
    setPending(false);
    setDone({ name: data["mc-name"].trim().split(" ")[0], format: formats.find((f) => f.id === format)?.title ?? "masterclass" });
  };

  return (
    <div className="relative" style={{ "--accent": "#e3a24a" } as React.CSSProperties}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            className="flex min-h-[28rem] flex-col items-center justify-center text-center"
          >
            <svg aria-hidden viewBox="0 0 120 120" className="size-28" fill="none" stroke="#e2c99b" strokeWidth="1.3" strokeLinecap="round">
              <motion.circle cx="60" cy="60" r="54" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: EASE_EXPO }} />
              <motion.path d="M42 30 C41 48 43 60 50 68 C54 72 57 73 60 73 C63 73 66 72 70 68 C77 60 79 48 78 30 Z M60 73 L60 90 M48 92 L72 92" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE_EXPO, delay: 0.4 }} />
              <motion.path d="M46 50 C55 53 65 47 74 50" stroke="#e3a24a" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EASE_EXPO, delay: 1.2 }} />
            </svg>
            <p className="eyebrow mt-8">Enquiry received</p>
            <p className="mt-4 max-w-md font-display text-[clamp(2rem,1.6rem+1.4vw,2.8rem)] font-light leading-tight text-bone">
              Salud, {done.name}. <em className="text-gold-soft">Your glass is being poured.</em>
            </p>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-mist">
              Adriana&rsquo;s team will reply within two business days to confirm your {done.format.toLowerCase()} and tailor the flight.
            </p>
            <button type="button" onClick={() => setDone(null)} className="link-underline mt-8 text-[0.72rem] uppercase tracking-[0.2em] text-gold-soft">
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="grid gap-6 md:grid-cols-2"
            aria-label="Masterclass enquiry"
          >
            <TextField id="mc-name" label="Your name" autoComplete="name" error={errors.name} required />
            <TextField id="mc-email" label="Email" type="email" autoComplete="email" error={errors.email} required />
            <TextField id="mc-date" label="Preferred date" type="date" error={errors.date} required />
            <TextField id="mc-guests" label="Guests" type="number" inputMode="numeric" min={1} max={200} defaultValue={8} error={errors.guests} required />
            <SelectField id="mc-format" label="Format" value={format} onChange={(e) => setFormat(e.target.value)} wrapClassName="md:col-span-2">
              {formats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </SelectField>
            <TextArea
              id="mc-notes"
              label="Tell us about the occasion"
              placeholder="Birthday dinner, client evening, a tequila-curious team…"
              wrapClassName="md:col-span-2"
            />
            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-start gap-4 text-[0.9rem] text-parchment">
                <input
                  id="mc-age"
                  name="mc-age"
                  type="checkbox"
                  aria-invalid={errors.age ? true : undefined}
                  aria-describedby={errors.age ? "mc-age-error" : undefined}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-md shadow-[inset_0_0_0_1px_rgb(201_164_106/0.5)] transition-colors checked:bg-amber checked:shadow-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold-soft"
                />
                <span>All guests will be of legal drinking age in the province of the tasting.</span>
              </label>
              {errors.age && (
                <p id="mc-age-error" className="mt-2 pl-9 text-[0.78rem] text-[#f0a08e]">
                  {errors.age}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-5 md:col-span-2">
              <SubmitButton pending={pending}>Book your experience</SubmitButton>
              <p className="text-[0.78rem] text-smoke">No payment now. We&rsquo;ll confirm availability and pricing first.</p>
            </div>
            <p className="sr-only" aria-live="assertive">
              {Object.values(errors).filter(Boolean).join(" ")}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
