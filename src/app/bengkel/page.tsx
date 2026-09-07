"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { workshops } from "@/lib/data/mocks";
import { WorkshopCard } from "@/components/ui/Card";
import LeafletMap from "@/components/Map";
import SearchBar from "@/components/SearchBar";

function dist(lat1:number,lng1:number,lat2:number,lng2:number){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

export default function BengkelPage(){
  const [filter, setFilter]=useState("Semua");
  const [q, setQ]=useState("");
  const [loc, setLoc]=useState<[number,number]|null>(null);
  const [err, setErr]=useState("");

  const handleLoc=()=>{
    if(!navigator.geolocation){ setErr("Browser tidak mendukung lokasi"); return;}
    navigator.geolocation.getCurrentPosition(p=>{ setLoc([p.coords.latitude,p.coords.longitude]); setErr("");}, ()=> setErr("Izin lokasi ditolak"));
  };

  const list = useMemo(()=>{
    let l=[...workshops];
    if(filter!=="Semua") l=l.filter(w=>w.layanan.includes(filter));
    if(q) l=l.filter(w=> w.name.toLowerCase().includes(q.toLowerCase()) || w.kecamatan.toLowerCase().includes(q.toLowerCase()));
    if(loc){
      l=l.map(w=> ({...w, _d: dist(loc[0],loc[1],w.lat,w.lng)}) as any).sort((a:any,b:any)=>a._d-b._d);
    }
    return l;
  },[filter,q,loc]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Bengkel</span></div>
      <h1 className="mt-2 text-2xl font-bold">Bengkel Surabaya</h1>
      <p className="text-sm text-neutral-500">Gunakan lokasi untuk urutkan terdekat. Sumber data seeder 12 bengkel (MVP → 50).</p>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={handleLoc} className="px-4 py-2 rounded-full bg-neutral-1000 text-slate-900 text-sm font-bold hover:bg-neutral-800">Gunakan lokasi saya</button>
        {loc && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Lokasi aktif: {loc[0].toFixed(3)}, {loc[1].toFixed(3)}</span>}
        {err && <span className="text-xs bg-neutral-100 text-neutral-900 px-2 py-1 rounded-full">{err}</span>}
      </div>
      <div className="mt-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari bengkel / kecamatan..." className="w-full max-w-md h-10 border rounded-full px-4 bg-white"/>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Semua","Bengkel","Tambal Ban","Cuci Motor"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-sm border ${filter===f?"bg-neutral-900 text-white":"bg-white"}`}>{f}</button>
        ))}
      </div>
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div><LeafletMap workshops={list} center={loc||undefined}/></div>
        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
          {list.map((w:any)=>(
            <div key={w.id}>
              <WorkshopCard w={w}/>
              {w._d!==undefined && <p className="text-xs text-neutral-500 ml-1">~{w._d.toFixed(1)} km dari kamu • <a href={`https://maps.google.com/?q=${w.lat},${w.lng}`} target="_blank" className="text-neutral-900">Navigasi</a></p>}
            </div>
          ))}
          {list.length===0 && <p className="text-center text-neutral-500 py-10">Tidak ada hasil.</p>}
        </div>
      </div>
    </div>
  );
}
