"use client";
import type { MotorProblem } from "@/lib/types";
import { motorProblems as seed } from "@/lib/data/mocks";
const KEY = "motorkita_problems_mock";
export function getProblemsMock(): MotorProblem[] {
  if (typeof window === "undefined") return seed;
  try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const p = JSON.parse(raw) as MotorProblem[]; return p.length ? p : seed; } catch { return seed; }
}
export function saveProblemsMock(list: MotorProblem[]) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list)); }
export function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
