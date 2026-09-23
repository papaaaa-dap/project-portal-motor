"use client";
import type { MaintenanceRecord } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_maintenance_mock";

function readMock(): MaintenanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as MaintenanceRecord[];
  } catch {
    return [];
  }
}

function writeMock(list: MaintenanceRecord[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list));
}

export async function fetchRecords(motorcycleId: string): Promise<MaintenanceRecord[]> {
  if (!isSupabaseConfigured()) return readMock().filter((r) => r.motorcycle_id === motorcycleId);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return readMock().filter((r) => r.motorcycle_id === motorcycleId);
  const { data, error } = await supabase
    .from("maintenance_records")
    .select("*")
    .eq("motorcycle_id", motorcycleId)
    .order("service_date", { ascending: false });
  if (error || !data) return readMock().filter((r) => r.motorcycle_id === motorcycleId);
  return data as unknown as MaintenanceRecord[];
}

export async function fetchAllRecords(motorcycleIds: string[]): Promise<Record<string, MaintenanceRecord[]>> {
  const out: Record<string, MaintenanceRecord[]> = {};
  if (!motorcycleIds.length) return out;
  if (!isSupabaseConfigured()) {
    const all = readMock();
    for (const id of motorcycleIds) out[id] = all.filter((r) => r.motorcycle_id === id).sort((a, b) => b.service_date.localeCompare(a.service_date));
    return out;
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const all = readMock();
    for (const id of motorcycleIds) out[id] = all.filter((r) => r.motorcycle_id === id).sort((a, b) => b.service_date.localeCompare(a.service_date));
    return out;
  }
  const { data, error } = await supabase
    .from("maintenance_records")
    .select("*")
    .in("motorcycle_id", motorcycleIds)
    .order("service_date", { ascending: false });
  if (error || !data) {
    const all = readMock();
    for (const id of motorcycleIds) out[id] = all.filter((r) => r.motorcycle_id === id);
    return out;
  }
  for (const id of motorcycleIds) out[id] = (data as unknown as MaintenanceRecord[]).filter((r) => r.motorcycle_id === id);
  return out;
}

export async function addRecord(rec: Omit<MaintenanceRecord, "id" | "created_at">): Promise<MaintenanceRecord[]> {
  if (!isSupabaseConfigured()) {
    const all = readMock();
    const nm = { ...rec, id: Date.now().toString() } as MaintenanceRecord;
    writeMock([nm, ...all]);
    return [nm, ...all.filter((r) => r.motorcycle_id === rec.motorcycle_id)];
  }
  const supabase = createClient();
  const payload = {
    motorcycle_id: rec.motorcycle_id,
    service_type: rec.service_type,
    kilometer: rec.kilometer,
    service_date: rec.service_date,
    cost: rec.cost ?? null,
    notes: rec.notes ?? null,
    next_service_km: rec.next_service_km ?? null,
    next_service_date: rec.next_service_date ?? null,
  };
  const { error } = await supabase.from("maintenance_records").insert(payload);
  if (error) throw error;
  // update motor: km maju + tanggal servis terakhir
  await supabase
    .from("motorcycles")
    .update({ kilometer: rec.kilometer, last_service_date: rec.service_date })
    .eq("id", rec.motorcycle_id);
  return fetchRecords(rec.motorcycle_id);
}

export async function deleteRecord(id: string, motorcycleId: string): Promise<MaintenanceRecord[]> {
  if (!isSupabaseConfigured()) {
    const next = readMock().filter((r) => r.id !== id);
    writeMock(next);
    return next.filter((r) => r.motorcycle_id === motorcycleId);
  }
  const supabase = createClient();
  const { error } = await supabase.from("maintenance_records").delete().eq("id", id);
  if (error) throw error;
  return fetchRecords(motorcycleId);
}
