import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bengkel Motor Surabaya Terdekat — Tambal Ban & Cuci Motor",
  description: "Daftar bengkel motor, tambal ban, dan cuci motor Surabaya: urutkan pakai lokasi, lihat jam buka, rating, layanan, langsung navigasi Google Maps. 12+ bengkel terverifikasi.",
  alternates: { canonical: "/bengkel" },
  openGraph: {
    title: "Bengkel Motor Surabaya Terdekat — Motorkita",
    description: "Urutkan pakai lokasi, langsung navigasi. Tambal ban, servis, cuci motor.",
    type: "website",
  },
};

export default function BengkelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
