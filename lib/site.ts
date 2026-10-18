/** Site-wide constants (links, contact, copy that repeats). */
export const SITE = {
  name: "Eleva Imports",
  url: "https://elevaimports.com",
  tagline: "Additive-free tequila, chosen by Canada's only Certified Tequila Master.",
  instagram: "https://www.instagram.com/adrianatequilamaster",
  whatsapp: "https://wa.me/19057181247",
  city: "Toronto, Canada",
} as const;

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/masterclass", label: "Masterclass" },
  { href: "/events", label: "Events" },
  { href: "/recipes", label: "Recipes" },
  { href: "/trade", label: "Trade" },
  { href: "/about", label: "About" },
] as const;
