# Hero media: drop-in specs

The home hero picks its engine automatically, in this order:

1. **Frame sequence**: `public/hero/frames/` (2 or more images).
2. **Video**: `public/hero/pour.webm` and/or `public/hero/pour.mp4`.
3. **Procedural WebGL**: the built-in fallback, which uses `procedural/bottle.webp`. Nothing is needed for this one.

Detection runs on the server (`lib/hero-assets.ts`). In `npm run dev` a page refresh picks up new files. In production, rebuild or redeploy after adding files.

Whichever engine is used, the shot plays in two parts:

| Part | Driven by | Default share of the media |
| --- | --- | --- |
| Intro (lights up, bottle appears, light sweep) | Autoplay on load, about 3 s | First **18%** (`introEnd`) |
| The pour (tilt, stream, fill, glass glow) | Scroll scrub while the hero is pinned | Remaining **82%** |

So the **first 18% of the media should be the "reveal"** and the rest the pour. The last frame should be the filled glass glowing, because it hands off into the next section.

---

## Option A: frame sequence (best scrubbing, recommended)

```
public/hero/
  frames/            ← desktop / landscape, required
    0001.webp
    0002.webp
    …
    0180.webp
  frames-mobile/     ← optional portrait version (≤ 767 px or portrait tablets)
    0001.webp …
  poster.jpg         ← optional; otherwise frame 1 is used
  poster-mobile.jpg  ← optional
```

- **Naming**: any names that sort naturally (`0001.webp`, `frame_1.webp`, …). Numbers are sorted numerically.
- **Formats**: `.webp` (preferred), `.avif`, `.jpg`, `.png`.
- **Count**: 120 to 180 frames (around 24 fps over the shot). More than 240 adds weight without visible gain.
- **Desktop size**: 1920 × 1080 (16:9), WebP at quality 70 to 80, ideally **≤ 60 KB per frame** (about 8 to 10 MB total).
- **Mobile size**: 1080 × 1920 (9:16) or 900 × 1600, ≤ 45 KB per frame.
- **Composition**: keep the bottle and glass in the **right 55%** of the desktop frame, because the headline sits on the left 45%. For mobile, keep the action in the **lower 60%**.
- **Background**: near-black (`#0b0a09` to `#141210`) so it blends with the page edges.

Frames load progressively (every 8th frame first, then every 4th, then the rest), so scrubbing works almost immediately.

Export from a render or an image sequence:

```bash
# From a master video (ProRes/H.264) → 150 WebP frames at 1920 wide
ffmpeg -i master.mov -vf "fps=24,scale=1920:-2:flags=lanczos" -c:v libwebp -quality 76 -compression_level 6 public/hero/frames/%04d.webp
```

## Option B: video

```
public/hero/
  pour.webm          ← VP9, preferred
  pour.mp4           ← H.264 fallback (Safari)
  pour-mobile.webm   ← optional portrait version
  pour-mobile.mp4
  poster.jpg         ← strongly recommended (shown before the video loads, and it's the LCP image)
  poster-mobile.jpg
```

- **Length**: 6 to 10 s. **No audio track.**
- **Resolution**: 1920 × 1080 desktop, 1080 × 1920 mobile.
- **Scrubbing needs frequent keyframes.** Encode with a short GOP or the scrub will stutter:

```bash
# WebM (VP9), keyframe every 6 frames
ffmpeg -i master.mov -an -vf "scale=1920:-2" -c:v libvpx-vp9 -b:v 0 -crf 34 -g 6 -row-mt 1 public/hero/pour.webm
# MP4 (H.264), keyframe every 6 frames, fast start
ffmpeg -i master.mov -an -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 22 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart public/hero/pour.mp4
# Poster = first frame
ffmpeg -i master.mov -vframes 1 -q:v 3 public/hero/poster.jpg
```

Target **≤ 6 MB** per file.

## Optional `manifest.json`

```json
{
  "introEnd": 0.18,
  "fit": "cover",
  "focalX": 0.6,
  "focalY": 0.5
}
```

| Key | Meaning | Default |
| --- | --- | --- |
| `introEnd` | Fraction of the media played by the autoplay intro (0 to 0.9) | `0.18` |
| `fit` | `cover` (crop to fill) or `contain` | `cover` |
| `focalX`, `focalY` | Crop anchor when `cover` crops (0 = left/top, 1 = right/bottom) | `0.5` |

## Accessibility and motion

- Visitors with **prefers-reduced-motion** see a single still: the **last** frame (frames), the last moment (video), or a finished pour (procedural). There is no pinning and no scrubbing.
- Media is decorative (`aria-hidden`). The headline and CTAs are real HTML.

## Procedural fallback (`procedural/bottle.webp`)

`bottle.webp` is generated from `/products/Luxury Faceted Tequila Decanter.png` by `npm run assets`, together with the bottle mask in `components/hero/engines/procedural/bottleMask.ts`. If you change the source image, re-run the script and re-measure `BOTTLE_TEX` in `components/hero/engines/procedural/choreography.ts` (stopper cut, mouth and tank rows, in source pixels).
