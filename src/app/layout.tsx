import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motorkita.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Motorkita — Save Your Bike, Save Your Time", template: "%s — Motorkita" },
  description:
    "Portal perawatan sepeda motor: cek gejala 30 detik, katalog oli & sparepart, panduan darurat, dan bengkel terdekat dengan navigasi. Tanpa login, langsung pakai.",
  keywords: ["bengkel motor", "ganti oli motor", "servis CVT", "tambal ban", "sparepart motor", "bengkel Surabaya", "panduan darurat motor"],
  authors: [{ name: "Motorkita" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Motorkita",
    title: "Motorkita — Save Your Bike, Save Your Time",
    description: "Satu tempat untuk memahami, merawat, dan menemukan kebutuhan motor.",
    images: [{ url: "/motor1.jpeg", width: 1200, height: 630, alt: "Motorkita" }],
  },
  twitter: { card: "summary_large_image", title: "Motorkita", description: "Save Your Bike, Save Your Time", images: ["/motor1.jpeg"] },
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
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
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
