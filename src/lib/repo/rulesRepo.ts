"use client";
import type { MaintenanceRule } from "@/lib/types";
import { maintenanceRules as seed } from "@/lib/data/mocks";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_rules_mock";

export function getRulesMock(): MaintenanceRule[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const p = JSON.parse(raw) as MaintenanceRule[];
    return p.length ? p : seed;
  } catch {
    return seed;
  }
}

export function saveRulesMock(list: MaintenanceRule[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list));
}

export async function fetchRulesSupabase(): Promise<MaintenanceRule[]> {
  if (!isSupabaseConfigured()) return getRulesMock();
  const sb = createClient();
  const { data, error } = await sb.from("maintenance_rules").select("*");
  if (error || !data) return [];
  return data as MaintenanceRule[];
}

export async function upsertRuleSupabase(r: MaintenanceRule) {
  if (!isSupabaseConfigured()) {
    const list = getRulesMock();
    const exists = list.find((x) => x.id === r.id);
    const next = exists ? list.map((x) => (x.id === r.id ? r : x)) : [r, ...list];
    saveRulesMock(next);
    return next;
  }
  const sb = createClient();
  const payload = {
    motor_type: r.motor_type,
    category: r.category,
    interval_km: r.interval_km,
    interval_days: r.interval_days,
    title: r.title,
    description: r.description,
  };

  // If id is valid UUID or existing record, include id
  if (r.id && r.id.length > 20) {
    (payload as Record<string, unknown>).id = r.id;
  }

  const { error } = await sb.from("maintenance_rules").upsert(payload);
  if (error) throw error;
  return fetchRulesSupabase();
}

export async function deleteRuleSupabase(id: string) {
  if (!isSupabaseConfigured()) {
    const next = getRulesMock().filter((x) => x.id !== id);
    saveRulesMock(next);
    return next;
  }
  const sb = createClient();
  const { error } = await sb.from("maintenance_rules").delete().eq("id", id);
  if (error) throw error;
  return fetchRulesSupabase();
}
