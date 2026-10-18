/**
 * MOCK trade-program data: case sizes, trade case pricing, tiers, venue
 * lineups, FAQ and a sample "last order". Everything here is placeholder,
 * written so the trade pages can be reviewed with realistic content.
 *
 * TODO(client): confirm case sizes, trade (licensee) pricing, tier
 * thresholds/benefits and LCBO / provincial agency rules before launch.
 * Shopify path: case pricing maps to Shopify B2B price lists / catalogs and
 * quick reorder to customer accounts + order history.
 */

import type { Product, ProductImageData } from "./catalog-types";

/** Trade case configuration per product handle. Prices in cents, CAD, ex-HST. */
export interface TradeCase {
  handle: string;
  /** e.g. "6 × 750 ml" */
  caseLabel: string;
  unitsPerCase: number;
  /** Trade price per unit (cents). */
  unitPrice: number;
}

export const TRADE_CASES: TradeCase[] = [
  { handle: "reserva-huizar-plata", caseLabel: "6 × 750 ml", unitsPerCase: 6, unitPrice: 5750 },
  { handle: "reserva-huizar-plata-rosado", caseLabel: "6 × 750 ml", unitsPerCase: 6, unitPrice: 6100 },
  { handle: "reserva-huizar-cristalino-reposado", caseLabel: "6 × 750 ml", unitsPerCase: 6, unitPrice: 8650 },
  { handle: "casa-cofradia-anejo-black", caseLabel: "6 × 750 ml", unitsPerCase: 6, unitPrice: 10100 },
  { handle: "la-cofradia-las-iguanas-reposado", caseLabel: "4 × 750 ml (ceramic)", unitsPerCase: 4, unitPrice: 13800 },
  { handle: "reserva-huizar-tasting-trio", caseLabel: "6 gift boxes", unitsPerCase: 6, unitPrice: 4600 },
  { handle: "pechery-dubai-chocolate-cream-liqueur", caseLabel: "6 × 750 ml", unitsPerCase: 6, unitPrice: 3200 },
  { handle: "riedel-tequila-glass", caseLabel: "6 sets of 2", unitsPerCase: 6, unitPrice: 4600 },
];

export const casePrice = (c: TradeCase) => c.unitPrice * c.unitsPerCase;

// ---------------------------------------------------------------------------
// Why additive-free sells
// ---------------------------------------------------------------------------
export const WHY_ADDITIVE_FREE = [
  {
    n: "01",
    title: "Guests are asking",
    body: "Agave-curious guests now ask what's in the bottle. A back bar of verified additive-free tequila turns that question into a recommendation instead of a shrug.",
  },
  {
    n: "02",
    title: "Staff who can tell the story",
    body: "Bartenders sell what they understand. Adriana trains your team to taste, describe and upsell agave with confidence, from the well to the top shelf.",
  },
  {
    n: "03",
    title: "A margin story, not a race to the bottom",
    body: "Premium sipping pours, tasting flights and signature cocktails earn more per guest than another anonymous well tequila. We help you price and position them.",
  },
] as const;

// ---------------------------------------------------------------------------
// Program pillars
// ---------------------------------------------------------------------------
export type PillarIcon = "bar" | "train" | "menu" | "allocation" | "reorder";

export const PILLARS: { icon: PillarIcon; title: string; body: string }[] = [
  {
    icon: "bar",
    title: "A curated back bar",
    body: "A lineup built for your room, covering well, signature, sipping and statement, with no overlap and no dead stock.",
  },
  {
    icon: "train",
    title: "Staff training with Adriana",
    body: "Hands-on sessions with Canada's only Certified Tequila Master: categories, additives, tasting technique and how to sell the pour.",
  },
  {
    icon: "menu",
    title: "Menu & cocktail development",
    body: "Signature serves, tasting flights and menu copy written to move your agave program, all tested behind your bar.",
  },
  {
    icon: "allocation",
    title: "Priority allocation",
    body: "First access to boutique, small-batch and limited bottles before they reach retail, so your list stays one step ahead.",
  },
  {
    icon: "reorder",
    title: "Quick reorder",
    body: "Your last order is saved. Reorder the same cases in a tap, or adjust quantities before service.",
  },
];

// ---------------------------------------------------------------------------
// Back bar builder: recommended lineups by venue type
// ---------------------------------------------------------------------------
export type VenueType = "cocktail-bar" | "fine-dining" | "hotel" | "restaurant";

export interface LineupSlot {
  role: string;
  handle: string;
  why: string;
  /** Suggested opening order in cases. */
  cases: number;
}

