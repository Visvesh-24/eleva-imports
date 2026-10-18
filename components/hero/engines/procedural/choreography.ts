/**
 * Pour choreography: pure functions that turn the scrubbed hero progress
 * (0 → 1) into poses for the bottle, stopper, glass and lights.
 *
 * Everything here is deterministic in `progress`, so scrubbing backwards
 * replays the shot exactly. Time-dependent detail (stream parcels, splash,
 * bubbles, ripples) lives in simulation.ts and is layered on top.
 *
 * Units: "stage px" = CSS pixels of the hero canvas, origin top-left, y down.
 */

// ---------------------------------------------------------------------------
// Bottle texture metrics (measured from the 1024×1536 source cutout,
// products/Luxury Faceted Tequila Decanter.png).
// ---------------------------------------------------------------------------
export const BOTTLE_TEX = {
  width: 1024,
  height: 1536,
  /** Quad aspect (w / h). */
  aspect: 1024 / 1536,
  /** v where the crystal stopper ends and the bottle mouth begins. */
  cutV: 344 / 1536,
  /** Lowest opaque row (bottle sits on the floor here). */
  baseV: 1515 / 1536,
  /** Mouth: half-width and v of the pouring lip. */
  mouthHalfW: 88 / 1536,
  mouthV: 350 / 1536,
  /** Top of the liquid "tank" (below the neck label band). */
  tankTopV: 488 / 1536,
  /** Liquid level baked into the photo when upright. */
  photoLevelV: 505 / 1536,
} as const;

export type Vec2 = { x: number; y: number };

export interface Layout {
  W: number;
  H: number;
  mobile: boolean;
  /** Composition scale unit. */
  u: number;
  floorY: number;
  glass: {
    cx: number;
    /** Centre-line y of the outer base ellipse. */
    yBase: number;
    h: number;
    rTop: number;
    rBot: number;
    kTop: number;
    kBot: number;
    wall: number;
    /** Base (solid glass) thickness. */
    baseH: number;
  };
  bottle: {
    /** Quad height (full texture height) in stage px. */
    L: number;
    rest: Vec2;
    /** Floor contact line used for the mirrored reflection. */
    floorY: number;
  };
  /** Where the pouring lip should sit during the pour. */
  lipTarget: Vec2;
  light: { pos: Vec2; target: Vec2 };
  /** Camera push-in pivot. */
  zoomCenter: Vec2;
  /** Gravity for the liquid stream (stage px / s²). */
  gravity: number;
}

export function computeLayout(W: number, H: number): Layout {
  // Same switch as the `wide`/`narrow` CSS variants used by the hero copy.
  const mobile = !(W >= 768 && W / H >= 0.9);
  let u: number;
  let floorY: number;
  let glassCx: number;
  if (mobile) {
    u = Math.min(W * 1.42, H * 0.7);
    floorY = H * 0.855;
    glassCx = W * 0.4;
  } else {
    u = Math.min(H, W * 0.62);
    floorY = H * 0.845;
    glassCx = W * (W / H > 1.45 ? 0.585 : 0.62);
  }

  const gh = 0.22 * u;
  const rTop = 0.5 * gh;
  const glass = {
    cx: glassCx,
    yBase: floorY + 0.022 * u,
    h: gh,
    rTop,
    rBot: rTop * 0.86,
    kTop: 0.17,
    kBot: 0.25,
    wall: rTop * 0.06,
    baseH: gh * 0.19,
  };

  const L = 0.62 * u;
  const bottleFloor = floorY - 0.004 * u;
  const restX = mobile ? Math.min(glassCx + 0.3 * u, W - 0.17 * u) : glassCx + 0.31 * u;
  const rest = { x: restX, y: bottleFloor - (BOTTLE_TEX.baseV - 0.5) * L };

  const rimY = glass.yBase - glass.h;
  const lipTarget = { x: glass.cx + rTop * 0.2, y: rimY - 0.15 * u };

  const sceneCx = (glass.cx + rest.x) / 2;
  return {
    W,
    H,
    mobile,
    u,
    floorY,
    glass,
    bottle: { L, rest, floorY: bottleFloor },
    lipTarget,
    light: {
      pos: { x: sceneCx - 0.04 * u, y: -0.35 * H },
      target: { x: sceneCx, y: floorY },
    },
    zoomCenter: mobile
      ? { x: glass.cx + 0.12 * u, y: rimY - 0.04 * u }
      : { x: glass.cx, y: glass.yBase - glass.h * 0.5 },
    gravity: 2.3 * u,
  };
}

