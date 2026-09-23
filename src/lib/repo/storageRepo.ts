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
  if (error) throw error;
  const { data } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
