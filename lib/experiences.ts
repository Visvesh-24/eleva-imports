/**
 * MOCK EXPERIENCES DATA. Every format, price, date, venue and FAQ answer here
 * is placeholder copy written so the Masterclass and Events pages can be
 * reviewed with realistic content. TODO(client): replace with real formats,
 * pricing, calendar and booking provider (Calendly, Tock, Shopify product…).
 */

export interface MasterclassFormat {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  /** MOCK price per guest in CAD (whole dollars). */
  fromPrice: number;
  priceUnit: string;
  duration: string;
  guests: string;
  includes: string[];
  accent: string;
  glow: string;
}

export const MASTERCLASS_FORMATS: MasterclassFormat[] = [
  {
    id: "private",
    title: "Private at-home masterclass",
    eyebrow: "Your table, her teaching",
    description:
      "Adriana brings the glassware, the bottles and the stories to your home. A guided flight for friends, a birthday or an anniversary dinner.",
    fromPrice: 95, // MOCK
    priceUnit: "per guest",
    duration: "2 hours",
    guests: "6–16 guests",
    includes: ["Five-pour guided flight", "Riedel tequila glasses", "Tasting mats & notes", "Cocktail demo"],
    accent: "#e3a24a",
    glow: "#f5cf8e",
  },
  {
    id: "corporate",
    title: "Corporate tasting",
    eyebrow: "Teams, clients, launches",
    description:
      "A polished, interactive tasting for client evenings, team rewards and product launches. Branded tasting mats and gifting add-ons available.",
    fromPrice: 120, // MOCK
    priceUnit: "per guest",
    duration: "90 min – 2 hours",
    guests: "12–80 guests",
    includes: ["Tailored flight & script", "Bilingual hosting (EN/ES)", "Branded tasting mats", "Gift-set add-ons"],
    accent: "#d48358",
    glow: "#f8c898",
  },
  {
    id: "tequila-vs-mezcal",
    title: "Tequila vs Mezcal deep dive",
    eyebrow: "Two spirits, one plant family",
    description:
      "Highlands versus Oaxaca, oven versus earthen pit, Weber blue versus wild espadín. A side-by-side comparison for the curious palate.",
    fromPrice: 110, // MOCK
    priceUnit: "per guest",
    duration: "2.5 hours",
    guests: "8–20 guests",
    includes: ["Six-pour comparative flight", "Agave species guide", "Paired small bites", "Take-home tasting notes"],
    accent: "#7f9a78",
    glow: "#c8dbb9",
  },
  {
    id: "virtual",
    title: "Virtual tasting with the Trio",
    eyebrow: "Anywhere in Canada",
    description:
      "We ship each guest a Reserva Huizar Tasting Trio, then Adriana leads the tasting live on video. Great for distributed teams.",
    fromPrice: 85, // MOCK (includes kit)
    priceUnit: "per guest, kit included",
    duration: "60–75 min",
    guests: "5–200 guests",
    includes: ["Tasting Trio shipped to each guest", "Live-hosted video session", "Interactive Q&A", "Recording for your team"],
    accent: "#7fa7ff",
    glow: "#b9cdff",
  },
];

export interface JourneyStep {
  id: string;
  n: string;
  title: string;
  kicker: string;
  body: string;
  /** Icon key drawn by components/learn/JourneyIcon.tsx */
  icon: "agave" | "oven" | "still" | "barrel" | "glass";
}

