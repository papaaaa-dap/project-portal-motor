import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { parts as mockParts } from "@/lib/data/parts";
import { articles as mockArticles, workshops as mockWorkshops, motorProblems as mockProblems, maintenanceRules as mockRules } from "@/lib/data/mocks";
import type { Part, Article, Workshop, MotorProblem, MaintenanceRule, Category } from "@/lib/types";
import { categories as mockCategories } from "@/lib/data/mocks";

function isConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

async function getSupabaseServer() {
  if (!isConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}

// Generic fetch: jika Supabase configured → pakai DB langsung (kosong = kosong, biar admin input real), jika tidak configured → fallback mock
export async function fetchParts(): Promise<Part[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockParts;
  const { data, error } = await supabase.from("parts").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data as unknown as Part[]) ?? [];
}

export async function fetchArticles(): Promise<Article[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockArticles;
  const { data, error } = await supabase.from("articles").select("*").eq("published", true).order("created_at", { ascending: false });
  if (error) return [];
  return (data as Article[]) ?? [];
}

export async function fetchWorkshops(): Promise<Workshop[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockWorkshops;
  const { data, error } = await supabase.from("workshops").select("*").order("rating", { ascending: false });
  if (error) return [];
  return (data ?? []).map((w: Record<string, unknown>) => ({
    id: w.id,
    name: w.name,
    slug: w.slug,
    address: w.address,
    kecamatan: w.kecamatan,
    lat: w.lat as number,
    lng: w.lng as number,
    maps_url: w.maps_url as string,
    jam_operasional: w.jam_operasional as string,
    layanan: w.layanan as string[],
    kontak: w.kontak as string,
    foto_url: w.foto_url as string,
    rating: w.rating as number,
  })) as Workshop[];
}

export async function fetchProblems(): Promise<MotorProblem[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockProblems;
  const { data, error } = await supabase.from("motor_problems").select("*").order("created_at");
  if (error) return [];
  return (data as MotorProblem[]) ?? [];
}

export async function fetchRules(): Promise<MaintenanceRule[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockRules;
  const { data, error } = await supabase.from("maintenance_rules").select("*");
  if (error) return [];
  return (data as MaintenanceRule[]) ?? [];
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return mockCategories;
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data) return mockCategories;
  return (data as Category[]) ?? mockCategories;
}

// Motorcycles per user — requires auth; fallback ke null jika belum login / belum configured
export async function fetchMotorcyclesForUser(): Promise<import("@/lib/types").Motorcycle[] | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from("motorcycles").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return null;
  return (data as unknown as import("@/lib/types").Motorcycle[]) ?? [];
}
