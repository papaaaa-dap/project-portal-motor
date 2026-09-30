"use client";
import { useState } from "react";
import type { Workshop } from "@/lib/types";
import { slugify } from "@/lib/repo/workshopsRepo";
import { parseGoogleMapsLink } from "@/lib/maps";
import CoverUpload from "@/components/admin/CoverUpload";

export const STANDAR_LAYANAN = ["Bengkel", "Tambal Ban", "Cuci Motor"];

function normalizeLayanan(raw: string[]): string[] {
  return raw
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const low = s.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
      if (low === "tambal ban" || low === "tambalban" || low === "tambal") return "Tambal Ban";
      if (low === "cuci motor" || low === "cucimotor" || low === "cuci" || low === "steam") return "Cuci Motor";
      if (low === "bengkel" || low === "servis" || low === "service" || low === "servis motor") return "Bengkel";
      // Title-case lainnya: "ganti oli" -> "Ganti Oli"
      return low.replace(/\b\w/g, (c) => c.toUpperCase());
    })
    .filter((v, i, a) => a.indexOf(v) === i);
}

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
  const [latStr, setLatStr] = useState(initial?.lat != null ? String(initial.lat) : "");
  const [lngStr, setLngStr] = useState(initial?.lng != null ? String(initial.lng) : "");
  const [err, setErr] = useState("");

  const liveParsed = parseGoogleMapsLink(mapsUrl || "");
  const effLat = latStr.trim() !== "" ? parseFloat(latStr) : liveParsed.lat;
  const effLng = lngStr.trim() !== "" ? parseFloat(lngStr) : liveParsed.lng;
  const hasPin = effLat != null && !isNaN(effLat as number) && effLng != null && !isNaN(effLng as number);

  const autofillFromLink = () => {
    if (liveParsed.lat != null && liveParsed.lng != null) {
      setLatStr(String(liveParsed.lat));
      setLngStr(String(liveParsed.lng));
    }
  };

  const submit=()=>{
    if(!name || !kec) return setErr("Nama & kecamatan wajib");
    if(!mapsUrl.trim()) return setErr("Link Google Maps wajib — buka Google Maps → Share → Copy link");
    const parsed = parseGoogleMapsLink(mapsUrl);
    if(!parsed.maps_url) return setErr("Link tidak valid");
    const manualLat = latStr.trim() !== "" ? parseFloat(latStr) : undefined;
    const manualLng = lngStr.trim() !== "" ? parseFloat(lngStr) : undefined;
    if ((latStr.trim() !== "" && isNaN(manualLat as number)) || (lngStr.trim() !== "" && isNaN(manualLng as number)))
      return setErr("Lat / Lng harus angka, cth: -7.2975, 112.738");
    // lat/lng optional untuk peta; jika tidak ter-parse, tetap simpan link untuk Navigasi langsung
    const w: Workshop & { maps_url: string } = {
      id: initial?.id || `w-${Date.now()}`,
      slug: initial?.slug || slugify(name),
      name, address: address||`Jl. ${kec} No.1`, kecamatan: kec,
      lat: manualLat ?? parsed.lat ?? initial?.lat,
      lng: manualLng ?? parsed.lng ?? initial?.lng,
      maps_url: parsed.maps_url,
      jam_operasional: jam, layanan: normalizeLayanan(layanan.split(",")),
      kontak: kontak||"031-xxxxxxx", foto_url: foto||"/motor4.jpeg",
      rating: parseFloat(rating)||4.5
    } as unknown as Workshop & { maps_url: string };
    // warning if lat/lng not extracted
    if(w.lat == null || w.lng == null) {
      if(!confirm("Belum ada koordinat — pin TIDAK akan muncul di peta (tombol Navigasi tetap jalan). Tetap simpan? Isi Lat/Lng manual biar muncul pin.")) return;
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
          <label className="text-xs font-bold">Link Google Maps *<input value={mapsUrl} onChange={e=>setMapsUrl(e.target.value)} placeholder="https://maps.google.com/?q=-7.2975,112.738 atau https://goo.gl/maps/..." className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/><span className="mono text-[10px] font-normal text-neutral-500">JANGAN pakai link pendek goo.gl / maps.app.goo.gl — buka linknya di browser, copy URL panjang yang ada @-7.x,112.x. Link pendek tidak ada koordinat → pin hilang.</span></label>
          <div className={`rounded-lg border p-2 ${hasPin ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold">{hasPin ? `✓ Pin akan muncul (${effLat}, ${effLng})` : "⚠ Pin TIDAK akan muncul — isi Lat/Lng"}</span>
              {liveParsed.lat != null && (
                <button type="button" onClick={autofillFromLink} className="text-[11px] font-bold px-2 py-1 rounded-full border bg-white hover:bg-neutral-100">Ambil dari link</button>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="text-xs font-bold">Lat<input value={latStr} onChange={e=>setLatStr(e.target.value)} placeholder="-7.2975" inputMode="decimal" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal bg-white"/></label>
              <label className="text-xs font-bold">Lng<input value={lngStr} onChange={e=>setLngStr(e.target.value)} placeholder="112.738" inputMode="decimal" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal bg-white"/></label>
            </div>
            <p className="mono text-[10px] text-neutral-500 mt-1">Cara: buka Google Maps → klik titik bengkel → klik koordinat → copy paste ke sini. Cth Surabaya: -7.28, 112.74.</p>
          </div>
          <div>
            <span className="text-xs font-bold">Layanan (koma)</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {STANDAR_LAYANAN.map((s) => {
                const active = normalizeLayanan(layanan.split(",")).includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const cur = normalizeLayanan(layanan.split(","));
                      const next = active ? cur.filter((x) => x !== s) : [...cur, s];
                      setLayanan(next.join(", "));
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${active ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white hover:bg-neutral-100"}`}
                  >
                    {active ? `✓ ${s}` : `+ ${s}`}
                  </button>
                );
              })}
            </div>
            <input value={layanan} onChange={e=>setLayanan(e.target.value)} placeholder="Bengkel, Tambal Ban, Cuci Motor" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/>
            <span className="mono text-[10px] font-normal text-neutral-500">Wajib pisahkan dengan koma. Contoh: Bengkel, Tambal Ban, Cuci Motor. Otomatis dibetulkan walau ketik &quot;cucimotor&quot; / huruf kecil.</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Kontak<input value={kontak} onChange={e=>setKontak(e.target.value)} placeholder="031-8281234" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
            <label className="text-xs font-bold">Rating<input type="number" step="0.1" value={rating} onChange={e=>setRating(e.target.value)} className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          </div>
          <CoverUpload value={foto} onChange={setFoto} folder="workshops" label="Foto (upload / URL)" />
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}
          <div className="flex gap-2"><button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">{initial?"Simpan":"Simpan Bengkel"}</button><button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold">Batal</button></div>
        </div>
      </div>
    </div>
  );
}
