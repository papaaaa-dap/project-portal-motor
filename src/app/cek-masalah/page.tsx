"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProblemsSupabase } from "@/lib/repo/problemsRepo";
import type { MotorProblem } from "@/lib/types";
// NOTE: halaman client — metadata statis didefinisikan di layout induk.
export default function CekMasalah(){
  const [q, setQ]=useState("");
  const [sel, setSel]=useState<string| null>(null);
  const [motorProblems, setMotorProblems]=useState<MotorProblem[]>([]);
  useEffect(()=>{
    fetchProblemsSupabase().then(setMotorProblems).catch(()=>{});
  },[]);
  const filtered = motorProblems.filter(p=> p.title.toLowerCase().includes(q.toLowerCase()) && !p.is_emergency);
  const active = motorProblems.find(p=>p.id===sel);
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="text-sm text-[var(--muted-foreground)]"><Link href="/" className="hover:text-[var(--foreground)]">Home</Link> / <span className="text-[var(--foreground)] font-medium">Cek Masalah</span></div>
      <h1 className="mt-2 text-2xl font-bold">Cek Masalah Motor</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Pilih gejala - kami beri kemungkinan penyebab, langkah awal, dan arahkan ke bengkel terdekat. <span className="font-semibold text-[var(--foreground)]">Bukan diagnosis profesional.</span></p>
      <div className="mt-4 bg-[var(--muted)] border border-[var(--border)] p-3 rounded-lg text-xs text-[var(--foreground)]">Jika ragu atau kondisi darurat, langsung ke <Link href="/panduan-darurat" className="underline font-semibold">Panduan Darurat</Link> atau bengkel.</div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari gejala: sulit nyala, gredek, rem..." className="mt-4 w-full max-w-xl h-10 border rounded-full px-4 bg-[var(--card)] text-[var(--foreground)]"/>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {filtered.map(p=>(
            <button key={p.id} onClick={()=>setSel(p.id)} className={`w-full text-left p-4 rounded-xl border ${sel===p.id?"bg-[var(--foreground)] text-[var(--background)]":"bg-[var(--card)] hover:bg-[var(--muted)]"}`}>
              <div className="font-semibold text-sm">{p.title}</div>
              <div className={`text-xs mt-1 ${sel===p.id?"opacity-60":"text-[var(--muted-foreground)]"}`}>{p.gejala.slice(0,2).join(" • ")}</div>
            </button>
          ))}
          {filtered.length===0 && <p className="text-sm text-[var(--muted-foreground)]">Tidak ada gejala cocok. Coba kata lain atau buka Panduan Darurat.</p>}
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 min-h-[300px]">
          {!active ? <p className="text-sm text-[var(--muted-foreground)]">Pilih gejala di kiri untuk melihat hasil.</p> : (
            <div>
              <h3 className="font-bold">{active.title}</h3>
              <h4 className="mt-4 text-sm font-semibold">Kemungkinan Penyebab</h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-[var(--muted-foreground)]">{active.penyebab.map(s=> <li key={s}>{s}</li>)}</ul>
              <h4 className="mt-4 text-sm font-semibold">Langkah Awal</h4>
              <ol className="mt-1 list-decimal pl-5 text-sm text-[var(--muted-foreground)]">{active.langkah.map(s=> <li key={s}>{s}</li>)}</ol>
              <div className="mt-6 flex gap-2">
                <Link href="/bengkel" className="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-sm font-bold hover:opacity-90 transition">Cari Bengkel Terdekat →</Link>
                <Link href={`/panduan-darurat#${active.slug}`} className="px-4 py-2 rounded-full border bg-[var(--card)] text-sm">Panduan Darurat</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
