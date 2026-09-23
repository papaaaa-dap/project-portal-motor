import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Motorkita — Save Your Bike, Save Your Time",
    short_name: "Motorkita",
    description: "Cek gejala motor, panduan darurat offline, katalog oli & sparepart, dan bengkel terdekat.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      { src: "/logo-motorkita-white.png", sizes: "any", type: "image/png" },
      { src: "/logo-motorkita.jpeg", sizes: "any", type: "image/jpeg" },
    ],
  };
}
