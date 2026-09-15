"use client";
import type { Part, PartCategory } from "@/lib/types";
import { parts as seed } from "@/lib/data/parts";

const KEY = "motorkita_parts_mock";

export function getPartsMock(): Part[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Part[];
    return parsed.length ? parsed : seed;
  } catch { return seed; }
}

export function savePartsMock(list: Part[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addPartMock(p: Part) {
  const list = getPartsMock();
  list.unshift(p);
  savePartsMock(list);
  return list;
}

export function updatePartMock(id: string, patch: Partial<Part>) {
  const list = getPartsMock().map(x=> x.id===id ? { ...x, ...patch } : x);
  savePartsMock(list);
  return list;
}

export function deletePartMock(id: string) {
  const list = getPartsMock().filter(x=> x.id!==id);
  savePartsMock(list);
  return list;
}

export function slugify(s: string){
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

// untuk nanti ganti ke supabase: cukup ganti isi file ini jadi supabase.from('parts') — interface tetap
export const partsRepo = { getPartsMock, savePartsMock, addPartMock, updatePartMock, deletePartMock, slugify };
export type { PartCategory };
