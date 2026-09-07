"use client";
import { useState } from "react";
import { maintenanceRules } from "@/lib/data/mocks";
import type { Motorcycle } from "@/lib/types";
import Link from "next/link";

const initial: Motorcycle[] = [
  { id:"m1", brand:"Honda", model:"Vario 160", year:2023, type:"matic", cc:160, kilometer:18500, last_service_date:"2026-01-10" },
  { id:"m2", brand:"Yamaha", model:"NMAX", year:2022, type:"matic", cc:155, kilometer:32000, last_service_date:"2026-02-01" },
];

function recommendations(m: Motorcycle){
  return maintenanceRules.filter(r=> r.motor_type==="all" || r.motor_type===m.type);
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
      <h1 className="text-2xl font-bold">Motor Saya</h1>
      <p className="text-sm text-neutral-500">Kelola N motor, lihat rekomendasi perawatan rule-based, dan pengingat servis.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={()=>setShow(v=>!v)} className="px-4 py-2 rounded-full bg-neutral-1000 text-slate-900 text-sm font-bold">+ Tambah Motor</button>
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
          return (
            <div key={m.id} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{m.brand} {m.model} • {m.year}</h3>
                  <p className="text-xs text-neutral-500">{m.type} • {m.cc?m.cc+"cc":""} • {m.kilometer.toLocaleString()} km</p>
                  <p className="text-xs text-neutral-500">Servis terakhir: {m.last_service_date}</p>
                </div>
                <button onClick={()=>setList(list.filter(x=>x.id!==m.id))} className="text-xs text-neutral-900 hover:underline">Hapus</button>
              </div>
              <div className="mt-4 bg-neutral-100 border border-neutral-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-neutral-900">Pengingat: Ganti oli ~{nextOli} km lagi</p>
                <p className="text-xs text-neutral-600">Estimasi {Math.ceil(nextOli/40)} hari jika 40km/hari</p>
              </div>
              <h4 className="mt-4 text-sm font-semibold">Rekomendasi Perawatan</h4>
              <ul className="mt-2 space-y-2">
                {recs.map(r=>(
                  <li key={r.id} className="flex justify-between bg-neutral-50 border rounded-lg px-3 py-2">
                    <div><div className="text-sm font-medium">{r.title}</div><div className="text-xs text-neutral-500">{r.description}</div></div>
                    <span className="text-xs font-semibold text-neutral-600">{r.interval_km.toLocaleString()}km / {r.interval_days}h</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 rounded-full border bg-white text-xs">+ Riwayat Servis</button>
                <button className="px-3 py-1.5 rounded-full border bg-white text-xs">Bookmark</button>
              </div>
            </div>
          );
        })}
      </div>
      {list.length===0 && <p className="mt-10 text-center text-neutral-500">Belum ada motor. Tambah dulu.</p>}
    </div>
  );
}
