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
  { id: "r1", motor_type: "all", category: "Oli", interval_km: 3000, interval_days: 60, title: "Ganti Oli Mesin", description: "Rutin 3.000km / 2 bulan. Pakai SAE & standar JASO (MB untuk matic, MA untuk manual) sesuai buku manual agar mesin awet." },
  { id: "r2", motor_type: "matic", category: "CVT", interval_km: 8000, interval_days: 180, title: "Servis & Pembersihan CVT", description: "Pembersihan rutin ruang CVT dari debu, cek keausan roller & kampas ganda, serta pemberian grease CVT. (Bukan ganti part)." },
  { id: "r2b", motor_type: "matic", category: "CVT", interval_km: 20000, interval_days: 360, title: "Penggantian V-Belt CVT", description: "Penggantian sabuk V-Belt baru sesuai buku manual resmi pabrikan (tiap 20.000-24.000 km) untuk mencegah tali CVT putus di jalan." },
  { id: "r3", motor_type: "all", category: "Rem", interval_km: 5000, interval_days: 90, title: "Cek Kampas & Minyak Rem", description: "Kampas rem <2mm wajib ganti. Kuras minyak rem tiap 20.000km atau 2 tahun." },
  { id: "r4", motor_type: "all", category: "Ban", interval_km: 10000, interval_days: 180, title: "Cek Ban & Tekanan Ukuran", description: "Cek kedalaman alur kembang ban (<1.6mm wajib ganti). Tekanan ideal: Depan 29-33 psi, Belakang 33-36 psi." },
  { id: "r5", motor_type: "all", category: "Aki", interval_km: 15000, interval_days: 365, title: "Cek Aki & Kelistrikan", description: "Pemeriksaan kesehatan aki (umur ideal 1.5 - 2 tahun) dan tegangan pengisian kiprok/stator." },
  { id: "r6", motor_type: "manual", category: "Rantai", interval_km: 1000, interval_days: 30, title: "Pelumasan & Setel Rantai", description: "Lumasi rantai dengan chain lube tiap 500-1.000 km. Setel kekencangan rantai (toleransi kendur 20-30 mm)." },
  { id: "r7", motor_type: "all", category: "Servis Berkala", interval_km: 4000, interval_days: 90, title: "Servis Berkala (Tune Up)", description: "Pembersihan Throttle Body/Injektor, cek celah busi, filter udara, dan air radiator coolant." },
];

export function searchAll(query: string) {
  const q = query.toLowerCase();
  const art = articles.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  const bengkel = workshops.filter(w => w.name.toLowerCase().includes(q) || w.layanan.some(l => l.toLowerCase().includes(q)) || w.kecamatan.toLowerCase().includes(q));
  const masalah = motorProblems.filter(m => m.title.toLowerCase().includes(q));
  return { art, bengkel, masalah };
}
