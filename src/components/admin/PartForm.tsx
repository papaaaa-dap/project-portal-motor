"use client";
import { useState } from "react";
import type { Part, PartCategory } from "@/lib/types";
import { workshops } from "@/lib/data/mocks";
import { slugify } from "@/lib/repo/partsRepo";

const cats: { slug: PartCategory; label: string; specs: string[] }[] = [
  { slug:"oli-mesin", label:"Oli Mesin", specs:["SAE","JASO","Base","Untuk"] },
  { slug:"oli-gardan", label:"Oli Gardan", specs:["SAE","API","Untuk"] },
  { slug:"oli-samping", label:"Oli Samping 2T", specs:["Tipe","Untuk"] },
  { slug:"cvt", label:"CVT", specs:["Untuk","Bahan","Berat"] },
  { slug:"ban", label:"Ban", specs:["Ukuran","Tipe","Untuk"] },
  { slug:"busi", label:"Busi", specs:["Tipe","Gap","Untuk"] },
  { slug:"filter-udara", label:"Filter Udara", specs:["Tipe","Untuk"] },
  { slug:"kampas-rem", label:"Kampas Rem", specs:["Posisi","Bahan"] },
  { slug:"rem", label:"Rem & Minyak", specs:["Tipe","Ukuran","Volume"] },
  { slug:"aki", label:"Aki", specs:["Tipe","Voltase","Untuk"] },
  { slug:"rantai", label:"Rantai & Gir", specs:["Ukuran","Panjang","Untuk"] },
  { slug:"kelistrikan", label:"Kelistrikan", specs:["Untuk","Tipe"] },
];

export default function PartForm({ onSave, onClose, initial }: { onSave:(p:Part)=>void; onClose:()=>void; initial?: Part | null }){
  const [category, setCategory] = useState<PartCategory>(initial?.category || "oli-mesin");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [name, setName] = useState(initial?.name || "");
  const [hargaMin, setHargaMin] = useState(String(initial?.harga_min || ""));
  const [hargaMax, setHargaMax] = useState(String(initial?.harga_max || ""));
  const [satuan, setSatuan] = useState(initial?.satuan || "1 pcs");
  const [specs, setSpecs] = useState<Record<string,string>>(initial?.specs || {});
  const [keunggulan, setKeunggulan] = useState((initial?.keunggulan || []).join(", "));
  const [cocok, setCocok] = useState((initial?.cocok_motor || []).join(", "));
  const [interval, setInterval] = useState(String(initial?.interval_km || "2000"));
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi || "");
  const [cover, setCover] = useState(initial?.cover_url || "");
  const [bengkelIds, setBengkelIds] = useState<string[]>(initial?.bengkel_ids || ["w1"]);
  const [err, setErr] = useState("");

  const specFields = cats.find(c=>c.slug===category)?.specs || [];

  const toggleBengkel = (id:string)=> setBengkelIds(cur=> cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);

  const submit = ()=>{
    if(!brand || !name) return setErr("Brand & Nama wajib");
    const min = parseInt(hargaMin), max = parseInt(hargaMax);
    if(!min || !max || min<=0 || max<min) return setErr("Harga min/max tidak valid (min < max, >0)");
    if(bengkelIds.length===0) return setErr("Pilih minimal 1 bengkel");
    const slug = initial?.slug || slugify(`${brand}-${name}`);
    const p: Part = {
      id: initial?.id || `p-${Date.now()}`,
      slug, category, brand, name,
      harga_min: min, harga_max: max, satuan,
      cover_url: cover || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
      specs, keunggulan: keunggulan.split(",").map(s=>s.trim()).filter(Boolean).slice(0,4),
      cocok_motor: cocok.split(",").map(s=>s.trim()).filter(Boolean),
      interval_km: parseInt(interval)||2000, deskripsi: deskripsi || `${brand} ${name} untuk ${category}`,
      bengkel_ids: bengkelIds,
    };
    onSave(p);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-2xl bg-white rounded-[16px] border border-[#0A0A0A] p-5">
        <div className="flex justify-between items-center">
          <h3 className="font-black">{initial ? "Edit Part" : "Tambah Part Baru"}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center">✕</button>
        </div>
        <p className="mono text-[11px] text-neutral-500 mt-1">Foto pakai URL dulu — nanti ganti upload file ke Supabase Storage (field cover_url tetap).</p>

        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Kategori *<select value={category} onChange={e=>{setCategory(e.target.value as any); setSpecs({});}} className="mt-1 w-full h-9 border rounded-lg px-2 text-sm font-normal">{cats.map(c=> <option key={c.slug} value={c.slug}>{c.label}</option>)}</select></label>
            <label className="text-xs font-bold">Satuan *<input value={satuan} onChange={e=>setSatuan(e.target.value)} placeholder="0.8L / 1 pcs / 1 set" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Brand *<input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="Yamalube" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold">Nama *<input value={name} onChange={e=>setName(e.target.value)} placeholder="Matic 10W-40" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Harga Min *<input type="number" value={hargaMin} onChange={e=>setHargaMin(e.target.value)} placeholder="52000" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold">Harga Max *<input type="number" value={hargaMax} onChange={e=>setHargaMax(e.target.value)} placeholder="62000" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>

          <div className="bg-neutral-50 border rounded-xl p-3">
            <div className="mono text-[11px] font-black">SPEK DINAMIS — sesuai kategori</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {specFields.map(k=>(
                <label key={k} className="text-xs font-bold">{k}<input value={specs[k]||""} onChange={e=> setSpecs({...specs, [k]: e.target.value})} placeholder={k==="SAE"?"10W-40":k==="Ukuran"?"90/80-14":k} className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal bg-white"/></label>
              ))}
            </div>
          </div>

          <label className="text-xs font-bold">Keunggulan (pisah koma, max 4)<input value={keunggulan} onChange={e=>setKeunggulan(e.target.value)} placeholder="Tarikan enteng, OEM, Minim penguapan" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Cocok Motor (pisah koma)<input value={cocok} onChange={e=>setCocok(e.target.value)} placeholder="Honda BeAT, Vario 160, Scoopy" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Interval KM<input type="number" value={interval} onChange={e=>setInterval(e.target.value)} className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold">Foto URL (nanti upload)<input value={cover} onChange={e=>setCover(e.target.value)} placeholder="https://..." className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>

          <label className="text-xs font-bold">Deskripsi<textarea value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} rows={2} placeholder="Oli bawaan Honda untuk matic harian..." className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"/></label>

          <div>
            <div className="text-xs font-bold">Bengkel yang jual * ({bengkelIds.length} dipilih)</div>
            <div className="mt-1 grid grid-cols-2 gap-1 max-h-32 overflow-auto border rounded-lg p-2 bg-neutral-50">
              {workshops.map(w=>(
                <label key={w.id} className="flex items-center gap-2 text-xs bg-white border rounded-full px-2 py-1 cursor-pointer">
                  <input type="checkbox" checked={bengkelIds.includes(w.id)} onChange={()=> toggleBengkel(w.id)} />
                  <span className="truncate">{w.name}</span>
                </label>
              ))}
            </div>
          </div>

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}

          <div className="flex gap-2">
            <button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">{initial ? "Simpan Perubahan" : "Simpan Part"}</button>
            <button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold">Batal</button>
          </div>
          <p className="mono text-[11px] text-neutral-500 text-center">Nanti swap `partsRepo.ts` → Supabase: form ini 90% tetap, cuma `cover_url` jadi upload file.</p>
        </div>
      </div>
    </div>
  );
}
