"use client";
import type { Workshop } from "@/lib/types";
import { workshops as seed } from "@/lib/data/mocks";
const KEY = "motorkita_workshops_mock";
export function getWorkshopsMock(): Workshop[] {
  if (typeof window === "undefined") return seed;
  try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const p = JSON.parse(raw) as Workshop[]; return p.length ? p : seed; } catch { return seed; }
}
export function saveWorkshopsMock(list: Workshop[]) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list)); }
export function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
