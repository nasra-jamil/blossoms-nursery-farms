import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Oswald } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { PublicOnly } from "@/components/layout/PublicOnly";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Plant Nursery in Pattoki | Order Plants on WhatsApp`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "plant nursery",
    "buy plants online Pakistan",
    "indoor plants",
    "balcony plants",
    "fruit plants",
    "succulents",
    "plant nursery Pattoki",
    "Pattoki nursery",
    "Blossoms Nursery Farm",
    "WhatsApp plant order",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_PK",
    title: `${site.name} — Bring Nature Closer to Home`,
    description: site.description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "A bright living room filled with lush potted plants",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#234D32",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${oswald.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-forest px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Providers>
          <PublicOnly>
            <Navbar />
          </PublicOnly>
          <main id="main">{children}</main>
          <PublicOnly>
            <Footer />
            <FloatingWhatsApp />
          </PublicOnly>
        </Providers>
      </body>
    </html>
  );
}
