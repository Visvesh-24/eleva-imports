"use client";

/** Floating WhatsApp button; appears once the visitor scrolls past the first screen. */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_EXPO } from "@/lib/motion";
import { SITE } from "@/lib/site";

export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={SITE.whatsapp}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Eleva Imports on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
          className="wa-float group fixed bottom-5 right-5 z-[65] flex items-center gap-3 transition-[bottom] duration-500 md:bottom-8 md:right-8"
        >
          <span className="pointer-events-none hidden rounded-pill bg-ink-900/90 px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-parchment opacity-0 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.3)] backdrop-blur transition-all duration-500 group-hover:opacity-100 md:block">
            Ask Adriana&rsquo;s team
          </span>
          <span className="relative grid size-14 place-items-center rounded-full bg-[#1f3d2b] text-[#d9f5e2] shadow-[0_10px_40px_-8px_rgba(37,211,102,.45),inset_0_0_0_1px_rgba(217,245,226,.25)] transition-transform duration-500 ease-expo group-hover:scale-110">
            <span aria-hidden className="absolute inset-0 rounded-full bg-[#25d366]/25 [animation:pulse-glow_3s_var(--ease-silk)_infinite]" />
            <svg viewBox="0 0 24 24" className="relative size-6" fill="currentColor" aria-hidden>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
