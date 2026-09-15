"use client";
import { useState } from "react";
import Link from "next/link";
import { motorProblems } from "@/lib/data/mocks";
export default function CekMasalah(){
  const [q, setQ]=useState("");
  const [sel, setSel]=useState<string| null>(null);
  const filtered = motorProblems.filter(p=> p.title.toLowerCase().includes(q.toLowerCase()) && !p.is_emergency);
  const active = motorProblems.find(p=>p.id===sel);
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Cek Masalah</span></div>
      <h1 className="mt-2 text-2xl font-bold">Cek Masalah Motor</h1>
      <p className="text-sm text-neutral-500">Pilih gejala - kami beri kemungkinan penyebab, langkah awal, dan arahkan ke bengkel terdekat. <span className="font-semibold text-neutral-900">Bukan diagnosis profesional.</span></p>
      <div className="mt-4 bg-neutral-100 border border-neutral-200 p-3 rounded-lg text-xs text-neutral-900">Jika ragu atau kondisi darurat, langsung ke <Link href="/panduan-darurat" className="underline font-semibold">Panduan Darurat</Link> atau bengkel.</div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari gejala: sulit nyala, gredek, rem..." className="mt-4 w-full max-w-xl h-10 border rounded-full px-4 bg-white"/>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {filtered.map(p=>(
            <button key={p.id} onClick={()=>setSel(p.id)} className={`w-full text-left p-4 rounded-xl border ${sel===p.id?"bg-neutral-900 text-white":"bg-white hover:bg-neutral-50"}`}>
              <div className="font-semibold text-sm">{p.title}</div>
              <div className={`text-xs mt-1 ${sel===p.id?"text-neutral-300":"text-neutral-500"}`}>{p.gejala.slice(0,2).join(" • ")}</div>
            </button>
          ))}
          {filtered.length===0 && <p className="text-sm text-neutral-500">Tidak ada gejala cocok. Coba kata lain atau buka Panduan Darurat.</p>}
        </div>
        <div className="bg-white border rounded-xl p-5 min-h-[300px]">
          {!active ? <p className="text-sm text-neutral-500">Pilih gejala di kiri untuk melihat hasil.</p> : (
            <div>
              <h3 className="font-bold">{active.title}</h3>
              <h4 className="mt-4 text-sm font-semibold">Kemungkinan Penyebab</h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-neutral-600">{active.penyebab.map(s=> <li key={s}>{s}</li>)}</ul>
              <h4 className="mt-4 text-sm font-semibold">Langkah Awal</h4>
              <ol className="mt-1 list-decimal pl-5 text-sm text-neutral-600">{active.langkah.map(s=> <li key={s}>{s}</li>)}</ol>
              <div className="mt-6 flex gap-2">
                <Link href="/bengkel" className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold hover:bg-black transition">Cari Bengkel Terdekat →</Link>
                <Link href={`/panduan-darurat#${active.slug}`} className="px-4 py-2 rounded-full border bg-white text-sm">Panduan Darurat</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
