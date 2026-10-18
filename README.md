# Eleva Imports: storefront

A cinematic DTC storefront for **Eleva Imports**: additive-free, 100% blue agave tequila chosen by Adriana Martinez, Canada's only Certified Tequila Master.

Built with **Next.js 16** (App Router, Turbopack, Cache Components), **TypeScript**, **Tailwind CSS v4**, **GSAP + ScrollTrigger**, **Lenis** and **Framer Motion**. The hero pour is a hand-written WebGL2 renderer with no 3D library.

> **Status:** every page except checkout is built. The cart works and is saved on the device. Checkout is a documented hand-off stub (no payment is faked). Product, event, trade and recipe data are **mock** until the client supplies the real data (see `TODO.md`).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run assets     # regenerate product images, hero texture, bottle mask, logo variants, OG image (uses sharp, a dev dependency)
```

Node 20.9+ is required (developed on Node 22). Deploy on Vercel with the **Next.js** preset and default settings.

### Review helpers

- `/?heroProgress=0.55` freezes the hero pour at any point (0 to 1).
- The age gate shows on the first visit. To see it again, clear `localStorage["eleva.age.v1"]` and the `eleva_age` cookie.
- Turn on *Reduce motion* in your OS to see the static fallbacks.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero pour → trust strip → "Five ways in" collections bento → pinned featured-bottles gallery → Meet Adriana → masterclass banner → trade program → recipes teaser → 10% welcome newsletter |
| `/shop` | All bottles: collection chips, filters (type, size, price) and sort mirrored to the URL, animated grid |
| `/collections/[handle]` | 7 categories (Reserva Huizar, Blancos for Mixing, 100 ml Tasting Minis, Boutique Tequila Collection, Pechery Cream Liqueurs, Riedel Crystal Glassware, Other Liquors) + 4 edits (Sip Neat, Mix & Pour, Gift & Share, Start Here), each with its own lighting, motif and bottle fan |
| `/products/[handle]` | Product themed in the bottle's colour: 3D-tilt stage with masked specular sweep and reflection, variants, quantity, add to cart with the bottle-drop animation, sticky add-to-cart, tasting tabs + flavour radar, craft specs, serve-it-like, Adriana's note, related bottles, Product JSON-LD |
| `/masterclass` | Formats, scroll-drawn "field to glass" timeline, host section, tasting flight, FAQ, booking form |
| `/events` | Date-led calendar with inline RSVP, past events, private events |
| `/recipes`, `/recipes/[slug]` | 10 recipes/rituals/pairings with servings scaler + 4 long-form guides, with animated line-art glassware |
| `/about` | Adriana's story, numbers, philosophy, timeline |
| `/trade`, `/trade/ordering`, `/trade/quick-reorder` | Agave program + back-bar builder + application, case order sheet, reorder flow |
| `/contact` | Enquiry form, WhatsApp/Instagram, Toronto line-art map, FAQ |

Site-wide: age gate (province-aware legal age), header with shop mega menu, full-screen mobile menu, cart drawer, floating WhatsApp, amber page-transition wipe, custom cursor, film grain, compliance footer, sitemap, robots, OG image, 404.

## Project structure

```
app/                      routes (see table), layout, template (page transition), sitemap/robots/OG
components/
  art/Art.tsx             animated vector art: AgaveArt, OrbitRings, GoldDust, CircularText, WaveLines, LightRays, TalaveraRosette, BackdropWord
  hero/                   the pour (engines: procedural WebGL, frame sequence, video)
  home/                   home sections
  shop/                   ProductCard, ShopView (filters/sort), CollectionHero, CartDrawer
  product/                product page stage, buy box, story sections, related
  learn/                  masterclass + events components
  content/                recipes, guides, about, contact components (incl. GlassArt line-art glasses)
  trade/                  trade program, order sheet, quick reorder
  editorial/              PageHero, SectionHeading, PortraitFrame
  layout/ motion/ ui/ compliance/
lib/
  products.ts             THE catalogue API (async) → swap point for Shopify
  catalog-data.ts         mock catalogue (products + collections)
  catalog-types.ts        domain types
  product-images.ts       generated image metadata (sizes + blur placeholders)
  money.ts                CAD / en-CA formatting
  cart.ts                 cart store (localStorage) + bottle-drop animation
  age.ts                  age gate state + province ages
  adriana.ts              founder portraits (auto-detected in /public/adriana)
  experiences.ts trade.ts recipes.ts   mock content for those sections
  forms.ts                form submission stub (one place to connect a provider)
  jsonld.ts               schema.org builders
products/                 original product cutouts (source imagery)
public/products/          web-optimised product images (generated)
public/adriana/           founder photos go here (see its README)
public/hero/              optional filmed/rendered pour (see its README)
```

## Design and motion system

All tokens live in `app/globals.css`, in the `@theme` block: colours, type scale, spacing, radii, shadows, easing and durations. JavaScript uses the same easing and durations through `lib/motion.ts`.

- **Theming:** each product and collection carries a `theme` (`accent`, `glow`, `deep`) that is set as CSS variables. Cards, stages, rings and buttons pick it up, so the cobalt Plata glows blue and the Rosado glows magenta.
- **Responsive hero:** the custom `wide` / `narrow` Tailwind variants match the WebGL layout switch, so copy and scene stay composed on phones, portrait tablets and desktops.

## Founder photos

Drop the three supplied photographs into `public/adriana/` as `adriana-agave-field.jpg`, `adriana-cellar.jpg` and `adriana-barrels.jpg`. They appear automatically on Home, About, Masterclass, Trade and product pages. Until then an art-directed "AM" frame shows.

## Commerce architecture and Shopify migration path

- UI components get catalogue data **only** from `lib/products.ts` (`getProducts`, `getProduct`, `getCollections`, `getCollection`, `getCollectionProducts`, `getFeaturedProducts`, `getRelatedProducts`). It returns the plain types in `lib/catalog-types.ts`, with money in CAD minor units.
- **Swapping to the Shopify Storefront API:**
  1. Add `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` to `.env.local`.
  2. Implement the same functions in `lib/shopify/` with GraphQL (`products`, `productByHandle`, `collectionByHandle`), mapping variants, `price.amount` and `currencyCode: CAD`, images and metafields (tasting notes, profile, specs, theme) into the existing types.
  3. Point `lib/products.ts` at it. Cache with `'use cache'` + `cacheLife('hours')` + `cacheTag('products')`, and revalidate from a Shopify webhook route handler.
  4. **Cart and checkout:** replace the mutators in `lib/cart.ts` with Storefront `cartCreate` / `cartLinesAdd` / `cartLinesUpdate` (keep `useCart()`'s shape). Then make `beginCheckout()` in `components/shop/CartDrawer.tsx` redirect to `cart.checkoutUrl`.
  5. **Trade:** the quick-reorder lookup and order sheet move to Shopify customer accounts / B2B (TODOs are in `components/trade/`).
- **Forms:** all forms call `submitForm()` in `lib/forms.ts`, which is currently a stub. Connect a provider there.
