import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motorkita.my.id";
// Normalisasi: paksa ke motorkita.my.id (bukan motorkita.id punya orang lain)
const siteUrl = rawSiteUrl.includes("motorkita.id") && !rawSiteUrl.includes("motorkita.my.id") ? "https://motorkita.my.id" : rawSiteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Motorkita — Bengkel Motor Surabaya, Oli, Sparepart & Panduan Darurat", template: "%s — Motorkita" },
  description:
    "Motorkita: direktori bengkel motor Surabaya + tambal ban + cuci motor, cek gejala 30 detik, katalog oli & sparepart harga Surabaya, panduan darurat mogok & ban bocor. Tanpa login, langsung pakai.",
  keywords: ["bengkel motor surabaya", "bengkel motor terdekat", "tambal ban terdekat", "cuci motor surabaya", "ganti oli motor", "servis CVT", "sparepart motor", "motorkita", "bengkel 24 jam surabaya", "panduan darurat motor"],
  authors: [{ name: "Motorkita", url: siteUrl }],
  creator: "Motorkita",
  publisher: "Motorkita",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: {
    google: "y-n_r68moV6524liwsXqYWy46QaHWUY-iYK41Jp78j0",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Motorkita",
    title: "Motorkita — Bengkel Motor Surabaya, Oli, Sparepart & Panduan Darurat",
    description: "Cek gejala 30 detik, katalog oli & sparepart harga Surabaya, panduan darurat, dan bengkel terdekat dengan navigasi.",
    images: [{ url: "/motor1.jpeg", width: 1200, height: 630, alt: "Motorkita — Bengkel Motor Surabaya" }],
  },
  twitter: { card: "summary_large_image", title: "Motorkita — Bengkel Motor Surabaya", description: "Save Your Bike, Save Your Time — bengkel terdekat, katalog oli & sparepart, panduan darurat.", images: ["/motor1.jpeg"] },
  icons: {
    icon: [
      { url: "/logo-motorkita.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/logo-motorkita.png",
    apple: "/logo-motorkita.png",
  },
  appleWebApp: { capable: true, title: "Motorkita", statusBarStyle: "black" },
};

export const viewport: Viewport = { themeColor: "#0A0A0A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Motorkita",
        url: siteUrl,
        logo: `${siteUrl}/logo-motorkita.png`,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Motorkita",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "id-ID",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={query}`,
          "query-input": "required name=query",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#local`,
        name: "Motorkita — Direktori Bengkel Motor Surabaya",
        url: siteUrl,
        areaServed: { "@type": "City", name: "Surabaya" },
        priceRange: "Rp",
      },
    ],
  };
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="canonical" href={siteUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{__html:`(function(){try{localStorage.removeItem('motoku-theme');document.documentElement.classList.remove('dark')}catch(e){}})()`}} />
        <script dangerouslySetInnerHTML={{__html:`(function(){try{if('serviceWorker' in navigator&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}}catch(e){}}()`}} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {/* THESIS: Pit-depot for everyday riders - precise industrial service manual, not soft blog. OWN-WORLD: Warm concrete #FFFFFF + graphite #0A0A0A + hazard amber #0A0A0A + signal red #0A0A0A; condensed mono caps, hazard stripes, pegboard, blueprint grid, riveted steel cards. STORY: visitor grasps 3-in-1 (memahami-merawat-menemukan) in one viewport, trusts distance & emergency speed, acts via pit-lane shortcuts. FIRST VIEWPORT: Left giant condensed headline MOTOR SIAP. JALAN TERUS. + steel search + popular chips; right dark depot board 6 tool tiles; ticker below. FORM: Persuade depot-manual, seed d6b08155. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
