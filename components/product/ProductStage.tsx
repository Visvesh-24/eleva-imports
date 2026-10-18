"use client";

/**
 * The product "stage": the bottle on its own lit set.
 * - 3D tilt toward the pointer + a spotlight that follows it
 * - specular light sweep masked to the bottle's own silhouette
 * - glossy floor reflection, dial rings, agave line art, drifting backdrop
 *   word and gold dust in the product's colours
 * - gentle scroll parallax (bottle rises and turns as you scroll)
 */
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { forwardRef, useRef } from "react";
import type { Product } from "@/lib/catalog-types";
import { isFinePointer } from "@/lib/motion";
import { AgaveArt, BackdropWord, CircularText, GoldDust, OrbitRings } from "@/components/art/Art";

export const ProductStage = forwardRef<HTMLDivElement, { product: Product }>(function ProductStage({ product }, bottleRef) {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.4);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 120, damping: 18 });
  const lx = useSpring(useTransform(mx, (v) => `${v * 100}%`), { stiffness: 90, damping: 20 });
  const ly = useSpring(useTransform(my, (v) => `${v * 100}%`), { stiffness: 90, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(40% 35% at ${lx} ${ly}, color-mix(in srgb, var(--glow) 22%, transparent), transparent 70%)`;

  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-10%"]);
  const turn = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -6]);

  const onMove = (e: React.PointerEvent) => {
    if (!isFinePointer() || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.4);
  };

  const isSvg = product.image.src.endsWith(".svg");
  const maskStyle = isSvg
    ? undefined
    : ({
        maskImage: `url(${product.image.src})`,
        WebkitMaskImage: `url(${product.image.src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center bottom",
        WebkitMaskPosition: "center bottom",
      } as React.CSSProperties);

  return (
    <div ref={stage} onPointerMove={onMove} onPointerLeave={onLeave} className="relative h-full min-h-[68svh] w-full overflow-hidden lg:min-h-0">
      {/* Set lighting */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 42%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 72%), radial-gradient(80% 40% at 50% 100%, color-mix(in srgb, var(--deep) 100%, transparent), transparent), linear-gradient(180deg, #0f0e0c, #0b0a09)",
        }}
      />
      <motion.div aria-hidden className="absolute inset-0" style={{ background: spotlight }} />
      <BackdropWord word={product.backdropWord} className="absolute inset-x-0 top-[18%] opacity-70 [--outline:color-mix(in_srgb,var(--accent)_30%,transparent)]" />
      <OrbitRings className="absolute left-1/2 top-[46%] w-[min(760px,120%)] -translate-x-1/2 -translate-y-1/2 opacity-80" />
      <AgaveArt className="absolute -bottom-6 left-1/2 w-[min(900px,130%)] -translate-x-1/2 opacity-35" seed={product.rank * 5} />
      <GoldDust count={30} seed={product.rank} />
      <CircularText text={`${product.brand} · ${product.expression} · `} className="absolute bottom-[10%] right-[6%] hidden md:block" size={120} />

      {/* Floor */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(180deg,transparent,rgb(0_0_0/0.5))]" />
      <div aria-hidden className="absolute inset-x-[22%] bottom-[11%] h-10 rounded-[50%] bg-[color-mix(in_srgb,var(--accent)_45%,transparent)] blur-2xl [animation:pulse-glow_6s_var(--ease-silk)_infinite]" />

      {/* Bottle */}
      <motion.div className="absolute inset-x-[14%] bottom-[12%] top-[9%] md:inset-x-[20%]" style={{ y: lift, rotate: turn }}>
        <motion.div
          ref={bottleRef}
          className="relative size-full"
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
          initial={reduce ? false : { opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            preload
            sizes="(max-width: 1024px) 80vw, 45vw"
            placeholder={product.image.blurDataURL ? "blur" : "empty"}
            blurDataURL={product.image.blurDataURL}
            unoptimized={isSvg}
            className="object-contain object-bottom drop-shadow-[0_40px_50px_rgba(0,0,0,.6)]"
          />
          {/* Specular sweep clipped to the bottle silhouette */}
          {maskStyle && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_38%,rgb(255_244_224/0.5)_50%,transparent_62%)] bg-[length:300%_100%] mix-blend-screen [animation:sweep_6.5s_var(--ease-silk)_infinite]"
              style={maskStyle}
            />
          )}
        </motion.div>
        {/* Reflection */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-full scale-y-[-1] opacity-25 [mask-image:linear-gradient(to_top,black,transparent_28%)]">
          <Image src={product.image.src} alt="" fill sizes="(max-width: 1024px) 80vw, 45vw" unoptimized={isSvg} className="object-contain object-bottom blur-[2px]" />
        </div>
      </motion.div>
    </div>
  );
});
