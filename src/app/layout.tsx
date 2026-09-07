import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MotoKu - Save Your Bike, Save Your Time",
  description: "Portal informasi & perawatan sepeda motor. Satu tempat untuk memahami, merawat, dan menemukan kebutuhan motor di Surabaya.",
  openGraph: { title: "MotoKu", description: "Save Your Bike, Save Your Time" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var s=localStorage.getItem('motoku-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d))document.documentElement.classList.add('dark')}catch(e){}})()`}} />
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