// ---------------------------------------------------------------------------
// Easing / interpolation helpers
// ---------------------------------------------------------------------------
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Normalised position of p inside [a, b]. */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const smoothstep = (a: number, b: number, v: number) => smooth(clamp01((v - a) / (b - a)));

/**
 * Monotone cubic (Fritsch–Carlson) spline through keyframes: smooth like a
 * Catmull-Rom curve but never overshoots, so the tilt never "wobbles".
 */
function monotone(keys: [number, number][]) {
  const n = keys.length;
  const xs = keys.map((k) => k[0]);
  const ys = keys.map((k) => k[1]);
  const d: number[] = [];
  const m: number[] = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = 0;
  m[n - 1] = 0;
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}

/** Bottle tilt (degrees, positive = mouth toward the glass) over progress. */
const tiltCurve = monotone([
  [0.0, 0],
  [0.075, 0],
  [0.2, 34],
  [0.285, 86],
  [0.34, 104],
  [0.5, 109],
  [0.7, 116],
  [0.765, 80],
  [0.83, 22],
  [0.875, 0],
  [1.0, 0],
]);

/** Exit speed of the liquid at the lip (stage px / s). */
export function exitSpeed(flow: number, u: number) {
  return (0.05 + 0.13 * flow) * u;
}

/** Maximum glass fill as a fraction of the glass's inner height. */
export const MAX_POUR = 0.6;

/** Tilt angles where liquid starts/stops leaving the mouth. */
export const FLOW_ON_DEG = 93;
export const FLOW_FULL_DEG = 104;

/** Story beats (progress values) shared with the DOM captions. */
export const BEATS = {
  uncork: [0.0, 0.14],
  pour: [0.24, 0.74],
  savour: [0.8, 1.0],
  fill: [0.335, 0.735],
  glow: [0.88, 1.0],
} as const;

export interface Pose {
  /** Bottle centre (stage px). */
  bottle: Vec2;
  /** Bottle rotation (radians, screen space, y-down; negative = top to the left). */
  angle: number;
  tiltDeg: number;
  stopper: Vec2;
  stopperAngle: number;
  stopperAlpha: number;
  /** Flow strength at the mouth 0..1. */
  flow: number;
  /** Glass fill 0..1 (fraction of the max pour height). */
  fill: number;
  /** End-of-hero glow transition 0..1. */
  glow: number;
  /** Camera zoom about the glass. */
  zoom: number;
  bottleDim: number;
}

/** Rotate a vector by angle a (screen space, y down). */
export function rot(v: Vec2, a: number): Vec2 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: c * v.x - s * v.y, y: s * v.x + c * v.y };
}

/** Both mouth corners in bottle-local stage px (relative to bottle centre). */
function mouthCorners(L: number): [Vec2, Vec2] {
  const y = (BOTTLE_TEX.mouthV - 0.5) * L;
  const hw = BOTTLE_TEX.mouthHalfW * L;
  return [
    { x: -hw, y },
    { x: hw, y },
  ];
}

/** World-space pouring lip (the lower of the two mouth corners). */
export function lipWorld(center: Vec2, angle: number, L: number): Vec2 {
  const [a, b] = mouthCorners(L);
  const wa = rot(a, angle);
  const wb = rot(b, angle);
  const w = wa.y > wb.y ? wa : wb;
  return { x: center.x + w.x, y: center.y + w.y };
}

/** Bottle-axis "up" direction in world space. */
export function axisUp(angle: number): Vec2 {
  return rot({ x: 0, y: -1 }, angle);
}

