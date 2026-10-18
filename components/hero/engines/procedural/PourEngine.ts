/**
 * Procedural hero engine: WebGL2 renderer + liquid simulation.
 * Loaded with a dynamic import so none of this ships in the main bundle.
 */
import type { EngineOptions, HeroEngine } from "../types";
import {
  BOTTLE_TEX,
  MAX_POUR,
  STATIC_PROGRESS,
  computeLayout,
  computePose,
  easeInOut,
  lerp,
  seg,
  smoothstep,
  type Layout,
  type Pose,
} from "./choreography";
import { buildFrag, VERT } from "./shaders";
import { BottleLiquid, PourSim, type GlassSurface } from "./simulation";

type Uniforms = Record<string, WebGLUniformLocation | null>;

const UNIFORMS = [
  "uRes", "uPx", "uStage", "uU", "uTime", "uLightOn", "uGlow", "uZoom",
  "uLightPos", "uLightTarget", "uFloorY",
  "uBottleTex", "uTexH", "uBottle", "uStopper", "uBottleAlpha", "uBottleLevel", "uBottleSlosh", "uBottleDim", "uSweep", "uBottleFloorY",
  "uGlassA", "uGlassB", "uGlassC", "uWave",
  "uStream", "uStreamCount", "uStreamBox", "uDrops", "uDropCount", "uBubbles", "uBubbleCount",
] as const;

export interface PourEngineOptions extends EngineOptions {
  textureUrl: string;
}

export class PourEngine implements HeroEngine {
  readonly ready: Promise<void>;
  private resolveReady!: () => void;
  private rejectReady!: (e: unknown) => void;

  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private prog!: WebGLProgram;
  private u: Uniforms = {};
  private tex: WebGLTexture | null = null;
  private liquid: BottleLiquid | null = null;
  private sim = new PourSim();

  private layout: Layout;
  private cssW = 1;
  private cssH = 1;
  private pxScale = 1;
  private renderScale = 1;
  private quality: "high" | "low";

  private intro = 0;
  private target = 0;
  private progress = 0;
  private time = 0;
  private last = 0;
  private raf = 0;
  private active = true;
  private destroyed = false;
  private loaded = false;
  private frameTimes: number[] = [];
  private ro: ResizeObserver;
  private onVis = () => this.syncLoop();

  constructor(
    private container: HTMLElement,
    private opts: PourEngineOptions,
  ) {
    this.ready = new Promise((res, rej) => {
      this.resolveReady = res;
      this.rejectReady = rej;
    });

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    this.quality = coarse || cores <= 4 ? "low" : "high";

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    const gl = this.canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;
    container.appendChild(this.canvas);

    this.layout = computeLayout(1, 1);
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    document.addEventListener("visibilitychange", this.onVis);
    this.canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());

