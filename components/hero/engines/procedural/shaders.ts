/**
 * GLSL for the procedural hero pour. A single full-screen pass composites
 * the whole shot back to front, in linear light:
 *
 *   stage (spotlight beam, haze, dust) → floor (light pool, caustics,
 *   reflections, contact shadows) → bottle + stopper (photo texture with a
 *   volume-correct liquid line) → glass back wall → liquid (Beer–Lambert
 *   absorption, wavy surface + meniscus, bubbles) → stream + splash
 *   (capsule-chain SDF with Plateau–Rayleigh beading, metaball droplets) →
 *   glass front (walls, specular streaks, rim, thick base) → glow, vignette,
 *   ACES tone map, dither.
 *
 * Coordinates are stage px (CSS px, origin top-left, y down).
 */
import { BOTTLE_TEX } from "./choreography";
import { MAX_BUBBLES, MAX_DROPS, MAX_STREAM_POINTS } from "./simulation";

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const f = (n: number) => n.toFixed(6);

export function buildFrag(opts: { quality: "high" | "low" }) {
  const hi = opts.quality === "high";
  return /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

#define MAX_STREAM ${MAX_STREAM_POINTS}
#define MAX_DROPS ${MAX_DROPS}
#define MAX_BUBBLES ${MAX_BUBBLES}
#define HQ ${hi ? 1 : 0}

#define ASPECT ${f(BOTTLE_TEX.aspect)}
#define CUT_V ${f(BOTTLE_TEX.cutV)}
#define TANK_V ${f(BOTTLE_TEX.tankTopV)}

uniform vec2 uRes;
uniform float uPx;
uniform vec2 uStage;
uniform float uU;
uniform float uTime;
uniform float uLightOn;
uniform float uGlow;
uniform vec3 uZoom;

uniform vec2 uLightPos;
uniform vec2 uLightTarget;
uniform float uFloorY;

uniform sampler2D uBottleTex;
uniform vec4 uBottle;      // cx, cy, angle, L
uniform vec4 uStopper;     // cx, cy, angle, alpha
uniform float uBottleAlpha;
uniform float uBottleLevel;
uniform float uBottleSlosh;
uniform float uBottleDim;
uniform float uSweep;
uniform float uBottleFloorY;

uniform vec4 uGlassA;      // cx, yBase, h, rTop
uniform vec4 uGlassB;      // rBot, kTop, kBot, wall
uniform vec4 uGlassC;      // baseH, levelY, fill, impactX
uniform vec4 uWave;        // impact, slosh, -, -

uniform vec4 uStream[MAX_STREAM];
uniform int uStreamCount;
uniform vec4 uStreamBox;
uniform vec4 uDrops[MAX_DROPS];
uniform int uDropCount;
uniform vec4 uBubbles[MAX_BUBBLES];
uniform int uBubbleCount;

float AA;

const vec3 WARM = vec3(1.0, 0.78, 0.52);
const vec3 WARM_WHITE = vec3(1.0, 0.9, 0.76);
const vec3 GOLD = vec3(1.0, 0.66, 0.28);
const vec3 AMBER = vec3(0.95, 0.42, 0.1);
const vec3 SIGMA = vec3(0.42, 1.12, 2.6); // amber absorption (blue absorbed most)

// ---------------------------------------------------------------- noise
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x),
             mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}
// Tileable water caustic (after Dave Hoskins / joltz0r).
float caustic(vec2 uv, float t) {
  vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < ${hi ? 4 : 3}; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= ${hi ? "4.0" : "3.0"};
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 2.0);
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
vec3 toLinear(vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }

// ---------------------------------------------------------------- light
float spot(vec2 p) {
  vec2 ax = normalize(uLightTarget - uLightPos);
  vec2 d = p - uLightPos;
  float dist = length(d);
  float cosA = dot(d / dist, ax);
  float cone = smoothstep(0.952, 0.992, cosA);
  float fall = 1.0 / (1.0 + pow(dist / (uStage.y * 1.25), 2.0));
  return cone * fall;
}

