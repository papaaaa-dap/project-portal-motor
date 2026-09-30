"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchWorkshopsSupabase } from "@/lib/repo/workshopsRepo";
import type { Workshop } from "@/lib/types";
import { WorkshopCard } from "@/components/ui/Card";
import LeafletMap from "@/components/Map";
import { mapsUrlForWorkshop } from "@/lib/maps";
import { getOpenStatus } from "@/lib/openStatus";

function dist(lat1:number,lng1:number,lat2:number,lng2:number){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

export default function BengkelPage(){
  const [filter, setFilter]=useState("Semua");
  const [q, setQ]=useState("");
  const [openOnly, setOpenOnly]=useState(false);
  const [loc, setLoc]=useState<[number,number]|null>(null);
  const [watching, setWatching]=useState(false);
  const [watchId, setWatchId]=useState<number | null>(null);
  const [err, setErr]=useState("");
  const [workshops, setWorkshops]=useState<Workshop[]>([]);

  useEffect(()=>{
    fetchWorkshopsSupabase().then(setWorkshops).catch(()=>{});
  },[]);

  const handleLoc=()=>{
    if(!navigator.geolocation){ setErr("Browser tidak mendukung lokasi"); return;}
    navigator.geolocation.getCurrentPosition(p=>{ setLoc([p.coords.latitude,p.coords.longitude]); setErr("");}, ()=> setErr("Izin lokasi ditolak"), { enableHighAccuracy: true });
  };
  const toggleWatch=()=>{
    if(watching && watchId!=null){
      navigator.geolocation.clearWatch(watchId);
      setWatching(false); setWatchId(null); setErr("Pantau berhenti");
      return;
    }
    if(!navigator.geolocation){ setErr("Browser tidak mendukung lokasi"); return; }
    const id = navigator.geolocation.watchPosition(p=>{ setLoc([p.coords.latitude,p.coords.longitude]); setErr(""); setWatching(true); }, ()=> setErr("Izin lokasi ditolak"), { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 });
    setWatchId(id); setWatching(true); setErr("Memantau lokasi realtime...");
  };

  const list = useMemo(()=>{
    let l=[...workshops] as unknown as (typeof workshops[0] & { maps_url?: string })[];
    if(filter!=="Semua") l=l.filter(w=>w.layanan.includes(filter));
    if(q) l=l.filter(w=> w.name.toLowerCase().includes(q.toLowerCase()) || w.kecamatan.toLowerCase().includes(q.toLowerCase()));
    if(openOnly) l=l.filter(w=> getOpenStatus(w.jam_operasional).isOpen);
    if(loc){
      l=l.map(w=> {
        if(w.lat == null || w.lng == null) return { ...w, _d: Infinity } as unknown as typeof w & { _d: number };
        return { ...w, _d: dist(loc[0],loc[1],w.lat as number,w.lng as number)} as unknown as typeof w & { _d: number };
      }).sort((a: unknown, b: unknown)=> (a as { _d: number })._d - (b as { _d: number })._d);
    }
    return l;
  },[filter,q,loc,openOnly,workshops]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-sm text-[var(--muted-foreground)]"><Link href="/" className="hover:text-[var(--foreground)]">Home</Link> / <span className="text-[var(--foreground)] font-medium">Bengkel</span></div>
      <h1 className="mt-2 text-2xl font-bold">Bengkel Surabaya</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Gunakan lokasi untuk urutkan terdekat. Sumber data seeder 12 bengkel (MVP → 50).</p>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={handleLoc} className="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-sm font-bold hover:opacity-90 transition">📍 Lokasi sekali</button>
        <button onClick={toggleWatch} className={`px-4 py-2 rounded-full text-sm font-bold border transition ${watching ? "bg-blue-600 text-white border-blue-600 animate-pulse" : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--foreground)]"}`}>{watching ? "⏸ Hentikan pantau" : "🔴 Pantau realtime"}</button>
        {loc && <span className={`text-xs px-2 py-1 rounded-full ${watching ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{watching ? "Live:" : "Lokasi:"} {loc[0].toFixed(4)}, {loc[1].toFixed(4)}</span>}
        {err && <span className="text-xs bg-[var(--muted)] text-[var(--foreground)] px-2 py-1 rounded-full">{err}</span>}
      </div>
      {watching && <p className="mt-2 text-xs text-blue-400 bg-blue-900/20 border border-blue-800/30 rounded-lg p-2">Realtime aktif — pin biru ikut gerak, jarak `km` update otomatis. Matikan jika mau hemat baterai. Butuh HTTPS + izin lokasi.</p>}
      <div className="mt-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari bengkel / kecamatan..." className="w-full max-w-md h-10 border rounded-full px-4 bg-[var(--card)] text-[var(--foreground)]"/>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {["Semua","Bengkel","Tambal Ban","Cuci Motor"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-sm border ${filter===f?"bg-[var(--foreground)] text-[var(--background)]":"bg-[var(--card)]"}`}>{f}</button>
        ))}
        <button onClick={()=>setOpenOnly(v=>!v)} className={`px-3 py-1.5 rounded-full text-sm border font-bold flex items-center gap-1.5 ${openOnly ? "bg-green-600 text-white border-green-600" : "bg-[var(--card)] hover:bg-green-900/20"}`}>
          <span className={`h-2 w-2 rounded-full ${openOnly ? "bg-white animate-pulse" : "bg-green-600"}`} /> {openOnly ? "Buka sekarang ✓" : "Buka sekarang"}
        </button>
        {openOnly && <span className="mono text-xs text-green-400 bg-green-900/20 border border-green-800/30 px-2 py-1 rounded-full">{list.length} buka</span>}
      </div>
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div><LeafletMap workshops={list} center={loc||undefined} userLocation={loc}/></div>
        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
          {list.map((w:any)=>(
            <div key={w.id}>
              <WorkshopCard w={w}/>
              {w._d!==undefined && w._d !== Infinity && <p className="text-xs text-[var(--muted-foreground)] ml-1">~{w._d.toFixed(1)} km dari kamu • <a href={mapsUrlForWorkshop(w)} target="_blank" className="text-[var(--foreground)]">Navigasi</a></p>}
              {(w._d===undefined || w._d===Infinity) && <p className="text-xs text-[var(--muted-foreground)] ml-1"><a href={mapsUrlForWorkshop(w)} target="_blank" className="text-[var(--foreground)]">Buka di Google Maps →</a></p>}
            </div>
          ))}
          {list.length===0 && <p className="text-center text-[var(--muted-foreground)] py-10">Tidak ada hasil.</p>}
        </div>
      </div>
    </div>
  );
}
