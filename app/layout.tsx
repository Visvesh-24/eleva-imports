import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { AgeGate } from "@/components/compliance/AgeGate";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AGE_BOOT_SCRIPT } from "@/lib/age";
import { getCollections, getProduct } from "@/lib/products";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { SITE } from "@/lib/site";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Eleva Imports | Additive-free tequila chosen by a Tequila Master",
    template: "%s | Eleva Imports",
  },
  description:
    "Additive-free, 100% blue agave tequila hand-selected by Adriana Martinez, Canada's only Certified Tequila Master. Shop, gift, book a masterclass or build your agave program. Toronto.",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const collections = (await getCollections()).map(({ handle, title, eyebrow, kind }) => ({ handle, title, eyebrow, kind }));
  const pick = (await getProduct("reserva-huizar-cristalino-reposado"))!;
  const feature = {
    handle: pick.handle,
    name: pick.name,
    expression: pick.expression,
    image: pick.image.src,
    accent: pick.theme.accent,
  };
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag JS before first paint so reveal start-states never hide copy from no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js');${AGE_BOOT_SCRIPT}` }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-bone focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header collections={collections} feature={feature} />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <AgeGate />
        <Cursor />
        <Grain />
      </body>
    </html>
  );
}