export const VENUES: { id: VenueType; label: string; blurb: string; lineup: LineupSlot[] }[] = [
  {
    id: "cocktail-bar",
    label: "Cocktail bar",
    blurb: "Volume in the well, theatre on the top shelf.",
    lineup: [
      { role: "Well blanco", handle: "reserva-huizar-plata", why: "Bright, peppery agave that carries a Paloma or Margarita without additives.", cases: 4 },
      { role: "Signature serve", handle: "reserva-huizar-plata-rosado", why: "Red-fruit lift for spritzes and a photogenic signature cocktail.", cases: 2 },
      { role: "Sipping cristalino", handle: "reserva-huizar-cristalino-reposado", why: "The gateway pour for guests who 'don't do tequila'.", cases: 1 },
      { role: "Statement añejo", handle: "casa-cofradia-anejo-black", why: "Stirred, spirit-forward cocktails and a late-night neat pour.", cases: 1 },
    ],
  },
  {
    id: "fine-dining",
    label: "Fine dining",
    blurb: "Pairing-led pours from aperitif to digestif.",
    lineup: [
      { role: "Aperitif blanco", handle: "reserva-huizar-plata", why: "Served chilled and neat with crudo and ceviche courses.", cases: 1 },
      { role: "Pairing reposado", handle: "la-cofradia-las-iguanas-reposado", why: "Honeyed agave for mains, presented tableside from Talavera.", cases: 1 },
      { role: "Digestif añejo", handle: "casa-cofradia-anejo-black", why: "Dried fruit and cacao for the dessert and cheese course.", cases: 1 },
      { role: "Proper glassware", handle: "riedel-tequila-glass", why: "Tequila-specific crystal that shows the agave, not the burn.", cases: 2 },
    ],
  },
  {
    id: "hotel",
    label: "Hotel",
    blurb: "Lobby bar, room service and a gift to remember.",
    lineup: [
      { role: "Lobby bar well", handle: "reserva-huizar-plata", why: "One honest blanco across every outlet in the property.", cases: 3 },
      { role: "Sipping signature", handle: "reserva-huizar-cristalino-reposado", why: "Approachable, silky and easy to recommend to every guest.", cases: 2 },
      { role: "Statement bottle", handle: "la-cofradia-las-iguanas-reposado", why: "Hand-painted Talavera for the back bar and VIP amenities.", cases: 1 },
      { role: "Turndown tasting", handle: "reserva-huizar-tasting-trio", why: "A three-pour flight for suites, packages and gifting.", cases: 2 },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    blurb: "A tight list that sells itself across the menu.",
    lineup: [
      { role: "House margarita", handle: "reserva-huizar-plata", why: "The blanco that makes your house margarita taste like agave.", cases: 3 },
      { role: "Flavoured & frozen", handle: "reserva-huizar-plata-rosado", why: "Fruit-led serves for patios and brunch menus.", cases: 1 },
      { role: "Tasting flight", handle: "reserva-huizar-tasting-trio", why: "An easy upsell: three styles, one board, one story.", cases: 1 },
      { role: "Dessert pour", handle: "pechery-dubai-chocolate-cream-liqueur", why: "Chocolate-pistachio cream liqueur over gelato or in espresso.", cases: 1 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tiers (mock thresholds and benefits)
// ---------------------------------------------------------------------------
export const TIERS = [
  {
    name: "Tasting Room",
    volume: "1–4 cases / month",
    discount: "Standard trade pricing",
    features: ["Full trade catalogue", "Quarterly staff tasting", "Menu copy for every bottle", "Quick reorder"],
    highlight: false,
  },
  {
    name: "Agave Program",
    volume: "5–14 cases / month",
    discount: "Additional 5% on cases",
    features: ["Everything in Tasting Room", "Monthly training with Adriana", "Signature cocktail development", "Priority boutique allocation"],
    highlight: true,
  },
  {
    name: "Partner House",
    volume: "15+ cases / month",
    discount: "Additional 10% on cases",
    features: ["Everything in Agave Program", "Co-hosted masterclasses & events", "First access to limited releases", "Dedicated account line"],
    highlight: false,
  },
] as const;

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export const TRADE_FAQ = [
  {
    q: "Who can open a trade account?",
    a: "Licensed restaurants, bars, hotels, caterers and retailers in Canada. We'll ask for your liquor licence number during onboarding.",
  },
  {
    q: "How are orders delivered?",
    a: "Orders are fulfilled in line with your provincial liquor authority's rules. In Ontario that typically means through the LCBO's agency channels. We'll walk you through the process for your province. (TODO: confirm process per province.)",
  },
  {
    q: "Is there a minimum order?",
    a: "Trade orders are placed by the case, with a one-case minimum per product. Mixed orders across the catalogue are welcome.",
  },
  {
    q: "What does staff training include?",
    a: "A guided tasting covering tequila categories, how additives are used and how to spot them, plus tasting technique, pairing and how to sell premium pours. Sessions are led by Adriana in person in the GTA or virtually elsewhere.",
  },
  {
    q: "Can you help us build a cocktail menu?",
    a: "Yes. Program and Partner accounts get signature cocktail development and menu copy, tested with your bar team.",
  },
] as const;

// ---------------------------------------------------------------------------
// Mock "last order" for quick reorder (no customer data exists yet)
// ---------------------------------------------------------------------------
export const MOCK_LAST_ORDER = {
  venue: "Sample venue",
  reference: "SAMPLE-0000",
  placed: "Sample order: placed last month",
  lines: [
    { handle: "reserva-huizar-plata", cases: 4 },
    { handle: "reserva-huizar-cristalino-reposado", cases: 2 },
    { handle: "casa-cofradia-anejo-black", cases: 1 },
    { handle: "riedel-tequila-glass", cases: 1 },
  ],
} as const;

export const DELIVERY_WINDOWS = ["Next available delivery", "This week", "Next week", "Specific date"] as const;

// ---------------------------------------------------------------------------
// Compact product snapshot passed to client components
// ---------------------------------------------------------------------------

export interface TradeProduct {
  handle: string;
  name: string;
  expression: string;
  type: string;
  image: ProductImageData;
  accent: string;
  glow: string;
  caseLabel: string;
  unitsPerCase: number;
  unitPrice: number;
  /** Case price in cents, CAD, ex-HST. */
  casePrice: number;
}

/** Joins catalogue products with their trade case data (catalogue order). */
export function buildTradeProducts(products: Product[]): TradeProduct[] {
  return products.flatMap((p) => {
    const c = TRADE_CASES.find((t) => t.handle === p.handle);
    if (!c) return [];
    return [
      {
        handle: p.handle,
        name: p.name,
        expression: p.expression,
        type: p.type,
        image: p.image,
        accent: p.theme.accent,
        glow: p.theme.glow,
        caseLabel: c.caseLabel,
        unitsPerCase: c.unitsPerCase,
        unitPrice: c.unitPrice,
        casePrice: casePrice(c),
      },
    ];
  });
}
