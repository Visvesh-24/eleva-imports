/**
 * Time-based liquid simulation for the procedural pour.
 *
 * The stream is not a drawn curve: it is a chain of ballistic fluid parcels
 * emitted from the bottle lip. Each parcel follows an analytic projectile path
 * under gravity, so the stream bends naturally when the bottle moves, its head
 * falls when the pour begins, and its tail detaches and drops when the pour
 * ends. Parcels landing in the glass feed splash droplets, rising bubbles and
 * surface ripples.
 */
import { BOTTLE_MASK } from "./bottleMask";
import { axisUp, exitSpeed, lipWorld, type Layout, type Pose, type Vec2 } from "./choreography";

export const MAX_PARCELS = 30;
export const MAX_STREAM_POINTS = MAX_PARCELS + 2;
export const MAX_DROPS = 24;
export const MAX_BUBBLES = 40;

interface Parcel {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  t0: number;
  r0: number;
  /** Emission spacing used when this parcel was born (break detection). */
  gap: number;
  alive: boolean;
}

interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
}

interface Bubble {
  x: number;
  y: number;
  vy: number;
  r: number;
  phase: number;
  life: number;
}

/** Small deterministic PRNG so the splash pattern is stable between runs. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface GlassSurface {
  /** Centre-line y of the liquid surface (or inner bottom if empty). */
  y: number;
  /** Inner radius at the surface. */
  r: number;
  cx: number;
  /** y of the lowest visible liquid point (front of the inner bottom). */
  bottomY: number;
}

export class PourSim {
  time = 0;
  private parcels: Parcel[] = [];
  private drops: Drop[] = [];
  private bubbles: Bubble[] = [];
  private lastEmit = -1;
  private lastDead: { x: number; y: number; r: number; t: number; t0: number; gap: number } | null = null;
  private prevLip: Vec2 | null = null;
  private prevLipForEmit: Vec2 | null = null;
  private lipVel: Vec2 = { x: 0, y: 0 };
  private prevAngle = 0;
  private rand = mulberry32(0x5eed);

  /** Smoothed 0..1 strength of the stream currently hitting the surface. */
  impact = 0;
  /** Surface slosh energy 0..1. */
  slosh = 0;
  /** Impact position normalised to the surface radius (-1..1). */
  impactX = 0.1;
  /** Slosh of the liquid inside the bottle (driven by angular velocity). */
  bottleSlosh = 0;

  /** Packed GPU data. */
  readonly stream = new Float32Array(MAX_STREAM_POINTS * 4);
  streamCount = 0;
  readonly streamBox = new Float32Array(4);
  readonly dropData = new Float32Array(MAX_DROPS * 4);
  dropCount = 0;
  readonly bubbleData = new Float32Array(MAX_BUBBLES * 4);
  bubbleCount = 0;

  reset() {
    this.parcels = [];
    this.drops = [];
    this.bubbles = [];
    this.lastEmit = -1;
    this.lastDead = null;
    this.prevLip = null;
    this.impact = 0;
    this.slosh = 0;
    this.streamCount = 0;
    this.dropCount = 0;
    this.bubbleCount = 0;
  }

