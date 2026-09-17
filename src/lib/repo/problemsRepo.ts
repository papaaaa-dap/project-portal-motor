"use client";
import type { MotorProblem } from "@/lib/types";
import { motorProblems as seed } from "@/lib/data/mocks";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_problems_mock";
export function getProblemsMock(): MotorProblem[] {
  if (typeof window === "undefined") return seed;
  try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const p = JSON.parse(raw) as MotorProblem[]; return p.length ? p : seed; } catch { return seed; }
}
export function saveProblemsMock(list: MotorProblem[]) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list)); }
export function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

export async function fetchProblemsSupabase(): Promise<MotorProblem[]> {
  if (!isSupabaseConfigured()) return getProblemsMock();
  const sb = createClient();
  const { data, error } = await sb.from("motor_problems").select("*").order("created_at");
  if (error || !data) return getProblemsMock();
  return data as MotorProblem[];
}
export async function upsertProblemSupabase(p: MotorProblem) {
  if (!isSupabaseConfigured()) {
    const list = getProblemsMock();
    const exists = list.find(x=> x.id===p.id);
    const next = exists ? list.map(x=> x.id===p.id ? p : x) : [p, ...list];
    saveProblemsMock(next); return next;
  }
  const sb = createClient();
  const payload = { slug: p.slug, title: p.title, gejala: p.gejala, penyebab: p.penyebab, langkah: p.langkah, is_emergency: p.is_emergency, category: p.category };
  const { error } = await sb.from("motor_problems").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
  return fetchProblemsSupabase();
}
export async function deleteProblemSupabase(idOrSlug: string) {
  if (!isSupabaseConfigured()) {
    const next = getProblemsMock().filter(x=> x.id!==idOrSlug && x.slug!==idOrSlug);
    saveProblemsMock(next); return next;
  }
  const sb = createClient();
  let { error } = await sb.from("motor_problems").delete().eq("slug", idOrSlug);
  if (error) {
    const r2 = await sb.from("motor_problems").delete().eq("id", idOrSlug);
    if (r2.error) throw r2.error;
  }
  return fetchProblemsSupabase();
}
