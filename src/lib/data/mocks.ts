import type { Article, Category, MaintenanceRule, MotorProblem, Workshop } from "@/lib/types";

export const categories: Category[] = [
  { id: "1", name: "Oli", slug: "oli", type: "perawatan" },
  { id: "2", name: "Mesin", slug: "mesin", type: "perawatan" },
  { id: "3", name: "CVT", slug: "cvt", type: "perawatan" },
  { id: "4", name: "Rem", slug: "rem", type: "perawatan" },
  { id: "5", name: "Ban", slug: "ban", type: "perawatan" },
  { id: "6", name: "Aki", slug: "aki", type: "perawatan" },
  { id: "7", name: "Rantai", slug: "rantai", type: "perawatan" },
  { id: "8", name: "Kelistrikan", slug: "kelistrikan", type: "perawatan" },
  { id: "9", name: "Pengetahuan", slug: "pengetahuan", type: "edukasi" },
  { id: "10", name: "Mengenal Komponen", slug: "komponen", type: "edukasi" },
  { id: "11", name: "Tips Merawat", slug: "tips-merawat", type: "edukasi" },
  { id: "12", name: "Tips Berkendara", slug: "tips-berkendara", type: "edukasi" },
];

// B — 100% Supabase: dummy kosong, input real via /admin
export const articles: Article[] = [];
export const workshops: Workshop[] = [];
export const motorProblems: MotorProblem[] = [];

export const maintenanceRules: MaintenanceRule[] = [
  { id: "r1", motor_type: "all", category: "Oli", interval_km: 2000, interval_days: 60, title: "Ganti Oli Mesin", description: "Wajib 2.000km/2 bulan. Pakai SAE & JASO sesuai buku manual. Telat = tarikan berat, overheat. Lihat Katalog Oli untuk harga & pilihan." },
  { id: "r2", motor_type: "matic", category: "CVT", interval_km: 8000, interval_days: 180, title: "Servis CVT", description: "Bongkar, bersihkan roller/peyang, kampas ganda, vanbelt. Kuras grease. Ganti vanbelt tiap 20.000km. Jangan semprot air bertekanan ke CVT." },
  { id: "r3", motor_type: "all", category: "Rem", interval_km: 5000, interval_days: 90, title: "Cek Kampas & Minyak Rem", description: "Kampas <2mm wajib ganti. Minyak DOT3/4, kuras tiap 20.000km. Cakram bergelombang = bubut/ganti. Rem blong cek langsung." },
  { id: "r4", motor_type: "all", category: "Ban", interval_km: 10000, interval_days: 180, title: "Cek Ban & Tekanan", description: "Tekanan: depan 29-33 psi, belakang 33-36 psi (boncengan naik 2 psi). Kembang <1.6mm atau retak = ganti. Tubeless pakai cairan anti bocor." },
  { id: "r5", motor_type: "all", category: "Aki", interval_km: 15000, interval_days: 365, title: "Cek Aki & Kelistrikan", description: "Aki kering 1.5-2 tahun. Voltase idle 12.4V+, saat hidup 13.5-14.5V. Bersihkan terminal, cek kiprok jika lampu sering putus." },
  { id: "r6", motor_type: "manual", category: "Rantai", interval_km: 3000, interval_days: 60, title: "Setel & Lumasi Rantai", description: "Kendor 20-30mm. Lumasi chain lube tiap 500km, jangan pakai oli bekas. Gir runcing/tajam = ganti 1 set (gir depan-belakang + rantai)." },
  { id: "r7", motor_type: "all", category: "Servis Berkala", interval_km: 4000, interval_days: 90, title: "Servis Berkala", description: "Tune up: bersihkan TB/injektor, cek busi (gap 0.7-0.8mm), filter udara, coolant, dan baut rangka. Minta rincian sebelum setuju." },
];

export function searchAll(query: string) {
  const q = query.toLowerCase();
  const art = articles.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  const bengkel = workshops.filter(w => w.name.toLowerCase().includes(q) || w.layanan.some(l => l.toLowerCase().includes(q)) || w.kecamatan.toLowerCase().includes(q));
  const masalah = motorProblems.filter(m => m.title.toLowerCase().includes(q));
  return { art, bengkel, masalah };
}
