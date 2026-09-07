// Placeholder Supabase client - connect when env is set
// For MVP demo, data comes from src/lib/data/mocks.ts via ilike filter
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && anon ? createClient(url, anon) : null;

export function isSupabaseConfigured() {
  return !!supabase;
}
