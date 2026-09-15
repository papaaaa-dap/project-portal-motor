# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pengendara motor harian Indonesia — matic, manual, kopling, 18–45th, dari pemula sampai enthusiast. Job utama: (1) memahami gejala masalah motor tanpa harus ke bengkel dulu, (2) merawat motor rutin agar awet/irit, (3) menemukan bengkel/layanan terdekat secepat mungkin saat darurat atau servis berkala. Coverage awal Surabaya (seed 12 bengkel) tapi dirancang untuk skala nasional — tidak terbatas Surabaya.

Audiens sekunder: admin CMS yang kurasi artikel, bengkel, dan masalah motor.

## Product Purpose

RideIn adalah portal perawatan sepeda motor 3-in-1: edukasi + perawatan + discovery bengkel/layanan. Satu tempat untuk memahami, merawat, dan menemukan kebutuhan motor — tanpa harus login untuk konsumsi informasi. Login hanya untuk personalisasi: Motor Saya (N motor), riwayat/ reminder servis, dan bookmark. Sukses = user bisa cek masalah awal, dapat langkah darurat, temukan bengkel terdekat dengan navigasi, dan kembali rutin karena reminder perawatan yang tepat.

## Positioning

Satu tempat untuk memahami, merawat, dan menemukan kebutuhan motor — 3-in-1 yang Google Maps / bengkel biasa tidak beri secara terintegrasi. Mekanisme beda: konten perawatan terkurasi per kategori (oli, CVT, rem, ban, dll) + diagnosis gejala/penyebab/langkah + peta bengkel dengan filter layanan & jarak real-time + rule-based rekomendasi perawatan per tipe motor. Bukan direktori bengkel saja, bukan blog otomotif saja.

## Operating Context

- Penggunaan: mobile-first di jalan (darurat ban bocor/mogok/overheat) dan desktop untuk baca artikel edukasi. Lingkungan bising, sinyal tidak stabil, butuh scan cepat.
- Workflow: cari/klik shortcut → baca artikel / cek masalah → filter bengkel → hitung jarak via geolocation → navigasi ke Google Maps.
- Ritual: servis berkala 2000–8000km, cek tekanan ban mingguan, servis CVT matic.
- Context awal: data dev dari `src/lib/data/mocks.ts` sebelum Supabase aktif; produksi akan pakai Supabase (Postgres + RLS).

## Capabilities and Constraints

Confirmed:
- Katalog perawatan & edukasi dengan kategori (perawatan: oli/mesin/CVT/rem/ban/aki/rantai/kelistrikan; edukasi: tips/pengetahuan/FAQ), pagination, search `ilike`.
- Bengkel discovery: list + peta Leaflet (`react-leaflet` + `leaflet`), filter layanan (Bengkel/Tambal Ban/Cuci Motor/dll), sort by distance via haversine, navigasi `maps.google.com/?q=lat,lng`.
- Layanan agregat, cek-masalah & panduan-darurat berbasis `motor_problems` (gejala/penyebab/langkah, flag `is_emergency`).
- Motor Saya: kelola N motor (brand/model/year/type/cc/kilometer/last_service), rule-based rekomendasi (`maintenance_rules` per `motor_type`), pengingat oli 2000km.
- Search global (artikel + bengkel + masalah), admin CMS placeholder, auth via Supabase (proteksi `/motor-saya` & `/admin`).

Constraints:
- Stack incumbent: Next.js 16.3.4 (App Router, Turbopack), React 19, Tailwind 4, Supabase (`@supabase/ssr` + `@supabase/supabase-js`), Leaflet. Build harus `next build` lolos.
- Data geo awal Surabaya, ekspansi nasional harus tanpa refactor skema.
- Akses katalog publik tanpa login; RLS untuk `motorcycles/bookmarks/maintenance_records`.

Undecided: pricing/monetisasi bengkel, verifikasi rating bengkel, notifikasi push untuk reminder.

## Brand Commitments

Nama Ridein + tagline "Save Your Bike, Save Your Time" dipertahankan sebagai identitas. Tidak ada palet/font/logo yang mengikat — bebas redesign total. Voice sebelumnya: informatif, cepat, menenangkan saat darurat (tidak teknis berlebihan).

## Evidence on Hand

- Codebase Next.js di `src/app/*` (15 routes), `src/components/*`, `src/lib/data/mocks.ts` (12 articles, 12 workshops Surabaya, 8 motorProblems, 7 maintenanceRules), `supabase/schema.sql` + `supabase/seed.sql`.
- Aset foto `images.unsplash.com` untuk cover artikel & workshop (placeholder).
- Bukti interaksi: shortcut hero 6 kartu, filter kategori, peta + jarak km, CTA Motor Saya.
- Absen: testimoni real, data bengkel nasional, analytics, brand guide final — jangan difabrikasi.

## Product Principles

1. Darurat dulu, edukasi kemudian — saat mogok/ban bocor, jarak & langkah 3-tap lebih penting dari artikel panjang.
2. Tanpa login tetap berguna — personalisasi adalah bonus, bukan paywall untuk informasi dasar.
3. Jarak jujur & langkah actionable — tampilkan km real, jam operasional, dan langkah yang bisa dilakukan awam tanpa alat khusus.
4. Rule-based yang transparan — rekomendasi servis tampilkan interval km/hari + alasan, bukan black box.
5. Skala dari Surabaya ke nasional tanpa pecah skema — kategori & layanan dirancang generik, bukan hardcode kecamatan.

## Accessibility & Inclusion

Mobile-first, kontras tinggi untuk outdoor, tap target ≥44px, readable saat panik. Bahasa Indonesia; istilah teknis dijelaskan. Peta harus punya fallback list saat geolocation ditolak. Target WCAG AA untuk teks & fokus; tidak ada kebutuhan native khusus — web only.
