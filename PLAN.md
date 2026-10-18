# Eleva Imports — build plan

## Step 0 findings

- **Repo** was empty apart from `public/logo.png` and seven product cutouts in `/products`. Scaffolded **Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4**, plus GSAP/ScrollTrigger, Lenis and Framer Motion.
- **Logo**: a metallic copper "A" mark with an agave-leaf flourish, a copper ELEVA wordmark and a brushed-silver IMPORTS wordmark. Measured palette: copper `#D48358`, deep copper `#AC5E3F`, rose-gold highlight `#F8C898`, silver `#8E9096`.
- **Products**: all seven images are clean transparent PNG cutouts. Every one of them can be shown as a floating bottle on the dark stage.

| File | Proposed product | Collection(s) |
| --- | --- | --- |
| Luxury Faceted Tequila Decanter | Reserva Huizar Cristalino Reposado, 750 ml | Sip Neat, Boutique |
| Cobalt Blue Reserva Tequila Decanter | Reserva Huizar Plata, 750 ml | Mix & Pour |
| Magenta Faceted Tequila Decanter | Reserva Huizar Plata Rosado, 750 ml | Mix & Pour, Gift & Share |
| Casa Cofradía Black Tequila Bottle | Casa Cofradía Añejo (black edition), 750 ml | Sip Neat, Boutique |
| Ornate Talavera Iguana Tequila Bottle | La Cofradía Las Iguanas Reposado (Talavera ceramic), 750 ml | Boutique, Gift & Share |
| Luxury Three-Bottle Tequila Gift Set | Reserva Huizar Tasting Trio, 3 × 100 ml | Start Here, Gift & Share |
| Dubai Style Chocolate Liqueur Splash Bottle | Pechery Dubai-Style Chocolate Cream Liqueur | Other liquors |

Riedel glasses are in the known catalogue but have no image yet, so they're listed in TODO.md.

## Design system

- **Base**: agave-black `#0B0A09`, charcoal `#141210` / `#1C1916`, bone text `#F3EBDD`, muted `#B5AA99`.
- **Light**: amber `#E3A24A`, gold `#C9A46A` (hairlines), copper `#D48358` (brand accent from the logo), rose-gold `#F8C898` (highlights).
- **Accent**: agave green `#7F9A78`, used sparingly (chips, focus details).
- **Type**: Cormorant Garamond for display (300 to 600, italics for emphasis) and Manrope for UI, both via `next/font` (subset, swap).
- **Texture**: global film-grain overlay, vignettes, light-leak glows, 1px gold hairlines.
- **Motion tokens**: one easing curve `cubic-bezier(0.22, 1, 0.36, 1)` ("expo-out") and a duration scale of 0.2, 0.4, 0.8, 1.2 and 1.8 s, shared by CSS, GSAP and Framer Motion through `lib/motion.ts`.
- **Tokens** live as CSS variables and Tailwind v4 `@theme` entries in `app/globals.css`.

## Pages

Home (hero, trust strip, collections, featured bottles, Meet Adriana, masterclass, trade, recipes, newsletter, footer). Shop: collection listing with filters and sort, product detail and cart drawer. Masterclass, Events, Recipes & Resources, About, Trade (program, ordering, quick reorder) and Contact.

## Animation approach

- **Lenis** drives scrolling and feeds `ScrollTrigger.update`. GSAP's ticker drives Lenis, so there is a single rAF loop.
- **Hero**: a pinned ScrollTrigger scrubs a `progress` value from 0 to 1. The intro (`intro` from 0 to 1) autoplays on load. A hero "engine" consumes both values:
  1. **Frame sequence** (`/public/hero/frames/`) drawn to canvas, or
  2. **Scrubbed video** (`pour.webm` / `pour.mp4`), or
  3. **Procedural WebGL2** pour (the default). The real bottle photo is drawn as a texture, with a liquid line inside it that stays level as the bottle tilts. The stream is built from ballistic fluid parcels, with Plateau–Rayleigh beading. The glass liquid uses Beer–Lambert absorption, a wave surface with a meniscus, bubbles, splash droplets, a volumetric spotlight, a glossy floor with reflections, and caustics.
- Assets are detected server-side, so dropping files into `/public/hero/` switches the engine without code changes.
- **Sections**: masked line reveals, staggered fade-ups, clip-path image reveals. Page transitions use an amber wipe. Micro-interactions: magnetic buttons, cursor glow, underline links, and a bottle that drops into the cart.
- **Reduced motion**: static final frame, no pinning or scrubbing, and copy shown immediately.

## Build order

1. Scaffold, tokens, fonts, smooth scroll and **the hero** (review checkpoint).
2. Data layer (`lib/products.ts`), cart, shop and product pages.
3. Remaining home sections and content pages.
4. Compliance (age gate, footer notes), SEO, a QA pass across all widths, Lighthouse.
