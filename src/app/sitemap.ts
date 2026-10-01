import type { MetadataRoute } from "next";
import { fetchParts, fetchWorkshops } from "@/lib/supabase/queries";

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || "https://motorkita.my.id";
// Normalisasi: paksa ke motorkita.my.id (bukan motorkita.id punya orang lain)
const base = rawBase.includes("motorkita.id") && !rawBase.includes("motorkita.my.id") ? "https://motorkita.my.id" : rawBase;

const statics: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/bengkel", priority: 0.9, changeFrequency: "daily" },
  { path: "/katalog", priority: 0.9, changeFrequency: "daily" },
  { path: "/cek-masalah", priority: 0.8, changeFrequency: "weekly" },
  { path: "/panduan-darurat", priority: 0.8, changeFrequency: "weekly" },
  { path: "/oli", priority: 0.8, changeFrequency: "weekly" },
  { path: "/sparepart", priority: 0.8, changeFrequency: "weekly" },
  { path: "/edukasi", priority: 0.8, changeFrequency: "weekly" },
  { path: "/perawatan", priority: 0.7, changeFrequency: "weekly" },
  { path: "/layanan", priority: 0.7, changeFrequency: "monthly" },
  { path: "/search", priority: 0.5, changeFrequency: "monthly" },
  { path: "/motor-saya", priority: 0.5, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = statics.map((p) => ({
    url: base + (p.path || "/"),
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
  try {
    const [parts, workshops] = await Promise.all([fetchParts(), fetchWorkshops()]);
    for (const p of parts) urls.push({ url: `${base}/katalog/${p.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
    for (const w of workshops) urls.push({ url: `${base}/bengkel/${w.id}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
  } catch {}
  return urls;
}
