/**
 * Common contract for every hero "engine" (procedural WebGL, frame sequence,
 * scrubbed video). HeroStage drives an engine with two numbers:
 *
 *  - intro:    0 → 1, autoplayed once on load (lights up, bottle fades in…)
 *  - progress: 0 → 1, scrubbed by the pinned scroll (the pour itself)
 */
export interface HeroEngine {
  /** Resolve when the first frame is ready to show (used for the crossfade). */
  ready: Promise<void>;
  setIntro(v: number): void;
  setProgress(v: number): void;
  /** Pause/resume rendering (offscreen, tab hidden). */
  setActive(active: boolean): void;
  /** Re-measure the container. */
  resize(): void;
  destroy(): void;
}

export interface EngineOptions {
  /** Render a single still frame and never animate (prefers-reduced-motion). */
  staticFrame?: boolean;
}
