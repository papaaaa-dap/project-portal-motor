"use client";
import type { Part, PartCategory } from "@/lib/types";
import { parts as seed } from "@/lib/data/parts";

const KEY = "motorkita_parts_mock";

export function getPartsMock(): Part[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Part[];
    return parsed.length ? parsed : seed;
  } catch { return seed; }
}

export function savePartsMock(list: Part[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addPartMock(p: Part) {
  const list = getPartsMock();
  list.unshift(p);
  savePartsMock(list);
  return list;
}

export function updatePartMock(id: string, patch: Partial<Part>) {
  const list = getPartsMock().map(x=> x.id===id ? { ...x, ...patch } : x);
  savePartsMock(list);
  return list;
}

export function deletePartMock(id: string) {
  const list = getPartsMock().filter(x=> x.id!==id);
  savePartsMock(list);
  return list;
}

export function slugify(s: string){
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

// Supabase-ready: pakai helpers async jika env diset, fallback ke mock localStorage saat dev tanpa env.
// Server components bisa pakai fetchParts() dari @/lib/supabase/queries; client components pakai helpers di bawah.
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function fetchPartsSupabase(): Promise<Part[]> {
  if (!isSupabaseConfigured()) return getPartsMock();
  const supabase = createClient();
  const { data, error } = await supabase.from("parts").select("*").order("created_at", { ascending: false });
  if (error || !data) return getPartsMock();
  return data as unknown as Part[];
}

export async function upsertPartSupabase(p: Part) {
  if (!isSupabaseConfigured()) {
    const exists = getPartsMock().find((x) => x.id === p.id);
    const next = exists ? getPartsMock().map((x) => (x.id === p.id ? p : x)) : [p, ...getPartsMock()];
    savePartsMock(next);
    return next;
  }
  const supabase = createClient();
  const { error } = await supabase.from("parts").upsert({
    slug: p.slug, category: p.category, brand: p.brand, name: p.name,
    harga_min: p.harga_min, harga_max: p.harga_max, satuan: p.satuan,
    cover_url: p.cover_url, specs: p.specs, keunggulan: p.keunggulan,
    cocok_motor: p.cocok_motor, interval_km: p.interval_km, deskripsi: p.deskripsi,
    bengkel_ids: p.bengkel_ids,
  }, { onConflict: "slug" });
  if (error) throw error;
  return fetchPartsSupabase();
}

export async function deletePartSupabase(idOrSlug: string) {
  if (!isSupabaseConfigured()) return deletePartMock(idOrSlug);
  const supabase = createClient();
  // coba by slug dulu, lalu id
  let { error } = await supabase.from("parts").delete().eq("slug", idOrSlug);
  if (error) {
    const r2 = await supabase.from("parts").delete().eq("id", idOrSlug);
    if (r2.error) throw r2.error;
  }
  return fetchPartsSupabase();
}

export const partsRepo = { getPartsMock, savePartsMock, addPartMock, updatePartMock, deletePartMock, slugify, fetchPartsSupabase, upsertPartSupabase, deletePartSupabase };
export type { PartCategory };
