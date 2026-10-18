/**
 * Storefront domain types. UI components depend only on these, never on the
 * data source, so the mock catalogue can be swapped for the Shopify
 * Storefront API (see README → "Shopify migration path").
 */

/** Money in minor units (cents) to avoid float rounding. */
export interface Money {
  amount: number;
  currencyCode: "CAD";
}

export type ProductType =
  | "Blanco"
  | "Cristalino"
  | "Reposado"
  | "Añejo"
  | "Gift set"
  | "Cream liqueur"
  | "Glassware";

export interface ProductVariant {
  id: string;
  title: string;
  /** Volume in ml (glassware: undefined). */
  sizeMl?: number;
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
  sku: string;
}

export interface ProductImageData {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt: string;
}

export interface TastingNote {
  /** Short headline, e.g. "Cooked agave & vanilla bean". */
  headline: string;
  notes: string[];
}

/** 0–10 scores drawn as the flavour radar on the product page. */
export interface FlavourProfile {
  agave: number;
  citrus: number;
  sweetness: number;
  oak: number;
  spice: number;
  body: number;
}

export interface Theme {
  /** Main accent (buttons, rings, glows). */
  accent: string;
  /** Soft secondary glow. */
  glow: string;
  /** Deep tint mixed into the page background. */
  deep: string;
}

export interface Product {
  handle: string;
  name: string;
  brand: string;
  /** Expression line under the name, e.g. "Cristalino Reposado". */
  expression: string;
  type: ProductType;
  /** Primary category (breadcrumb + "back to"). */
  category: string;
  /** Every collection handle this product appears in (categories + edits). */
  collections: string[];
  tagline: string;
  description: string;
  story: string[];
  image: ProductImageData;
  theme: Theme;
  /** Large outlined word behind the bottle on the product page. */
  backdropWord: string;
  variants: ProductVariant[];
  abv?: number;
  badges: string[];
  specs: { label: string; value: string }[];
  tasting?: { aroma: TastingNote; palate: TastingNote; finish: TastingNote };
  profile?: FlavourProfile;
  serve?: {
    neat?: { title: string; detail: string };
    cocktail?: { name: string; ingredients: string[]; method: string };
  };
  pairsWith?: string[];
  mastersNote?: string;
  featured?: boolean;
  /** Merchandising order (lower = earlier). */
  rank: number;
}

export type CollectionKind = "category" | "edit";

export interface Collection {
  handle: string;
  title: string;
  kind: CollectionKind;
  eyebrow: string;
  description: string;
  /** Long intro used on the collection page hero. */
  intro: string;
  theme: Theme;
  /** Decorative motif drawn behind the collection hero. */
  motif: "agave" | "rings" | "waves" | "rays" | "talavera";
  /** Product handles shown in the collection hero fan (first = centre). */
  heroProducts: string[];
}
