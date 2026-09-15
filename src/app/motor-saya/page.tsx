"use client";
import { useState } from "react";
import { maintenanceRules } from "@/lib/data/mocks";
import { parts } from "@/lib/data/parts";
import type { Motorcycle } from "@/lib/types";
import Link from "next/link";

const initial: Motorcycle[] = [
  { id:"m1", brand:"Honda", model:"Vario 160", year:2023, type:"matic", cc:160, kilometer:18500, last_service_date:"2026-01-10" },
  { id:"m2", brand:"Yamaha", model:"NMAX 155", year:2022, type:"matic", cc:155, kilometer:32000, last_service_date:"2026-02-01" },
  { id:"m3", brand:"Yamaha", model:"Vixion 150", year:2021, type:"manual", cc:150, kilometer:28500, last_service_date:"2026-02-12" },
];

const motorSpecs: Record<string, { oli: string; banDepan: string; banBelakang: string; aki: string; busi: string; foto: string }> = {
  "Honda Vario 160": { oli: "MPX1 10W-30 / Enduro Matic G 10W-30 (0.8L, MB)", banDepan: "100/80-14", banBelakang: "120/70-14", aki: "GTZ6V / YTZ6V (MF)", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" },
  "Yamaha NMAX 155": { oli: "Yamalube Matic 10W-40 / Federal Racing 10W-30 (0.9L, MB)", banDepan: "110/70-13", banBelakang: "130/70-13", aki: "GTZ7V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80" },
  "Yamaha Vixion 150": { oli: "Shell AX7 10W-40 / Motul 3100 10W-40 (1L, MA2)", banDepan: "90/80-17", banBelakang: "120/70-17", aki: "GTZ4V", busi: "NGK CR8E", foto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80" },
};

function recommendations(m: Motorcycle){
  return maintenanceRules.filter(r=> r.motor_type==="all" || r.motor_type===m.type);
}
function getPartRekom(m: Motorcycle, cat: string){
  return parts.filter(p=> p.category===cat as any && p.cocok_motor.some(cm=> `${m.brand} ${m.model}`.includes(cm.split(" ")[1]||"") || cm.includes(m.model))).slice(0,2);
}
function getOliRekom(m: Motorcycle){
  const oli = parts.filter(p=> p.category==="oli-mesin");
  if(m.type==="matic" && (m.cc||0) <=125) return oli.filter(o=> (o.specs["Untuk"]||"").includes("Matic")).slice(0,2);
  if(m.type==="matic") return oli.slice(0,2);
  return oli.filter(o=> (o.specs["Untuk"]||"").includes("Manual") || (o.specs["Untuk"]||"").includes("Matic & Manual")).slice(0,2);
}

export default function MotorSaya(){
  const [list, setList]=useState<Motorcycle[]>(initial);
  const [show, setShow]=useState(false);
  const [form, setForm]=useState({brand:"", model:"", year:2024, type:"matic" as const, kilometer:0});

  const add = ()=>{
    if(!form.brand || !form.model) return;
    setList([...list, {id:Date.now().toString(), brand:form.brand, model:form.model, year:form.year, type:form.type, kilometer:form.kilometer, last_service_date: new Date().toISOString().slice(0,10)}]);
    setShow(false); setForm({brand:"", model:"", year:2024, type:"matic", kilometer:0});
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black tracking-tight">MOTOR SAYA</h1>
      <p className="text-sm text-neutral-600">Kelola N motor, lihat rekomendasi rule-based & oli yang cocok. <span className="font-semibold text-neutral-900">Khusus motor standar</span> — belum bore-up / belum ganti ECU / knalpot racing.</p>
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs leading-relaxed text-amber-900">
        <b>Disclaimer:</b> Rekomendasi di bawah untuk motor standar pabrik. Jika sudah modif mesin, konsultasi bengkel — interval oli, busi, dan CVT/rantai bisa lebih pendek. Data perawatan lengkap ada di <Link href="/katalog" className="underline font-semibold">Katalog</Link> & <Link href="/edukasi" className="underline font-semibold">Edukasi</Link>.
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={()=>setShow(v=>!v)} className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold hover:bg-black transition">+ Tambah Motor</button>
        <Link href="/login" className="px-4 py-2 rounded-full border bg-white text-sm">Login untuk sinkronisasi Supabase</Link>
      </div>
      {show && (
        <div className="mt-4 bg-white border rounded-xl p-4 grid sm:grid-cols-5 gap-2">
          <input placeholder="Merek" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} className="h-10 border rounded-lg px-3"/>
          <input placeholder="Model" value={form.model} onChange={e=>setForm({...form, model:e.target.value})} className="h-10 border rounded-lg px-3"/>
          <input type="number" placeholder="Tahun" value={form.year} onChange={e=>setForm({...form, year:parseInt(e.target.value)||0})} className="h-10 border rounded-lg px-3"/>
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value as any})} className="h-10 border rounded-lg px-3">
            <option value="matic">Matic</option><option value="manual">Manual</option><option value="kopling">Kopling</option>
          </select>
          <input type="number" placeholder="Kilometer" value={form.kilometer} onChange={e=>setForm({...form, kilometer:parseInt(e.target.value)||0})} className="h-10 border rounded-lg px-3"/>
          <button onClick={add} className="sm:col-span-5 h-10 rounded-full bg-neutral-900 text-white font-bold">Simpan</button>
        </div>
      )}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {list.map(m=>{
          const recs = recommendations(m);
          const nextOli = 2000 - (m.kilometer % 2000);
          const key = `${m.brand} ${m.model}`;
          const specs = motorSpecs[key] || { oli: "Cek Katalog Oli", banDepan: "-", banBelakang: "-", aki: "-", busi: "-", foto: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&q=80" };
          const oliRec = getOliRekom(m);
          return (
            <div key={m.id} className="bg-white border border-[#0A0A0A]/10 rounded-[16px] overflow-hidden flex flex-col">
              <div className="h-36 bg-[#F2F2F2] relative overflow-hidden">
                <img src={specs.foto} alt={`${m.brand} ${m.model}`} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 mono text-[10px] font-black bg-[#0A0A0A] text-white px-2 py-1 rounded-full">{m.type.toUpperCase()} • {m.cc}CC</span>
                <button onClick={()=>setList(list.filter(x=>x.id!==m.id))} className="absolute top-2 right-2 h-7 px-2 rounded-full bg-white border border-[#0A0A0A]/15 text-xs font-bold">Hapus</button>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-black tracking-tight">{m.brand} {m.model} • {m.year}</h3>
                <p className="text-xs text-neutral-600">{m.kilometer.toLocaleString()} km • Servis terakhir: {m.last_service_date}</p>

                {/* Specs berbeda per motor */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">OLI STANDAR</div><div className="font-medium leading-tight">{specs.oli}</div></div>
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">BAN</div><div className="font-medium">D {specs.banDepan} • B {specs.banBelakang}</div></div>
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">AKI</div><div className="font-medium">{specs.aki}</div></div>
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">BUSI</div><div className="font-medium">{specs.busi}</div></div>
                </div>

                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-amber-900">Pengingat: Ganti oli ~{nextOli.toLocaleString()} km lagi</p>
                  <p className="text-xs text-amber-800">Estimasi {Math.ceil(nextOli/40)} hari jika 40km/hari • Jangan tunda lewat 2 bulan.</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {oliRec.map(o=> <Link key={o.id} href={`/katalog/${o.slug}`} className="text-[11px] bg-white border border-amber-200 px-2 py-1 rounded-full font-medium hover:bg-[#0A0A0A] hover:text-white transition">{o.brand} {o.name} • Rp {o.harga_min.toLocaleString("id-ID")}</Link>)}
                  </div>
                </div>

                <h4 className="mt-4 text-sm font-bold">Rekomendasi Perawatan — Detail</h4>
                <ul className="mt-2 space-y-2">
                  {recs.map(r=>(
                    <li key={r.id} className="bg-neutral-50 border rounded-lg px-3 py-2">
                      <div className="flex justify-between gap-2"><span className="text-sm font-semibold">{r.title}</span><span className="text-xs font-bold mono text-neutral-600 shrink-0">{r.interval_km.toLocaleString()}km / {r.interval_days}h</span></div>
                      <div className="text-xs text-neutral-600 mt-1 leading-relaxed">{r.description}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <Link href="/katalog" className="px-3 py-1.5 rounded-full bg-[#0A0A0A] text-white text-xs font-bold">Lihat Katalog →</Link>
                  <Link href="/bengkel" className="px-3 py-1.5 rounded-full border bg-white text-xs font-bold">Cari Bengkel</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {list.length===0 && <p className="mt-10 text-center text-neutral-500">Belum ada motor. Tambah dulu.</p>}
    </div>
  );
}
