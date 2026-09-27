"use client";
import type { MotorSpecItem } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_motor_specs_mock";

export function getMotorSpecsMock(): MotorSpecItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MotorSpecItem[];
  } catch {
    return [];
  }
}

export function saveMotorSpecsMock(list: MotorSpecItem[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list));
}

export async function fetchMotorSpecsSupabase(): Promise<MotorSpecItem[]> {
  if (!isSupabaseConfigured()) return getMotorSpecsMock();
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("motor_specs").select("*").order("brand", { ascending: true });
    if (error || !data) return getMotorSpecsMock();
    return data as unknown as MotorSpecItem[];
  } catch {
    return getMotorSpecsMock();
  }
}

export async function upsertMotorSpecSupabase(item: MotorSpecItem): Promise<MotorSpecItem[]> {
  if (!isSupabaseConfigured()) {
    const list = getMotorSpecsMock();
    const existingIdx = list.findIndex((x) => x.id === item.id || (x.brand === item.brand && x.model === item.model));
    let next: MotorSpecItem[];
    if (existingIdx >= 0) {
      next = [...list];
      next[existingIdx] = item;
    } else {
      next = [item, ...list];
    }
    saveMotorSpecsMock(next);
    return next;
  }

  const supabase = createClient();
  const payload = {
    brand: item.brand,
    model: item.model,
    type: item.type,
    oli: item.oli,
    volume_oli: item.volume_oli,
    ban_depan: item.ban_depan,
    ban_belakang: item.ban_belakang,
    aki: item.aki,
    busi: item.busi,
    catatan: item.catatan || null,
  };

  const { error } = await supabase.from("motor_specs").upsert(payload, { onConflict: "brand,model" });
  if (error) throw error;
  return fetchMotorSpecsSupabase();
}

export async function deleteMotorSpecSupabase(id: string): Promise<MotorSpecItem[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from("motor_specs").delete().eq("id", id);
    if (!error) return fetchMotorSpecsSupabase();
  }
  const next = getMotorSpecsMock().filter((x) => x.id !== id);
  saveMotorSpecsMock(next);
  return next;
}
