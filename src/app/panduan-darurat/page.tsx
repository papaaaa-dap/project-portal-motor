import Link from "next/link";
import { motorProblems } from "@/lib/data/mocks";
export default function Darurat(){
  const list = motorProblems.filter(p=>p.is_emergency);
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-neutral-900 font-bold">Panduan Darurat</span></div>
      <div className="mt-3 bg-neutral-900 text-white rounded-xl p-6">
        <h1 className="text-2xl font-black">Panduan Darurat</h1>
        <p className="text-neutral-300 text-sm mt-1">Pilih masalah → baca langkah awal → cari layanan terdekat. Selalu utamakan keselamatan, menepi di tempat aman.</p>
      </div>
      <div className="mt-6 space-y-4">
        {list.map(p=>(
          <div key={p.id} id={p.slug} className="bg-white border border-neutral-200 rounded-xl p-5">
            <h3 className="font-bold text-neutral-900">{p.title}</h3>
            <p className="text-xs text-neutral-500 mt-1">{p.category} • Gejala: {p.gejala.join(", ")}</p>
            <div className="mt-3">
              <h4 className="text-sm font-semibold">Langkah Awal</h4>
              <ol className="list-decimal pl-5 text-sm text-neutral-600 mt-1">{p.langkah.map(s=> <li key={s}>{s}</li>)}</ol>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/bengkel" className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold hover:bg-black transition">Cari Bengkel/Layanan Terdekat →</Link>
              <Link href="/cek-masalah" className="px-4 py-2 rounded-full border bg-white text-sm">Cek Masalah Lain</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
