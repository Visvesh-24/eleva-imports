/**
 * MOCK recipes, rituals, pairings and guides for /recipes.
 * TODO(client): Adriana to review every spec, method, tip and guide before launch.
 * Product handles in `madeWith` / `products` point at lib/catalog-data.ts.
 */

import type { CSSProperties } from "react";

/** Theme CSS variables for an entry (server- and client-safe). */
export function entryVars(e: { theme: EntryTheme }): CSSProperties {
  return { "--accent": e.theme.accent, "--glow": e.theme.glow, "--deep": e.theme.deep } as CSSProperties;
}

export type EntryKind = "cocktail" | "neat" | "pairing" | "guide";
export type GlassKind = "coupe" | "rocks" | "highball" | "copita" | "wine" | "snifter";
export type Garnish = "lime" | "grapefruit" | "orange" | "cherry" | "strawberry" | "pistachio" | "salt" | "none";

export interface EntryTheme {
  accent: string;
  glow: string;
  deep: string;
}

export interface Ingredient {
  /** Quantity for one serve. Omit for "to top", "to garnish"… */
  qty?: number;
  /** "ml", "dash", "pinch", "wedge"… (singular). */
  unit?: string;
  /** Plural of unit (defaults to unit + "es"/"s"). */
  unitPlural?: string;
  item: string;
  note?: string;
}

interface EntryBase {
  slug: string;
  kind: EntryKind;
  title: string;
  subtitle: string;
  excerpt: string;
  theme: EntryTheme;
  glass: GlassKind;
  /** Liquid colour for the line-art glass. */
  liquid: string;
  garnish: Garnish;
  /** Show ice cubes in the glass art. */
  ice?: boolean;
}

export interface Recipe extends EntryBase {
  kind: "cocktail" | "neat" | "pairing";
  time: string;
  difficulty: "Easy" | "Medium";
  glassName: string;
  ingredients: Ingredient[];
  method: string[];
  tip: string;
  madeWith: string;
}

export interface GuideSection {
  heading: string;
  body: string[];
  /** Optional pull quote shown after the section. */
  quote?: string;
}

export interface Guide extends EntryBase {
  kind: "guide";
  readTime: string;
  sections: GuideSection[];
  /** Optional comparison table. */
  table?: { caption: string; headers: string[]; rows: string[][] };
  products: string[];
}

export type Entry = Recipe | Guide;

export const KIND_LABEL: Record<EntryKind, string> = {
  cocktail: "Cocktails",
  neat: "Neat rituals",
  pairing: "Food pairing",
  guide: "Guides",
};

export const KIND_SINGULAR: Record<EntryKind, string> = {
  cocktail: "Cocktail",
  neat: "Neat ritual",
  pairing: "Food pairing",
  guide: "Guide",
};

