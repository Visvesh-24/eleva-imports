/**
 * Age verification state (client). The verdict is remembered in localStorage
 * and a cookie; an inline script in <head> marks <html data-age="ok"> before
 * first paint so returning visitors never see the gate flash.
 */
/**
 * Master switch for the age gate. Disabled for now at the client's request;
 * set to true to bring the full-screen gate back (nothing else changes).
 */
export const AGE_GATE_ENABLED = false;

export const AGE_KEY = "eleva.age.v1";
export const AGE_EVENT = "eleva:age-ok";

/** Inline pre-paint script (kept tiny; runs before React). */
export const AGE_BOOT_SCRIPT = AGE_GATE_ENABLED
  ? `try{if(localStorage.getItem('${AGE_KEY}')==='ok'||document.cookie.indexOf('eleva_age=ok')>-1)document.documentElement.dataset.age='ok'}catch(e){}`
  : "document.documentElement.dataset.age='ok'";

export function isAgeVerified() {
  if (!AGE_GATE_ENABLED) return true;
  return typeof document !== "undefined" && document.documentElement.dataset.age === "ok";
}

export function markAgeVerified() {
  try {
    localStorage.setItem(AGE_KEY, "ok");
  } catch {
    /* private mode */
  }
  document.cookie = `eleva_age=ok; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
  document.documentElement.dataset.age = "ok";
  window.dispatchEvent(new CustomEvent(AGE_EVENT));
}

/** Run `cb` once the visitor has confirmed their age (immediately if already). */
export function whenAgeVerified(cb: () => void) {
  if (isAgeVerified()) {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener(AGE_EVENT, on, { once: true });
  return () => window.removeEventListener(AGE_EVENT, on);
}

/** Legal drinking age by province/territory. */
export const PROVINCES: { code: string; name: string; age: number }[] = [
  { code: "ON", name: "Ontario", age: 19 },
  { code: "QC", name: "Québec", age: 18 },
  { code: "BC", name: "British Columbia", age: 19 },
  { code: "AB", name: "Alberta", age: 18 },
  { code: "MB", name: "Manitoba", age: 18 },
  { code: "SK", name: "Saskatchewan", age: 19 },
  { code: "NS", name: "Nova Scotia", age: 19 },
  { code: "NB", name: "New Brunswick", age: 19 },
  { code: "NL", name: "Newfoundland and Labrador", age: 19 },
  { code: "PE", name: "Prince Edward Island", age: 19 },
  { code: "YT", name: "Yukon", age: 19 },
  { code: "NT", name: "Northwest Territories", age: 19 },
  { code: "NU", name: "Nunavut", age: 19 },
];
