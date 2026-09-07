import Link from "next/link";
import { articles, workshops, motorProblems } from "@/lib/data/mocks";
export default function Admin(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">CMS Admin - MotoKu</h1>
      <p className="text-sm text-neutral-500">MVP: CRUD sederhana. Supabase RLS role `admin` akan proteksi route ini.</p>
      <div className="mt-4 p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-xs">Login sebagai <b>admin@motoku.id</b> untuk bypass. Sementara mock data - connect Supabase untuk persist.</div>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-bold">Artikel ({articles.length})</h3>
          <ul className="mt-2 text-sm space-y-1 max-h-64 overflow-auto">{articles.map(a=> <li key={a.id} className="flex justify-between border-b py-1"><span className="truncate pr-2">{a.title}</span><span className="text-xs text-neutral-500">{a.slug}</span></li>)}</ul>
          <button className="mt-3 w-full h-8 rounded-full bg-neutral-900 text-white text-sm">+ Tambah Artikel</button>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-bold">Bengkel ({workshops.length})</h3>
          <ul className="mt-2 text-sm space-y-1 max-h-64 overflow-auto">{workshops.map(w=> <li key={w.id} className="flex justify-between border-b py-1"><span className="truncate pr-2">{w.name}</span><span className="text-xs text-neutral-500">{w.kecamatan}</span></li>)}</ul>
          <button className="mt-3 w-full h-8 rounded-full bg-neutral-900 text-white text-sm">+ Tambah Bengkel</button>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-bold">Masalah ({motorProblems.length})</h3>
          <ul className="mt-2 text-sm space-y-1 max-h-64 overflow-auto">{motorProblems.map(m=> <li key={m.id} className="flex justify-between border-b py-1"><span className="truncate pr-2">{m.title}</span><span className={`text-xs px-1 rounded ${m.is_emergency?"bg-red-100 text-neutral-900":"bg-slate-100"}`}>{m.is_emergency?"darurat":"biasa"}</span></li>)}</ul>
          <button className="mt-3 w-full h-8 rounded-full bg-neutral-900 text-white text-sm">+ Tambah Masalah</button>
        </div>
      </div>
      <div className="mt-6">
        <Link href="/" className="text-sm text-neutral-900 hover:underline">← Kembali ke Home</Link>
      </div>
    </div>
  );
}
