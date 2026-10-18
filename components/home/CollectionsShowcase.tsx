"use client";

/**
 * "Five ways in": editorial bento of the shopping edits. Each card has its own
 * light, a parallax bottle that drifts against the scroll, a hover reveal of
 * the description and a magnetic lean toward the pointer.
 */
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { isFinePointer } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { Motif } from "@/components/art/Art";

export interface ShowcaseItem {
  handle: string;
  title: string;
  eyebrow: string;
  description: string;
  theme: { accent: string; glow: string; deep: string };
  motif: "agave" | "rings" | "waves" | "rays" | "talavera";
  image: { src: string; alt: string; blurDataURL?: string };
}

export function CollectionsShowcase({ items }: { items: ShowcaseItem[] }) {
  // Desktop bento: two tall feature cards, then three.
  const spans = ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5", "lg:col-span-6", "lg:col-span-6"];
  return (
    <section className="relative py-section" aria-labelledby="collections-title">
      <div className="mx-auto max-w-[1800px] px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gold/70" /> Five ways in
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="collections-title" className="font-display text-display-lg font-light text-bone">
                Find your <em className="text-gold-soft">pour.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-[1rem] leading-relaxed text-mist">
              However you drink it (slowly, shaken, shared or for the first time), there&rsquo;s a bottle Adriana would hand you.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid auto-rows-[minmax(22rem,auto)] gap-5 lg:grid-cols-12 lg:auto-rows-[21rem]">
          {items.map((item, i) => (
            <Reveal key={item.handle} delay={i * 0.06} className={spans[i] ?? "lg:col-span-6"}>
              <ShowcaseCard item={item} index={i} large={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ item, index, large }: { item: ShowcaseItem; index: number; large: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 16 });
  const sy = useSpring(my, { stiffness: 140, damping: 16 });

  const onMove = (e: React.PointerEvent) => {
    if (!isFinePointer() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  return (
    <motion.div style={{ x: sx, y: sy }} className="h-full">
      <Link
        ref={ref}
        href={`/collections/${item.handle}`}
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.6rem] p-7 shadow-[inset_0_0_0_1px_rgb(201_164_106/0.14)] transition-shadow duration-[800ms] hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_60%,transparent)] md:p-10"
        style={{ "--accent": item.theme.accent, "--glow": item.theme.glow, "--deep": item.theme.deep } as CSSProperties}
      >
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1200ms]"
          style={{
            background:
              "radial-gradient(60% 70% at 72% 40%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%), linear-gradient(160deg, color-mix(in srgb, var(--deep) 100%, #000) 0%, #0b0a09 80%)",
          }}
        />
        <Motif
          motif={item.motif}
          className={`absolute opacity-40 transition-opacity duration-[1200ms] group-hover:opacity-80 ${
            item.motif === "waves" ? "inset-x-0 top-0 h-1/2" : item.motif === "rays" ? "inset-0" : "-right-[20%] -top-[10%] w-[90%]"
          }`}
        />
        {/* Parallax bottle */}
        <motion.div
          aria-hidden
          style={{ y }}
          className={`absolute ${large ? "bottom-[-4%] right-[4%] h-[92%] w-[46%]" : "bottom-[-6%] right-[2%] h-[96%] w-[42%]"}`}
        >
          <div className="relative size-full transition-transform duration-[1400ms] ease-expo group-hover:-translate-y-4 group-hover:rotate-[-3deg] group-hover:scale-[1.05]">
            <Image
              src={item.image.src}
              alt=""
              fill
              sizes={large ? "(max-width: 1024px) 50vw, 26vw" : "(max-width: 1024px) 45vw, 18vw"}
              placeholder={item.image.blurDataURL ? "blur" : "empty"}
              blurDataURL={item.image.blurDataURL}
              unoptimized={item.image.src.endsWith(".svg")}
              className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]"
            />
          </div>
        </motion.div>

        <span aria-hidden className="absolute left-7 top-6 font-display text-[0.95rem] text-[var(--glow)] md:left-10 md:top-9">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative max-w-[58%]">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-[var(--glow)]">{item.eyebrow}</p>
          <h3 className={`mt-3 font-display font-light leading-[0.95] text-bone ${large ? "text-[clamp(2.6rem,1.8rem+3vw,5rem)]" : "text-[clamp(2.1rem,1.6rem+1.6vw,3.2rem)]"}`}>
            {item.title}
          </h3>
          <p className="mt-4 max-w-[22rem] text-[0.92rem] leading-relaxed text-parchment/85 transition-all duration-[800ms] ease-expo md:max-h-0 md:translate-y-3 md:overflow-hidden md:opacity-0 md:group-hover:max-h-40 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:max-h-40 md:group-focus-visible:opacity-100">
            {item.description}
          </p>
          <span className="mt-5 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.24em] text-bone">
            Explore
            <span aria-hidden className="grid size-8 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--accent)] transition-all duration-[600ms] group-hover:bg-[var(--accent)] group-hover:text-ink-950">
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
