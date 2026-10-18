/**
 * Video engine: scrubs a muted, inline <video> by seeking to the hero
 * progress. Seeks are throttled (one in flight at a time) so fast scrolling
 * never queues up a backlog. Encode with short GOPs; see public/hero/README.md.
 */
import type { EngineOptions, HeroEngine } from "./types";

export interface VideoSource {
  src: string;
  type: string;
}

export interface VideoEngineOptions extends EngineOptions {
  sources: VideoSource[];
  poster?: string;
  introEnd: number;
  fit?: "cover" | "contain";
  focalX?: number;
  focalY?: number;
}

export class VideoEngine implements HeroEngine {
  readonly ready: Promise<void>;
  private video: HTMLVideoElement;
  private intro = 0;
  private progress = 0;
  private target = 0;
  private seeking = false;
  private raf = 0;
  private active = true;
  private destroyed = false;
  private last = 0;

  constructor(
    container: HTMLElement,
    private opts: VideoEngineOptions,
  ) {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("aria-hidden", "true");
    v.disablePictureInPicture = true;
    if (opts.poster) v.poster = opts.poster;
    const fx = Math.round((opts.focalX ?? 0.5) * 100);
    const fy = Math.round((opts.focalY ?? 0.5) * 100);
    v.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:${opts.fit ?? "cover"};object-position:${fx}% ${fy}%;`;
    for (const s of opts.sources) {
      const el = document.createElement("source");
      el.src = s.src;
      el.type = s.type;
      v.appendChild(el);
    }
    v.addEventListener("seeked", () => {
      this.seeking = false;
    });
    container.appendChild(v);
    this.video = v;

    this.ready = new Promise<void>((res, rej) => {
      v.addEventListener("loadeddata", () => res(), { once: true });
      v.addEventListener("error", () => rej(new Error("Hero video failed to load")), { once: true });
    }).then(() => {
      if (opts.staticFrame) this.seek(v.duration - 0.05);
      else this.loop();
    });
    v.load();
  }

  private position() {
    const e = this.opts.introEnd;
    return Math.min(1, e * this.intro + (1 - e) * this.progress);
  }

  private seek(t: number) {
    const v = this.video;
    if (!Number.isFinite(v.duration)) return;
    const clamped = Math.max(0, Math.min(v.duration - 0.04, t));
    if (Math.abs(v.currentTime - clamped) < 1 / 60) return;
    this.seeking = true;
    if ("fastSeek" in v && typeof v.fastSeek === "function" && Math.abs(v.currentTime - clamped) > 1) v.fastSeek(clamped);
    else v.currentTime = clamped;
  }

  private loop = () => {
    if (this.destroyed || !this.active) {
      this.raf = 0;
      return;
    }
    const now = performance.now();
    const dt = Math.min((now - (this.last || now)) / 1000, 0.1);
    this.last = now;
    this.progress += (this.target - this.progress) * (1 - Math.exp(-dt * 8));
    if (!this.seeking) this.seek(this.position() * this.video.duration);
    this.raf = requestAnimationFrame(this.loop);
  };

  setIntro(v: number) {
    this.intro = v;
  }
  setProgress(v: number) {
    this.target = v;
  }
  setActive(active: boolean) {
    this.active = active;
    if (active && !this.raf && !this.opts.staticFrame) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.loop);
    }
  }
  resize() {}
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.video.removeAttribute("src");
    this.video.load();
    this.video.remove();
  }
}
