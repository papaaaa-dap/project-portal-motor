"use client";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

export const COVERS_BUCKET = "covers";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function validateImage(file: File): string | null {
  if (!ALLOWED.includes(file.type)) return "File harus JPG / PNG / WebP.";
  if (file.size > MAX_BYTES) return "Maksimal 2MB — kompres dulu sebelum upload.";
  return null;
}

// Upload ke bucket `covers/<folder>/...` → return public URL.
// Butuh: bucket public `covers` + policy insert untuk user login (lihat supabase/schema.sql).
export async function uploadCover(file: File, folder: "parts" | "workshops" | "articles"): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error("Supabase belum dikonfigurasi — isi .env.local dulu, atau tempel URL manual.");
  const invalid = validateImage(file);
  if (invalid) throw new Error(invalid);
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const supabase = createClient();
  const { error } = await supabase.storage.from(COVERS_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(friendlyStorageError(error.message), { cause: error.message });
  const { data } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function friendlyStorageError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("bucket not found") || m.includes("bucket_not_found"))
    return `Bucket '${COVERS_BUCKET}' belum ada di Supabase Storage. Buat dulu: Dashboard → Storage → New bucket → nama '${COVERS_BUCKET}', centang Public. Lalu coba upload lagi.`;
  if (m.includes("row-level security") || m.includes("policy") || m.includes("unauthorized") || m.includes("403"))
    return "Upload ditolak policy Storage (RLS). Pastikan sudah login sebagai admin dan policy 'login write covers' sudah dijalankan (lihat supabase/schema.sql bagian storage).";
  if (m.includes("duplicate") || m.includes("already exists"))
    return "Nama file bentrok — coba upload ulang (nama dibuat acak tiap percobaan).";
  if (m.includes("payload too large") || m.includes("exceeded"))
    return "File terlalu besar untuk limit project — kompres di bawah 2MB lalu coba lagi.";
  return "Upload gagal: " + raw;
}

export type StorageHealth =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "not-logged-in" | "bucket-missing" | "unknown"; message: string };
// SQL idempoten untuk memperbaiki policy Storage covers.
// Jalankan di Supabase Dashboard → SQL Editor jika upload ditolak RLS.
export const STORAGE_FIX_SQL = `insert into storage.buckets (id, name, public) values ('covers','covers', true) on conflict (id) do nothing;
drop policy if exists "public read covers" on storage.objects;
create policy "public read covers" on storage.objects for select using (bucket_id = 'covers');
drop policy if exists "login write covers" on storage.objects;
create policy "login write covers" on storage.objects for insert with check (bucket_id = 'covers' and auth.uid() is not null);
drop policy if exists "login update covers" on storage.objects;
create policy "login update covers" on storage.objects for update using (bucket_id = 'covers' and auth.uid() is not null) with check (bucket_id = 'covers' and auth.uid() is not null);
drop policy if exists "login delete covers" on storage.objects;
create policy "login delete covers" on storage.objects for delete using (bucket_id = 'covers' and auth.uid() is not null);`;

// Cek cepat: login + bucket covers ada/tidak. Dipakai /admin untuk status Storage.
export async function checkStorageHealth(): Promise<StorageHealth> {
  if (!isSupabaseConfigured())
    return { ok: false, reason: "not-configured", message: "Supabase belum dikonfigurasi." };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "not-logged-in", message: "Belum login — upload butuh login." };
  const { data, error } = await supabase.storage.from(COVERS_BUCKET).list("", { limit: 1 });
  if (error) {
    if (error.message.toLowerCase().includes("bucket not found"))
      return {
        ok: false,
        reason: "bucket-missing",
        message: `Bucket '${COVERS_BUCKET}' belum ada — buat di Dashboard → Storage → New bucket (Public), atau jalankan SQL pembuatan bucket.`,
      };
    return { ok: false, reason: "unknown", message: friendlyStorageError(error.message) };
  }
  if (!data) return { ok: false, reason: "unknown", message: "Storage tidak merespons." };
  return { ok: true };
}
