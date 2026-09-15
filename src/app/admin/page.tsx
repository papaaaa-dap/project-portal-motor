"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { articles as seedArticles, workshops as seedWorkshops, motorProblems as seedProblems } from "@/lib/data/mocks";
import { parts as seed } from "@/lib/data/parts";
import type { Part, Workshop, Article, MotorProblem } from "@/lib/types";
import PartForm from "@/components/admin/PartForm";
import WorkshopForm from "@/components/admin/WorkshopForm";
import ArticleForm from "@/components/admin/ArticleForm";
import ProblemForm from "@/components/admin/ProblemForm";
import { getPartsMock, savePartsMock } from "@/lib/repo/partsRepo";
import { getWorkshopsMock, saveWorkshopsMock } from "@/lib/repo/workshopsRepo";
import { getArticlesMock, saveArticlesMock } from "@/lib/repo/articlesRepo";
import { getProblemsMock, saveProblemsMock } from "@/lib/repo/problemsRepo";

const TABS = ["Katalog","Bengkel","Artikel","Masalah"] as const;

export default function Admin(){
  const [tab, setTab] = useState<typeof TABS[number]>("Katalog");
  const [list, setList] = useState<Part[]>(seed);
  const [wList, setWList] = useState<Workshop[]>(seedWorkshops);
  const [aList, setAList] = useState<Article[]>(seedArticles);
  const [pList, setPList] = useState<MotorProblem[]>(seedProblems);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [showForm, setShowForm] = useState<null|"part"|"bengkel"|"artikel"|"masalah">(null);
  const [editingPart, setEditingPart] = useState<Part|null>(null);
  const [editingW, setEditingW] = useState<Workshop|null>(null);
  const [editingA, setEditingA] = useState<Article|null>(null);
  const [editingP, setEditingP] = useState<MotorProblem|null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    setList(getPartsMock());
    setWList(getWorkshopsMock());
    setAList(getArticlesMock());
    setPList(getProblemsMock());
    setIsAdmin(localStorage.getItem("motorkita_admin")==="true");
  },[]);

  const persistPart = (next: Part[])=>{ setList(next); savePartsMock(next); };
  const persistW = (next: Workshop[])=>{ setWList(next); saveWorkshopsMock(next); };
  const persistA = (next: Article[])=>{ setAList(next); saveArticlesMock(next); };
  const persistP = (next: MotorProblem[])=>{ setPList(next); saveProblemsMock(next); };

  const handleSavePart = (p: Part)=>{
    const exists = list.find(x=> x.id===p.id);
    const next = exists ? list.map(x=> x.id===p.id ? p : x) : [p, ...list];
    persistPart(next);
  };
  const handleSaveW = (w: Workshop)=>{
    const exists = wList.find(x=> x.id===w.id);
    const next = exists ? wList.map(x=> x.id===w.id ? w : x) : [w, ...wList];
    persistW(next);
  };
  const handleSaveA = (a: Article)=>{
    const exists = aList.find(x=> x.id===a.id);
    const next = exists ? aList.map(x=> x.id===a.id ? a : x) : [a, ...aList];
    persistA(next);
  };
  const handleSaveP = (p: MotorProblem)=>{
    const exists = pList.find(x=> x.id===p.id);
    const next = exists ? pList.map(x=> x.id===p.id ? p : x) : [p, ...pList];
    persistP(next);
  };

  const toggleAdmin = ()=>{
    const next = !isAdmin;
    setIsAdmin(next);
    localStorage.setItem("motorkita_admin", String(next));
  };

  const cats = ["Semua", ...Array.from(new Set(seed.map(p=>p.category)))];
  const filtered = list.filter(p=>{
    if(cat!=="Semua" && p.category!==cat) return false;
    if(q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap justify-between gap-3 items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight">CMS ADMIN — MOTORKITA</h1>
          <p className="text-sm text-neutral-600">Mock sekarang (localStorage) — nanti swap <code className="bg-neutral-100 px-1 rounded">partsRepo.ts</code> ke Supabase. Foto pakai URL dulu, nanti upload.</p>
        </div>
        <button onClick={toggleAdmin} className={`h-9 px-4 rounded-full text-xs font-black border ${isAdmin?"bg-green-600 text-white border-green-600":"bg-white border-[#0A0A0A]/15"}`}>{isAdmin ? "✓ Admin Aktif" : "Masuk sebagai Admin"}</button>
      </div>

      {!isAdmin && <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">Klik <b>Masuk sebagai Admin</b> untuk aktifkan tombol tambah/edit/hapus (mock guard). Nanti diganti Supabase Auth + RLS `profiles.role='admin'`.</div>}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t=>(
          <button key={t} onClick={()=> setTab(t)} className={`px-4 py-2 rounded-full text-sm font-bold border whitespace-nowrap ${tab===t?"bg-[#0A0A0A] text-white border-[#0A0A0A]":"bg-white hover:bg-neutral-100"}`}>{t} {t==="Katalog"?`(${list.length})`: t==="Bengkel"?`(${wList.length})`: t==="Artikel"?`(${aList.length})`:`(${pList.length})`}</button>
        ))}
      </div>

      {tab==="Katalog" && (
        <div className="mt-4 bg-white border border-[#0A0A0A] rounded-[16px] p-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <h3 className="font-black">KATALOG — OLI & SPAREPART</h3>
            <button disabled={!isAdmin} onClick={()=>{setEditingPart(null); setShowForm("part");}} className={`h-9 px-4 rounded-full text-sm font-black ${isAdmin?"bg-[#0A0A0A] text-white hover:bg-black":"bg-neutral-100 text-neutral-400 cursor-not-allowed"}`}>+ Tambah Part</button>
          </div>
          <p className="mono text-[11px] text-neutral-500 mt-1">Part only • Jasa terpisah ±30-120rb. Filter kategori + search, edit/hapus langsung. Data mock tahan refresh (localStorage).</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari: Shell, Ban, Busi..." className="h-9 flex-1 min-w-[180px] border rounded-full px-4 text-sm bg-white"/>
            <select value={cat} onChange={e=>setCat(e.target.value)} className="h-9 border rounded-full px-3 text-sm bg-white">
              {cats.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="h-9 px-3 rounded-full bg-neutral-100 border mono text-xs grid place-items-center">{filtered.length} item</span>
            <button onClick={()=>{localStorage.removeItem("motorkita_parts_mock"); setList(seed);}} className="h-9 px-3 rounded-full border bg-white text-xs font-bold">Reset ke Seed</button>
          </div>

          <div className="mt-3 max-h-[420px] overflow-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 mono text-[11px] sticky top-0"><tr><th className="text-left p-2">Nama</th><th className="text-left p-2">Kategori</th><th className="text-left p-2">Harga</th><th className="text-left p-2">Aksi</th></tr></thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.id} className="border-t hover:bg-neutral-50">
                    <td className="p-2"><div className="font-bold leading-tight truncate max-w-[220px]">{p.brand} {p.name}</div><div className="mono text-[11px] text-neutral-500 truncate max-w-[220px]">{p.slug}</div></td>
                    <td className="p-2 mono text-xs">{p.category}</td>
                    <td className="p-2 text-xs whitespace-nowrap">Rp {p.harga_min.toLocaleString("id-ID")}</td>
                    <td className="p-2 flex gap-1">
                      <button disabled={!isAdmin} onClick={()=>{setEditingPart(p); setShowForm("part");}} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-[#0A0A0A] hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Edit</button>
                      <button disabled={!isAdmin} onClick={()=>{ if(!confirm("Hapus part ini?")) return; const next=list.filter(x=>x.id!==p.id); setList(next); savePartsMock(next); }} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-red-600 hover:text-white hover:border-red-600":"bg-neutral-100 text-neutral-400"}`}>Hapus</button>
                    </td>
                  </tr>
                ))}
                {filtered.length===0 && <tr><td colSpan={4} className="p-8 text-center text-sm text-neutral-500">Tidak ada part. Ubah filter atau tambah baru.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="mt-3 bg-neutral-900 text-white rounded-xl p-3 text-xs leading-relaxed">
            <b>Mock ke Supabase nanti:</b> ganti repo dari localStorage ke supabase.from parts + storage. Form tetap, cover_url jadi input file.
          </div>
        </div>
      )}

      {tab==="Bengkel" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Bengkel ({wList.length})</h3>
            <button disabled={!isAdmin} onClick={()=>{setEditingW(null); setShowForm("bengkel");}} className={`h-8 px-3 rounded-full text-xs font-black border ${isAdmin?"bg-[#0A0A0A] text-white hover:bg-black":"bg-neutral-100 text-neutral-400"}`}>+ Tambah Bengkel</button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">CRUD mock aktif — data tersimpan localStorage, nanti pindah ke таблицу workshops Supabase.</p>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {wList.map(w=>(
              <li key={w.id} className="flex justify-between items-center border-b py-2 gap-2">
                <span className="truncate pr-2"><b>{w.name}</b> <span className="text-xs text-neutral-500">— {w.kecamatan} • {w.jam_operasional} • {w.layanan.slice(0,2).join(", ")}</span></span>
                <span className="flex gap-1 shrink-0">
                  <button disabled={!isAdmin} onClick={()=>{setEditingW(w); setShowForm("bengkel");}} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-[#0A0A0A] hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Edit</button>
                  <button disabled={!isAdmin} onClick={()=>{ if(!confirm("Hapus bengkel?")) return; const n=wList.filter(x=>x.id!==w.id); setWList(n); saveWorkshopsMock(n); }} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-red-600 hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Hapus</button>
                </span>
              </li>
            ))}
          </ul>
          <button onClick={()=>{localStorage.removeItem("motorkita_workshops_mock"); setWList(seedWorkshops);}} className="mt-3 h-8 px-3 rounded-full border bg-white text-xs font-bold">Reset ke Seed</button>
        </div>
      )}
      {tab==="Artikel" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Edukasi/Artikel ({aList.length})</h3>
            <button disabled={!isAdmin} onClick={()=>{setEditingA(null); setShowForm("artikel");}} className={`h-8 px-3 rounded-full text-xs font-black border ${isAdmin?"bg-[#0A0A0A] text-white hover:bg-black":"bg-neutral-100 text-neutral-400"}`}>+ Tambah Artikel</button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">CRUD mock — nanti tabel articles Supabase.</p>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {aList.map(a=>(
              <li key={a.id} className="flex justify-between items-center border-b py-2 gap-2">
                <span className="truncate pr-2">{a.title.slice(0,48)} <span className="text-xs text-neutral-500">— {a.slug}</span></span>
                <span className="flex gap-1 shrink-0">
                  <button disabled={!isAdmin} onClick={()=>{setEditingA(a); setShowForm("artikel");}} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-[#0A0A0A] hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Edit</button>
                  <button disabled={!isAdmin} onClick={()=>{ if(!confirm("Hapus artikel?")) return; const n=aList.filter(x=>x.id!==a.id); setAList(n); saveArticlesMock(n); }} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-red-600 hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Hapus</button>
                </span>
              </li>
            ))}
          </ul>
          <button onClick={()=>{localStorage.removeItem("motorkita_articles_mock"); setAList(seedArticles);}} className="mt-3 h-8 px-3 rounded-full border bg-white text-xs font-bold">Reset ke Seed</button>
        </div>
      )}
      {tab==="Masalah" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Masalah & Darurat ({pList.length})</h3>
            <button disabled={!isAdmin} onClick={()=>{setEditingP(null); setShowForm("masalah");}} className={`h-8 px-3 rounded-full text-xs font-black border ${isAdmin?"bg-[#0A0A0A] text-white hover:bg-black":"bg-neutral-100 text-neutral-400"}`}>+ Tambah Masalah</button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">CRUD mock — emergency tampil di Panduan Darurat & Cek Masalah.</p>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {pList.map(m=>(
              <li key={m.id} className="flex justify-between items-center border-b py-2 gap-2">
                <span className="truncate pr-2">{m.title} <span className={`text-xs px-1 rounded ${m.is_emergency?"bg-amber-100 text-amber-900":"bg-neutral-100"}`}>{m.is_emergency?"darurat":"biasa"}</span> <span className="text-xs text-neutral-500">— {m.category}</span></span>
                <span className="flex gap-1 shrink-0">
                  <button disabled={!isAdmin} onClick={()=>{setEditingP(m); setShowForm("masalah");}} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-[#0A0A0A] hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Edit</button>
                  <button disabled={!isAdmin} onClick={()=>{ if(!confirm("Hapus masalah?")) return; const n=pList.filter(x=>x.id!==m.id); setPList(n); saveProblemsMock(n); }} className={`h-7 px-2 rounded-full text-xs font-bold border ${isAdmin?"bg-white hover:bg-red-600 hover:text-white":"bg-neutral-100 text-neutral-400"}`}>Hapus</button>
                </span>
              </li>
            ))}
          </ul>
          <button onClick={()=>{localStorage.removeItem("motorkita_problems_mock"); setPList(seedProblems);}} className="mt-3 h-8 px-3 rounded-full border bg-white text-xs font-bold">Reset ke Seed</button>
        </div>
      )}

      {showForm==="part" && <PartForm initial={editingPart} onSave={handleSavePart} onClose={()=> setShowForm(null)} />}
      {showForm==="bengkel" && <WorkshopForm initial={editingW} onSave={handleSaveW} onClose={()=> setShowForm(null)} />}
      {showForm==="artikel" && <ArticleForm initial={editingA} onSave={handleSaveA} onClose={()=> setShowForm(null)} />}
      {showForm==="masalah" && <ProblemForm initial={editingP} onSave={handleSaveP} onClose={()=> setShowForm(null)} />}

      <div className="mt-6">
        <Link href="/" className="text-sm text-neutral-900 hover:underline">← Kembali ke Home</Link>
        <span className="mono text-xs text-neutral-400 ml-3">/katalog baca seed statis dulu — admin mock ini preview lokal. Setelah Supabase, keduanya baca DB yang sama.</span>
      </div>
    </div>
  );
}