  step(dtRaw: number, pose: Pose, lay: Layout, surf: GlassSurface) {
    const dt = Math.min(dtRaw, 1 / 20);
    this.time += dt;
    const t = this.time;
    const g = lay.gravity;
    const u = lay.u;
    const rand = this.rand;

    const L = lay.bottle.L;
    const lip = lipWorld(pose.bottle, pose.angle, L);
    if (this.prevLip && dtRaw > 0) {
      // Measure against the real frame time, then cap: a fast scroll should
      // swing the stream, never fling it out of the glass.
      const k = 1 - Math.exp(-dtRaw * 12);
      this.lipVel.x += ((lip.x - this.prevLip.x) / dtRaw - this.lipVel.x) * k;
      this.lipVel.y += ((lip.y - this.prevLip.y) / dtRaw - this.lipVel.y) * k;
      const sp = Math.hypot(this.lipVel.x, this.lipVel.y);
      const cap = 0.35 * u;
      if (sp > cap) {
        this.lipVel.x *= cap / sp;
        this.lipVel.y *= cap / sp;
      }
    }
    this.prevLip = lip;

    // Bottle-internal slosh from angular velocity.
    const angVel = dt > 0 ? Math.abs(pose.angle - this.prevAngle) / dt : 0;
    this.prevAngle = pose.angle;
    this.bottleSlosh += (Math.min(angVel * 0.6, 1) - this.bottleSlosh) * (1 - Math.exp(-dt * 3));

    // ---- Emission -----------------------------------------------------------
    const flow = pose.flow;
    const rMax = 0.0088 * u;
    const up = axisUp(pose.angle);
    const v0 = exitSpeed(flow, u);
    // Estimate the fall time to space parcels evenly along the stream.
    const drop = Math.max(surf.y - lip.y, 0.02 * u);
    const vyEst = up.y * v0;
    const fall = (-vyEst + Math.sqrt(vyEst * vyEst + 2 * g * drop)) / g;
    const gap = Math.min(Math.max(fall / (MAX_PARCELS - 6), 1 / 240), 1 / 40);

    if (flow > 0.015) {
      if (this.lastEmit < 0 || t - this.lastEmit > gap * 4) this.lastEmit = t - gap;
      const prev = this.prevLipForEmit ?? lip;
      const frameStart = t - dt;
      let guard = 0;
      while (t - this.lastEmit >= gap && guard++ < 12) {
        this.lastEmit += gap;
        // Interpolate the lip across the frame so a low frame rate still
        // produces an evenly spaced, smooth stream.
        const k = dt > 0 ? Math.min(1, Math.max(0, (this.lastEmit - frameStart) / dt)) : 1;
        const jitter = (rand() - 0.5) * 0.01 * u;
        this.parcels.push({
          x0: prev.x + (lip.x - prev.x) * k,
          y0: prev.y + (lip.y - prev.y) * k,
          vx: up.x * v0 + this.lipVel.x * 0.4 + jitter,
          vy: up.y * v0 + this.lipVel.y * 0.4,
          t0: this.lastEmit,
          r0: rMax * Math.sqrt(flow),
          gap,
          alive: true,
        });
      }
      while (this.parcels.length > MAX_PARCELS) this.parcels.shift();
    } else {
      this.lastEmit = -1;
    }
    this.prevLipForEmit = lip;

    // ---- Parcel impacts -----------------------------------------------------
    let hitting = 0;
    for (const pc of this.parcels) {
      if (!pc.alive) continue;
      const a = t - pc.t0;
      const x = pc.x0 + pc.vx * a;
      const y = pc.y0 + pc.vy * a + 0.5 * g * a * a;
      const insideGlass = Math.abs(x - surf.cx) < surf.r * 0.97;
      if ((insideGlass && y >= surf.y) || y > lay.H * 1.2) {
        pc.alive = false;
        // Exact intersection with the surface plane.
        const dy = surf.y - pc.y0;
        const disc = pc.vy * pc.vy + 2 * g * dy;
        const tau = disc > 0 ? (-pc.vy + Math.sqrt(disc)) / g : a;
        const ix = pc.x0 + pc.vx * tau;
        const rNow = pc.r0 / Math.sqrt(1 + (g * tau) / (0.35 * u));
        this.lastDead = { x: ix, y: surf.y, r: rNow, t, t0: pc.t0, gap: pc.gap };
        if (insideGlass) {
          hitting = Math.max(hitting, pc.r0 / rMax);
          this.impactX += ((ix - surf.cx) / surf.r - this.impactX) * 0.2;
          this.spawnSplash(ix, surf, rNow, pc.r0 / rMax, lay);
        }
      }
    }
    this.parcels = this.parcels.filter((p) => p.alive);

    // Surface response.
    const kImp = 1 - Math.exp(-dt * (hitting > this.impact ? 10 : 3));
    this.impact += (hitting - this.impact) * kImp;
    this.slosh = Math.min(1, this.slosh * Math.exp(-dt * 0.9) + this.impact * dt * 1.6);

    // ---- Droplets -------------------------------------------------------------
    for (const d of this.drops) {
      d.vy += g * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.life -= dt;
      if ((d.vy > 0 && d.y > surf.y) || Math.abs(d.x - surf.cx) > surf.r * 0.95) {
        d.life = 0;
        this.slosh = Math.min(1, this.slosh + 0.004);
      }
    }
    this.drops = this.drops.filter((d) => d.life > 0);

    // ---- Bubbles ------------------------------------------------------------
    for (const b of this.bubbles) {
      b.y += b.vy * dt;
      b.vy *= Math.exp(-dt * 0.4);
      b.phase += dt * 9;
      b.x += Math.sin(b.phase) * 0.012 * u * dt;
      b.life -= dt;
      if (b.y < surf.y + 0.004 * u) b.life = 0;
    }
    this.bubbles = this.bubbles.filter((b) => b.life > 0 && b.y < surf.bottomY);

    this.pack(lip, flow, lay, surf);
  }

