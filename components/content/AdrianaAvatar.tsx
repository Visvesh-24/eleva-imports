/**
 * Small circular portrait of Adriana for tips and notes. Uses her photo
 * from /public/adriana when present, otherwise a monogram.
 */
import Image from "next/image";
import type { Portrait } from "@/lib/adriana";

export function AdrianaAvatar({ portrait, size = 56 }: { portrait: Portrait; size?: number }) {
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-ink-800 shadow-[0_0_0_1px_rgb(201_164_106/0.5),0_0_0_5px_rgb(11_10_9),0_0_0_6px_rgb(201_164_106/0.2)]"
      style={{ width: size, height: size }}
    >
      {portrait.src ? (
        <Image src={portrait.src} alt="" fill sizes={`${size}px`} className="object-cover" style={{ objectPosition: portrait.focal }} />
      ) : (
        <span aria-hidden className="font-display text-[1.1rem] italic text-gold-soft">
          AM
        </span>
      )}
    </span>
  );
}
