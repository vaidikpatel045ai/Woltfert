import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import localFont from "next/font/local";
import Preloader from "@/components/animation/Preloader";
import { PageTransitionProvider } from "@/components/animation/PageTransition";
import SmoothScroll from "@/components/animation/SmoothScroll";
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/sections/Navigation";
import Cursor from "@/components/ui/Cursor";
import StickyMobileBar from "@/components/ui/StickyMobileBar";
import { business, seo } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schema";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

/**
 * IBM Plex Serif for numerals only. The unicode-range limits these faces to
 * digits (and $ % +), so it sits first in every font stack and every number
 * on the site renders in Plex while letters fall through to Fraunces/Manrope.
 */
const plexDigits = localFont({
  src: [
    { path: "./fonts/ibm-plex-serif-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ibm-plex-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-serif-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-serif-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/ibm-plex-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-plex-digits",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0030-0039, U+0024, U+0025, U+002B" }],
  // A metric fallback face would have no unicode-range and swallow all text.
  adjustFontFallback: false,
  fallback: [],
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: { default: seo.title, template: "%s · Wolsfelt's Bridal, Aurora IL" },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_US",
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: motion class (gates CSS that hides split headings) and
// preloader skip for repeat visits in the same session.
const boot = `(function(){try{var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.classList.add(r?'reduced-motion':'motion');if(r||sessionStorage.getItem('wols-preloaded')){d.classList.add('preloaded')}else{d.classList.add('is-loading')}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${plexDigits.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <style>{`.preloaded .preloader{display:none}html.is-loading{overflow:hidden}`}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }} />
      </head>
      <body>
        <a href="#main" className="label sr-only z-[400] bg-espresso px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <PageTransitionProvider>
          <Preloader />
          <SmoothScroll />
          <AnnouncementBar />
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
          <StickyMobileBar />
        </PageTransitionProvider>
        <Cursor />
        <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
          <div className="grain" />
        </div>
      </body>
    </html>
  );
}