  private spawnSplash(x: number, surf: GlassSurface, r: number, strength: number, lay: Layout) {
    const rand = this.rand;
    const u = lay.u;
    const g = lay.gravity;
    if (rand() < 0.42 * strength) {
      const n = rand() < 0.25 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const h = (0.012 + 0.045 * rand() * rand()) * u;
        this.drops.push({
          x: x + (rand() - 0.5) * r,
          y: surf.y - r * 0.4,
          vx: (rand() - 0.5) * 0.55 * u,
          vy: -Math.sqrt(2 * g * h),
          r: (0.22 + 0.42 * rand()) * r + 0.6,
          life: 1.2,
        });
      }
      while (this.drops.length > MAX_DROPS) this.drops.shift();
    }
    if (rand() < 0.7 * strength) {
      const depth = Math.max(surf.bottomY - surf.y, 1);
      this.bubbles.push({
        x: x + (rand() - 0.5) * surf.r * 0.45,
        y: surf.y + (0.18 + 0.75 * rand()) * depth,
        vy: -(0.05 + 0.1 * rand()) * u,
        r: (0.0012 + 0.0032 * rand() * rand()) * u + 0.5,
        phase: rand() * 6.28,
        life: 2.4,
      });
      while (this.bubbles.length > MAX_BUBBLES) this.bubbles.shift();
    }
  }

  /** Pack stream / drops / bubbles into the uniform arrays. */
  private pack(lip: Vec2, flow: number, lay: Layout, surf: GlassSurface) {
    const t = this.time;
    const g = lay.gravity;
    const u = lay.u;
    const s = this.stream;
    let n = 0;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const push = (x: number, y: number, r: number, age: number, brk: boolean) => {
      if (n >= MAX_STREAM_POINTS) return;
      s[n * 4] = x;
      s[n * 4 + 1] = y;
      s[n * 4 + 2] = brk ? -Math.max(r, 0.001) : r;
      s[n * 4 + 3] = age;
      n++;
      minX = Math.min(minX, x - r);
      maxX = Math.max(maxX, x + r);
      minY = Math.min(minY, y - r);
      maxY = Math.max(maxY, y + r);
    };

    const rMax = 0.0088 * u;
    // Newest first: lip → falling parcels → impact point.
    const ordered = this.parcels.slice().sort((a, b) => b.t0 - a.t0);
    if (flow > 0.015) push(lip.x, lip.y, rMax * Math.sqrt(flow), 0, false);
    let prevT0 = flow > 0.015 ? t : -1;
    let prevGap = ordered[0]?.gap ?? 0;
    for (const pc of ordered) {
      const a = t - pc.t0;
      const x = pc.x0 + pc.vx * a;
      const y = pc.y0 + pc.vy * a + 0.5 * g * a * a;
      const r = pc.r0 / Math.sqrt(1 + (g * a) / (0.35 * u));
      const brk = prevT0 < 0 ? n > 0 : prevT0 - pc.t0 > Math.max(pc.gap, prevGap) * 3.2;
      push(x, y, r, a, brk || n === 0);
      prevT0 = pc.t0;
      prevGap = pc.gap;
    }
    const ld = this.lastDead;
    if (ld && n > 0 && t - ld.t < ld.gap * 2.5 && prevT0 - ld.t0 < ld.gap * 3.2) {
      push(ld.x, surf.y + 0.002 * u, ld.r, t - ld.t0, false);
    }
    // The first point of a run is flagged as a break (no segment into it).
    if (n > 0) s[2] = -Math.abs(s[2]);
    this.streamCount = n;
    const pad = 0.05 * u;
    this.streamBox[0] = minX - pad;
    this.streamBox[1] = minY - pad;
    this.streamBox[2] = maxX + pad;
    this.streamBox[3] = maxY + pad;

    let dn = 0;
    for (const d of this.drops) {
      if (dn >= MAX_DROPS) break;
      this.dropData.set([d.x, d.y, d.r, Math.min(1, d.life * 4)], dn * 4);
      dn++;
    }
    this.dropCount = dn;

    let bn = 0;
    for (const b of this.bubbles) {
      if (bn >= MAX_BUBBLES) break;
      this.bubbleData.set([b.x, b.y, b.r, Math.min(1, b.life * 2) * Math.min(1, (2.4 - b.life) * 6)], bn * 4);
      bn++;
    }
    this.bubbleCount = bn;
  }
}

/**
 * Keeps the liquid line inside the bottle level with the world while the
 * bottle tilts, conserving volume. Uses a coarse grid sampled from the
 * bottle's alpha mask; good enough for a believable air pocket.
 */
export class BottleLiquid {
  private cells: { x: number; y: number }[] = [];
  /** Fill fraction that reproduces the level baked into the photo. */
  baseFill = 0.85;
  private ys: Float32Array = new Float32Array(0);

  constructor(tankTopV: number, photoLevelV: number, aspect: number) {
    const { w: gw, h: gh, hex } = BOTTLE_MASK;
    const bit = (i: number) => (parseInt(hex[i >> 2], 16) >> (3 - (i & 3))) & 1;
    let below = 0;
    for (let j = 0; j < gh; j++) {
      const v = (j + 0.5) / gh;
      if (v < tankTopV) continue;
      for (let i = 0; i < gw; i++) {
        if (!bit(j * gw + i)) continue;
        this.cells.push({ x: ((i + 0.5) / gw - 0.5) * aspect, y: v - 0.5 });
        if (v > photoLevelV) below++;
      }
    }
    this.baseFill = this.cells.length ? below / this.cells.length : 0.85;
    this.ys = new Float32Array(this.cells.length);
  }

  /** World y of the liquid line for a given bottle transform and fill. */
  level(center: Vec2, angle: number, L: number, fill: number): number {
    const n = this.cells.length;
    if (!n) return center.y;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    for (let i = 0; i < n; i++) {
      const cell = this.cells[i];
      this.ys[i] = center.y + L * (s * cell.x + c * cell.y);
    }
    this.ys.sort();
    // Liquid occupies the lowest (largest y) `fill` fraction of the cells.
    const idx = Math.min(n - 1, Math.max(0, Math.floor((1 - fill) * n)));
    return this.ys[idx];
  }
}
