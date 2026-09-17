"use client";
import { useState } from "react";
import type { Workshop } from "@/lib/types";
import { slugify } from "@/lib/repo/workshopsRepo";
import { parseGoogleMapsLink } from "@/lib/maps";

export default function WorkshopForm({ onSave, onClose, initial }: { onSave:(w:Workshop)=>void; onClose:()=>void; initial?: Workshop|null }){
  const [name, setName] = useState(initial?.name||"");
  const [address, setAddress] = useState(initial?.address||"");
  const [kec, setKec] = useState(initial?.kecamatan||"");
  const [mapsUrl, setMapsUrl] = useState((initial as unknown as { maps_url?: string })?.maps_url || (initial?.lat && initial?.lng ? `https://maps.google.com/?q=${initial.lat},${initial.lng}` : ""));
  const [jam, setJam] = useState(initial?.jam_operasional||"08:00-17:00");
  const [layanan, setLayanan] = useState((initial?.layanan||[]).join(", "));
  const [kontak, setKontak] = useState(initial?.kontak||"");
  const [foto, setFoto] = useState(initial?.foto_url||"");
  const [rating, setRating] = useState(String(initial?.rating||"4.5"));
  const [err, setErr] = useState("");

  const submit=()=>{
    if(!name || !kec) return setErr("Nama & kecamatan wajib");
    if(!mapsUrl.trim()) return setErr("Link Google Maps wajib — buka Google Maps → Share → Copy link");
    const parsed = parseGoogleMapsLink(mapsUrl);
    if(!parsed.maps_url) return setErr("Link tidak valid");
    // lat/lng optional untuk peta; jika tidak ter-parse, tetap simpan link untuk Navigasi langsung
    const w: Workshop & { maps_url: string } = {
      id: initial?.id || `w-${Date.now()}`,
      slug: initial?.slug || slugify(name),
      name, address: address||`Jl. ${kec} No.1`, kecamatan: kec,
      lat: parsed.lat ?? initial?.lat,
      lng: parsed.lng ?? initial?.lng,
      maps_url: parsed.maps_url,
      jam_operasional: jam, layanan: layanan.split(",").map(s=>s.trim()).filter(Boolean),
      kontak: kontak||"031-xxxxxxx", foto_url: foto||"https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=600&q=80",
      rating: parseFloat(rating)||4.5
    } as unknown as Workshop & { maps_url: string };
    // warning if lat/lng not extracted
    if(parsed.lat == null) {
      if(!confirm("Link tidak mengandung koordinat lat,lng yang terdeteksi. Tetap simpan? Peta tidak akan tampil pin, tapi tombol Navigasi tetap langsung ke link Google Maps.")) return;
    }
    onSave(w as unknown as Workshop); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-xl bg-white rounded-[16px] border border-[#0A0A0A] p-5">
        <div className="flex justify-between items-center"><h3 className="font-black">{initial?"Edit Bengkel":"Tambah Bengkel"}</h3><button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center">✕</button></div>
        <p className="mono text-[11px] text-neutral-500 mt-1">Paste link Google Maps langsung — Share → Copy link. Lat/Lng otomatis diambil jika ada.</p>
        <div className="mt-4 grid gap-3">
          <label className="text-xs font-bold">Nama *<input value={name} onChange={e=>setName(e.target.value)} placeholder="Bengkel AHASS ..." className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Alamat<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Jl. Ahmad Yani No.12" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Kecamatan *<input value={kec} onChange={e=>setKec(e.target.value)} placeholder="Wonokromo" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold">Jam<input value={jam} onChange={e=>setJam(e.target.value)} placeholder="08:00-17:00 / 24 Jam" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>
          <label className="text-xs font-bold">Link Google Maps *<input value={mapsUrl} onChange={e=>setMapsUrl(e.target.value)} placeholder="https://maps.google.com/?q=-7.2975,112.738 atau https://goo.gl/maps/..." className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/><span className="mono text-[10px] font-normal text-neutral-500">Contoh: https://maps.app.goo.gl/xxxx atau https://www.google.com/maps/place/.../@-7.28,112.73,15z — buka di Google Maps lalu Share</span></label>
          <label className="text-xs font-bold">Layanan (koma)<input value={layanan} onChange={e=>setLayanan(e.target.value)} placeholder="Bengkel, Ganti Oli, CVT" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Kontak<input value={kontak} onChange={e=>setKontak(e.target.value)} placeholder="031-8281234" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold">Rating<input type="number" step="0.1" value={rating} onChange={e=>setRating(e.target.value)} className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>
          <label className="text-xs font-bold">Foto URL<input value={foto} onChange={e=>setFoto(e.target.value)} placeholder="https://..." className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}
          <div className="flex gap-2"><button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">{initial?"Simpan":"Simpan Bengkel"}</button><button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold">Batal</button></div>
        </div>
      </div>
    </div>
  );
}