export function computePose(p: number, lay: Layout): Pose {
  const { L, rest } = lay.bottle;
  const tiltDeg = tiltCurve(p);
  const angle = (-tiltDeg * Math.PI) / 180;

  // Move from the resting spot into a pose that keeps the lip over the glass.
  const moveIn = easeInOut(seg(p, 0.06, 0.3));
  const moveOut = easeInOut(seg(p, 0.735, 0.875));
  const move = moveIn * (1 - moveOut);

  const flow = smoothstep(FLOW_ON_DEG, FLOW_FULL_DEG, tiltDeg);
  const fill = easeInOut(seg(p, BEATS.fill[0], BEATS.fill[1]));

  // Aim: the stream leaves the lip with some sideways speed, so offset the
  // lip by the ballistic drift to land just right of the glass centre.
  const g = lay.glass;
  const up = axisUp(angle);
  const v0 = exitSpeed(flow, lay.u);
  const surfaceY = g.yBase - g.baseH - fill * MAX_POUR * (g.h - g.baseH);
  const drop = Math.max(surfaceY - lay.lipTarget.y, 1);
  const vy = up.y * v0;
  const fall = (-vy + Math.sqrt(vy * vy + 2 * lay.gravity * drop)) / lay.gravity;
  const aimX = g.cx + g.rTop * 0.08 - up.x * v0 * fall;

  // Pour pose: rotate about the lip so it stays planted above the glass.
  // While travelling, aim for where the lip will be once fully tilted so the
  // bottle never swings away from the glass first.
  const travelAngle = Math.min(angle, (-FLOW_ON_DEG * Math.PI) / 180);
  const [ca, cb] = mouthCorners(L);
  const wa = rot(ca, travelAngle);
  const wb = rot(cb, travelAngle);
  const lipLocal = wa.y > wb.y ? wa : wb;
  const pourCenter = {
    x: aimX - lipLocal.x,
    y: lay.lipTarget.y - lipLocal.y,
  };
  // A small lift arc while travelling, so the bottle is carried, not slid.
  const arc = Math.sin(Math.PI * moveIn) * 0.05 * lay.u * (1 - moveOut) + Math.sin(Math.PI * moveOut) * 0.035 * lay.u;
  const bottle = {
    x: lerp(rest.x, pourCenter.x, move),
    y: lerp(rest.y, pourCenter.y, move) - arc,
  };

  // Stopper: eased up out of the neck, then lifted away out of frame.
  // It is lowered back into place once the bottle is home again.
  let stopper: Vec2;
  let stopperAngle: number;
  let stopperAlpha: number;
  if (p < 0.5) {
    const up = easeInOut(seg(p, 0.0, 0.055));
    const away = easeIn(seg(p, 0.045, 0.14));
    stopper = { x: rest.x + away * 0.12 * lay.u, y: rest.y - up * 0.085 * lay.u - away * 0.9 * lay.H };
    stopperAngle = away * 0.22;
    stopperAlpha = 1 - smoothstep(0.35, 0.9, away);
  } else {
    const r = easeInOut(1 - seg(p, 0.87, 0.97)); // 1 = far above, 0 = seated
    stopper = { x: rest.x + r * 0.03 * lay.u, y: rest.y - r * 0.3 * lay.H };
    stopperAngle = r * 0.12;
    stopperAlpha = 1 - smoothstep(0.45, 0.95, r);
  }

  const glow = smooth(seg(p, BEATS.glow[0], BEATS.glow[1]));

  return {
    bottle,
    angle,
    tiltDeg,
    stopper,
    stopperAngle,
    stopperAlpha,
    flow,
    fill,
    glow,
    // Mobile pushes in as the pour begins (the copy steps aside); desktop
    // keeps the wide shot. Both drift toward the glass for the hand-off.
    zoom: lay.mobile
      ? 1 + 0.3 * easeInOut(seg(p, 0.03, 0.3)) - 0.12 * easeInOut(seg(p, 0.76, 0.9)) + 0.14 * easeInOut(seg(p, 0.88, 1.0))
      : 1 + 0.04 * easeInOut(seg(p, 0.05, 0.32)) + 0.12 * easeInOut(seg(p, 0.86, 1.0)),
    bottleDim: 1 - 0.55 * glow,
  };
}

/** Pose used for reduced-motion visitors: glass poured, bottle resting. */
export const STATIC_PROGRESS = 0.975;
