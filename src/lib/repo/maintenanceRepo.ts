"use client";
import type { MaintenanceRecord } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_maintenance_mock";

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

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
  if (!isSupabaseConfigured() || !isUuid(motorcycleId)) {
    return readMock().filter((r) => r.motorcycle_id === motorcycleId);
  }
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

  const mockIds = motorcycleIds.filter((id) => !isUuid(id));
  const uuidIds = motorcycleIds.filter((id) => isUuid(id));

  // Handle mock IDs directly from localStorage
  if (mockIds.length) {
    const all = readMock();
    for (const id of mockIds) {
      out[id] = all.filter((r) => r.motorcycle_id === id).sort((a, b) => b.service_date.localeCompare(a.service_date));
    }
  }

  // Handle UUID IDs with Supabase if configured and logged in
  if (uuidIds.length && isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("maintenance_records")
          .select("*")
          .in("motorcycle_id", uuidIds)
          .order("service_date", { ascending: false });
        if (!error && data) {
          for (const id of uuidIds) {
            out[id] = (data as unknown as MaintenanceRecord[]).filter((r) => r.motorcycle_id === id);
          }
          return out;
        }
      }
    } catch {}
  }

  // Fallback for remaining UUIDs if Supabase fails or not logged in
  const all = readMock();
  for (const id of uuidIds) {
    if (!out[id]) {
      out[id] = all.filter((r) => r.motorcycle_id === id).sort((a, b) => b.service_date.localeCompare(a.service_date));
    }
  }
  return out;
}

export async function addRecord(rec: Omit<MaintenanceRecord, "id" | "created_at">): Promise<MaintenanceRecord[]> {
  if (!isSupabaseConfigured() || !isUuid(rec.motorcycle_id)) {
    const all = readMock();
    const nm = { ...rec, id: Date.now().toString() } as MaintenanceRecord;
    writeMock([nm, ...all]);
    return [nm, ...all.filter((r) => r.motorcycle_id === rec.motorcycle_id)];
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const all = readMock();
    const nm = { ...rec, id: Date.now().toString() } as MaintenanceRecord;
    writeMock([nm, ...all]);
    return [nm, ...all.filter((r) => r.motorcycle_id === rec.motorcycle_id)];
  }

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
  if (error) {
    // Safe fallback if Supabase table or FK rejects non-existent remote motorcycle
    const all = readMock();
    const nm = { ...rec, id: Date.now().toString() } as MaintenanceRecord;
    writeMock([nm, ...all]);
    return [nm, ...all.filter((r) => r.motorcycle_id === rec.motorcycle_id)];
  }

  // update motor: km maju + tanggal servis terakhir
  await supabase
    .from("motorcycles")
    .update({ kilometer: rec.kilometer, last_service_date: rec.service_date })
    .eq("id", rec.motorcycle_id);

  return fetchRecords(rec.motorcycle_id);
}

export async function deleteRecord(id: string, motorcycleId: string): Promise<MaintenanceRecord[]> {
  if (!isSupabaseConfigured() || !isUuid(id) || !isUuid(motorcycleId)) {
    const next = readMock().filter((r) => r.id !== id);
    writeMock(next);
    return next.filter((r) => r.motorcycle_id === motorcycleId);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const next = readMock().filter((r) => r.id !== id);
    writeMock(next);
    return next.filter((r) => r.motorcycle_id === motorcycleId);
  }

  const { error } = await supabase.from("maintenance_records").delete().eq("id", id);
  if (error) {
    const next = readMock().filter((r) => r.id !== id);
    writeMock(next);
    return next.filter((r) => r.motorcycle_id === motorcycleId);
  }
  return fetchRecords(motorcycleId);
}