// ---------------------------------------------------------------- bottle
vec4 bottleSample(vec2 p, vec4 xf, float part, float bias, out vec2 uv) {
  vec2 d = p - xf.xy;
  float c = cos(xf.z);
  float s = sin(xf.z);
  vec2 q = vec2(c * d.x + s * d.y, -s * d.x + c * d.y) / xf.w;
  uv = vec2(q.x / ASPECT + 0.5, q.y + 0.5);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  float edge = 0.6 / xf.w;
  float m = part > 0.0 ? smoothstep(CUT_V - edge, CUT_V + edge, uv.y)
                       : smoothstep(CUT_V + edge, CUT_V - edge, uv.y);
  if (m <= 0.0) return vec4(0.0);
  return texture(uBottleTex, uv, bias) * m;
}

vec3 shadeGlassPhoto(vec4 b, vec2 uv, vec2 p, float isBody, float lightAmt) {
  vec3 c = toLinear(b.rgb / max(b.a, 1e-4));
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  if (isBody > 0.5) {
    // Volume-correct air pocket: above the world-level line the crystal is empty.
    float wave = (sin(p.x * 0.05 + uTime * 3.1) * 0.006 + sin(p.x * 0.13 - uTime * 4.7) * 0.003) * uBottleSlosh * uU;
    float lvl = uBottleLevel + wave;
    float inTank = smoothstep(TANK_V - 0.01, TANK_V + 0.01, uv.y);
    float empty = inTank * smoothstep(lvl + AA, lvl - AA, p.y);
    vec3 crystal = vec3(lum) * vec3(1.0, 0.92, 0.8) * 1.08;
    c = mix(c, crystal, empty * 0.75);
    float men = inTank * exp(-abs(p.y - lvl) / (0.0016 * uU));
    c += GOLD * men * 0.5 * (0.35 + lum);
  }
  // Light sweep across the crystal (intro).
  vec2 sp = uv - 0.5;
  float sw = dot(sp, normalize(vec2(1.0, -0.62)));
  float band = exp(-pow((sw - uSweep) / 0.05, 2.0)) + 0.35 * exp(-pow((sw - uSweep + 0.09) / 0.02, 2.0));
  c += WARM_WHITE * band * (0.12 + 2.2 * lum * lum) * 0.9;
  return c * lightAmt;
}

// ---------------------------------------------------------------- glass geo
struct Glass {
  float cx, yBase, h, rT, rB, kT, kB, wall, baseH;
  float rimY, x, t, r, k, ri;
  float yIB, riB, kIB;
};

Glass glassGeo(vec2 p) {
  Glass g;
  g.cx = uGlassA.x; g.yBase = uGlassA.y; g.h = uGlassA.z; g.rT = uGlassA.w;
  g.rB = uGlassB.x; g.kT = uGlassB.y; g.kB = uGlassB.z; g.wall = uGlassB.w;
  g.baseH = uGlassC.x;
  g.rimY = g.yBase - g.h;
  g.x = p.x - g.cx;
  g.t = clamp((g.yBase - p.y) / g.h, 0.0, 1.0);
  g.r = mix(g.rB, g.rT, g.t);
  g.k = mix(g.kB, g.kT, g.t);
  g.ri = g.r - g.wall;
  g.yIB = g.yBase - g.baseH;
  float tIB = g.baseH / g.h;
  g.riB = mix(g.rB, g.rT, tIB) - g.wall * 1.3;
  g.kIB = mix(g.kB, g.kT, tIB);
  return g;
}

// Signed distance (px) to an axis-aligned ellipse, first-order approximation.
float ellipseDist(vec2 q, vec2 rad) {
  float e = length(q / rad);
  vec2 grad = q / (rad * rad) / max(e, 1e-4);
  return (e - 1.0) / max(length(grad), 1e-4);
}

float glassMask(vec2 p, Glass g) {
  float side = step(g.rimY, p.y) * step(p.y, g.yBase) * smoothstep(g.r + AA, g.r - AA, abs(g.x));
  float rim = smoothstep(AA, -AA, ellipseDist(vec2(g.x, p.y - g.rimY), vec2(g.rT, g.rT * g.kT)));
  float base = step(g.yBase, p.y) * smoothstep(AA, -AA, ellipseDist(vec2(g.x, p.y - g.yBase), vec2(g.rB, g.rB * g.kB)));
  return max(side, max(rim, base));
}