export const JOURNEY: JourneyStep[] = [
  {
    id: "field",
    n: "01",
    title: "The field",
    kicker: "Six to eight years of patience",
    body: "Blue Weber agave grows for years before a jimador harvests the heart, the piña. You'll learn why age, soil and altitude shape everything that follows.",
    icon: "agave",
  },
  {
    id: "oven",
    n: "02",
    title: "The oven",
    kicker: "Stone, brick or autoclave",
    body: "Cooking turns starch into sugar. Slow brick ovens give caramel and cooked-sweet notes; diffusers strip them away. Taste the difference side by side.",
    icon: "oven",
  },
  {
    id: "still",
    n: "03",
    title: "The still",
    kicker: "Copper, steam and judgement",
    body: "Fermented must is distilled twice. The cuts the maestro makes decide the texture in your glass, and where additives often try to hide shortcuts.",
    icon: "still",
  },
  {
    id: "barrel",
    n: "04",
    title: "The barrel",
    kicker: "Blanco, reposado, añejo",
    body: "Oak adds vanilla, spice and roundness. Learn how months and years in wood transform agave, and how to spot colour that came from a bottle, not a barrel.",
    icon: "barrel",
  },
  {
    id: "glass",
    n: "05",
    title: "The glass",
    kicker: "How to taste like a master",
    body: "Nose, sip, breathe, finish. The four-step method Adriana teaches turns any pour into a conversation, no lime or salt required.",
    icon: "glass",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const MASTERCLASS_FAQ: Faq[] = [
  {
    q: "Do I need to know anything about tequila beforehand?",
    a: "Not at all. Every masterclass starts from the plant and builds up. Curious beginners and seasoned collectors leave with something new.",
  },
  {
    q: "Where do private masterclasses take place?",
    a: "In your home, office or a venue you choose across Toronto and the GTA. Travel beyond the GTA can be arranged on request.",
  },
  {
    q: "Is everything additive-free?",
    a: "Yes. Every tequila poured is 100% blue agave and additive-free, the same standard as every bottle in our shop.",
  },
  {
    q: "Can you accommodate dietary needs for paired bites?",
    a: "Absolutely. Tell us about allergies or preferences in your enquiry and we'll adapt the pairings.",
  },
  {
    q: "What's the minimum age?",
    a: "All guests must be of legal drinking age in the province where the tasting takes place. We may ask for ID on the day.",
  },
  {
    q: "How far in advance should I book?",
    a: "Two to three weeks is ideal, and longer for November and December when holiday dates go quickly.",
  },
];

export interface EventItem {
  id: string;
  /** ISO date (MOCK). */
  date: string;
  day: string;
  month: string;
  year: string;
  weekday: string;
  time: string;
  title: string;
  kind: string;
  venue: string;
  area: string;
  description: string;
  /** MOCK ticket price in CAD; null = free / by invitation. */
  price: number | null;
  seats: string;
  accent: string;
  glow: string;
  motif: "agave" | "rings" | "waves" | "rays" | "talavera";
}

/** MOCK calendar: dates, venues and prices are placeholders. */
export const EVENTS: EventItem[] = [
  {
    id: "dia-de-muertos-tasting",
    date: "2026-11-01",
    day: "01",
    month: "Nov",
    year: "2026",
    weekday: "Sunday",
    time: "7:00 pm",
    title: "Día de Muertos Tasting",
    kind: "Seated tasting",
    venue: "Private gallery, Ossington",
    area: "Toronto",
    description:
      "An evening of remembrance and celebration: a five-pour flight from blanco to extra añejo, pan de muerto pairings and an ofrenda built with our guests.",
    price: 85,
    seats: "28 seats",
    accent: "#e3a24a",
    glow: "#f5cf8e",
    motif: "talavera",
  },
  {
    id: "agave-dinner-pairing",
    date: "2026-11-20",
    day: "20",
    month: "Nov",
    year: "2026",
    weekday: "Friday",
    time: "6:30 pm",
    title: "Agave Dinner Pairing",
    kind: "Chef's table",
    venue: "Partner restaurant, King West",
    area: "Toronto",
    description:
      "Four courses built around four tequilas. Adriana and the chef walk you through why cooked agave loves mole, citrus and char.",
    price: 145,
    seats: "40 seats",
    accent: "#d48358",
    glow: "#f8c898",
    motif: "agave",
  },
  {
    id: "holiday-gifting-popup",
    date: "2026-12-05",
    day: "05",
    month: "Dec",
    year: "2026",
    weekday: "Saturday",
    time: "11:00 am – 5:00 pm",
    title: "Holiday Gifting Pop-up",
    kind: "Open house",
    venue: "Distillery District",
    area: "Toronto",
    description:
      "Taste before you gift. Complimentary sips, Riedel glass engraving and gift-wrapping, with Adriana on hand to match a bottle to every name on your list.",
    price: null,
    seats: "Drop in",
    accent: "#e0457b",
    glow: "#f39abb",
    motif: "rays",
  },
  {
    id: "mezcal-night",
    date: "2027-01-23",
    day: "23",
    month: "Jan",
    year: "2027",
    weekday: "Saturday",
    time: "8:00 pm",
    title: "Mezcal Night",
    kind: "Comparative tasting",
    venue: "Cocktail bar, Leslieville",
    area: "Toronto",
    description:
      "Espadín, tobalá and wild agaves from Oaxaca, poured next to a highland tequila. Smoke, earth and fruit, explained.",
    price: 75,
    seats: "32 seats",
    accent: "#7f9a78",
    glow: "#c8dbb9",
    motif: "waves",
  },
  {
    id: "valentines-cristalino",
    date: "2027-02-13",
    day: "13",
    month: "Feb",
    year: "2027",
    weekday: "Saturday",
    time: "7:30 pm",
    title: "Cristalino & Chocolate for Two",
    kind: "Couples tasting",
    venue: "Boutique hotel lounge, Yorkville",
    area: "Toronto",
    description:
      "A candle-lit pairing of cristalino, añejo and Pechery liqueur with single-origin chocolate. Tables for two.",
    price: 160,
    seats: "16 tables",
    accent: "#ec5b8d",
    glow: "#f6a6c3",
    motif: "rings",
  },
  {
    id: "oakville-spring-tasting",
    date: "2027-04-17",
    day: "17",
    month: "Apr",
    year: "2027",
    weekday: "Saturday",
    time: "2:00 pm",
    title: "Spring Blanco Garden Tasting",
    kind: "Afternoon tasting",
    venue: "Private garden, Oakville",
    area: "GTA",
    description:
      "Bright blancos, Palomas and fresh ceviche in the first warm afternoon of the year. Learn to build a better highball.",
    price: 70,
    seats: "50 guests",
    accent: "#7fa7ff",
    glow: "#b9cdff",
    motif: "waves",
  },
];

export interface PastEvent {
  title: string;
  where: string;
  when: string;
  accent: string;
  glow: string;
  motif: "agave" | "rings" | "waves" | "rays" | "talavera";
  /** Grid span hint for the gallery layout. */
  span: "tall" | "wide" | "square";
}

/** MOCK archive (art-directed panels until real event photography is supplied). */
export const PAST_EVENTS: PastEvent[] = [
  { title: "Reposado & Mole", where: "Kensington Market", when: "Sept 2026", accent: "#d48358", glow: "#f8c898", motif: "agave", span: "tall" },
  { title: "Women of Agave", where: "Yorkville", when: "Mar 2026", accent: "#ec5b8d", glow: "#f6a6c3", motif: "talavera", span: "wide" },
  { title: "Corporate Holiday Tasting", where: "Bay Street", when: "Dec 2025", accent: "#e3a24a", glow: "#f5cf8e", motif: "rays", span: "square" },
  { title: "Mezcal Under the Stars", where: "Prince Edward County", when: "Aug 2025", accent: "#7f9a78", glow: "#c8dbb9", motif: "waves", span: "square" },
  { title: "Cristalino Launch", where: "Distillery District", when: "Jun 2025", accent: "#7fa7ff", glow: "#b9cdff", motif: "rings", span: "wide" },
];
