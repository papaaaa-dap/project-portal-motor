"use client";
import type { Article } from "@/lib/types";
import { articles as seed } from "@/lib/data/mocks";
const KEY = "motorkita_articles_mock";
export function getArticlesMock(): Article[] {
  if (typeof window === "undefined") return seed;
  try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const p = JSON.parse(raw) as Article[]; return p.length ? p : seed; } catch { return seed; }
}
export function saveArticlesMock(list: Article[]) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list)); }
export function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
