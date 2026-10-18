"use client";

/**
 * The cinematic hero.
 *
 *  1. SSR paints the copy plus a dark CSS "stage" (or the poster image when
 *     video/frames exist), so first paint is light and LCP-friendly.
 *  2. After hydration the chosen engine is code-split in, renders its first
 *     frame and crossfades over the poster.
 *  3. The intro autoplays (lights up, bottle emerges, light sweep) while the
 *     headline reveals line by line.
 *  4. A pinned ScrollTrigger then scrubs the pour; captions and the chapter
 *     rail follow the same progress. The glass ends glowing and hands off to
 *     the next section.
 *
 * Reduced motion: no pin, no scrub, a single still of the finished pour.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroAssets } from "@/lib/hero-assets";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Arrow, Button } from "@/components/ui/Button";
import type { HeroEngine } from "./engines/types";

/** Must match the `wide` / `narrow` variants in globals.css and computeLayout(). */
const WIDE_QUERY = "(min-width: 768px) and (min-aspect-ratio: 9/10)";
const NARROW_QUERY = "not all and (min-width: 768px) and (min-aspect-ratio: 9/10)";

const BEATS = [
  { id: "uncork", n: "01", title: "Uncork", line: "Hand-selected in Jalisco.", at: [0.0, 0.2] },
  { id: "pour", n: "02", title: "Pour", line: "Nothing added. Nothing to hide.", at: [0.26, 0.75] },
  { id: "savour", n: "03", title: "Savour", line: "Just agave, fire and time.", at: [0.8, 0.985] },
] as const;

