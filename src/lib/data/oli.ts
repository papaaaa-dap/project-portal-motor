import { parts } from "./parts";
import type { Part } from "@/lib/types";

// legacy alias — katalog sekarang pakai parts, oliList tetap untuk compat
export type Oli = Part;
export const oliList: Part[] = parts.filter(p=> p.category==="oli-mesin");

export const faqs = [
  { q: "Berapa km ganti oli ideal di Surabaya?", a: "Matic harian macet: 2000km / 2 bulan. Manual: 2500-3000km. Jika sering macet parah atau sering hujan-panas, majukan 500km lebih awal. Cek warna oli: jika sudah hitam pekat + tarikan berat, jangan tunda." },
  { q: "Matic pakai oli manual boleh?", a: "Jangan. Matic pakai JASO MB (tanpa friction modifier kopling), manual pakai JASO MA/MA2. Jika matic pakai MA, tarikan berat dan boros. Jika manual pakai MB, kopling bisa selip." },
  { q: "Oli 0.8L vs 1L bedanya apa?", a: "Matic kecil (BeAT, Scoopy, Mio) butuh 0.8L. Matic besar (NMAX, PCX, XMAX) dan manual 150cc butuh 1L. Selalu cek deepstick, jangan kelebihan — mesin jadi berat dan seal bisa rembes." },
  { q: "Boleh campur merek oli?", a: "Darurat boleh asal SAE & JASO sama, tapi kuras total di servis berikutnya. Idealnya satu merek & satu base (jangan campur mineral + full sintetik terus-menerus)." },
  { q: "Oli mahal pasti lebih bagus?", a: "Tidak selalu. Cocokkan dengan motor & pemakaian. Untuk harian 20-40km/hari, semi sintetik 60-90rb sudah cukup. Full sintetik baru terasa untung jika touring atau RPM tinggi sering." },
  { q: "Bagaimana cara cek bengkel punya stok?", a: "Di tiap kartu part ada daftar bengkel yang jual. Klik bengkel untuk lihat alamat, jam buka, dan tombol Navigasi langsung ke Google Maps. Hubungi dulu sebelum berangkat." },
];
