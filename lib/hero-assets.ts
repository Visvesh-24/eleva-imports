/**
 * Server-side discovery of hero media in /public/hero (see public/hero/README.md).
 *
 * Priority: frame sequence → video → procedural WebGL fallback.
 * Runs at build/prerender time (and per request in dev), so dropping files
 * into /public/hero switches the hero without touching any code.
 */
import fs from "node:fs";
import path from "node:path";

export type HeroMode = "frames" | "video" | "procedural";

export interface HeroMediaSet {
  frames?: string[];
  video?: { src: string; type: string }[];
  poster?: string;
}

export interface HeroAssets {
  mode: HeroMode;
  desktop: HeroMediaSet;
  /** Optional portrait variant (≤ 767px wide). Falls back to desktop. */
  mobile?: HeroMediaSet;
  /** Fraction of the media played by the autoplay intro (rest is scrubbed). */
  introEnd: number;
  fit: "cover" | "contain";
  focalX: number;
  focalY: number;
  /** Bottle texture for the procedural engine. */
  proceduralTexture: string;
}

interface Manifest {
  introEnd?: number;
  fit?: "cover" | "contain";
  focalX?: number;
  focalY?: number;
}

const HERO_DIR = path.join(process.cwd(), "public", "hero");
const FRAME_EXT = /\.(webp|avif|jpe?g|png)$/i;

function exists(rel: string) {
  return fs.existsSync(path.join(HERO_DIR, rel));
}

function listFrames(dir: string): string[] | undefined {
  const abs = path.join(HERO_DIR, dir);
  if (!fs.existsSync(abs)) return undefined;
  const files = fs
    .readdirSync(abs)
    .filter((f) => FRAME_EXT.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return files.length >= 2 ? files.map((f) => `/hero/${dir}/${f}`) : undefined;
}

function videoSet(prefix: string) {
  const out: { src: string; type: string }[] = [];
  if (exists(`${prefix}.webm`)) out.push({ src: `/hero/${prefix}.webm`, type: "video/webm" });
  if (exists(`${prefix}.mp4`)) out.push({ src: `/hero/${prefix}.mp4`, type: "video/mp4" });
  return out.length ? out : undefined;
}

function poster(name: string) {
  for (const ext of ["avif", "webp", "jpg", "jpeg", "png"]) {
    if (exists(`${name}.${ext}`)) return `/hero/${name}.${ext}`;
  }
  return undefined;
}

export function getHeroAssets(): HeroAssets {
  let manifest: Manifest = {};
  try {
    if (exists("manifest.json")) manifest = JSON.parse(fs.readFileSync(path.join(HERO_DIR, "manifest.json"), "utf8"));
  } catch {
    manifest = {};
  }

  const base = {
    introEnd: clamp(manifest.introEnd ?? 0.18, 0, 0.9),
    fit: manifest.fit ?? "cover",
    focalX: clamp(manifest.focalX ?? 0.5, 0, 1),
    focalY: clamp(manifest.focalY ?? 0.5, 0, 1),
    proceduralTexture: "/hero/procedural/bottle.webp",
  } as const;

  const frames = listFrames("frames");
  const framesMobile = listFrames("frames-mobile");
  if (frames) {
    return {
      ...base,
      mode: "frames",
      desktop: { frames, poster: poster("poster") ?? frames[0] },
      mobile: framesMobile ? { frames: framesMobile, poster: poster("poster-mobile") ?? framesMobile[0] } : undefined,
    };
  }

  const video = videoSet("pour");
  const videoMobile = videoSet("pour-mobile");
  if (video) {
    return {
      ...base,
      mode: "video",
      desktop: { video, poster: poster("poster") },
      mobile: videoMobile ? { video: videoMobile, poster: poster("poster-mobile") ?? poster("poster") } : undefined,
    };
  }

  return { ...base, mode: "procedural", desktop: {} };
}

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
