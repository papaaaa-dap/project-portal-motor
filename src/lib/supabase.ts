import { createClient as createBrowserClient } from "@supabase/supabase-js";

// Legacy compat — new code pakai @supabase/ssr via src/lib/supabase/{client,server}
// File ini dipertahankan agar import lama tidak pecah; tetap fallback ke mock jika env kosong.
// JANGAN re-export server.ts di sini — server.ts pakai next/headers (hanya Server Components).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anon ? createBrowserClient(url, anon) : null;

export function isSupabaseConfigured() {
  return !!supabase;
}
