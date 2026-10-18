/**
 * Form primitives for the trade pages: hairline inputs that glow gold on
 * focus, labelled for screen readers, plus a case-quantity stepper.
 */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "peer w-full bg-transparent pb-3 pt-2 text-[1rem] text-bone placeholder:text-smoke/70 border-0 border-b border-gold/30 rounded-none transition-colors duration-[400ms] focus:outline-none focus:border-gold-soft focus-visible:outline-none aria-[invalid=true]:border-[#e07a6a]";

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`group/field block ${className}`}>
      <span className="mb-1 block text-[0.62rem] uppercase tracking-[0.28em] text-mist transition-colors group-focus-within/field:text-gold-soft">
        {label}
      </span>
      {children}
      {hint && <span className="mt-2 block text-[0.72rem] text-smoke">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={`${control} appearance-none pr-8 [&>option]:bg-ink-900 ${props.className ?? ""}`}>
        {children}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gold">
        ⌄
      </span>
    </span>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${control} resize-y ${props.className ?? ""}`} />;
}

/** − n + case stepper. */
export function CaseStepper({
  value,
  onChange,
  label,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  max?: number;
}) {
  const set = (v: number) => onChange(Math.max(0, Math.min(max, Number.isFinite(v) ? Math.round(v) : 0)));
  return (
    <div className="inline-flex h-11 items-center rounded-pill shadow-[inset_0_0_0_1px_rgb(201_164_106/0.32)] transition-shadow focus-within:shadow-[inset_0_0_0_1px_var(--color-gold-soft)]">
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= 0}
        aria-label={`Remove a case of ${label}`}
        className="grid h-full w-10 place-items-center text-lg text-parchment transition-colors hover:text-gold-soft disabled:opacity-30"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onChange={(e) => set(parseInt(e.target.value || "0", 10))}
        aria-label={`Cases of ${label}`}
        className="w-10 bg-transparent text-center text-[0.95rem] tabular-nums text-bone [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label={`Add a case of ${label}`}
        className="grid h-full w-10 place-items-center text-lg text-parchment transition-colors hover:text-gold-soft disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

/** Small spinner used on submit buttons. */
export function Spinner() {
  return <span aria-hidden className="inline-block size-3.5 rounded-full border border-current border-t-transparent [animation:spin-slow_0.8s_linear_infinite]" />;
}
