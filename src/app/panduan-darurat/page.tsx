import Link from "next/link";
import type { Metadata } from "next";
import { fetchProblems } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Panduan Darurat Motor — Mogok, Ban Bocor, Overheat di Jalan",
  description: "Mogok di jalan? Langkah 3-tap saat ban bocor, rem blong, overheat, kehabisan bensin + cari tambal ban & bengkel 24 jam terdekat Surabaya. Bisa dibaca offline.",
  alternates: { canonical: "/panduan-darurat" },
  openGraph: { title: "Panduan Darurat Motor — Motorkita", description: "Mogok? Jangan panik. Langkah cepat + bengkel terdekat.", type: "website" },
};
export default async function Darurat(){
  const motorProblems = await fetchProblems().catch(() => []);
  const list = motorProblems.filter(p=>p.is_emergency);
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="text-sm text-[var(--muted-foreground)]"><Link href="/" className="hover:text-[var(--foreground)]">Home</Link> / <span className="text-[var(--foreground)] font-bold">Panduan Darurat</span></div>
      <div className="mt-3 bg-[#0A0A0A] text-white rounded-xl p-6">
        <h1 className="text-2xl font-black">Panduan Darurat</h1>
        <p className="text-neutral-300 text-sm mt-1">Pilih masalah → baca langkah awal → cari layanan terdekat. Selalu utamakan keselamatan, menepi di tempat aman.</p>
      </div>
      <div className="mt-6 space-y-4">
        {list.map(p=>(
          <div key={p.id} id={p.slug} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="font-bold text-[var(--foreground)]">{p.title}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{p.category} • Gejala: {p.gejala.join(", ")}</p>
            <div className="mt-3">
              <h4 className="text-sm font-semibold">Langkah Awal</h4>
              <ol className="list-decimal pl-5 text-sm text-[var(--muted-foreground)] mt-1">{p.langkah.map(s=> <li key={s}>{s}</li>)}</ol>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/bengkel" className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold hover:bg-black transition">Cari Bengkel/Layanan Terdekat →</Link>
              <Link href="/cek-masalah" className="px-4 py-2 rounded-full border bg-[var(--card)] text-sm">Cek Masalah Lain</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
