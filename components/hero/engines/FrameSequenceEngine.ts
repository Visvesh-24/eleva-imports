/**
 * Frame-sequence engine: draws a numbered image sequence to a canvas, scrubbed
 * by the hero progress. Frames load progressively (every 8th first, then every
 * 4th, then the rest) so scrubbing works almost immediately at a coarser step
 * and sharpens as the remaining frames arrive.
 */
import type { EngineOptions, HeroEngine } from "./types";

export interface FrameSequenceOptions extends EngineOptions {
  frames: string[];
  /** Fraction of the sequence played by the autoplay intro. */
  introEnd: number;
  fit?: "cover" | "contain";
  focalX?: number;
  focalY?: number;
}

export class FrameSequenceEngine implements HeroEngine {
  readonly ready: Promise<void>;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bitmaps: (ImageBitmap | HTMLImageElement | null)[];
  private intro = 0;
  private progress = 0;
  private target = 0;
  private drawn = -1;
  private raf = 0;
  private active = true;
  private destroyed = false;
  private ro: ResizeObserver;
  private last = 0;

  constructor(
    private container: HTMLElement,
    private opts: FrameSequenceOptions,
  ) {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    this.ctx = this.canvas.getContext("2d", { alpha: false })!;
    container.appendChild(this.canvas);
    this.bitmaps = new Array(opts.frames.length).fill(null);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();

    this.ready = this.load(this.firstIndex()).then(() => {
      this.draw(true);
      this.preloadRest();
      this.loop();
    });
  }

  private firstIndex() {
    return this.opts.staticFrame ? this.opts.frames.length - 1 : 0;
  }

  private async load(i: number) {
    if (this.bitmaps[i] || this.destroyed) return;
    const res = await fetch(this.opts.frames[i]);
    const blob = await res.blob();
    this.bitmaps[i] = "createImageBitmap" in window ? await createImageBitmap(blob) : await blobToImage(blob);
  }

  private async preloadRest() {
    if (this.opts.staticFrame) return;
    const n = this.opts.frames.length;
    const order: number[] = [];
    for (const step of [8, 4, 2, 1]) for (let i = 0; i < n; i += step) if (!order.includes(i)) order.push(i);
    // A few parallel lanes keep the network busy without flooding it.
    let cursor = 0;
    const lane = async () => {
      while (cursor < order.length && !this.destroyed) {
        const i = order[cursor++];
        try {
          await this.load(i);
        } catch {
          /* skip broken frame */
        }
      }
    };
    await Promise.all([lane(), lane(), lane(), lane()]);
  }

  /** Nearest loaded frame to index i. */
  private nearest(i: number) {
    for (let d = 0; d < this.bitmaps.length; d++) {
      if (this.bitmaps[i - d]) return i - d;
      if (this.bitmaps[i + d]) return i + d;
    }
    return -1;
  }

  private position() {
    if (this.opts.staticFrame) return 1;
    const e = this.opts.introEnd;
    return Math.min(1, e * this.intro + (1 - e) * this.progress);
  }

  private draw(force = false) {
    const n = this.opts.frames.length;
    const idx = this.nearest(Math.round(this.position() * (n - 1)));
    if (idx < 0 || (idx === this.drawn && !force)) return;
    const img = this.bitmaps[idx]!;
    const { width: cw, height: ch } = this.canvas;
    const iw = "naturalWidth" in img ? img.naturalWidth : img.width;
    const ih = "naturalHeight" in img ? img.naturalHeight : img.height;
    const cover = (this.opts.fit ?? "cover") === "cover";
    const s = cover ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih);
    const w = iw * s;
    const h = ih * s;
    const fx = this.opts.focalX ?? 0.5;
    const fy = this.opts.focalY ?? 0.5;
    this.ctx.fillStyle = "#0b0a09";
    this.ctx.fillRect(0, 0, cw, ch);
    this.ctx.drawImage(img, (cw - w) * fx, (ch - h) * fy, w, h);
    this.drawn = idx;
  }

  private loop = () => {
    if (this.destroyed || !this.active || this.opts.staticFrame) {
      this.raf = 0;
      return;
    }
    const now = performance.now();
    const dt = Math.min((now - (this.last || now)) / 1000, 0.1);
    this.last = now;
    this.progress += (this.target - this.progress) * (1 - Math.exp(-dt * 8));
    this.draw();
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
    if (active && !this.raf) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.loop);
    }
  }
  resize() {
    const r = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.draw(true);
  }
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    for (const b of this.bitmaps) if (b && "close" in b) b.close();
    this.canvas.remove();
  }
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(blob);
  });
}
