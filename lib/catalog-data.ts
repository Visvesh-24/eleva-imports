/**
 * MOCK CATALOGUE. Every name, price, ABV, tasting note and story here is
 * placeholder copy built around the bottle images in /products, written so
 * the design can be reviewed with realistic content. Replace with the
 * client's real data or the Shopify Storefront API (see TODO.md).
 */
import type { Collection, Product, ProductVariant } from "./catalog-types";
import { PRODUCT_IMAGES } from "./product-images";

const cad = (dollars: number) => ({ amount: Math.round(dollars * 100), currencyCode: "CAD" as const });

function variant(handle: string, title: string, dollars: number, sizeMl?: number): ProductVariant {
  return {
    id: `${handle}--${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title,
    sizeMl,
    price: cad(dollars),
    available: true,
    sku: `ELV-${handle.slice(0, 10).toUpperCase()}-${sizeMl ?? title.replace(/\W/g, "").slice(0, 4).toUpperCase()}`,
  };
}

const img = (key: keyof typeof PRODUCT_IMAGES, alt: string) => ({ ...PRODUCT_IMAGES[key], alt });

const ADDITIVE_FREE = "Additive-free";
const AGAVE = "100% blue agave";

// ---------------------------------------------------------------------------
// Collections: the categories mirror the current store's catalogue
// structure; the "edits" are the shopping intents used on the home page.
// ---------------------------------------------------------------------------
export const COLLECTIONS: Collection[] = [
  {
    handle: "reserva-huizar",
    title: "Reserva Huizar",
    kind: "category",
    eyebrow: "The house family",
    description: "Faceted crystal decanters holding a family of expressions, from bright platas to rested cristalino.",
    intro:
      "Reserva Huizar is the family Adriana returns to: clean, agave-forward tequilas in faceted crystal, each expression a different conversation between agave and time.",
    theme: { accent: "#e3b25a", glow: "#f6d48f", deep: "#2a1e0c" },
    motif: "rings",
    heroProducts: ["reserva-huizar-cristalino-reposado", "reserva-huizar-plata", "reserva-huizar-plata-rosado"],
  },
  {
    handle: "blanco",
    title: "Blancos for Mixing",
    kind: "category",
    eyebrow: "Bright, unrested, honest",
    description: "Unaged tequilas with nowhere to hide. Crisp enough for a Paloma, good enough to sip.",
    intro:
      "A blanco is tequila at its most transparent: cooked agave, citrus peel, white pepper. Build a better cocktail with a spirit that tastes of the plant, not of additives.",
    theme: { accent: "#7fa7ff", glow: "#b9cdff", deep: "#0c1730" },
    motif: "waves",
    heroProducts: ["reserva-huizar-plata", "reserva-huizar-plata-rosado"],
  },
  {
    handle: "tasting-minis",
    title: "100 ml Tasting Minis",
    kind: "category",
    eyebrow: "Taste before you commit",
    description: "Sample sizes of the expressions we love, made for side-by-side tastings.",
    intro:
      "The best way to learn tequila is side by side. Our 100 ml minis and the Tasting Trio let you taste rested, unrested and cristalino at home, the way Adriana teaches it.",
    theme: { accent: "#e39a52", glow: "#f5c48c", deep: "#28160a" },
    motif: "rays",
    heroProducts: ["reserva-huizar-tasting-trio", "reserva-huizar-cristalino-reposado", "reserva-huizar-plata-rosado"],
  },
  {
    handle: "boutique-collection",
    title: "Boutique Tequila Collection",
    kind: "category",
    eyebrow: "Small houses, singular bottles",
    description: "Hard-to-find tequilas from small producers, chosen bottle by bottle.",
    intro:
      "Rare pours from small houses: hand-painted Talavera, black glass, expressions you won't find on a liquor-store shelf. Each one is a story Adriana wanted to bring home to Canada.",
    theme: { accent: "#5d86d6", glow: "#a8c1f0", deep: "#0d1426" },
    motif: "talavera",
    heroProducts: ["la-cofradia-las-iguanas-reposado", "casa-cofradia-anejo-black"],
  },
  {
    handle: "pechery",
    title: "Pechery Cream Liqueurs",
    kind: "category",
    eyebrow: "Dessert in a glass",
    description: "Indulgent cream liqueurs for the after-dinner pour.",
    intro:
      "Pechery is velvet-textured cream liqueur for the end of the night: over ice, in coffee, or poured over vanilla ice cream.",
    theme: { accent: "#b07a52", glow: "#d9b08c", deep: "#1f120a" },
    motif: "waves",
    heroProducts: ["pechery-dubai-chocolate-cream-liqueur"],
  },
  {
    handle: "riedel",
    title: "Riedel Crystal Glassware",
    kind: "category",
    eyebrow: "The right glass changes everything",
    description: "Riedel's tequila glass, shaped to open the aroma and soften the alcohol.",
    intro:
      "A narrow, tall bowl concentrates aroma and tames the heat of alcohol. It's the glass Adriana uses in every masterclass, and the simplest upgrade to how your tequila tastes.",
    theme: { accent: "#cfd8de", glow: "#eef3f6", deep: "#14181b" },
    motif: "rings",
    heroProducts: ["riedel-tequila-glass"],
  },
  {
    handle: "other-liquors",
    title: "Other Liquors",
    kind: "category",
    eyebrow: "Beyond agave",
    description: "Liqueurs and spirits that earned a place on the bar cart.",
    intro: "A short, considered list of non-agave bottles we enjoy alongside tequila.",
    theme: { accent: "#b07a52", glow: "#d9b08c", deep: "#1f120a" },
    motif: "agave",
    heroProducts: ["pechery-dubai-chocolate-cream-liqueur"],
  },

  // Edits (shopping intents)
  {
    handle: "sip-neat",
    title: "Sip Neat",
    kind: "edit",
    eyebrow: "For the slow pour",
    description: "Rested and aged tequilas with the depth to be enjoyed on their own.",
    intro: "Room temperature, a proper glass, no lime required. These are the bottles to sit with.",
    theme: { accent: "#e3a24a", glow: "#f5cf8e", deep: "#251708" },
    motif: "agave",
    heroProducts: ["reserva-huizar-cristalino-reposado", "casa-cofradia-anejo-black", "la-cofradia-las-iguanas-reposado"],
  },
  {
    handle: "mix-and-pour",
    title: "Mix & Pour",
    kind: "edit",
    eyebrow: "Cocktail-ready",
    description: "Bright blancos that make a Paloma or Margarita taste like it should.",
    intro: "A cocktail is only as honest as its base. Start with tequila that tastes like agave.",
    theme: { accent: "#7fa7ff", glow: "#b9cdff", deep: "#0c1730" },
    motif: "waves",
    heroProducts: ["reserva-huizar-plata", "reserva-huizar-plata-rosado"],
  },
  {
    handle: "gift-and-share",
    title: "Gift & Share",
    kind: "edit",
    eyebrow: "Bottles that arrive as a story",
    description: "Statement bottles, tasting sets and glassware worth wrapping.",
    intro: "Ceramic Talavera, faceted crystal, a trio for a first tasting. Gifts that open a conversation.",
    theme: { accent: "#e0457b", glow: "#f39abb", deep: "#2a0c18" },
    motif: "talavera",
    heroProducts: ["la-cofradia-las-iguanas-reposado", "reserva-huizar-tasting-trio", "riedel-tequila-glass"],
  },
  {
    handle: "start-here",
    title: "Start Here",
    kind: "edit",
    eyebrow: "New to real tequila?",
    description: "Tasting minis and the trio: the easiest way into additive-free tequila.",
    intro: "Not sure where to begin? Taste three styles side by side and find the one that's yours.",
    theme: { accent: "#e39a52", glow: "#f5c48c", deep: "#28160a" },
    motif: "rays",
    heroProducts: ["reserva-huizar-tasting-trio", "reserva-huizar-plata"],
  },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const PRODUCTS: Product[] = [
  {
    handle: "reserva-huizar-cristalino-reposado",
    name: "Reserva Huizar Cristalino",
    brand: "Reserva Huizar",
    expression: "Cristalino Reposado",
    type: "Cristalino",
    category: "reserva-huizar",
    collections: ["reserva-huizar", "sip-neat", "tasting-minis", "start-here"],
    tagline: "Rested in oak, filtered back to light.",
    description:
      "A reposado rested in American oak, then filtered until almost clear. You get the vanilla and toasted-wood roundness of a rested tequila with the brightness of a blanco.",
    story: [
      "Cristalino is one of tequila's newest styles, and one of the most misunderstood. Done badly, filtering strips a tequila of everything. Done with care, it removes colour and a little tannic grip while keeping the soft, rounded character the barrel gave it.",
      "This is the bottle Adriana pours for people who think they don't like tequila. It's silky and gently sweet from the cooked agave, with nothing added to make it so.",
    ],
    image: img("reserva-huizar-cristalino-reposado", "Reserva Huizar Cristalino Reposado in a faceted crystal decanter"),
    theme: { accent: "#e3b25a", glow: "#f6d48f", deep: "#2a1e0c" },
    backdropWord: "Cristalino",
    variants: [variant("rh-cristalino", "750 ml", 119.99, 750), variant("rh-cristalino", "100 ml", 24.99, 100)],
    abv: 40,
    badges: [ADDITIVE_FREE, AGAVE, "Rested in oak"],
    specs: [
      { label: "Agave", value: "Blue Weber, 6–8 years" },
      { label: "Region", value: "Jalisco, Mexico" },
      { label: "Cooking", value: "Stone ovens" },
      { label: "Distillation", value: "Twice, copper pot" },
      { label: "Rest", value: "6 months, American oak" },
      { label: "Filtration", value: "Charcoal, to crystal clear" },
    ],
    tasting: {
      aroma: { headline: "Cooked agave & vanilla bean", notes: ["Roasted agave", "Vanilla", "Pear", "Honeysuckle"] },
      palate: { headline: "Silky, round, quietly sweet", notes: ["Butterscotch", "Baked apple", "White pepper", "Toasted oak"] },
      finish: { headline: "Long and clean", notes: ["Vanilla cream", "Soft spice", "Minerality"] },
    },
    profile: { agave: 7, citrus: 4, sweetness: 7, oak: 5, spice: 4, body: 7 },
    serve: {
      neat: { title: "Neat, in a Riedel tequila glass", detail: "Room temperature. Let it open for two minutes before the first sip." },
      cocktail: {
        name: "Cristalino Old Fashioned",
        ingredients: ["60 ml Reserva Huizar Cristalino", "5 ml agave syrup", "2 dashes orange bitters", "Orange peel"],
        method: "Stir over ice until cold, strain over one large cube, express the orange peel over the top.",
      },
    },
    pairsWith: ["Aged Manchego", "Crème brûlée", "Seared scallops", "Dark chocolate 70%"],
    mastersNote:
      "This is my answer when someone says they ‘don't do tequila’. One sip, no lime, no salt, and the conversation changes.",
    featured: true,
    rank: 1,
  },
  {
    handle: "reserva-huizar-plata",
    name: "Reserva Huizar Plata",
    brand: "Reserva Huizar",
    expression: "Plata",
    type: "Blanco",
    category: "blanco",
    collections: ["reserva-huizar", "blanco", "mix-and-pour", "tasting-minis", "start-here"],
    tagline: "The agave, unfiltered by time.",
    description:
      "An unrested plata bottled straight from the still: bright citrus, cracked pepper and the green, almost minty sweetness of freshly cooked agave.",
    story: [
      "Plata (silver) tequila is bottled without resting in wood, so every decision in the distillery shows. Here that means bright, peppery agave with a clean mineral spine.",
      "It's the backbone of a proper Paloma and the tequila we use to teach what agave tastes like before oak enters the picture.",
    ],
    image: img("reserva-huizar-plata", "Reserva Huizar Plata in a cobalt-blue faceted decanter"),
    theme: { accent: "#6f9bff", glow: "#b4c8ff", deep: "#0b1530" },
    backdropWord: "Plata",
    variants: [variant("rh-plata", "750 ml", 79.99, 750), variant("rh-plata", "100 ml", 19.99, 100)],
    abv: 35,
    badges: [ADDITIVE_FREE, AGAVE, "Unrested"],
    specs: [
      { label: "Agave", value: "Blue Weber, 6–7 years" },
      { label: "Region", value: "Jalisco, Mexico" },
      { label: "Cooking", value: "Stone ovens" },
      { label: "Distillation", value: "Twice, copper pot" },
      { label: "Rest", value: "None (bottled fresh)" },
      { label: "Style", value: "Plata / blanco" },
    ],
    tasting: {
      aroma: { headline: "Green agave & lime zest", notes: ["Cooked agave", "Lime zest", "Fresh herbs", "Wet stone"] },
      palate: { headline: "Bright, peppery, clean", notes: ["Cracked pepper", "Citrus pith", "Sweet agave", "Spearmint"] },
      finish: { headline: "Crisp and lively", notes: ["White pepper", "Minerality", "Grapefruit"] },
    },
    profile: { agave: 9, citrus: 7, sweetness: 4, oak: 0, spice: 6, body: 5 },
    serve: {
      neat: { title: "Slightly chilled, neat", detail: "Pour at cellar temperature to taste the agave at its brightest." },
      cocktail: {
        name: "The Eleva Paloma",
        ingredients: ["50 ml Reserva Huizar Plata", "60 ml fresh grapefruit juice", "15 ml lime juice", "Soda water", "Pinch of salt"],
        method: "Build over ice in a tall glass, top with soda and stir once. Garnish with a grapefruit wedge.",
      },
    },
    pairsWith: ["Ceviche", "Tacos al pastor", "Oysters", "Fresh guacamole"],
    mastersNote: "Taste this before anything aged. It's the purest lesson in what agave actually tastes like.",
    featured: true,
    rank: 2,
  },
  {
    handle: "reserva-huizar-plata-rosado",
    name: "Reserva Huizar Plata Rosado",
    brand: "Reserva Huizar",
    expression: "Plata Rosado",
    type: "Blanco",
    category: "blanco",
    collections: ["reserva-huizar", "blanco", "mix-and-pour", "gift-and-share", "tasting-minis"],
    tagline: "A blanco with a blush of fruit.",
    description:
      "A bright plata with a softer, fruit-led side: wild strawberry, pink grapefruit and cooked agave, in an unmistakable magenta decanter.",
    story: [
      "Rosado is a playful corner of the blanco world. This one keeps the clean agave core of the Plata and leans into red-fruit aromatics, which makes it a natural in spritzes and summer cocktails.",
      "The magenta crystal makes it one of our most-gifted bottles, and one of the most photographed.",
    ],
    image: img("reserva-huizar-plata-rosado", "Reserva Huizar Plata Rosado in a magenta faceted decanter"),
    theme: { accent: "#ec5b8d", glow: "#f6a6c3", deep: "#2b0b19" },
    backdropWord: "Rosado",
    variants: [variant("rh-rosado", "750 ml", 84.99, 750), variant("rh-rosado", "100 ml", 19.99, 100)],
    abv: 35,
    badges: [ADDITIVE_FREE, AGAVE, "Fruit-forward"],
    specs: [
      { label: "Agave", value: "Blue Weber, 6–7 years" },
      { label: "Region", value: "Jalisco, Mexico" },
      { label: "Cooking", value: "Stone ovens" },
      { label: "Distillation", value: "Twice, copper pot" },
      { label: "Rest", value: "Brief, neutral vessel" },
      { label: "Style", value: "Plata rosado" },
    ],
    tasting: {
      aroma: { headline: "Wild strawberry & pink grapefruit", notes: ["Red berries", "Pink grapefruit", "Cooked agave", "Rose petal"] },
      palate: { headline: "Juicy, bright, gently sweet", notes: ["Strawberry", "Agave nectar", "Citrus", "Light pepper"] },
      finish: { headline: "Fresh and fruity", notes: ["Grapefruit pith", "Soft spice"] },
    },
    profile: { agave: 7, citrus: 6, sweetness: 6, oak: 0, spice: 4, body: 5 },
    serve: {
      neat: { title: "Over one large cube", detail: "A little dilution opens the red-fruit side beautifully." },
      cocktail: {
        name: "Rosado Spritz",
        ingredients: ["45 ml Reserva Huizar Plata Rosado", "15 ml lime juice", "10 ml agave syrup", "Sparkling rosé", "Strawberry"],
        method: "Shake tequila, lime and agave, strain into a wine glass over ice and top with sparkling rosé.",
      },
    },
    pairsWith: ["Watermelon & feta salad", "Shrimp tostadas", "Berry pavlova"],
    mastersNote: "Serve it to friends who swear they only drink rosé, then tell them what it is.",
    featured: true,
    rank: 4,
  },
  {
    handle: "reserva-huizar-tasting-trio",
    name: "Reserva Huizar Tasting Trio",
    brand: "Reserva Huizar",
    expression: "Plata Rosado · Cristalino · Extra Añejo",
    type: "Gift set",
    category: "tasting-minis",
    collections: ["reserva-huizar", "tasting-minis", "gift-and-share", "start-here"],
    tagline: "Three styles. One evening. Your own masterclass.",
    description:
      "Three 100 ml crystal decanters (Plata Rosado, Cristalino Reposado and Extra Añejo) in a gift box with Adriana's tasting guide.",
    story: [
      "This is the tasting Adriana opens her masterclasses with: unrested, rested and extra-aged, poured side by side so you can taste what time and oak do to agave.",
      "Each kit includes a printed tasting mat and a QR code to a guided video tasting.",
    ],
    image: img("reserva-huizar-tasting-trio", "Reserva Huizar Tasting Trio gift box with three 100 ml decanters"),
    theme: { accent: "#e39a52", glow: "#f5c48c", deep: "#28160a" },
    backdropWord: "Trio",
    variants: [variant("rh-trio", "3 × 100 ml", 64.99, 300)],
    abv: 35,
    badges: [ADDITIVE_FREE, AGAVE, "Tasting guide included"],
    specs: [
      { label: "Contents", value: "3 × 100 ml decanters" },
      { label: "Expressions", value: "Plata Rosado, Cristalino Reposado, Extra Añejo" },
      { label: "ABV", value: "35–40% (varies by expression)" },
      { label: "Includes", value: "Tasting mat + guided video" },
      { label: "Packaging", value: "Gift box, ready to wrap" },
    ],
    tasting: {
      aroma: { headline: "From bright fruit to deep oak", notes: ["Red berries", "Vanilla", "Dried fig", "Cacao"] },
      palate: { headline: "A ladder of age", notes: ["Fresh agave", "Butterscotch", "Toffee", "Leather"] },
      finish: { headline: "Short → long", notes: ["Citrus", "Cream", "Toasted oak"] },
    },
    profile: { agave: 7, citrus: 5, sweetness: 6, oak: 6, spice: 5, body: 6 },
    serve: {
      neat: { title: "Side by side, youngest first", detail: "Pour 15 ml of each, taste left to right, then go back to the first." },
    },
    pairsWith: ["A cheese board", "Dark chocolate", "Good company"],
    mastersNote: "If you only buy one thing from us, buy this. It's the fastest way to find the tequila that's truly yours.",
    featured: true,
    rank: 3,
  },
  {
    handle: "casa-cofradia-anejo-black",
    name: "Casa Cofradía Añejo",
    brand: "Casa Cofradía",
    expression: "Añejo · Black Edition",
    type: "Añejo",
    category: "boutique-collection",
    collections: ["boutique-collection", "sip-neat", "gift-and-share"],
    tagline: "Dark glass. Deeper oak.",
    description:
      "An añejo aged in oak for over a year, in a sculpted black bottle with a gold cap: dried fruit, cacao, cinnamon and a long, warm finish.",
    story: [
      "Casa Cofradía is a family distillery in the Jalisco lowlands with a deep respect for slow work. Their añejo spends more than a year in oak, long enough to turn bright agave into something closer to a fine brandy.",
      "The black edition is our after-dinner bottle: cigars, dark chocolate, long conversations.",
    ],
    image: img("casa-cofradia-anejo-black", "Casa Cofradía Añejo in a sculpted black bottle with gold cap"),
    theme: { accent: "#d4a95f", glow: "#ecd09c", deep: "#17110a" },
    backdropWord: "Añejo",
    variants: [variant("cc-anejo", "750 ml", 139.99, 750)],
    abv: 40,
    badges: [ADDITIVE_FREE, AGAVE, "Aged 14 months"],
    specs: [
      { label: "Agave", value: "Blue Weber, 7–8 years" },
      { label: "Region", value: "Jalisco lowlands" },
      { label: "Cooking", value: "Autoclave, slow pressure" },
      { label: "Distillation", value: "Twice, stainless & copper" },
      { label: "Aging", value: "14 months, American oak" },
      { label: "Bottle", value: "Hand-finished black glass" },
    ],
    tasting: {
      aroma: { headline: "Dried fruit & cacao", notes: ["Fig", "Cacao nib", "Cinnamon", "Cooked agave"] },
      palate: { headline: "Rich, oily, warming", notes: ["Toffee", "Raisin", "Clove", "Toasted oak"] },
      finish: { headline: "Long, dry, spiced", notes: ["Espresso", "Tobacco leaf", "Vanilla"] },
    },
    profile: { agave: 5, citrus: 2, sweetness: 6, oak: 9, spice: 7, body: 9 },
    serve: {
      neat: { title: "Neat, after dinner", detail: "Room temperature in a snifter or Riedel tequila glass. A drop of water opens the fruit." },
      cocktail: {
        name: "Añejo Manhattan",
        ingredients: ["60 ml Casa Cofradía Añejo", "25 ml sweet vermouth", "2 dashes Angostura", "Brandied cherry"],
        method: "Stir with ice until silky, strain into a chilled coupe, garnish with the cherry.",
      },
    },
    pairsWith: ["Mole negro", "Dark chocolate", "Aged gouda", "Espresso"],
    mastersNote: "Pour it slowly and give it time in the glass. This one rewards patience.",
    featured: true,
    rank: 5,
  },
  {
    handle: "la-cofradia-las-iguanas-reposado",
    name: "La Cofradía Las Iguanas",
    brand: "La Cofradía",
    expression: "Reposado · Talavera Edition",
    type: "Reposado",
    category: "boutique-collection",
    collections: ["boutique-collection", "sip-neat", "gift-and-share"],
    tagline: "Hand-painted Talavera. Honest reposado.",
    description:
      "A gentle reposado in a hand-painted Talavera ceramic decanter, wrapped by two sculpted iguanas. A collector's piece long after the last pour.",
    story: [
      "Talavera is Mexico's celebrated tin-glazed ceramic tradition, and every decanter is painted by hand, so no two are exactly alike. Inside is a soft, approachable reposado: honeyed agave, vanilla and a touch of cinnamon.",
      "We import these in small numbers. When they're gone, they're gone until the next firing.",
    ],
    image: img("la-cofradia-las-iguanas-reposado", "La Cofradía Las Iguanas Reposado in a hand-painted Talavera ceramic decanter"),
    theme: { accent: "#4f7fd6", glow: "#f0c35c", deep: "#0d1428" },
    backdropWord: "Talavera",
    variants: [variant("lc-iguanas", "750 ml", 189.99, 750)],
    abv: 40,
    badges: [ADDITIVE_FREE, AGAVE, "Hand-painted ceramic"],
    specs: [
      { label: "Agave", value: "100% de agave azul" },
      { label: "Region", value: "Jalisco, Mexico (D.O.P.)" },
      { label: "Rest", value: "Reposado, American oak" },
      { label: "Decanter", value: "Hand-painted Talavera ceramic" },
      { label: "Volume", value: "750 ml" },
      { label: "NOM", value: "1137" },
    ],
    tasting: {
      aroma: { headline: "Honeyed agave & cinnamon", notes: ["Cooked agave", "Honey", "Cinnamon", "Orange blossom"] },
      palate: { headline: "Soft, rounded, approachable", notes: ["Vanilla", "Caramelized pear", "Light oak", "Pepper"] },
      finish: { headline: "Medium, warm", notes: ["Sweet spice", "Agave", "Toasted wood"] },
    },
    profile: { agave: 7, citrus: 3, sweetness: 6, oak: 5, spice: 5, body: 6 },
    serve: {
      neat: { title: "Neat, from the decanter", detail: "Room temperature. Save the decanter: it's a piece of folk art." },
      cocktail: {
        name: "Reposado Margarita",
        ingredients: ["50 ml Las Iguanas Reposado", "25 ml lime juice", "15 ml orange liqueur", "5 ml agave syrup", "Salt rim (optional)"],
        method: "Shake hard with ice and strain over fresh ice in a half-salted rocks glass.",
      },
    },
    pairsWith: ["Cochinita pibil", "Grilled corn with chili-lime", "Churros"],
    mastersNote: "A gift that keeps giving. The tequila disappears; the Talavera stays on the shelf for years.",
    featured: true,
    rank: 6,
  },
  {
    handle: "pechery-dubai-chocolate-cream-liqueur",
    name: "Pechery Dubai-Style Chocolate",
    brand: "Pechery",
    expression: "Cream Liqueur",
    type: "Cream liqueur",
    category: "pechery",
    collections: ["pechery", "other-liquors", "gift-and-share"],
    tagline: "Milk chocolate, pistachio, a whisper of kataifi crunch.",
    description:
      "A velvet cream liqueur inspired by the viral Dubai chocolate bar: milk chocolate, roasted pistachio cream and toasted pastry notes.",
    story: [
      "Pechery makes dessert-first cream liqueurs. This one channels the pistachio-and-kataifi chocolate bar that took over the internet, as a pour for the end of the night.",
      "Serve it over ice, in an espresso, or over a scoop of vanilla ice cream for the easiest dessert you'll ever make.",
    ],
    image: img("pechery-dubai-chocolate-cream-liqueur", "Pechery Dubai-Style Chocolate cream liqueur bottle with a chocolate splash"),
    theme: { accent: "#b58055", glow: "#b9cf7a", deep: "#1f120a" },
    backdropWord: "Pechery",
    variants: [variant("pechery-dubai", "750 ml", 44.99, 750)],
    abv: 17,
    badges: ["Cream liqueur", "Pistachio & chocolate", "Serve chilled"],
    specs: [
      { label: "Style", value: "Cream liqueur" },
      { label: "Flavour", value: "Milk chocolate, pistachio" },
      { label: "ABV", value: "17%" },
      { label: "Serve", value: "Chilled, over ice" },
      { label: "Storage", value: "Refrigerate after opening" },
    ],
    tasting: {
      aroma: { headline: "Melted milk chocolate", notes: ["Cocoa", "Roasted pistachio", "Vanilla"] },
      palate: { headline: "Creamy, nutty, indulgent", notes: ["Chocolate ganache", "Pistachio cream", "Toasted pastry"] },
      finish: { headline: "Sweet and lingering", notes: ["Cocoa", "Nutty warmth"] },
    },
    serve: {
      neat: { title: "Over ice", detail: "One large cube in a rocks glass, or poured over vanilla gelato." },
      cocktail: {
        name: "Dubai Espresso",
        ingredients: ["45 ml Pechery Dubai-Style Chocolate", "30 ml fresh espresso", "15 ml tequila reposado", "Crushed pistachio"],
        method: "Shake hard with ice, strain into a coupe and dust with crushed pistachio.",
      },
    },
    pairsWith: ["Espresso", "Vanilla gelato", "Baklava"],
    rank: 7,
  },
  {
    handle: "riedel-tequila-glass",
    name: "Riedel Tequila Glass",
    brand: "Riedel",
    expression: "Crystal · Set of 2",
    type: "Glassware",
    category: "riedel",
    collections: ["riedel", "gift-and-share"],
    tagline: "The glass Adriana pours every masterclass in.",
    description:
      "Riedel's tequila-specific glass: a tall, narrow bowl that lifts the agave aromatics and softens the alcohol on the nose.",
    story: [
      "Developed with tequila producers, the shape guides aroma up and spirit onto the middle of the tongue, so the sweetness of cooked agave shows and the burn recedes.",
      "Machine-made crystal, dishwasher safe. The single best upgrade to how your tequila tastes.",
    ],
    image: {
      src: "/products/riedel-tequila-glass.svg",
      width: 640,
      height: 1500,
      alt: "Illustration of a Riedel crystal tequila glass (placeholder)",
    },
    theme: { accent: "#cfd8de", glow: "#eef3f6", deep: "#14181b" },
    backdropWord: "Riedel",
    variants: [variant("riedel-tequila", "Set of 2", 64.99), variant("riedel-tequila", "Single", 34.99)],
    badges: ["Crystal", "Dishwasher safe", "Masterclass favourite"],
    specs: [
      { label: "Material", value: "Machine-made crystal" },
      { label: "Capacity", value: "190 ml" },
      { label: "Height", value: "210 mm" },
      { label: "Care", value: "Dishwasher safe" },
    ],
    serve: {
      neat: { title: "Pour 30–45 ml", detail: "Fill only to the widest point of the bowl so the aromas have room to collect." },
    },
    pairsWith: ["Any tequila on this site", "A tasting with friends"],
    mastersNote: "Swap your shot glass for this and taste the same tequila again. You'll never go back.",
    rank: 8,
  },
];
