"use client";

/**
 * Trade account application. Client-side validation with inline,
 * screen-reader-announced errors; submits through the shared form stub
 * (lib/forms.ts) and swaps to an animated confirmation.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { PROVINCES } from "@/lib/age";
import { submitForm } from "@/lib/forms";
import { EASE_EXPO } from "@/lib/motion";
import { VENUES } from "@/lib/trade";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Spinner } from "./fields";

const VOLUMES = ["1–4 cases / month", "5–14 cases / month", "15+ cases / month", "Not sure yet"];

type Errors = Partial<Record<"venue" | "contact" | "email" | "licence", string>>;

export function TradeApplicationForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const next: Errors = {};
    if (!data.venue?.trim()) next.venue = "Please tell us your venue's name.";
    if (!data.contact?.trim()) next.contact = "Who should we speak with?";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) next.email = "Please enter a valid email address.";
    if (!data.licence?.trim()) next.licence = "A liquor licence number is required for trade accounts.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    setState("sending");
    await submitForm("trade-application", data);
    setState("done");
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span id={`ta-${k}-err`} role="alert" className="mt-2 block text-[0.75rem] text-[#f0a090]">
        {errors[k]}
      </span>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `ta-${k}-err` : undefined });

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] bg-ink-900/85 p-6 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.22),0_40px_100px_-40px_rgb(0_0_0/0.9)] backdrop-blur-sm sm:p-8 md:p-12">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.22),transparent)]" />
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            className="relative py-10 text-center"
            role="status"
          >
            <svg viewBox="0 0 64 64" className="mx-auto size-16 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <circle cx="32" cy="32" r="30" strokeDasharray="190" strokeDashoffset="190" style={{ animation: "draw 1.4s var(--ease-expo) forwards" }} />
              <path d="M20 33l8 8 16-18" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "draw 1s var(--ease-expo) 0.6s forwards" }} />
            </svg>
            <p className="mt-6 font-display text-[2.2rem] font-light text-bone">Application received.</p>
            <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-mist">
              Thank you. Adriana&rsquo;s team will review your details and contact you within two business days to plan your agave program.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            onSubmit={onSubmit}
            noValidate
            className="relative grid gap-x-8 gap-y-7 sm:grid-cols-2"
            aria-label="Trade account application"
          >
            <Field label="Venue name" className="sm:col-span-2">
              <Input name="venue" autoComplete="organization" placeholder="e.g. The Agave Room" {...aria("venue")} />
              {err("venue")}
            </Field>
            <Field label="Contact name">
              <Input name="contact" autoComplete="name" {...aria("contact")} />
              {err("contact")}
            </Field>
            <Field label="Email">
              <Input name="email" type="email" autoComplete="email" {...aria("email")} />
              {err("email")}
            </Field>
            <Field label="Phone (optional)">
              <Input name="phone" type="tel" autoComplete="tel" />
            </Field>
            <Field label="Province">
              <Select name="province" defaultValue="ON">
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Liquor licence number">
              <Input name="licence" autoComplete="off" {...aria("licence")} />
              {err("licence")}
            </Field>
            <Field label="Venue type">
              <Select name="venueType" defaultValue="cocktail-bar">
                {VENUES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
                <option value="retail">Retail / bottle shop</option>
                <option value="catering">Catering & events</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="mb-1 block text-[0.62rem] uppercase tracking-[0.28em] text-mist">Expected monthly volume</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {VOLUMES.map((v, i) => (
                  <label key={v} className="cursor-pointer">
                    <input type="radio" name="volume" value={v} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block rounded-pill px-4 py-2.5 text-[0.78rem] text-parchment shadow-[inset_0_0_0_1px_rgb(201_164_106/0.3)] transition-all duration-[400ms] hover:shadow-[inset_0_0_0_1px_rgb(226_201_155/0.8)] peer-checked:bg-gold-soft peer-checked:text-ink-950 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-soft">
                      {v}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-[0.75rem] leading-relaxed text-smoke">
                Trade accounts are for licensed venues in Canada. We&rsquo;ll never share your details.
              </p>
              <Button type="submit">
                {state === "sending" ? (
                  <>
                    <Spinner /> Sending
                  </>
                ) : (
                  "Apply for a trade account"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
