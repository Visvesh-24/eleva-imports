# TODO: client input, placeholders and missing assets

## Assets

- [ ] **Adriana's photos.** The three founder portraits supplied in chat didn't reach the repo. Add them to `public/adriana/` as `adriana-agave-field.jpg`, `adriana-cellar.jpg` and `adriana-barrels.jpg` (see `public/adriana/README.md`). They appear automatically.
- [ ] **Riedel tequila glass** photography. A line-art placeholder (`public/products/riedel-tequila-glass.svg`) is used for now.
- [ ] **Event photography** for the Events archive, which currently uses art-directed panels.
- [ ] Optional **filmed or rendered pour** for the hero (`public/hero/`, see its README).
- [ ] Vector (SVG) logo. Only a raster PNG exists today.
- [ ] Any additional products (more Pechery flavours, individual 100 ml minis, other liquors) with images.

## Catalogue: all mock (`lib/catalog-data.ts`)

- [ ] **Re-check categories against the current store.** The live site (elevaimports.com) couldn't be reached from the build environment because its network policy blocks the host. Categories follow the original brief (Reserva Huizar, blancos, 100 ml minis, Pechery, Riedel, Boutique Collection, other liquors).
- [ ] Real product names, expressions, sizes and **CAD prices**.
- [ ] ABV, specs, tasting notes (aroma, palate, finish), flavour-profile scores, serves and pairings.
- [ ] Confirm the **additive-free status** of every bottle shown with that badge.
- [ ] Confirm Casa Cofradía Black's expression and size. The label in the image isn't legible.
- [ ] Adriana's per-product notes (`mastersNote`).

## Content: mock or placeholder copy

- [ ] **About:** approved bio, timeline milestones, and the "40+ distilleries" and "2,000+ guests" figures (`app/about/page.tsx`).
- [ ] **Home "Meet Adriana" bio** (`components/home/HomeSections.tsx`).
- [ ] **Masterclass formats, prices and FAQ; events (dates, venues, prices)** (`lib/experiences.ts`).
- [ ] **Recipes and guides:** Adriana to review every spec and guide (`lib/recipes.ts`).
- [ ] **Trade:** case sizes, trade pricing, tiers and thresholds, provincial / LCBO ordering rules, partner venues (`lib/trade.ts`, `components/trade/QuickReorder.tsx`).
- [ ] **Hero copy and captions** sign-off, including the "Hand-selected in Jalisco" claim.

## Business and legal

- [ ] **Shipping by province.** The footer and product notes are placeholders.
- [ ] Age-gate wording, privacy policy, terms, and CASL consent wording for the newsletter.
- [ ] Public **email address, phone, hours and address** (`EMAIL` constant in `app/contact/page.tsx`).
- [ ] How the 10% welcome code is issued (Shopify Email / Klaviyo).

## Integrations (next phase)

- [ ] **Checkout:** Shopify Storefront cart → `checkoutUrl` (hook in `components/shop/CartDrawer.tsx`).
- [ ] Data layer → Shopify Storefront API (`lib/products.ts`, see README).
- [ ] Forms → a provider (`lib/forms.ts`): contact, newsletter, masterclass, event RSVP, trade application, trade order, quick reorder.
- [ ] Trade accounts / reorder → Shopify B2B or customer accounts.
- [ ] Lighthouse pass on real hardware. The build container renders WebGL in software, which inflates blocking time.
