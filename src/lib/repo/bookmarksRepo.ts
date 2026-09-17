"use client";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY_A = "motoku_bookmarks_articles";
const KEY_W = "motoku_bookmarks_workshops";

function getLS(key: string): string[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as string[]) : []; } catch { return []; }
}
function setLS(key: string, v: string[]) { if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(v)); }

export function getBookmarksMock(): { articles: string[]; workshops: string[] } {
  return { articles: getLS(KEY_A), workshops: getLS(KEY_W) };
}

// Supabase article bookmarks
export async function fetchBookmarks(): Promise<{ articles: string[]; workshops: string[] }> {
  if (!isSupabaseConfigured()) return getBookmarksMock();
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return getBookmarksMock();
  const [a, w] = await Promise.all([
    sb.from("bookmarks").select("article_id").eq("user_id", user.id),
    sb.from("workshop_bookmarks").select("workshop_id").eq("user_id", user.id),
  ]);
  const articles = a.data?.map(r => (r as unknown as { article_id: string }).article_id) ?? getLS(KEY_A);
  const workshops = w.data?.map(r => (r as unknown as { workshop_id: string }).workshop_id) ?? getLS(KEY_W);
  return { articles, workshops };
}

export async function toggleBookmarkArticle(articleId: string): Promise<boolean> {
  const cur = getLS(KEY_A);
  const has = cur.includes(articleId);
  if (!isSupabaseConfigured()) {
    const next = has ? cur.filter(x=>x!==articleId) : [...cur, articleId];
    setLS(KEY_A, next); return !has;
  }
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    const next = has ? cur.filter(x=>x!==articleId) : [...cur, articleId];
    setLS(KEY_A, next); return !has;
  }
  if (has) {
    await sb.from("bookmarks").delete().eq("user_id", user.id).eq("article_id", articleId);
    setLS(KEY_A, cur.filter(x=>x!==articleId));
    return false;
  } else {
    const { error } = await sb.from("bookmarks").insert({ user_id: user.id, article_id: articleId });
    if (error) { // fallback LS if RLS
      const next = [...cur, articleId]; setLS(KEY_A, next); return true;
    }
    setLS(KEY_A, [...cur, articleId]);
    return true;
  }
}

export async function toggleBookmarkWorkshop(workshopId: string): Promise<boolean> {
  const cur = getLS(KEY_W);
  const has = cur.includes(workshopId);
  if (!isSupabaseConfigured()) {
    const next = has ? cur.filter(x=>x!==workshopId) : [...cur, workshopId];
    setLS(KEY_W, next); return !has;
  }
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    const next = has ? cur.filter(x=>x!==workshopId) : [...cur, workshopId];
    setLS(KEY_W, next); return !has;
  }
  if (has) {
    await sb.from("workshop_bookmarks").delete().eq("user_id", user.id).eq("workshop_id", workshopId);
    setLS(KEY_W, cur.filter(x=>x!==workshopId));
    return false;
  } else {
    const { error } = await sb.from("workshop_bookmarks").insert({ user_id: user.id, workshop_id: workshopId });
    if (error) {
      const next = [...cur, workshopId]; setLS(KEY_W, next); return true;
    }
    setLS(KEY_W, [...cur, workshopId]);
    return true;
  }
}

export function isBookmarkedArticle(id: string): boolean { return getLS(KEY_A).includes(id); }
export function isBookmarkedWorkshop(id: string): boolean { return getLS(KEY_W).includes(id); }
