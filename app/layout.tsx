import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Footer } from "@/components/site/Footer";
import { Chrome } from "@/components/site/Chrome";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "luxury chocolate",
    "bean to bar",
    "single origin chocolate",
    "chocolate gifts",
    "artisan chocolate India",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    url: site.url,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: `${site.name} craft chocolate` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#241711",
  colorScheme: "dark" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The inline script below strips `no-js` before hydration, so the class
       list legitimately differs from the server's, suppress that one warning. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} no-js`}
    >
      <body>
        {/* Removing .no-js before paint keeps reveal states from sticking. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <Chrome />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
