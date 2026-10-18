# TODO: client input, placeholders and missing assets

## Needs the client's input

- [ ] **Adriana's bio, certification details and portrait photography** for "Meet Adriana" and About. All current copy is placeholder.
- [ ] **Real product data**: names, ABV, sizes, tasting notes (aroma, palate, finish) and **CAD prices**. The catalogue built from `/products` is mock data. Proposed mapping is in `PLAN.md`.
- [ ] **Hero bottle choice**: the procedural pour uses the *Reserva Huizar Cristalino Reposado* decanter. Confirm, or name a preferred hero bottle.
- [ ] **Hero copy sign-off**: "Pour something real.", the subtext, and the beat captions ("Hand-selected in Jalisco." / "Nothing added. Nothing to hide." / "Just agave, fire and time."). In particular, confirm the "Hand-selected in Jalisco" claim.
- [ ] **Masterclass and event details**: formats, pricing, dates, booking provider (Calendly, Tock, Shopify product, etc.).
- [ ] **Trade program**: terms, minimums, how trade accounts are approved, and the quick-reorder flow (Shopify B2B or wholesale app?).
- [ ] **Shipping by province**: which provinces can be shipped to (the current note is a placeholder) and any LCBO or retail availability.
- [ ] **Legal**: age-gate wording, privacy policy, terms, and the newsletter consent copy (CASL).
- [ ] **Newsletter provider** (Shopify Email, Klaviyo, Mailchimp) and how the 10% welcome code is issued.
- [ ] **Contact details**: email, phone, address or showroom hours. WhatsApp (+1 905 718 1247) and Instagram are already wired.

## Missing assets

- [ ] **Riedel crystal tequila glass** product photography (no image in `/products`).
- [ ] Pechery liqueurs other than Dubai-Style Chocolate, 100 ml tasting minis sold individually, and "other liquors". These need images if they should be listed.
- [ ] Optional **filmed or rendered pour** for the hero (`public/hero/`, see its README). The procedural version works without it.
- [ ] Lifestyle and editorial photography for collections, masterclass, events and the trade section.
- [ ] Open Graph image (1200 × 630). A branded one will be generated if none is supplied.
- [ ] Vector (SVG) logo. Only a 1254 px raster PNG exists today.

## Build follow-ups (next phases)

- [ ] Shop, product, cart drawer and checkout hand-off (`lib/products.ts`, localStorage cart).
- [ ] Remaining home sections, content pages, footer.
- [ ] Age gate, footer compliance notes, floating WhatsApp button.
- [ ] Sitemap, robots, JSON-LD Product schema, per-page metadata.
- [ ] Page transitions (amber wipe) and the cart "bottle drop" animation.
- [ ] Mobile menu: the header button is a placeholder until the full menu ships.
- [ ] Header nav links point at routes that don't exist yet (they 404 until those pages are built).
- [ ] Lighthouse pass on real hardware. This container renders WebGL in software (SwiftShader), which inflates blocking time.
