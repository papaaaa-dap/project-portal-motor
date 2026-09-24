"use client";
import type { Motorcycle } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_motorcycles_mock";

export function getMotorcyclesMock(): Motorcycle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Motorcycle[];
  } catch {
    return [];
  }
}

export function saveMotorcyclesMock(list: Motorcycle[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list));
}

export async function fetchMotorcycles(): Promise<Motorcycle[]> {
  if (!isSupabaseConfigured()) return getMotorcyclesMock();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getMotorcyclesMock();
  const { data, error } = await supabase.from("motorcycles").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as Motorcycle[];
}

export async function addMotorcycle(m: Omit<Motorcycle, "id"> & { id?: string }) {
  const supabaseConfigured = isSupabaseConfigured();
  if (supabaseConfigured) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const payload = { user_id: user.id, brand: m.brand, model: m.model, year: m.year, type: m.type, cc: m.cc, kilometer: m.kilometer, last_service_date: m.last_service_date, notes: m.notes ?? null };
      const { error } = await supabase.from("motorcycles").insert(payload);
      if (error) throw error;
      return fetchMotorcycles();
    }
  }
  const list = getMotorcyclesMock();
  const nm = { ...m, id: m.id || Date.now().toString() } as Motorcycle;
  const next = [nm, ...list];
  saveMotorcyclesMock(next);
  return next;
}

export async function deleteMotorcycle(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("motorcycles").delete().eq("id", id);
      if (error) throw error;
      return fetchMotorcycles();
    }
  }
  const next = getMotorcyclesMock().filter((x) => x.id !== id);
  saveMotorcyclesMock(next);
  return next;
}

export async function touchMotorcycleAfterService(id: string, kilometer: number, service_date: string) {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return fetchMotorcycles();
  }
  const list = getMotorcyclesMock().map((x) =>
    x.id === id ? { ...x, kilometer: Math.max(x.kilometer, kilometer), last_service_date: service_date } : x
  );
  saveMotorcyclesMock(list);
  return list;
}
