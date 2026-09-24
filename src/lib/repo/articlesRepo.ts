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
  if (error || !data) return [];
  return data as Article[];
}

export async function fetchCategoriesSupabase(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return seedCategories;
  const sb = createClient();
  const { data, error } = await sb.from("categories").select("*").order("name");
  if (error || !data || data.length === 0) return seedCategories;

  // Filter out legacy generic "tips" & "faq" from edukasi type
  const dbCategories = (data as Category[]).filter(
    (c) => !(c.type === "edukasi" && (c.slug === "tips" || c.name === "Tips" || c.slug === "faq" || c.name === "FAQ"))
  );

  const existingSlugs = new Set(dbCategories.map((c) => c.slug));
  const missingDefaults = seedCategories.filter(
    (c) => c.type === "edukasi" && !existingSlugs.has(c.slug)
  );

  return missingDefaults.length > 0 ? [...dbCategories, ...missingDefaults] : dbCategories;
}
function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export async function upsertArticleSupabase(a: Article) {
  if (!isSupabaseConfigured()) {
    const list = getArticlesMock();
    const exists = list.find((x) => x.id === a.id);
    const next = exists ? list.map((x) => (x.id === a.id ? a : x)) : [a, ...list];
    saveArticlesMock(next);
    return next;
  }
  const sb = createClient();

  let resolvedCategoryId: string | null = null;
  const rawCat = a.category_id;

  if (isUUID(rawCat)) {
    resolvedCategoryId = rawCat;
  } else if (rawCat) {
    const cleanSlug = rawCat.replace(/^cat-/, "");
    // Look up category UUID from Supabase categories table
    const { data: catRow } = await sb
      .from("categories")
      .select("id")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (catRow?.id) {
      resolvedCategoryId = catRow.id;
    } else {
      // Auto-insert missing category into Supabase categories table to generate valid UUID
      const catName =
        cleanSlug === "pengetahuan"
          ? "Pengetahuan"
          : cleanSlug === "komponen"
          ? "Mengenal Komponen"
          : cleanSlug === "tips-merawat"
          ? "Tips Merawat"
          : cleanSlug === "tips-berkendara"
          ? "Tips Berkendara"
          : cleanSlug;

      const { data: newCat } = await sb
        .from("categories")
        .insert({ name: catName, slug: cleanSlug, type: "edukasi" })
        .select("id")
        .maybeSingle();

      if (newCat?.id) {
        resolvedCategoryId = newCat.id;
      }
    }
  }

  const payload: Record<string, unknown> = {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    cover_url: a.cover_url,
    published: a.published ?? true,
  };
  if (resolvedCategoryId) {
    payload.category_id = resolvedCategoryId;
  }

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

export async function upsertCategorySupabase(c: { id?: string; name: string; slug: string; type: "perawatan" | "edukasi" }) {
  if (!isSupabaseConfigured()) return seedCategories;
  const sb = createClient();
  const payload: Record<string, unknown> = { name: c.name, slug: c.slug, type: c.type };
  if (c.id && c.id.length > 20) payload.id = c.id;
  const { error } = await sb.from("categories").upsert(payload, { onConflict: "slug" });
  if (error) throw error;
  return fetchCategoriesSupabase();
}

export async function deleteCategorySupabase(id: string) {
  if (!isSupabaseConfigured()) return seedCategories;
  const sb = createClient();
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) throw error;
  return fetchCategoriesSupabase();
}

