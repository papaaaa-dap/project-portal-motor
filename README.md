# Motorkita — Portal Perawatan Motor 3-in-1

> **Save Your Bike, Save Your Time.**
> Satu tempat untuk **memahami, merawat, dan menemukan** kebutuhan motor — tanpa login, langsung pakai.

Live: **https://motorkita.my.id** · Coverage awal: **Surabaya** (dirancang skala nasional)

![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?logo=supabase)
![Leaflet](https://img.shields.io/badge/Map-Leaflet-green?logo=leaflet)

---

## Fitur Utama

### 1. Edukasi & Perawatan
- Katalog artikel perawatan: oli/mesin, CVT, rem, ban, aki, rantai, kelistrikan
- Edukasi: tips, pengetahuan, FAQ
- Search `ilike`, filter kategori, pagination
- Halaman detail `/perawatan/[slug]`, `/edukasi`, `/oli`, `/sparepart`

### 2. Cek Masalah & Panduan Darurat
- Diagnosis gejala → penyebab → langkah penanganan (`motor_problems`)
- Flag `is_emergency` untuk kasus mogok / ban bocor / overheat
- Panduan darurat 3-tap, mobile-first untuk kondisi di jalan
- Routes: `/cek-masalah`, `/panduan-darurat`

### 3. Discovery Bengkel / Layanan
- List + peta interaktif (Leaflet + react-leaflet)
- 274+ bengkel Surabaya ter-geocoded (Bengkel, Tambal Ban, Cuci Motor)
- Filter layanan, sortir jarak real-time (haversine + geolocation)
- Navigasi 1-klik ke Google Maps (`maps.google.com/?q=lat,lng`)
- Fallback list saat geolocation ditolak
- Routes: `/bengkel`, `/bengkel/[id]`, `/layanan`

### 4. Motor Saya (butuh login)
- Kelola N motor: brand / model / tahun / tipe / cc / kilometer / servis terakhir
- Rekomendasi rule-based transparan (`maintenance_rules` per `motor_type`)
- Pengingat oli tiap 2000 km, servis CVT, dll
- Bookmark artikel & bengkel, riwayat servis
- Routes: `/motor-saya`, `/login`, `/register` — proteksi via Supabase Auth + middleware

### 5. Lainnya
- Search global: artikel + bengkel + masalah (`/search`)
- Admin CMS: kurasi artikel, bengkel, masalah (`/admin`)
- SEO: sitemap, robots, JSON-LD, OpenGraph, canonical `motorkita.my.id`
- PWA: manifest + service worker, halaman `/offline`

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16.3.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Database & Auth | Supabase (Postgres + RLS, `@supabase/ssr` + `@supabase/supabase-js`) |
| Peta | Leaflet 1.9 + react-leaflet 5 |
| Bahasa | TypeScript 5 |
| Lint | ESLint 9 + eslint-config-next |

Fallback data lokal di `src/lib/data/mocks.ts` — aplikasi tetap jalan tanpa Supabase (mode dev).

---

## Struktur Proyek

```
motoku/
├── src/
│   ├── app/                  # App Router (24 routes)
│   │   ├── page.tsx          # Homepage
│   │   ├── bengkel/          # List + detail bengkel + peta
│   │   ├── katalog/          # Katalog artikel
│   │   ├── perawatan/[slug]/ # Detail perawatan
│   │   ├── edukasi/          # Artikel edukasi
│   │   ├── oli/ sparepart/   # Katalog produk + harga Surabaya
│   │   ├── cek-masalah/      # Diagnosis gejala
│   │   ├── panduan-darurat/  # Langkah darurat
│   │   ├── motor-saya/       # Dashboard user (protected)
│   │   ├── admin/            # CMS admin (protected)
│   │   ├── search/           # Search global
│   │   ├── login/ register/ auth/
│   │   ├── sitemap.ts robots.ts manifest.ts
│   │   └── layout.tsx globals.css
│   ├── components/           # Navbar, Footer, Card, SearchBar, FaqAccordion, Map, dll
│   └── lib/
│       ├── data/mocks.ts     # Data dev (12 artikel, 12 bengkel, 8 problems, 7 rules)
│       └── supabase/         # client, server, queries
├── supabase/
│   ├── schema.sql            # Skema utama — jalankan pertama
│   └── seed*.sql             # Seed artikel, bengkel 274, oli, sparepart, problems
├── public/                   # logo-motorkita.png, motor1-4.jpeg, sw.js
├── middleware.ts             # Proteksi /motor-saya & /admin
└── next.config.ts
```

---

## Cara Jalan Lokal

### 1. Prasyarat
- Node.js 20+
- npm (atau pnpm / yarn / bun)
- Akun Supabase gratis (opsional untuk mode full, tanpa ini tetap jalan pakai mock)

### 2. Install
```bash
git clone https://github.com/papaaaa-dap/project-portal-motor.git
cd project-portal-motor/motoku
# atau jika clone dari root repo ini langsung:
npm install
```

### 3. Environment
```bash
cp .env.example .env.local
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Tanpa Supabase pun bisa jalan — app otomatis fallback ke `mocks.ts`. Untuk verifikasi build lokal tanpa Supabase, kosongkan saja variabel di atas.

### 4. Setup Supabase (untuk data asli)
1. Buat project di [supabase.com](https://supabase.com)
2. Copy URL & anon key dari Settings > API
3. Di Supabase SQL Editor, jalankan berurutan:
   - `supabase/schema.sql` (wajib pertama)
   - `supabase/seed.sql`
   - Seed tambahan sesuai kebutuhan:
     - `seed_workshops_all_274_geocoded.sql` — 274 bengkel Surabaya
     - `seed_articles_workshops.sql`, `seed_oli_excel.sql`, `seed_parts_excel_120.sql`, `seed_problems_excel_52.sql`, `seed_motor_specs_100.sql`, dll

### 5. Jalankan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000).

### Scripts
```bash
npm run dev    # dev + Turbopack
npm run build  # production build (wajib lolos sebelum push)
npm run start  # serve hasil build
npm run lint   # eslint
```

---

## Deploy

### Vercel (recommended)
1. Push repo ke GitHub
2. Import di Vercel → set env `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL=https://motorkita.my.id`
3. Deploy — `next build` otomatis

### Domain
Canonical production: `https://motorkita.my.id`. Jangan pakai `motorkita.id` (milik pihak lain) — sudah dinormalisasi di `src/app/layout.tsx`.

---

## Prinsip Produk

1. **Darurat dulu, edukasi kemudian** — jarak & langkah 3-tap lebih penting dari artikel panjang
2. **Tanpa login tetap berguna** — login hanya untuk Motor Saya / bookmark / reminder
3. **Jarak jujur & langkah actionable** — km real, jam operasional, langkah awam tanpa alat khusus
4. **Rule-based transparan** — tampilkan interval km/hari + alasan
5. **Skala Surabaya → nasional tanpa pecah skema**

Mobile-first, kontras tinggi untuk outdoor, tap target ≥44px, Bahasa Indonesia.

---

## Kontribusi

```bash
git checkout -b feat/nama-fitur
npm run build   # pastikan lolos
npm run lint
git commit -m "feat: deskripsi singkat"
git push origin feat/nama-fitur
```

Lalu buka Pull Request ke `master`.

---

## Lisensi

Private — © Motorkita. All rights reserved.