export const ENTRIES: Entry[] = [
  // ------------------------------------------------------------ cocktails
  {
    slug: "eleva-paloma",
    kind: "cocktail",
    title: "The Eleva Paloma",
    subtitle: "Mexico's real favourite, built on fresh grapefruit.",
    excerpt: "Forget the soda-gun version. Fresh grapefruit, a pinch of salt and a plata that tastes of agave.",
    theme: { accent: "#f08a6c", glow: "#ffc2a8", deep: "#2a120c" },
    glass: "highball",
    glassName: "Highball",
    liquid: "#f6ad92",
    garnish: "grapefruit",
    ice: true,
    time: "4 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 50, unit: "ml", item: "Reserva Huizar Plata" },
      { qty: 60, unit: "ml", item: "Fresh pink grapefruit juice" },
      { qty: 15, unit: "ml", item: "Fresh lime juice" },
      { qty: 10, unit: "ml", item: "Agave syrup", note: "optional" },
      { qty: 1, unit: "pinch", unitPlural: "pinches", item: "Flaky sea salt" },
      { item: "Chilled soda water", note: "to top" },
      { qty: 1, unit: "wedge", item: "Grapefruit", note: "to garnish" },
    ],
    method: [
      "Fill a highball glass to the brim with cold, hard ice.",
      "Add the tequila, grapefruit, lime, agave syrup and the pinch of salt.",
      "Top with soda water and give it a single, gentle stir from the bottom up.",
      "Garnish with a grapefruit wedge and serve immediately, while it still fizzes.",
    ],
    tip: "The pinch of salt is the secret. It doesn't make the drink salty; it makes the grapefruit taste more like grapefruit.",
    madeWith: "reserva-huizar-plata",
  },
  {
    slug: "classic-margarita",
    kind: "cocktail",
    title: "Classic Margarita",
    subtitle: "Three ingredients. No sour mix. Ever.",
    excerpt: "Tequila, lime, orange liqueur, shaken hard. The way it was meant to taste.",
    theme: { accent: "#b8d46a", glow: "#e3f0a8", deep: "#18200b" },
    glass: "coupe",
    glassName: "Coupe or rocks",
    liquid: "#e4ecab",
    garnish: "salt",
    time: "5 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 50, unit: "ml", item: "Reserva Huizar Plata" },
      { qty: 25, unit: "ml", item: "Fresh lime juice" },
      { qty: 15, unit: "ml", item: "Orange liqueur" },
      { qty: 5, unit: "ml", item: "Agave syrup", note: "to taste" },
      { item: "Coarse salt", note: "for a half rim" },
      { qty: 1, unit: "wheel", item: "Lime", note: "to garnish" },
    ],
    method: [
      "Run a lime wedge around half the rim of a chilled coupe and dip it in coarse salt.",
      "Add tequila, lime juice, orange liqueur and agave syrup to a shaker.",
      "Fill with ice and shake hard for 12 seconds, until the tin is frosted.",
      "Double-strain into the glass and float a lime wheel on top.",
    ],
    tip: "Salt only half the rim, so every sip is your choice. And squeeze the lime no more than an hour before you serve it.",
    madeWith: "reserva-huizar-plata",
  },
  {
    slug: "rosado-spritz",
    kind: "cocktail",
    title: "Rosado Spritz",
    subtitle: "A long, pink, golden-hour pour.",
    excerpt: "Plata Rosado, lime and sparkling rosé over ice. Summer on a patio, in a glass.",
    theme: { accent: "#ec5b8d", glow: "#f6a6c3", deep: "#2b0b19" },
    glass: "wine",
    glassName: "Large wine glass",
    liquid: "#f5a9c0",
    garnish: "strawberry",
    ice: true,
    time: "4 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 45, unit: "ml", item: "Reserva Huizar Plata Rosado" },
      { qty: 15, unit: "ml", item: "Fresh lime juice" },
      { qty: 10, unit: "ml", item: "Agave syrup" },
      { qty: 90, unit: "ml", item: "Sparkling rosé", note: "well chilled" },
      { qty: 1, unit: "strawberry", unitPlural: "strawberries", item: "Fresh", note: "halved" },
    ],
    method: [
      "Shake the tequila, lime and agave syrup briefly with ice.",
      "Strain into a large wine glass filled with ice.",
      "Top with sparkling rosé and lift once with a bar spoon.",
      "Garnish with a halved strawberry on the rim.",
    ],
    tip: "Pour the rosé down the bar spoon so it keeps its bubbles. A flat spritz is a sad spritz.",
    madeWith: "reserva-huizar-plata-rosado",
  },
  {
    slug: "cristalino-old-fashioned",
    kind: "cocktail",
    title: "Cristalino Old Fashioned",
    subtitle: "Clear as crystal, round as a reposado.",
    excerpt: "The whisky lover's gateway: cristalino, agave, orange bitters and one perfect cube.",
    theme: { accent: "#e3a24a", glow: "#f5cf8e", deep: "#251708" },
    glass: "rocks",
    glassName: "Double rocks",
    liquid: "#ecc27a",
    garnish: "orange",
    ice: true,
    time: "3 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 60, unit: "ml", item: "Reserva Huizar Cristalino" },
      { qty: 5, unit: "ml", item: "Agave syrup" },
      { qty: 2, unit: "dash", unitPlural: "dashes", item: "Orange bitters" },
      { qty: 1, unit: "peel", item: "Orange", note: "wide strip" },
      { qty: 1, unit: "large cube", unitPlural: "large cubes", item: "Clear ice" },
    ],
    method: [
      "Add the cristalino, agave syrup and bitters to a mixing glass with ice.",
      "Stir for 25 to 30 seconds, until silky and very cold.",
      "Strain over a single large cube in a chilled rocks glass.",
      "Express the orange peel over the drink, skin side down, and drop it in.",
    ],
    tip: "Stir, never shake. You want the texture of the barrel to stay velvety, not frothy.",
    madeWith: "reserva-huizar-cristalino-reposado",
  },
  {
    slug: "anejo-manhattan",
    kind: "cocktail",
    title: "Añejo Manhattan",
    subtitle: "The after-dinner classic, translated into agave.",
    excerpt: "Añejo, sweet vermouth and Angostura, stirred until it shines like lacquer.",
    theme: { accent: "#c4572f", glow: "#eaa27c", deep: "#22100a" },
    glass: "coupe",
    glassName: "Chilled coupe",
    liquid: "#a84421",
    garnish: "cherry",
    time: "4 min",
    difficulty: "Medium",
    ingredients: [
      { qty: 60, unit: "ml", item: "Casa Cofradía Añejo" },
      { qty: 25, unit: "ml", item: "Sweet vermouth" },
      { qty: 2, unit: "dash", unitPlural: "dashes", item: "Angostura bitters" },
      { qty: 1, unit: "cherry", unitPlural: "cherries", item: "Brandied", note: "to garnish" },
    ],
    method: [
      "Chill a coupe in the freezer for ten minutes.",
      "Stir the añejo, vermouth and bitters with plenty of ice for 30 seconds.",
      "Strain into the frozen coupe.",
      "Drop a brandied cherry into the glass and serve.",
    ],
    tip: "Keep your vermouth in the fridge once opened. It's wine, and stale vermouth will flatten the best añejo.",
    madeWith: "casa-cofradia-anejo-black",
  },
  {
    slug: "dubai-espresso",
    kind: "cocktail",
    title: "Dubai Espresso",
    subtitle: "Chocolate, pistachio and a jolt of coffee.",
    excerpt: "Pechery's Dubai-style chocolate shaken with fresh espresso and a whisper of reposado.",
    theme: { accent: "#b58055", glow: "#b9cf7a", deep: "#1f120a" },
    glass: "coupe",
    glassName: "Coupe",
    liquid: "#6b3f24",
    garnish: "pistachio",
    time: "5 min",
    difficulty: "Medium",
    ingredients: [
      { qty: 45, unit: "ml", item: "Pechery Dubai-Style Chocolate" },
      { qty: 30, unit: "ml", item: "Fresh espresso", note: "cooled slightly" },
      { qty: 15, unit: "ml", item: "Tequila reposado" },
      { qty: 1, unit: "pinch", unitPlural: "pinches", item: "Crushed pistachio", note: "to garnish" },
    ],
    method: [
      "Pull a fresh shot of espresso and let it cool for a minute.",
      "Add the liqueur, espresso and tequila to a shaker with ice.",
      "Shake very hard for 15 seconds to build a thick, velvety crema.",
      "Strain into a coupe and dust with crushed pistachio.",
    ],
    tip: "Shake it harder than feels polite. The foam is half the pleasure.",
    madeWith: "pechery-dubai-chocolate-cream-liqueur",
  },

  // ------------------------------------------------------------ neat rituals
  {
    slug: "the-copita-ritual",
    kind: "neat",
    title: "The Copita Ritual",
    subtitle: "How to sip a cristalino the way a master does.",
    excerpt: "Two minutes of patience, three small sips and a glass that does half the work.",
    theme: { accent: "#e3b25a", glow: "#f6d48f", deep: "#2a1e0c" },
    glass: "copita",
    glassName: "Copita or Riedel tequila glass",
    liquid: "#f0c46a",
    garnish: "none",
    time: "10 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 30, unit: "ml", item: "Reserva Huizar Cristalino" },
      { qty: 1, unit: "glass", unitPlural: "glasses", item: "Riedel tequila glass or copita" },
      { item: "Still water", note: "on the side" },
    ],
    method: [
      "Pour 30 ml into the glass and leave it alone for two minutes to open up.",
      "Nose it gently with your mouth slightly open, never a deep inhale.",
      "Take a first tiny sip and roll it around your mouth: that one just wakes your palate.",
      "The second sip is the real one. Notice the sweetness of cooked agave, then the vanilla.",
      "Breathe out through your nose after you swallow and follow the finish.",
    ],
    tip: "The first sip always lies. Your palate is still adjusting to the alcohol. Judge the tequila on the second.",
    madeWith: "reserva-huizar-cristalino-reposado",
  },
  {
    slug: "tasting-flight-at-home",
    kind: "neat",
    title: "A Tasting Flight at Home",
    subtitle: "Three styles, side by side, youngest first.",
    excerpt: "Turn the Tasting Trio into your own masterclass in twenty minutes.",
    theme: { accent: "#e39a52", glow: "#f5c48c", deep: "#28160a" },
    glass: "copita",
    glassName: "Three copitas",
    liquid: "#e6a54b",
    garnish: "none",
    time: "20 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 1, unit: "set", unitPlural: "sets", item: "Reserva Huizar Tasting Trio" },
      { qty: 3, unit: "glass", unitPlural: "glasses", item: "Copitas or Riedel tequila glasses" },
      { item: "Plain crackers & still water", note: "to reset" },
    ],
    method: [
      "Line up three glasses and pour 15 ml of each expression, youngest on the left.",
      "Nose all three before tasting anything, and note which one you're drawn to.",
      "Taste left to right, with a sip of water between each.",
      "Go back to the first glass. It will taste completely different now.",
    ],
    tip: "Write down one word per glass. In a year, taste again and compare notes: your palate will have grown.",
    madeWith: "reserva-huizar-tasting-trio",
  },

  // ------------------------------------------------------------ food pairing
  {
    slug: "plata-and-ceviche",
    kind: "pairing",
    title: "Plata & Ceviche",
    subtitle: "Citrus meets citrus, agave meets the sea.",
    excerpt: "Bright plata lifts lime-cured fish like a squeeze of fresh citrus.",
    theme: { accent: "#7fd1c7", glow: "#c7f0ea", deep: "#0c2220" },
    glass: "copita",
    glassName: "Copita, lightly chilled",
    liquid: "#e8eef0",
    garnish: "lime",
    time: "25 min",
    difficulty: "Medium",
    ingredients: [
      { qty: 30, unit: "ml", item: "Reserva Huizar Plata", note: "per guest, chilled" },
      { qty: 150, unit: "g", unitPlural: "g", item: "Sushi-grade white fish", note: "diced" },
      { qty: 80, unit: "ml", item: "Fresh lime juice" },
      { qty: 0.5, unit: "", item: "red onion, finely sliced" },
      { item: "Cilantro, serrano & avocado", note: "to finish" },
    ],
    method: [
      "Cure the diced fish in lime juice with a pinch of salt for 12 to 15 minutes.",
      "Fold in onion, chopped serrano and cilantro; top with avocado.",
      "Pour the plata just below cellar temperature.",
      "Alternate a bite and a sip. The tequila's pepper wakes the chili, and its sweetness rounds the lime.",
    ],
    tip: "Don't serve the tequila ice-cold. A little chill keeps it fresh, but too much hides the agave.",
    madeWith: "reserva-huizar-plata",
  },
  {
    slug: "anejo-and-dark-chocolate",
    kind: "pairing",
    title: "Añejo & Dark Chocolate",
    subtitle: "The easiest dessert you'll ever serve.",
    excerpt: "A square of 70% chocolate and a slow pour of añejo: cacao meets oak.",
    theme: { accent: "#a8663f", glow: "#e1b48a", deep: "#1c0f08" },
    glass: "snifter",
    glassName: "Snifter or tequila glass",
    liquid: "#b9672a",
    garnish: "none",
    time: "5 min",
    difficulty: "Easy",
    ingredients: [
      { qty: 30, unit: "ml", item: "Casa Cofradía Añejo", note: "per guest" },
      { qty: 2, unit: "square", unitPlural: "squares", item: "Dark chocolate, 70%" },
      { item: "Flaky salt & orange zest", note: "optional" },
    ],
    method: [
      "Let the chocolate come to room temperature; cold chocolate tastes of nothing.",
      "Pour the añejo and let it breathe while you plate.",
      "Melt a piece of chocolate on your tongue, then take a small sip.",
      "Finish with a flake of salt and a little orange zest to bring out the barrel spice.",
    ],
    tip: "Avoid milk chocolate here. Its sweetness fights the oak; dark chocolate harmonises with it.",
    madeWith: "casa-cofradia-anejo-black",
  },

  // ------------------------------------------------------------ guides
  {
    slug: "how-to-taste-tequila",
    kind: "guide",
    title: "How to Taste Tequila Like a Master",
    subtitle: "Forget the lime and salt. Here's what to do instead.",
    excerpt: "The glass, the pour, the nose and the all-important second sip: Adriana's tasting method, step by step.",
    theme: { accent: "#c9a46a", glow: "#e2c99b", deep: "#1c1308" },
    glass: "copita",
    liquid: "#e9b45a",
    garnish: "none",
    readTime: "6 min read",
    sections: [
      {
        heading: "Start with the right glass",
        body: [
          "A shot glass is built for speed, not flavour. It funnels the alcohol straight to your nose and gives the aroma nowhere to gather.",
          "A copita, or a Riedel tequila glass, does the opposite: a narrow rim concentrates the aroma, and a taller bowl lets the alcohol vapour lift away before it reaches you.",
        ],
        quote: "Change the glass before you change the tequila. Most people have never actually smelled what they're drinking.",
      },
      {
        heading: "Pour less than you think",
        body: [
          "Pour 30 ml at most and let it sit for a minute or two. Like wine, tequila opens up with a little air, and the first sharp edge of alcohol settles down.",
          "Hold the glass by the stem or base, so your hand doesn't warm it.",
        ],
      },
      {
        heading: "Nose with your mouth open",
        body: [
          "Bring the glass to your nose slowly, with your lips slightly parted. Breathing through nose and mouth together tames the alcohol and lets the fruit, herbs and cooked agave come through.",
          "Ask yourself simple questions. Is it sweet or green? Citrus or vanilla? Earthy or floral? There are no wrong answers, only practice.",
        ],
      },
      {
        heading: "The first sip lies",
        body: [
          "Your first small sip is a primer: it gets your palate used to the alcohol. Roll it around, swallow, and don't judge yet.",
          "The second sip is the true one. Notice the texture (oily, silky, light), where the flavours appear on your tongue, and how long they last after you swallow. That length is the finish, and great tequila lingers.",
        ],
        quote: "Judge a tequila on the second sip and the last impression, never the first.",
      },
      {
        heading: "Taste side by side",
        body: [
          "Nothing teaches faster than comparison. Pour a blanco, a reposado and an añejo from the same producer and taste them youngest to oldest. You'll understand in twenty minutes what oak and time actually do.",
        ],
      },
    ],
    products: ["riedel-tequila-glass", "reserva-huizar-tasting-trio"],
  },
  {
    slug: "what-does-additive-free-mean",
    kind: "guide",
    title: "What Does Additive-Free Mean?",
    subtitle: "The quiet secret of the tequila aisle.",
    excerpt: "Mexican rules let some tequila contain small amounts of sweeteners, colouring and flavourings without saying so on the label. Here's why it matters.",
    theme: { accent: "#7f9a78", glow: "#b9d0b0", deep: "#111a10" },
    glass: "copita",
    liquid: "#eef3e6",
    garnish: "none",
    readTime: "5 min read",
    sections: [
      {
        heading: "The 1% rule",
        body: [
          "Tequila regulations allow up to 1% of the total weight to be “abocado” additives: caramel colouring, oak extract, glycerin and sugar-based syrup. None of them has to appear on the label.",
          "One percent sounds small, but it's plenty to make a young, harsh tequila taste sweet, smooth and vanilla-heavy, and to hide shortcuts in production.",
        ],
        quote: "Additives don't add flavour so much as they erase character.",
      },
      {
        heading: "Why we only import additive-free",
        body: [
          "Additive-free tequila tastes of where and how it was made: the age of the agave, the oven, the still, the barrel. That honesty is what makes tequila as fascinating as wine.",
          "Every bottle Eleva imports is chosen because it needs nothing added. When it's sweet, that's cooked agave. When it tastes of vanilla, that's oak.",
        ],
      },
      {
        heading: "How to tell in your glass",
        body: [
          "Additive-heavy tequilas often smell of cake frosting or cotton candy, feel syrupy, and finish suspiciously short and sweet. Real agave spirits show pepper, citrus, herbs, earth and minerality, with a finish that evolves.",
          "Independent verification programmes test brands for additives. Ask your retailer, and ask us; it's the first question Adriana asks a producer.",
        ],
      },
    ],
    products: ["reserva-huizar-plata", "reserva-huizar-cristalino-reposado"],
  },
  {
    slug: "tequila-styles-explained",
    kind: "guide",
    title: "Blanco vs Reposado vs Añejo vs Cristalino",
    subtitle: "What time and oak actually do to agave.",
    excerpt: "Four styles, one plant. A clear map of tequila's ages, and which one to reach for when.",
    theme: { accent: "#e3a24a", glow: "#f5cf8e", deep: "#251708" },
    glass: "snifter",
    liquid: "#d98b2b",
    garnish: "none",
    readTime: "7 min read",
    sections: [
      {
        heading: "Blanco: the agave, unfiltered by time",
        body: [
          "Bottled fresh or rested less than two months. Blanco (also called plata or silver) is the purest expression of the agave and the distillery: citrus, pepper, herbs and cooked agave sweetness.",
        ],
      },
      {
        heading: "Reposado: rested, rounded",
        body: [
          "Rested in oak between two months and a year. The barrel softens the edges and adds vanilla, caramel and baking spice, while the agave still leads.",
        ],
        quote: "A great reposado is a conversation. Agave speaks first, and oak answers.",
      },
      {
        heading: "Añejo & extra añejo: depth and patience",
        body: [
          "Añejo spends one to three years in oak, extra añejo more than three. Expect dried fruit, toffee, cacao and tobacco. These are sipping spirits, closer in spirit to a fine cognac.",
        ],
      },
      {
        heading: "Cristalino: aged, then filtered clear",
        body: [
          "A modern style: rested or aged tequila filtered through charcoal to remove colour. Done well, it keeps the barrel's roundness with a blanco's brightness.",
        ],
      },
    ],
    table: {
      caption: "Tequila styles at a glance",
      headers: ["Style", "Time in oak", "Tastes like", "Reach for it when"],
      rows: [
        ["Blanco", "0–2 months", "Citrus, pepper, green agave", "Palomas, margaritas, ceviche"],
        ["Reposado", "2–12 months", "Vanilla, caramel, cooked agave", "Neat or in a richer margarita"],
        ["Añejo", "1–3 years", "Dried fruit, toffee, cacao", "After dinner, neat"],
        ["Extra añejo", "3+ years", "Leather, tobacco, deep oak", "Special occasions"],
        ["Cristalino", "Aged, then filtered", "Silky, vanilla, bright", "Gateway sipping, Old Fashioneds"],
      ],
    },
    products: ["reserva-huizar-tasting-trio", "reserva-huizar-plata", "casa-cofradia-anejo-black"],
  },
  {
    slug: "tequila-vs-mezcal",
    kind: "guide",
    title: "Tequila vs Mezcal",
    subtitle: "Cousins, not twins.",
    excerpt: "All tequila is technically a mezcal, but not every mezcal is tequila. Here's the difference.",
    theme: { accent: "#9a8f86", glow: "#d8cfc6", deep: "#161412" },
    glass: "rocks",
    liquid: "#e0d6c8",
    garnish: "orange",
    readTime: "5 min read",
    sections: [
      {
        heading: "One family, many plants",
        body: [
          "Mezcal is the umbrella term for spirits distilled from cooked agave. Tequila is a specific mezcal: made only from blue Weber agave, in Jalisco and a few designated municipalities in neighbouring states.",
          "Mezcal can be made from more than thirty agave species (espadín, tobalá, tepeztate) across several states, with Oaxaca the best known.",
        ],
      },
      {
        heading: "The fire makes the difference",
        body: [
          "Tequila agave is usually steamed in stone ovens or autoclaves, which keeps the flavour clean and sweet. Traditional mezcal roasts its agave in earthen pits over wood and stone, which is where its famous smoke comes from.",
        ],
        quote: "Tequila is the agave in daylight; mezcal is the agave by the fire.",
      },
      {
        heading: "Which to choose",
        body: [
          "Reach for tequila when you want clarity, citrus and cooked-agave sweetness. Reach for mezcal when you want smoke, earth and wildness. The best way to choose is to taste both. Ask about our tequila and mezcal masterclass.",
        ],
      },
    ],
    products: ["reserva-huizar-plata", "reserva-huizar-tasting-trio"],
  },
];

