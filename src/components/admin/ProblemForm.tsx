"use client";
import { useState } from "react";
import type { MotorProblem } from "@/lib/types";
import { slugify } from "@/lib/repo/problemsRepo";

export default function ProblemForm({ onSave, onClose, initial }: { onSave:(p:MotorProblem)=>void; onClose:()=>void; initial?: MotorProblem|null }){
  const [title, setTitle] = useState(initial?.title||"");
  const [category, setCategory] = useState(initial?.category||"Mesin");
  const [gejala, setGejala] = useState((initial?.gejala||[]).join(", "));
  const [penyebab, setPenyebab] = useState((initial?.penyebab||[]).join(", "));
  const [langkah, setLangkah] = useState((initial?.langkah||[]).join(" | "));
  const [isEmergency, setIsEmergency] = useState(initial?.is_emergency||false);
  const [err,setErr]=useState("");
  const submit=()=>{
    if(!title) return setErr("Judul wajib");
    const p: MotorProblem = {
      id: initial?.id || `p-${Date.now()}`,
      slug: initial?.slug || slugify(title),
      title, gejala: gejala.split(",").map(s=>s.trim()).filter(Boolean),
      penyebab: penyebab.split(",").map(s=>s.trim()).filter(Boolean),
      langkah: langkah.split("|").map(s=>s.trim()).filter(Boolean),
      is_emergency: isEmergency, category
    };
    if(p.gejala.length===0) return setErr("Isi minimal 1 gejala (pisah koma)");
    onSave(p); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-xl bg-white rounded-[16px] border border-[#0A0A0A] p-5">
        <div className="flex justify-between items-center"><h3 className="font-black">{initial?"Edit Masalah":"Tambah Masalah"}</h3><button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center">✕</button></div>
        <p className="mono text-[11px] text-neutral-500 mt-1">Gejala/penyebab pisah koma, langkah pisah |. Emergency = tampil di Panduan Darurat.</p>
        <div className="mt-4 grid gap-3">
          <label className="text-xs font-bold">Judul *<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Motor Sulit Dinyalakan" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Kategori<input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Mesin / CVT / Rem" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold flex items-center gap-2 mt-6"><input type="checkbox" checked={isEmergency} onChange={e=>setIsEmergency(e.target.checked)} /> Darurat</label>
          </div>
          <label className="text-xs font-bold">Gejala (koma)<textarea value={gejala} onChange={e=>setGejala(e.target.value)} rows={2} placeholder="Starter berputar tapi tidak hidup, Tidak ada suara starter" className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Penyebab (koma)<textarea value={penyebab} onChange={e=>setPenyebab(e.target.value)} rows={2} placeholder="Aki lemah, Busi kotor" className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Langkah (pisah | )<textarea value={langkah} onChange={e=>setLangkah(e.target.value)} rows={2} placeholder="Cek bensin dan aki | Coba kick starter | Bersihkan busi" className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"/></label>
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}
          <div className="flex gap-2"><button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">{initial?"Simpan":"Simpan Masalah"}</button><button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold">Batal</button></div>
        </div>
      </div>
    </div>
  );
}