export function HeroStage({ assets }: { assets: HeroAssets }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HeroEngine | null>(null);
  const railFill = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // ---------------------------------------------------------------- engine
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let cancelled = false;
    const reduced = prefersReducedMotion();
    const narrow = window.matchMedia(NARROW_QUERY).matches;
    const media = narrow && assets.mobile ? assets.mobile : assets.desktop;
    const common = { staticFrame: reduced, introEnd: assets.introEnd, fit: assets.fit, focalX: assets.focalX, focalY: assets.focalY };

    const boot = async () => {
      let engine: HeroEngine;
      if (assets.mode === "frames" && media.frames) {
        const { FrameSequenceEngine } = await import("./engines/FrameSequenceEngine");
        engine = new FrameSequenceEngine(el, { ...common, frames: media.frames });
      } else if (assets.mode === "video" && media.video) {
        const { VideoEngine } = await import("./engines/VideoEngine");
        engine = new VideoEngine(el, { ...common, sources: media.video, poster: media.poster });
      } else {
        const { createPourEngine } = await import("./engines/procedural/PourEngine");
        engine = createPourEngine(el, { textureUrl: assets.proceduralTexture, staticFrame: reduced });
      }
      if (cancelled) return engine.destroy();
      engineRef.current = engine;
      if (process.env.NODE_ENV !== "production") (window as unknown as { __heroEngine: HeroEngine }).__heroEngine = engine;
      await engine.ready;
      if (cancelled) return;
      setReady(true);
      window.dispatchEvent(new CustomEvent("hero:ready"));
    };

    // Let the page settle (fonts, LCP) before spinning up the GPU.
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 600 }) : setTimeout(cb, 120);
    idle(() => {
      boot().catch((err) => {
        console.warn("[hero] falling back to still image:", err);
        if (!cancelled) setFailed(true);
      });
    });

    // Pause rendering whenever the hero is offscreen.
    const io = new IntersectionObserver(([e]) => engineRef.current?.setActive(e.isIntersecting), { threshold: 0 });
    if (section.current) io.observe(section.current);

    return () => {
      cancelled = true;
      io.disconnect();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [assets]);

  // ---------------------------------------------------------------- motion
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const params = new URLSearchParams(window.location.search);
    // Review/QA hook: ?heroProgress=0.5 freezes the shot at that point.
    const frozen = params.get("heroProgress");

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const intro = { v: 0 };

      if (reduced) {
        engineRef.current?.setIntro(1);
        return;
      }

      // Headline: masked line reveal, then the supporting copy and CTAs.
      // y:0 overrides the px offset GSAP would otherwise parse from the CSS start state.
      gsap.fromTo(q('[data-reveal="line"] > span'), { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, delay: 0.3 });
      gsap.fromTo(q('[data-reveal="fade"]'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.85 });

      // Engine intro starts once its first frame exists.
      const playIntro = () =>
        gsap.to(intro, {
          v: 1,
          duration: assets.mode === "procedural" ? 3.6 : 3,
          ease: assets.mode === "procedural" ? "none" : "power1.inOut",
          onUpdate: () => engineRef.current?.setIntro(intro.v),
        });
      if (frozen === null) window.addEventListener("hero:ready", playIntro, { once: true });
      else {
        const p = Math.min(1, Math.max(0, parseFloat(frozen) || 0));
        const apply = () => {
          intro.v = 1;
          engineRef.current?.setIntro(1);
          engineRef.current?.setProgress(p);
        };
        window.addEventListener("hero:ready", () => setTimeout(apply, 50), { once: true });
        apply();
        gsap.set(q("[data-caption]"), { opacity: 0 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add({ mobile: NARROW_QUERY, desktop: WIDE_QUERY }, (c) => {
        const mobile = !!c.conditions?.mobile;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (mobile ? 2.4 : 2.8)}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              engineRef.current?.setProgress(self.progress);
              if (railFill.current) railFill.current.style.transform = `scaleY(${self.progress})`;
              const beat = BEATS.find((b) => self.progress >= b.at[0] - 0.02 && self.progress <= b.at[1] + 0.02);
              root.dataset.beat = beat?.id ?? "";
            },
          },
        });
        tl.to(q("[data-cue]"), { opacity: 0, y: 12, duration: 0.05 }, 0);
        if (mobile) {
          tl.to(q("[data-copy]"), { opacity: 0, y: -36, duration: 0.14 }, 0.02);
          tl.to(q("[data-ctas-mobile]"), { opacity: 0, y: 24, duration: 0.12 }, 0.02);
        } else {
          tl.to(q("[data-copy]"), { opacity: 0, y: -44, duration: 0.08 }, 0.9);
          tl.to(q("[data-rail]"), { opacity: 0, duration: 0.06 }, 0.92);
        }
        BEATS.forEach((b, i) => {
          const el = q(`[data-caption="${b.id}"]`);
          const inAt = i === 0 ? 0.015 : b.at[0];
          tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.045 }, inAt);
          tl.to(el, { opacity: 0, y: -12, duration: 0.045 }, b.at[1] - 0.045);
        });
        tl.set({}, {}, 1); // normalise the timeline to exactly 1 = full scroll
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const poster = assets.desktop.poster;
  const posterMobile = assets.mobile?.poster;

  return (
    <section
      ref={section}
      id="hero"
      aria-labelledby="hero-title"
      className="group/hero relative h-svh min-h-[580px] w-full overflow-hidden bg-ink-950"
    >
      {/* Stage / poster (SSR) */}
      <div aria-hidden className="absolute inset-0">
        {poster ? (
          <picture>
            {posterMobile && <source media={NARROW_QUERY} srcSet={posterMobile} />}
            <img src={poster} alt="" fetchPriority="high" className="size-full object-cover" />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_32%_70%_at_68%_-8%,rgb(227_162_74/0.10),transparent_70%),radial-gradient(ellipse_40%_12%_at_70%_86%,rgb(227_162_74/0.07),transparent_70%)] narrow:bg-[radial-gradient(ellipse_60%_55%_at_60%_10%,rgb(227_162_74/0.09),transparent_70%)]" />
        )}
      </div>

      {/* Engine canvas / video */}
      <div
        ref={stage}
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-[1200ms] ease-expo ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {failed && <StillFallback src={assets.proceduralTexture} />}

      {/* Readability scrim behind the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(11_10_9/0.72)_0%,rgb(11_10_9/0.35)_38%,transparent_60%)] narrow:bg-[linear-gradient(180deg,rgb(11_10_9/0.7)_0%,rgb(11_10_9/0.25)_40%,transparent_55%)]"
      />

      {/* Copy */}
      <div
        data-copy
        className="absolute inset-x-0 top-0 z-10 px-gutter pt-[calc(4rem+5vh)] wide:top-1/2 wide:max-w-[min(54vw,60rem)] wide:-translate-y-[46%] wide:pt-0 lg:pl-[max(var(--spacing-gutter),5vw)]"
      >
        <p data-reveal="fade" className="eyebrow mb-5 flex items-center gap-3 wide:mb-8">
          <span aria-hidden className="h-px w-8 bg-gold/70" />
          Additive-free · 100% blue agave<span className="max-sm:hidden">&nbsp;· Toronto</span>
        </p>
        <h1
          id="hero-title"
          className="whitespace-nowrap font-display text-[clamp(3rem,min(6.6vw,12.6vh),8.5rem)] font-light leading-[0.9] tracking-[-0.015em] text-bone narrow:text-[clamp(3rem,min(13.5vw,7.5vh),5.5rem)]"
        >
          <span data-reveal="line" className="mask-line">
            <span>Pour something</span>
          </span>
          <span data-reveal="line" className="mask-line">
            <span>
              <em className="bg-[linear-gradient(100deg,#f8c898_0%,#e3a24a_45%,#d48358_100%)] bg-clip-text pr-[0.08em] font-normal italic text-transparent">
                real.
              </em>
            </span>
          </span>
        </h1>
        <p
          data-reveal="fade"
          className="mt-5 max-w-[30rem] text-[0.95rem] leading-relaxed text-parchment/90 wide:mt-8 wide:text-[clamp(1rem,0.8rem+0.35vw,1.2rem)] wide:max-w-[34rem]"
        >
          Every bottle is chosen by Adriana Martinez, Canada&rsquo;s only Certified Tequila Master.
          <span className="narrow:hidden"> No sweeteners, no colouring, nothing to hide &mdash; just agave, fire and time.</span>
        </p>
        <div data-reveal="fade" className="mt-10 hidden flex-wrap items-center gap-4 wide:flex">
          <Button href="/shop">
            Shop the collection <Arrow />
          </Button>
          <Button href="/masterclass" variant="ghost">
            Book a masterclass
          </Button>
        </div>
        {/* Beat captions (desktop: a quiet line under the CTAs) */}
        <div aria-hidden className="relative mt-12 hidden h-[4.5rem] wide:block">
          <Captions />
        </div>
      </div>

      {/* Mobile CTAs sit on the floor line, under the scene */}
      <div data-ctas-mobile className="absolute inset-x-0 bottom-0 z-10 px-gutter pb-[max(1.25rem,env(safe-area-inset-bottom))] wide:hidden">
        <div data-reveal="fade" className="flex items-center gap-3">
          <Button href="/shop" size="sm">
            Shop the collection
          </Button>
          <Button href="/masterclass" variant="ghost" size="sm">
            Masterclass
          </Button>
        </div>
      </div>

      {/* Beat captions (mobile: take over the top once the copy steps aside) */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(4.75rem+3vh)] z-10 px-gutter wide:hidden">
        <Captions />
      </div>

      {/* Chapter rail (desktop) */}
      <div data-rail aria-hidden className="motion-reduce:!hidden absolute right-[max(var(--spacing-gutter),3vw)] top-1/2 z-10 hidden -translate-y-1/2 items-stretch gap-5 wide:flex">
        <div className="relative w-px bg-gold/20">
          <span ref={railFill} className="absolute inset-0 origin-top scale-y-0 bg-gold-soft" />
        </div>
        <ol className="flex flex-col justify-between gap-12 py-1">
          {BEATS.map((b) => (
            <li
              key={b.id}
              className="hero-rail-item text-[0.625rem] uppercase tracking-[0.3em] text-smoke transition-colors duration-[800ms]"
              data-b={b.id}
            >
              <span className="mr-2 font-display text-[0.8rem] tracking-normal">{b.n}</span>
              {b.title}
            </li>
          ))}
        </ol>
      </div>

      {/* Scroll cue */}
      <div
        data-cue
        aria-hidden
        className="absolute bottom-8 left-[max(var(--spacing-gutter),5vw)] z-10 hidden items-center gap-4 wide:flex motion-reduce:!hidden"
      >
        <span className="h-10 w-px overflow-hidden bg-gold/15">
          <span className="block h-full w-full animate-cue bg-gold-soft" />
        </span>
        <span className="text-[0.625rem] uppercase tracking-[0.36em] text-mist">Scroll to pour</span>
      </div>

      {/* Soft seam into the next section */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-ink-950/80" />
    </section>
  );
}

function Captions() {
  return (
    <>
      {BEATS.map((b) => (
        <div key={b.id} data-caption={b.id} className="absolute left-0 top-0 w-max max-w-full opacity-0">
          <p className="eyebrow mb-2 text-gold">
            {b.n} &mdash; {b.title}
          </p>
          <p className="font-display text-[clamp(1.6rem,1.25rem+1.1vw,2.25rem)] font-light italic leading-tight text-bone/90">
            {b.line}
          </p>
        </div>
      ))}
    </>
  );
}

/** Shown only if the engine can't start (e.g. no WebGL2). */
function StillFallback({ src }: { src: string }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute bottom-[12%] right-[8%] h-[62%] w-[32%] narrow:bottom-[16%] narrow:right-[-6%] narrow:h-[44%] narrow:w-[60%]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(227_162_74/0.28),transparent)] blur-2xl" />
        <Image src={src} alt="" fill sizes="(max-width: 767px) 60vw, 32vw" className="object-contain" />
      </div>
    </div>
  );
}
