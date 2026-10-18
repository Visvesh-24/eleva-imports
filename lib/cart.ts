"use client";

/**
 * Cart store: a tiny external store persisted to localStorage and read with
 * useSyncExternalStore (no provider needed). Lines snapshot the display data
 * they need so the drawer renders without refetching.
 *
 * Shopify swap: replace the mutators with Storefront `cartCreate` /
 * `cartLinesAdd` / `cartLinesUpdate` calls and keep `useCart()`'s shape.
 */
import { useSyncExternalStore } from "react";
import type { Money } from "./catalog-types";

export interface CartLine {
  variantId: string;
  handle: string;
  name: string;
  variantTitle: string;
  image: string;
  price: Money;
  quantity: number;
  accent: string;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
}

const KEY = "eleva.cart.v1";
const MAX_QTY = 24;
let state: CartState = { lines: [], open: false };
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...state, lines: (JSON.parse(raw) as CartLine[]).filter((l) => l && l.variantId) };
  } catch {
    /* private mode / corrupt data: start empty */
  }
}

function set(next: Partial<CartState>) {
  state = { ...state, ...next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state.lines));
  } catch {
    /* ignore quota / private mode */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      hydrated = false;
      load();
      listeners.forEach((fn) => fn());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: CartState = { lines: [], open: false };

export function useCart() {
  const s = useSyncExternalStore(subscribe, () => state, () => EMPTY);
  const count = s.lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal: Money = { amount: s.lines.reduce((n, l) => n + l.price.amount * l.quantity, 0), currencyCode: "CAD" };
  return { ...s, count, subtotal };
}

export const cart = {
  add(line: Omit<CartLine, "quantity">, quantity = 1) {
    load();
    const existing = state.lines.find((l) => l.variantId === line.variantId);
    const lines = existing
      ? state.lines.map((l) => (l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l))
      : [...state.lines, { ...line, quantity: Math.min(MAX_QTY, quantity) }];
    set({ lines });
  },
  setQuantity(variantId: string, quantity: number) {
    const lines =
      quantity <= 0
        ? state.lines.filter((l) => l.variantId !== variantId)
        : state.lines.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l));
    set({ lines });
  },
  remove(variantId: string) {
    set({ lines: state.lines.filter((l) => l.variantId !== variantId) });
  },
  open() {
    set({ open: true });
  },
  close() {
    set({ open: false });
  },
};

/**
 * "Bottle drops into the cart": flies a ghost of the product image from the
 * source element into the header cart icon, then bumps the icon.
 */
export function flyToCart(from: HTMLElement | null) {
  if (typeof window === "undefined" || !from) return Promise.resolve();
  const target = document.querySelector<HTMLElement>("[data-cart-icon]");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const ghost = from.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${a.left}px`,
    top: `${a.top}px`,
    width: `${a.width}px`,
    height: `${a.height}px`,
    margin: "0",
    zIndex: "90",
    pointerEvents: "none",
    filter: "drop-shadow(0 20px 40px rgba(227,162,74,.45))",
  });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const s = Math.max(0.06, 28 / Math.max(a.height, 1));
  const anim = ghost.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 120}px) scale(${0.45 + s}) rotate(-14deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(-30deg)`, opacity: 0.2 },
    ],
    { duration: 900, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
  );
  return anim.finished.then(() => {
    ghost.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(0.92)" }, { transform: "scale(1)" }],
      { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  });
}
