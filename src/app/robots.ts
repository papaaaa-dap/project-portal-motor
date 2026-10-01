import type { MetadataRoute } from "next";

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || "https://motorkita.my.id";
// Normalisasi: paksa ke motorkita.my.id (bukan motorkita.id punya orang lain)
const base = rawBase.includes("motorkita.id") && !rawBase.includes("motorkita.my.id") ? "https://motorkita.my.id" : rawBase;

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
