import Link from "next/link";

export const metadata = {
  title: "Offline — Mode Darurat",
  description: "Tidak ada koneksi. Panduan darurat yang sudah dibuka tetap bisa dibaca.",
};

// Halaman statis tanpa fetch — aman di-cache service worker untuk mode offline.
export default function Offline() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 text-center">
      <div className="mono text-[11px] font-black tracking-[0.14em] bg-[#0A0A0A] text-white px-3 py-1 rounded-full w-fit mx-auto">MODE OFFLINE</div>
      <h1 className="mt-4 text-2xl font-black tracking-tight">Tidak ada koneksi.</h1>
      <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
        Kalau halaman <b>Panduan Darurat</b> atau <b>Cek Masalah</b> pernah dibuka saat online, halaman itu tetap bisa
        dibaca offline lewat tombol kembali di browser.
      </p>
      <div className="mt-6 grid gap-2 text-left text-sm">
        {[
          ["1. Menepi aman", "Nyalakan hazard, standar tengah, matikan mesin 5–15 menit jika overheat."],
          ["2. Ban bocor", "Tubeless: cari paku, jangan dicabut. Cari tambal ban terdekat setelah sinyal kembali."],
          ["3. Mogok total", "Cek bensin → aki (klakson/lampu) → busi. Minta tolong pengendara lain / ojek dorong."],
        ].map(([t, d]) => (
          <div key={t} className="bg-white border rounded-xl p-3">
            <div className="font-bold">{t}</div>
            <div className="text-neutral-600 text-[13px] mt-0.5">{d}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-2 justify-center">
        <Link href="/panduan-darurat" className="h-11 px-6 rounded-full bg-[#0A0A0A] text-white mono text-xs font-black grid place-items-center">COBA PANDUAN DARURAT</Link>
        <Link href="/" className="h-11 px-6 rounded-full border bg-white mono text-xs font-bold grid place-items-center">BERANDA</Link>
      </div>
    </div>
  );
}
