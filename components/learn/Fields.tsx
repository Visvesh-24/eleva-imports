/**
 * Form primitives for the experiences pages: hairline-framed inputs with
 * small-caps labels, visible focus rings and error text wired via aria.
 */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-2xl bg-ink-950/60 px-5 text-[0.98rem] text-bone placeholder:text-smoke/80 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.28)] transition-shadow duration-[400ms] ease-expo hover:shadow-[inset_0_0_0_1px_rgb(201_164_106/0.5)] focus:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--accent,#e2c99b),0_0_0_4px_color-mix(in_srgb,var(--accent,#e2c99b)_18%,transparent)] aria-[invalid=true]:shadow-[inset_0_0_0_1px_#e0705a]";

function Wrap({ id, label, hint, error, children, className = "" }: { id: string; label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 block text-[0.62rem] uppercase tracking-[0.28em] text-mist">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.78rem] text-[#f0a08e]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[0.75rem] text-smoke">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Base = { id: string; label: string; hint?: string; error?: string; wrapClassName?: string };

export function TextField({ id, label, hint, error, wrapClassName, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error} className={wrapClassName}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${control} h-13 [color-scheme:dark]`}
        {...rest}
      />
    </Wrap>
  );
}

export function SelectField({ id, label, hint, error, wrapClassName, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error} className={wrapClassName}>
      <div className="relative">
        <select
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${control} h-13 appearance-none pr-12`}
          {...rest}
        >
          {children}
        </select>
        <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Wrap>
  );
}

export function TextArea({ id, label, hint, error, wrapClassName, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error} className={wrapClassName}>
      <textarea
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${control} min-h-32 resize-y py-4 leading-relaxed`}
        {...rest}
      />
    </Wrap>
  );
}

/** Primary submit button with a pending shimmer. */
export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group relative inline-flex h-13 items-center justify-center gap-3 overflow-hidden rounded-pill bg-[linear-gradient(135deg,#f0be7a_0%,#e3a24a_45%,#c8783e_100%)] px-8 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink-950 shadow-[0_0_0_1px_rgb(248_200_152/0.35),0_12px_40px_-12px_rgb(227_162_74/0.65)] transition-shadow duration-[400ms] ease-expo hover:shadow-[0_0_0_1px_rgb(248_200_152/0.6),0_16px_60px_-10px_rgb(227_162_74/0.85)] disabled:cursor-wait disabled:opacity-80"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgb(255_244_224/0.55)_50%,transparent_70%)] bg-[length:250%_100%] ${pending ? "[animation:sweep_1.4s_linear_infinite]" : "-translate-x-full transition-transform duration-[1200ms] ease-expo group-hover:translate-x-full"}`}
      />
      <span className="relative">{pending ? "Sending…" : children}</span>
    </button>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: string) => EMAIL.test(v.trim());