// ---------------------------------------------------------------- main
void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPx;
  vec2 p = (frag - uZoom.xy) / uZoom.z + uZoom.xy;
  AA = 0.85 / (uPx * uZoom.z);
  float U = uU;
  float H = uStage.y;
  float L = uLightOn;

  // ============================================================ stage
  vec3 col = mix(vec3(0.0062, 0.0052, 0.0046), vec3(0.0026, 0.0022, 0.002), clamp(p.y / H, 0.0, 1.0));
  float sp = spot(p);
  float airMask = smoothstep(uFloorY + 0.02 * H, uFloorY - 0.04 * H, p.y);
  float haze = 0.45 + 0.55 * fbm(p * 0.0032 + vec2(uTime * 0.018, -uTime * 0.03));
  col += WARM * sp * haze * 0.085 * L * airMask;

  // Light leaks: soft copper/amber blooms at the edges.
  vec2 lk1 = (p - vec2(uStage.x * 0.06, H * 0.12)) / vec2(0.55 * U, 0.42 * U);
  vec2 lk2 = (p - vec2(uStage.x * 1.02, H * 0.55 + sin(uTime * 0.11) * 0.05 * H)) / vec2(0.35 * U, 0.6 * U);
  col += vec3(0.6, 0.24, 0.08) * exp(-dot(lk1, lk1)) * 0.022 * L;
  col += vec3(0.7, 0.32, 0.12) * exp(-dot(lk2, lk2)) * 0.03 * L;

  // Dust motes drifting in the beam.
  {
    float m = 0.0;
    for (int l = 0; l < ${hi ? 3 : 2}; l++) {
      float fl = float(l);
      float sc = 0.075 * U + fl * 0.045 * U;
      vec2 q = p / sc + vec2(uTime * 0.04 * (1.0 + fl), -uTime * (0.05 + 0.02 * fl));
      vec2 id = floor(q);
      vec2 fr = fract(q) - 0.5;
      vec2 h = hash22(id + fl * 13.7) - 0.5;
      vec2 off = h * 0.7 + 0.1 * vec2(sin(uTime * 0.6 + h.x * 9.0), cos(uTime * 0.45 + h.y * 9.0));
      float d = length(fr - off) * sc;
      float sz = (0.5 + 1.4 * hash12(id + 3.1)) * (0.6 + fl * 0.4);
      float tw = 0.55 + 0.45 * sin(uTime * 1.1 + h.x * 25.0);
      m += smoothstep(sz + 1.0, 0.0, d) * tw * step(0.6, hash12(id + 7.7 + fl));
    }
    col += WARM_WHITE * m * sp * 0.42 * L * airMask;
  }

  // ============================================================ floor
  float floorM = smoothstep(uFloorY - 0.004 * H, uFloorY + 0.03 * H, p.y);
  vec2 pq = (p - vec2(uLightTarget.x, uFloorY + 0.035 * U)) / vec2(0.44 * U, 0.075 * U);
  float pool = exp(-dot(pq, pq) * 1.35);
  col = mix(col, col * 0.55, floorM);
  col += WARM * pool * 0.11 * L * floorM;
  // A faint horizon line where the beam meets the floor.
  col += WARM * exp(-abs(p.y - uFloorY) / (0.003 * H)) * 0.02 * L * smoothstep(0.0, 0.4, sp + pool * 0.3);

  Glass g = glassGeo(p);
  float fill = uGlassC.z;
  float levelY = uGlassC.y;

  // Contact shadows.
  {
    vec2 bq = (p - vec2(uBottle.x, uBottleFloorY + 0.004 * U)) / vec2(0.16 * U, 0.018 * U);
    float lifted = clamp((uBottleFloorY - (uBottle.y + (${f(BOTTLE_TEX.baseV)} - 0.5) * uBottle.w)) / (0.15 * U), 0.0, 1.0);
    float bs = exp(-dot(bq, bq)) * (1.0 - lifted) * (abs(uBottle.z) < 0.4 ? 1.0 : 0.0);
    vec2 gq = (p - vec2(g.cx, g.yBase + g.rB * g.kB * 0.5)) / vec2(g.rB * 1.25, g.rB * g.kB * 1.8);
    float gs = exp(-dot(gq, gq) * 1.4);
    col *= 1.0 - 0.65 * max(bs * uBottleAlpha, gs) * floorM;
  }

  // Floor caustics: light focused through the liquid onto the floor.
  {
    vec2 cq = (p - vec2(g.cx + g.rB * 0.15, g.yBase + g.rB * g.kB * 1.35)) / vec2(g.rB * 1.65, g.rB * g.kB * 2.5);
    float cm = 1.0 - smoothstep(0.25, 1.0, length(cq));
    if (cm > 0.0) {
      float cs = caustic(cq * 0.55 + vec2(0.0, uTime * 0.03), uTime * 0.5 + 23.0);
      float amt = (fill * 0.9 + 0.08) * L * (1.0 + uGlow * 1.6);
      col += mix(GOLD, AMBER, 0.45) * (cs * 0.55 + 0.25) * cm * amt * 0.42;
    }
    // Warm reflected glow column of the liquid on the glossy floor.
    vec2 rq = (p - vec2(g.cx, g.yBase + g.rB * g.kB + 0.03 * U)) / vec2(g.rB * 0.9, 0.06 * U);
    col += AMBER * exp(-dot(rq, rq)) * fill * 0.09 * L * (1.0 + uGlow * 2.0) * floorM;
  }

  // Bottle reflection on the glossy floor (mirrored, blurred via mip bias).
  if (p.y > uBottleFloorY) {
    vec2 uvR;
    vec2 pm = vec2(p.x, 2.0 * uBottleFloorY - p.y);
    vec4 rb = bottleSample(pm, uBottle, 1.0, 2.5, uvR);
    float fade = exp(-(p.y - uBottleFloorY) / (0.075 * U)) * 0.16 * uBottleAlpha * uBottleDim;
    col += toLinear(rb.rgb / max(rb.a, 1e-4)) * rb.a * fade * L;
  }

  // ============================================================ bottle
  {
    vec2 hq = (p - uBottle.xy) / vec2(0.24 * U, 0.42 * U);
    col += GOLD * exp(-dot(hq, hq) * 1.4) * 0.03 * L * uBottleAlpha * uBottleDim;

    float lightAmt = (0.32 + 1.05 * smoothstep(0.0, 0.7, spot(p) * 1.2)) * L * uBottleDim;
    vec2 uv;
    vec4 b = bottleSample(p, uBottle, 1.0, -0.4, uv);
    if (b.a > 0.002) {
      vec3 c = shadeGlassPhoto(b, uv, p, 1.0, lightAmt);
      float a = b.a * uBottleAlpha;
      col = col * (1.0 - a) + c * a;
    }
    if (uStopper.w > 0.002) {
      vec2 suv;
      vec4 s = bottleSample(p, vec4(uStopper.xy, uStopper.z, uBottle.w), -1.0, -0.4, suv);
      if (s.a > 0.002) {
        vec3 c = shadeGlassPhoto(s, suv, p, 0.0, lightAmt * 1.05);
        float a = s.a * uStopper.w * uBottleAlpha;
        col = col * (1.0 - a) + c * a;
      }
    }
  }

  // ============================================================ glass + liquid
  float gm = 0.0;
  bool nearGlass = abs(g.x) < g.rT * 1.2 + 6.0 && p.y > g.rimY - g.rT * g.kT - 6.0 && p.y < g.yBase + g.rB * g.kB + 6.0;
  float gLight = (0.45 + 0.9 * smoothstep(0.0, 0.6, spot(p) * 1.3)) * L;
  float liquidMask = 0.0;
  if (nearGlass) {
    gm = glassMask(p, g);
    // Back wall: faint absorption + back rim arc.
    col = mix(col, col * 0.9 + vec3(0.007, 0.006, 0.005) * L, gm);
    float rimD = ellipseDist(vec2(g.x, p.y - g.rimY), vec2(g.rT, g.rT * g.kT));
    float backArc = step(p.y, g.rimY);
    col += WARM_WHITE * exp(-abs(rimD) / 0.9) * 0.22 * gLight * backArc;
    // Inner bottom ellipse (visible when the glass is empty or through liquid).
    float ibD = ellipseDist(vec2(g.x, p.y - g.yIB), vec2(g.riB, g.riB * g.kIB));
    col += WARM_WHITE * exp(-abs(ibD) / 1.1) * 0.08 * gLight * (1.0 - fill * 0.7);

    // ---------------------------------------------------- liquid
    if (fill > 0.0005) {
      float tL = (g.yBase - levelY) / g.h;
      float rL = mix(g.rB, g.rT, tL) - g.wall;
      float kL = mix(g.kB, g.kT, tL);
      float imp = uWave.x;
      float slo = uWave.y;
      float ix = uGlassC.w;

      float xn = g.x / rL;
      float zf = sqrt(max(1.0 - xn * xn, 0.0));
      // Height field (normalised) evaluated on the surface disk.
      // Front/back edges use z = ±zf.
      float t0 = uTime;
      float frontH = imp * sin(length(vec2(xn - ix, zf - 0.05)) * 26.0 - t0 * 16.0) * exp(-length(vec2(xn - ix, zf)) * 2.8)
                   + slo * (sin(xn * 3.3 + t0 * 6.2) * 0.6 + sin(xn * 6.1 - zf * 3.0 - t0 * 4.1) * 0.4);
      float backH = slo * (sin(xn * 3.3 + t0 * 6.2 + 1.3) * 0.6 + sin(xn * 6.1 + zf * 3.0 - t0 * 4.1) * 0.4);
      float amp = rL * 0.035;
      float frontL = levelY + kL * rL * zf - frontH * amp;
      float backL = levelY - kL * rL * zf - backH * amp;
      float bottomFront = g.yIB + g.kIB * g.riB * sqrt(max(1.0 - pow(g.x / g.riB, 2.0), 0.0));
      float inX = smoothstep(rL + AA, rL - AA, abs(g.x));
      float sideM = smoothstep(min(g.ri, rL) + AA, min(g.ri, rL) - AA, abs(g.x)) * smoothstep(frontL - AA, frontL + AA, p.y) * smoothstep(bottomFront + AA, bottomFront - AA, p.y);
      float surfM = inX * smoothstep(backL - AA, backL + AA, p.y) * smoothstep(frontL + AA, frontL - AA, p.y);
      // Thin pours: fade the body in so the first millimetre doesn't pop.
      float thin = smoothstep(0.0, 0.035, fill);
      sideM *= thin;
      surfM *= thin;
      liquidMask = max(sideM, surfM);

      if (sideM > 0.0) {
        float uu = clamp(g.x / max(min(g.ri, rL), 1.0), -1.0, 1.0);
        float path = sqrt(max(1.0 - uu * uu, 0.0));
        float depth = clamp((p.y - frontL) / max(bottomFront - frontL, 1.0), 0.0, 1.0);
        float column = clamp((bottomFront - frontL) / (g.h * 0.55), 0.25, 1.0);
        vec3 T = exp(-SIGMA * (0.4 + 1.15 * path) * (0.55 + 0.45 * column));
        vec3 lc = mix(GOLD, WARM, 0.15) * (0.4 + 0.8 * exp(-depth * 2.6)) * T * 0.72;
        lc += AMBER * pow(1.0 - path, 3.0) * 0.32;
        // Darker, richer core toward the base.
        lc *= 1.0 - 0.35 * depth * path;
        lc += GOLD * exp(-pow((uu + 0.38) / 0.16, 2.0)) * 0.12;
        // Internal caustics swimming near the base.
        float cst = caustic(vec2(uu * 0.6, p.y / (0.55 * g.h)) + vec2(0.0, uTime * 0.04), uTime * 0.55);
        lc += mix(AMBER, GOLD, 0.5) * min(cst, 1.2) * 0.16 * smoothstep(0.3, 1.0, depth);
        // Rising highlights: soft shimmering columns drifting upward.
        float colId = floor((uu + 1.0) * 4.0);
        float rise = fract(p.y / (0.3 * g.h) + uTime * (0.22 + 0.1 * hash12(vec2(colId, 1.0))) + hash12(vec2(colId, 4.0)));
        float colMask = exp(-pow((fract((uu + 1.0) * 4.0) - 0.5) / 0.14, 2.0));
        lc += GOLD * smoothstep(0.0, 0.08, rise) * smoothstep(0.35, 0.08, rise) * colMask * 0.05;
        // Aeration plume under the stream.
        float plume = exp(-pow((uu - ix) / 0.14, 2.0)) * exp(-depth * 2.2) * imp;
        lc = mix(lc, GOLD * 0.9, plume * 0.3);
        lc *= gLight;
        lc += AMBER * uGlow * (0.12 + 0.2 * path) * gLight;
        col = mix(col, lc, sideM * 0.93);
      }
      if (surfM > 0.0) {
        vec2 sd = vec2(xn, (p.y - levelY) / (kL * rL));
        float rho = length(sd);
        vec2 di = sd - vec2(ix, 0.05);
        float rI = length(di);
        float ph = rI * 26.0 - uTime * 16.0;
        float ripple = imp * sin(ph) * exp(-rI * 2.8);
        float sloshH = slo * (sin(sd.x * 3.3 + uTime * 6.2) * 0.6 + sin(sd.x * 6.1 - sd.y * 3.0 - uTime * 4.1) * 0.4);
        float hgt = ripple + sloshH;
        // Back of the surface mirrors the spotlight; front looks into the amber.
        float back = smoothstep(1.0, -1.0, sd.y);
        vec3 sc = mix(AMBER * 0.26, GOLD * 0.5, back * back) * (1.0 + hgt * 0.4);
        float specS = exp(-pow((sd.y + 0.55 + hgt * 0.3) / 0.13, 2.0)) * exp(-pow(sd.x / 0.5, 2.0));
        sc += WARM_WHITE * specS * 0.7;
        sc += WARM_WHITE * pow(max(sin(ph), 0.0), 10.0) * imp * exp(-rI * 3.2) * 0.9;
        // Meniscus: liquid climbing the wall catches a bright edge.
        float men = smoothstep(0.86, 0.99, rho);
        sc += GOLD * men * 0.55;
        // Foam where the stream lands.
        float foam = imp * exp(-pow(rI / 0.11, 2.0)) * (0.55 + 0.45 * vnoise(p * 0.25 + uTime * 3.0));
        sc = mix(sc, WARM_WHITE * 1.4, foam * 0.6);
        sc *= gLight;
        sc += GOLD * uGlow * 0.18 * gLight;
        col = mix(col, sc, surfM);
      }

      // Bubbles rising through the liquid.
      if (liquidMask > 0.01) {
        for (int i = 0; i < MAX_BUBBLES; i++) {
          if (i >= uBubbleCount) break;
          vec4 bb = uBubbles[i];
          vec2 d = p - bb.xy;
          float dl = length(d);
          if (dl > bb.z + 2.0) continue;
          float ring = smoothstep(bb.z - 1.1, bb.z, dl) * smoothstep(bb.z + AA, bb.z - AA * 0.5, dl);
          float hl = exp(-dot(d / bb.z - vec2(-0.35, -0.4), d / bb.z - vec2(-0.35, -0.4)) * 10.0);
          float inside = smoothstep(bb.z, bb.z - 1.0, dl);
          col = mix(col, col * 0.85, inside * 0.4 * bb.w);
          col += WARM_WHITE * (ring * 0.55 + hl * 0.9) * bb.w * liquidMask * gLight;
        }
      }
    }
  }

  // ============================================================ stream + splash
  if (uStreamCount > 1 || uDropCount > 0) {
    vec4 bx = uStreamBox;
    bool inBox = uStreamCount > 1 && p.x > bx.x && p.x < bx.z && p.y > bx.y && p.y < bx.w;
    float best = 1e5;
    float bestU = 0.0;
    float bestPath = 1.0;
    vec2 bestN = vec2(0.0);
    float isDrop = 0.0;
    if (inBox) {
      for (int i = 1; i < MAX_STREAM; i++) {
        if (i >= uStreamCount) break;
        vec4 b = uStream[i];
        if (b.z < 0.0) continue;
        vec4 a = uStream[i - 1];
        vec2 pa = p - a.xy;
        vec2 ba = b.xy - a.xy;
        float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
        float age = mix(a.w, b.w, h);
        float rr = mix(abs(a.z), b.z, h);
        // Plateau–Rayleigh: the falling stream necks into beads as it ages.
        rr *= 1.0 + 0.2 * smoothstep(0.06, 0.42, age) * sin(age * 52.0);
        vec2 q = pa - ba * h;
        float dq = length(q);
        float d = dq - rr;
        if (d < best) {
          best = d;
          float s = sign(ba.x * pa.y - ba.y * pa.x);
          bestU = clamp(s * dq / max(rr, 0.5), -1.0, 1.0);
          bestPath = rr;
        }
      }
    }
    for (int j = 0; j < MAX_DROPS; j++) {
      if (j >= uDropCount) break;
      vec4 dr = uDrops[j];
      vec2 dv = p - dr.xy;
      float dd = length(dv) - dr.z * dr.w;
      if (dd < 6.0) {
        if (dd < best) {
          isDrop = 1.0;
          bestN = dv / max(dr.z, 0.5);
        }
        best = smin(best, dd, 2.2);
      }
    }
    if (best < 0.03 * U) {
      float alpha = smoothstep(AA, -AA, best);
      float sl = (0.55 + 1.0 * smoothstep(0.0, 0.6, spot(p) * 1.3)) * L;
      vec3 sc;
      if (isDrop > 0.5) {
        float pth = sqrt(max(1.0 - dot(bestN, bestN), 0.0));
        vec3 T = exp(-SIGMA * (0.25 + 0.6 * pth));
        sc = GOLD * T * 2.0 + WARM_WHITE * exp(-dot(bestN - vec2(0.3, -0.35), bestN - vec2(0.3, -0.35)) * 9.0) * 1.3;
      } else {
        float pth = sqrt(max(1.0 - bestU * bestU, 0.0));
        float thick = clamp(bestPath / (0.009 * U), 0.3, 1.0);
        vec3 T = exp(-SIGMA * (0.2 + 0.85 * pth) * (0.4 + 0.6 * thick));
        sc = GOLD * T * 1.8 * (0.55 + 0.45 * sqrt(pth));
        sc += WARM_WHITE * exp(-pow((bestU - 0.42) / 0.13, 2.0)) * 0.95;
        sc += WARM * exp(-pow((bestU + 0.66) / 0.1, 2.0)) * 0.3;
      }
      sc *= sl * (1.0 + uGlow);
      // Soft bloom around the stream.
      col += GOLD * exp(-max(best, 0.0) / (0.01 * U)) * 0.07 * sl * (1.0 - alpha);
      col = mix(col, sc, alpha * 0.96);
    }
  }

  // ============================================================ glass front
  if (nearGlass && gm > 0.0) {
    float u = g.x / g.r;
    float sideM = step(g.rimY, p.y) * step(p.y, g.yBase);
    float dw = g.r - abs(g.x);
    // Walls seen edge-on read brighter; bright silhouette + inner edge lines.
    float wallBand = smoothstep(g.wall * 1.7, 0.0, dw) * sideM;
    col = mix(col, col * 1.15 + WARM * 0.016 * gLight, wallBand);
    col += WARM_WHITE * exp(-max(dw, 0.0) / 0.8) * 0.2 * gLight * sideM * gm;
    col += WARM_WHITE * exp(-abs(dw - g.wall) / 0.9) * 0.07 * gLight * sideM;
    // Vertical specular streaks (studio softbox reflections).
    float vfade = smoothstep(g.rimY, g.rimY + 0.12 * g.h, p.y) * smoothstep(g.yBase + 2.0, g.yBase - 0.2 * g.h, p.y);
    float streaks = exp(-pow((u + 0.6) / 0.08, 2.0)) * 0.16
                  + exp(-pow((u + 0.47) / 0.016, 2.0)) * 0.38
                  + exp(-pow((u - 0.73) / 0.022, 2.0)) * 0.2
                  + exp(-pow((u - 0.58) / 0.07, 2.0)) * 0.05;
    col += WARM_WHITE * streaks * vfade * gLight * sideM;

    // Rim: outer + inner lip ellipses, front arc brightest, sparkle at the ends.
    float rimD = ellipseDist(vec2(g.x, p.y - g.rimY), vec2(g.rT, g.rT * g.kT));
    float rimDi = ellipseDist(vec2(g.x, p.y - g.rimY), vec2(g.rT - g.wall, (g.rT - g.wall) * g.kT));
    float front = step(g.rimY, p.y);
    float ends = pow(clamp(abs(g.x) / g.rT, 0.0, 1.0), 10.0);
    col += WARM_WHITE * exp(-abs(rimD) / 0.8) * (0.16 + 0.26 * front + ends * 0.7) * gLight;
    col += WARM_WHITE * exp(-abs(rimDi) / 0.8) * (0.06 + 0.12 * front) * gLight;
    float lip = smoothstep(0.5, -0.5, rimD) * smoothstep(-0.5, 0.5, rimDi);
    col = mix(col, col * 1.25 + WARM * 0.015 * gLight, lip);

    // Heavy base: thick refracting glass glowing with the amber above it.
    float bottomFront = g.yIB + g.kIB * g.riB * sqrt(max(1.0 - pow(g.x / g.riB, 2.0), 0.0));
    float outerFront = g.yBase + g.kB * g.rB * sqrt(max(1.0 - pow(g.x / g.rB, 2.0), 0.0));
    float baseM = smoothstep(bottomFront - 0.5, bottomFront + 0.5, p.y) * smoothstep(outerFront + AA, outerFront - AA, p.y) * smoothstep(g.r + AA, g.r - AA, abs(g.x));
    if (baseM > 0.0) {
      float by = clamp((p.y - bottomFront) / max(outerFront - bottomFront, 1.0), 0.0, 1.0);
      vec3 bc = col * 0.7 + vec3(0.01, 0.008, 0.006) * gLight;
      float cs = caustic(vec2(u * 0.9, by * 0.6) + vec2(uTime * 0.02, 0.0), uTime * 0.45 + 7.0);
      bc += mix(AMBER, GOLD, by) * (0.16 + min(cs, 1.2) * 0.28) * fill * gLight * (1.0 - by * 0.55) * (1.0 + uGlow);
      bc += WARM_WHITE * exp(-abs(p.y - outerFront) / 1.1) * 0.3 * gLight;
      bc += WARM_WHITE * exp(-abs(p.y - bottomFront) / 1.0) * 0.14 * gLight;
      bc += WARM_WHITE * exp(-pow((u + 0.55) / 0.05, 2.0)) * 0.25 * gLight;
      col = mix(col, bc, baseM);
    }
  }

  // ============================================================ finishing
  // End-of-hero glow: the glass becomes the light that carries into the page.
  if (uGlow > 0.0) {
    vec2 gq = (p - vec2(g.cx, g.yBase - g.h * 0.45)) / vec2(0.55 * U, 0.42 * U);
    float gl = exp(-dot(gq, gq) * 1.6);
    // Keep the liquid itself rich; the bloom lives around it.
    float halo = gl * (1.0 - 0.75 * max(liquidMask, gm * 0.6));
    col = col * (1.0 - 0.5 * uGlow * (1.0 - gl)) + mix(AMBER, GOLD, gl) * halo * uGlow * 0.16;
  }

  // Vignette.
  vec2 vq = (frag / uStage - 0.5) * vec2(1.0, 1.15);
  col *= 1.0 - 0.75 * smoothstep(0.32, 0.95, length(vq));

  // ACES filmic tone map → sRGB → dither.
  col *= 1.05;
  col = clamp((col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14), 0.0, 1.0);
  col = pow(col, vec3(1.0 / 2.2));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  outColor = vec4(col, 1.0);
}
`;
}
