"use client";

/** Newsletter block with the 10% welcome gift. Submits via lib/forms (stub). */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { submitForm } from "@/lib/forms";
import { EASE_EXPO } from "@/lib/motion";
import { GoldDust, TalaveraRosette } from "@/components/art/Art";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      setState("error");
      return;
    }
    if (!consent) {
      setError("Please confirm you’d like to receive emails from us.");
      setState("error");
      return;
    }
    setState("sending");
    await submitForm("newsletter", { email });
    setState("done");
  };

  return (
    <section className="relative px-gutter py-section" aria-labelledby="nl-title" style={{ "--accent": "#e3a24a", "--glow": "#f5cf8e" } as React.CSSProperties}>
      <div
        style={{ background: "radial-gradient(60% 80% at 80% 20%, rgb(227 162 74 / 0.18), transparent 70%), #11100e" }}
        className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] px-7 py-16 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.2)] md:px-16 md:py-24">
        <TalaveraRosette className="absolute -right-24 -top-24 w-[min(560px,90vw)] opacity-50" />
        <GoldDust count={20} seed={61} />
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-6">The welcome gift</p>
            <h2 id="nl-title" className="font-display text-display-lg font-light text-bone">
              10% off your <em className="text-gold-soft">first pour.</em>
            </h2>
            <p className="mt-6 max-w-[30rem] text-[1.02rem] leading-relaxed text-mist">
              Join the list for new arrivals, masterclass dates and Adriana&rsquo;s tasting notes. Your welcome code arrives by email.
            </p>
          </div>

          <div className="relative min-h-[12rem]">
            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_EXPO }} role="status">
                  <p className="font-display text-[2.4rem] font-light italic leading-tight text-gold-soft">Salud, and welcome.</p>
                  <p className="mt-3 text-mist">Check your inbox for your 10% welcome code.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="nl-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="nl-email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={state === "error" && !/^\S+@\S+\.\S+$/.test(email)}
                      aria-describedby={state === "error" ? "nl-error" : undefined}
                      className="h-14 flex-1 rounded-pill bg-ink-950/70 px-6 text-[1rem] text-bone placeholder:text-smoke shadow-[inset_0_0_0_1px_rgb(201_164_106/0.35)] focus:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--color-gold-soft)]"
                    />
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="h-14 rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] px-8 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink-950 shadow-glow transition-shadow hover:shadow-glow-lg disabled:opacity-60"
                    >
                      {state === "sending" ? "Joining…" : "Claim 10%"}
                    </button>
                  </div>
                  <label className="flex items-start gap-3 text-[0.8rem] leading-relaxed text-mist">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-[#e3a24a]" />
                    {/* TODO(client): confirm CASL consent wording. */}
                    Yes, email me news and offers from Eleva Imports. I&rsquo;m of legal drinking age and can unsubscribe anytime.
                  </label>
                  {state === "error" && (
                    <p id="nl-error" role="alert" className="text-[0.85rem] text-rosegold">
                      {error}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
