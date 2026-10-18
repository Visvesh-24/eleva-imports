"use client";

/**
 * Enquiry form with inline validation, a submitting state and an animated
 * success state. Submits through the shared stub in lib/forms.ts.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { submitForm } from "@/lib/forms";
import { EASE_EXPO } from "@/lib/motion";

const TOPICS = [
  { value: "order", label: "An order or a bottle" },
  { value: "masterclass", label: "Masterclasses & private tastings" },
  { value: "events", label: "Events" },
  { value: "trade", label: "Trade / restaurants & bars" },
  { value: "press", label: "Press & partnerships" },
  { value: "other", label: "Something else" },
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "peer w-full rounded-2xl bg-ink-900/80 px-5 pb-3 pt-7 text-[1rem] text-bone shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)] outline-none transition-shadow duration-[400ms] placeholder:text-transparent focus:shadow-[inset_0_0_0_1px_var(--color-gold-soft)] aria-[invalid=true]:shadow-[inset_0_0_0_1px_#e0705a]";
const label =
  "pointer-events-none absolute left-5 top-2.5 text-[0.6rem] uppercase tracking-[0.24em] text-smoke transition-colors peer-focus:text-gold-soft";

export function ContactForm({ defaultTopic = "order" }: { defaultTopic?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const next: Errors = {};
    if (!data.name?.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) next.email = "Please enter a valid email address.";
    if ((data.message ?? "").trim().length < 10) next.message = "A few more words, please (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setName(data.name.trim().split(" ")[0]);
    setStatus("sending");
    await submitForm("contact", data);
    setStatus("sent");
  };

  return (
    <div className="relative" style={{ "--accent": "#c9a46a", "--glow": "#e2c99b" } as React.CSSProperties}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
            className="flex min-h-[28rem] flex-col items-center justify-center rounded-card bg-ink-900/80 p-10 text-center shadow-[inset_0_0_0_1px_rgb(201_164_106/0.25)]"
          >
            <svg viewBox="0 0 80 80" className="size-20" fill="none" aria-hidden>
              <motion.circle cx="40" cy="40" r="36" stroke="#e3a24a" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EASE_EXPO }} />
              <motion.path d="M26 41l9 9 19-20" stroke="#f8c898" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.5 }} />
            </svg>
            <p className="mt-8 font-display text-[2.4rem] font-light leading-tight text-bone">
              Thank you{name ? `, ${name}` : ""}.
            </p>
            <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-mist">
              Your note is on its way to Adriana&rsquo;s team. We usually reply within one business day.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="link-underline mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-gold-soft"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
            className="grid gap-4 sm:grid-cols-2"
            aria-describedby="contact-privacy"
          >
            <div className="relative">
              <input id="c-name" name="name" autoComplete="name" placeholder="Name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} />
              <label htmlFor="c-name" className={label}>
                Your name *
              </label>
              {errors.name && <p id="c-name-err" className="mt-2 text-[0.78rem] text-[#f0a090]">{errors.name}</p>}
            </div>
            <div className="relative">
              <input id="c-email" name="email" type="email" autoComplete="email" placeholder="Email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} />
              <label htmlFor="c-email" className={label}>
                Email *
              </label>
              {errors.email && <p id="c-email-err" className="mt-2 text-[0.78rem] text-[#f0a090]">{errors.email}</p>}
            </div>
            <div className="relative">
              <input id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={field} />
              <label htmlFor="c-phone" className={label}>
                Phone (optional)
              </label>
            </div>
            <div className="relative">
              <select id="c-topic" name="topic" defaultValue={defaultTopic} className={`${field} appearance-none pr-12`}>
                {TOPICS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <label htmlFor="c-topic" className={label}>
                Topic
              </label>
              <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gold">
                ⌄
              </span>
            </div>
            <div className="relative sm:col-span-2">
              <textarea id="c-message" name="message" rows={6} placeholder="Message" className={`${field} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined} />
              <label htmlFor="c-message" className={label}>
                How can we help? *
              </label>
              {errors.message && <p id="c-message-err" className="mt-2 text-[0.78rem] text-[#f0a090]">{errors.message}</p>}
            </div>
            <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p id="contact-privacy" className="max-w-sm text-[0.75rem] leading-relaxed text-smoke">
                We only use your details to reply to you. Must be of legal drinking age in your province to order.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] px-8 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink-950 shadow-[0_12px_40px_-12px_rgb(227_162_74/0.65)] transition-shadow hover:shadow-[0_16px_60px_-10px_rgb(227_162_74/0.85)] disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <span aria-hidden className="size-4 rounded-full border-2 border-ink-950/30 border-t-ink-950 [animation:spin-slow_0.8s_linear_infinite]" />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <svg aria-hidden viewBox="0 0 24 24" className="size-4 transition-transform duration-[400ms] group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
