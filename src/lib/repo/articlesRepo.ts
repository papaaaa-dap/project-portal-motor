"use client";
import type { Article, Category } from "@/lib/types";
import { articles as seed, categories as seedCategories } from "@/lib/data/mocks";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "motorkita_articles_mock";
export function getArticlesMock(): Article[] {
  if (typeof window === "undefined") return seed;
  try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const p = JSON.parse(raw) as Article[]; return p.length ? p : seed; } catch { return seed; }
}
export function saveArticlesMock(list: Article[]) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list)); }
export function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

export async function fetchArticlesSupabase(): Promise<Article[]> {
  if (!isSupabaseConfigured()) return getArticlesMock();
  const sb = createClient();
  const { data, error } = await sb.from("articles").select("*").order("created_at", { ascending: false });
  if (error || !data) return getArticlesMock();
  return data as Article[];
}

export async function fetchCategoriesSupabase(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return seedCategories;
  const sb = createClient();
  const { data, error } = await sb.from("categories").select("*").order("name");
  if (error || !data) return seedCategories;
  return data as Category[];
}
export async function upsertArticleSupabase(a: Article) {
  if (!isSupabaseConfigured()) {
    const list = getArticlesMock();
    const exists = list.find(x=> x.id===a.id);
    const next = exists ? list.map(x=> x.id===a.id ? a : x) : [a, ...list];
    saveArticlesMock(next); return next;
  }
  const sb = createClient();
  // need category_id: if a.category_id looks like slug, resolve; otherwise use as is
  let category_id: string | null = a.category_id;
  if (category_id && !category_id.includes("-")) {
    // legacy numeric id -> map via slug table? fallback to first category
  }
  const payload: Record<string, unknown> = { title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content, cover_url: a.cover_url, published: a.published ?? true };
  // if category_id is uuid, include
  if (a.category_id && a.category_id.length > 20) payload.category_id = a.category_id;
  const { error } = await sb.from("articles").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
  return fetchArticlesSupabase();
}
export async function deleteArticleSupabase(idOrSlug: string) {
  if (!isSupabaseConfigured()) {
    const next = getArticlesMock().filter(x=> x.id!==idOrSlug && x.slug!==idOrSlug);
    saveArticlesMock(next); return next;
  }
  const sb = createClient();
  let { error } = await sb.from("articles").delete().eq("slug", idOrSlug);
  if (error) {
    const r2 = await sb.from("articles").delete().eq("id", idOrSlug);
    if (r2.error) throw r2.error;
  }
  return fetchArticlesSupabase();
}