    this.init().catch((e) => this.rejectReady(e));
  }

  private async init() {
    // Compile and fetch the texture in parallel.
    await Promise.all([this.initGL(), this.fetchImage()]);
    if (this.destroyed) return;
    this.uploadTexture();
  }

  // ------------------------------------------------------------------ setup
  private async initGL() {
    const gl = this.gl;
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const fs = shader(gl.FRAGMENT_SHADER, buildFrag({ quality: this.quality }));
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    // Let the driver compile off the main thread where supported, polling
    // once per frame instead of blocking on LINK_STATUS.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    if (parallel) {
      while (!gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
        await new Promise((r) => requestAnimationFrame(r));
        if (this.destroyed) return;
      }
    }
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog);
      throw new Error("Hero shader failed: " + log);
    }
    this.prog = prog;
    gl.useProgram(prog);
    for (const name of UNIFORMS) {
      const arr = name === "uStream" || name === "uDrops" || name === "uBubbles";
      this.u[name] = gl.getUniformLocation(prog, arr ? `${name}[0]` : name);
    }

    // Full-screen triangle.
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  private pot: ImageBitmap | HTMLCanvasElement | null = null;

  private async fetchImage() {
    const img = new Image();
    img.decoding = "async";
    img.src = this.opts.textureUrl;
    await img.decode();
    // Resample to a power-of-two size so we get full mip chains (used for the
    // blurred floor reflection). createImageBitmap resizes off the main thread.
    const tw = this.quality === "high" ? 1024 : 512;
    const th = tw * 2;
    try {
      // WebGL ignores UNPACK_* flags for ImageBitmaps, so premultiply here
      // (the shader and mip chain expect premultiplied alpha).
      this.pot = await createImageBitmap(img, { resizeWidth: tw, resizeHeight: th, resizeQuality: "high", premultiplyAlpha: "premultiply" });
    } catch {
      const c = document.createElement("canvas");
      c.width = tw;
      c.height = th;
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, tw, th);
      this.pot = c;
    }
  }

  private uploadTexture() {
    const c = this.pot!;

    const gl = this.gl;
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.tex = tex;
    gl.uniform1i(this.u.uBottleTex, 0);
    gl.uniform1f(this.u.uTexH, c.height);

    this.liquid = new BottleLiquid(BOTTLE_TEX.tankTopV, BOTTLE_TEX.photoLevelV, BOTTLE_TEX.aspect);
    this.loaded = true;
    this.renderFrame(0);
    this.resolveReady();
    this.syncLoop();
  }

  // ------------------------------------------------------------------ API
  setIntro(v: number) {
    this.intro = v;
    if (this.opts.staticFrame) this.renderFrame(0);
  }

  setProgress(v: number) {
    this.target = v;
    if (this.opts.staticFrame) this.renderFrame(0);
  }

  setActive(active: boolean) {
    this.active = active;
    this.syncLoop();
  }

  resize() {
    const r = this.container.getBoundingClientRect();
    this.cssW = Math.max(1, r.width);
    this.cssH = Math.max(1, r.height);
    const maxDpr = this.quality === "high" ? 1.75 : 1.3;
    let s = Math.min(window.devicePixelRatio || 1, maxDpr) * this.renderScale;
    // Cap the backing store (~2.8 MP) so 4K screens stay smooth.
    const maxPx = 2.8e6;
    if (this.cssW * this.cssH * s * s > maxPx) s = Math.sqrt(maxPx / (this.cssW * this.cssH));
    this.pxScale = s;
    this.canvas.width = Math.round(this.cssW * s);
    this.canvas.height = Math.round(this.cssH * s);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.layout = computeLayout(this.cssW, this.cssH);
    if (this.loaded && (this.opts.staticFrame || !this.raf)) this.renderFrame(0);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.ro.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
    const ext = this.gl.getExtension("WEBGL_lose_context");
    ext?.loseContext();
    if (this.pot && "close" in this.pot) this.pot.close();
    this.canvas.remove();
  }

  // ------------------------------------------------------------------ loop
  private syncLoop() {
    const run = this.loaded && this.active && !this.destroyed && !this.opts.staticFrame && !document.hidden;
    if (run && !this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    } else if (!run && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    this.renderFrame(dt);
    this.adapt(dt);
  };

  /** Drop render resolution if the device can't hold ~50fps. */
  private adapt(dt: number) {
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 50) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes.length = 0;
    if (avg > 1 / 48 && this.renderScale > 0.55) {
      this.renderScale = Math.max(0.55, this.renderScale * 0.85);
      this.resize();
    } else if (avg < 1 / 58 && this.renderScale < 1) {
      this.renderScale = Math.min(1, this.renderScale * 1.08);
      this.resize();
    }
  }

  private glassSurface(lay: Layout, fill: number): GlassSurface & { levelY: number } {
    const g = lay.glass;
    const yIB = g.yBase - g.baseH;
    const inner = g.h - g.baseH;
    const levelY = yIB - fill * MAX_POUR * inner;
    const tL = (g.yBase - levelY) / g.h;
    const rL = lerp(g.rBot, g.rTop, tL) - g.wall;
    const tIB = g.baseH / g.h;
    const riB = lerp(g.rBot, g.rTop, tIB) - g.wall * 1.3;
    const kIB = lerp(g.kBot, g.kTop, tIB);
    return { y: levelY, levelY, r: rL, cx: g.cx, bottomY: yIB + kIB * riB };
  }

  private renderFrame(dt: number) {
    if (!this.loaded || this.destroyed) return;
    const gl = this.gl;
    const lay = this.layout;
    const staticMode = !!this.opts.staticFrame;

    // Critically-damped follow of the scroll target: silky even on wheel steps.
    if (staticMode) this.progress = STATIC_PROGRESS;
    else this.progress += (this.target - this.progress) * (1 - Math.exp(-dt * 6.5));
    if (Math.abs(this.target - this.progress) < 1e-5) this.progress = this.target;
    this.time += dt;

    const pose: Pose = computePose(this.progress, lay);
    if (staticMode) {
      pose.glow = 0.18;
      pose.zoom = 1;
      pose.bottleDim = 1;
    }
    const intro = staticMode ? 1 : this.intro;

    const surf = this.glassSurface(lay, pose.fill);
    if (!staticMode) this.sim.step(dt, pose, lay, surf);

    const fillBottle = (this.liquid?.baseFill ?? 0.85) - 0.1 * pose.fill;
    const level = this.liquid ? this.liquid.level(pose.bottle, pose.angle, lay.bottle.L, fillBottle) : 0;

    // Intro: light warms up in two steps, bottle emerges, a sweep of light
    // crosses the crystal. After the intro a softer sweep recurs every 9s.
    const lightOn = 0.38 * smoothstep(0.02, 0.16, intro) + 0.62 * smoothstep(0.22, 0.62, intro);
    const bottleAlpha = smoothstep(0.16, 0.62, intro);
    let sweep = -2;
    if (intro < 1) {
      const s = seg(intro, 0.42, 1.0);
      if (s > 0 && s < 1) sweep = lerp(-0.75, 0.85, easeInOut(s));
    } else {
      const ph = (this.time % 9) / 2.4;
      if (ph < 1) sweep = lerp(-0.75, 0.85, easeInOut(ph));
    }

    const g = lay.glass;
    const zc = lay.zoomCenter;

    gl.useProgram(this.prog);
    const U = this.u;
    gl.uniform2f(U.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(U.uPx, this.pxScale);
    gl.uniform2f(U.uStage, lay.W, lay.H);
    gl.uniform1f(U.uU, lay.u);
    gl.uniform1f(U.uTime, this.time);
    gl.uniform1f(U.uLightOn, lightOn);
    gl.uniform1f(U.uGlow, pose.glow);
    gl.uniform3f(U.uZoom, zc.x, zc.y, pose.zoom);
    gl.uniform2f(U.uLightPos, lay.light.pos.x, lay.light.pos.y);
    gl.uniform2f(U.uLightTarget, lay.light.target.x, lay.light.target.y);
    gl.uniform1f(U.uFloorY, lay.floorY);

    gl.uniform4f(U.uBottle, pose.bottle.x, pose.bottle.y, pose.angle, lay.bottle.L);
    gl.uniform4f(U.uStopper, pose.stopper.x, pose.stopper.y, pose.stopperAngle, pose.stopperAlpha);
    gl.uniform1f(U.uBottleAlpha, bottleAlpha);
    gl.uniform1f(U.uBottleLevel, level);
    gl.uniform1f(U.uBottleSlosh, this.sim.bottleSlosh);
    gl.uniform1f(U.uBottleDim, pose.bottleDim);
    gl.uniform1f(U.uSweep, sweep);
    gl.uniform1f(U.uBottleFloorY, lay.bottle.floorY);

    gl.uniform4f(U.uGlassA, g.cx, g.yBase, g.h, g.rTop);
    gl.uniform4f(U.uGlassB, g.rBot, g.kTop, g.kBot, g.wall);
    gl.uniform4f(U.uGlassC, g.baseH, surf.levelY, pose.fill, staticMode ? 0.1 : this.sim.impactX);
    gl.uniform4f(U.uWave, staticMode ? 0 : this.sim.impact, staticMode ? 0.05 : this.sim.slosh, 0, 0);

    const sim = this.sim;
    const sc = staticMode ? 0 : sim.streamCount;
    if (sc > 0) gl.uniform4fv(U.uStream, sim.stream, 0, sc * 4);
    gl.uniform1i(U.uStreamCount, sc);
    gl.uniform4fv(U.uStreamBox, sim.streamBox);
    const dc = staticMode ? 0 : sim.dropCount;
    if (dc > 0) gl.uniform4fv(U.uDrops, sim.dropData, 0, dc * 4);
    gl.uniform1i(U.uDropCount, dc);
    const bc = staticMode ? 0 : sim.bubbleCount;
    if (bc > 0) gl.uniform4fv(U.uBubbles, sim.bubbleData, 0, bc * 4);
    gl.uniform1i(U.uBubbleCount, bc);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

export function createPourEngine(container: HTMLElement, opts: PourEngineOptions): HeroEngine {
  return new PourEngine(container, opts);
}
