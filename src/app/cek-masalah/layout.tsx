import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Masalah Motor 30 Detik — Gejala & Solusi",
  description: "Motor bunyi aneh, susah starter, brebet, ngempos? Pilih gejala, dapat kemungkinan penyebab + solusi + estimasi biaya + bengkel yang bisa benerin. Gratis 30 detik.",
  alternates: { canonical: "/cek-masalah" },
  openGraph: {
    title: "Cek Masalah Motor 30 Detik — Motorkita",
    description: "Pilih gejala → dapat penyebab, solusi & estimasi biaya.",
    type: "website",
  },
};

export default function CekMasalahLayout({ children }: { children: React.ReactNode }) {
  return children;
}
