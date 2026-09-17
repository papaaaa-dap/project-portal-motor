"use client";
import type { Workshop } from "@/lib/types";
import { workshops as seed } from "@/lib/data/mocks";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_workshops_mock";
export function getWorkshopsMock(): Workshop[] {
  if (typeof window === "undefined") return seed;
  try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const p = JSON.parse(raw) as Workshop[]; return p.length ? p : seed; } catch { return seed; }
}
export function saveWorkshopsMock(list: Workshop[]) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list)); }
export function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

export async function fetchWorkshopsSupabase(): Promise<Workshop[]> {
  if (!isSupabaseConfigured()) return getWorkshopsMock();
  const sb = createClient();
  const { data, error } = await sb.from("workshops").select("*").order("created_at", { ascending: false });
  if (error || !data) return getWorkshopsMock();
  return data as Workshop[];
}
export async function upsertWorkshopSupabase(w: Workshop) {
  if (!isSupabaseConfigured()) {
    const list = getWorkshopsMock();
    const exists = list.find(x=> x.id===w.id || x.slug===w.slug);
    const next = exists ? list.map(x=> x.id===w.id || x.slug===w.slug ? w : x) : [w, ...list];
    saveWorkshopsMock(next); return next;
  }
  const sb = createClient();
  const payload: Record<string, unknown> = { name: w.name, slug: w.slug, address: w.address, kecamatan: w.kecamatan, lat: w.lat ?? null, lng: w.lng ?? null, maps_url: (w as unknown as { maps_url?: string }).maps_url ?? null, jam_operasional: w.jam_operasional, layanan: w.layanan, kontak: w.kontak, foto_url: w.foto_url, rating: w.rating };
  const { error } = await sb.from("workshops").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
  return fetchWorkshopsSupabase();
}
export async function deleteWorkshopSupabase(idOrSlug: string) {
  if (!isSupabaseConfigured()) {
    const next = getWorkshopsMock().filter(x=> x.id!==idOrSlug && x.slug!==idOrSlug);
    saveWorkshopsMock(next); return next;
  }
  const sb = createClient();
  let { error } = await sb.from("workshops").delete().eq("slug", idOrSlug);
  if (error) {
    const r2 = await sb.from("workshops").delete().eq("id", idOrSlug);
    if (r2.error) throw r2.error;
  }
  return fetchWorkshopsSupabase();
}