export function getEntries(): Entry[] {
  return ENTRIES;
}

export function getEntry(slug: string): Entry | undefined {
  return ENTRIES.find((e) => e.slug === slug);
}

export function isGuide(e: Entry): e is Guide {
  return e.kind === "guide";
}

/** Same kind first, then the rest, excluding itself. */
export function getRelatedEntries(entry: Entry, limit = 3): Entry[] {
  const same = ENTRIES.filter((e) => e.slug !== entry.slug && e.kind === entry.kind);
  const rest = ENTRIES.filter((e) => e.slug !== entry.slug && e.kind !== entry.kind);
  return [...same, ...rest].slice(0, limit);
}

/** Format a scaled ingredient quantity ("100 ml", "4 dashes"). */
export function formatQty(ing: Ingredient, servings: number): string | null {
  if (ing.qty === undefined) return null;
  const q = ing.qty * servings;
  const n = Number.isInteger(q) ? String(q) : q.toFixed(1).replace(/\.0$/, "");
  if (!ing.unit) return n;
  if (ing.unit === "ml" || ing.unit === "g") return `${n} ${ing.unit}`;
  const plural = ing.unitPlural ?? (/(s|sh|ch|x)$/.test(ing.unit) ? `${ing.unit}es` : `${ing.unit}s`);
  return `${n} ${q === 1 ? ing.unit : plural}`;
}
