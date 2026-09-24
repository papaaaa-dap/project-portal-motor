import type { MetadataRoute } from "next";
import { fetchParts, fetchWorkshops } from "@/lib/supabase/queries";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://motorkita.id";

const statics = [
  "",
  "/katalog",
  "/bengkel",
  "/edukasi",
  "/cek-masalah",
  "/panduan-darurat",
  "/layanan",
  "/perawatan",
  "/oli",
  "/sparepart",
  "/search",
  "/motor-saya",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = statics.map((p) => ({ url: base + (p || ""), lastModified: now }));
  try {
    const [parts, workshops] = await Promise.all([fetchParts(), fetchWorkshops()]);
    for (const p of parts) urls.push({ url: `${base}/katalog/${p.slug}`, lastModified: now });
    for (const w of workshops) urls.push({ url: `${base}/bengkel/${w.id}`, lastModified: now });
  } catch {}
  return urls;
}
