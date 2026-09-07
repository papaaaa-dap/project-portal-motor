"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const MapContainer = dynamic(()=>import("react-leaflet").then(m=>m.MapContainer), {ssr:false});
const TileLayer = dynamic(()=>import("react-leaflet").then(m=>m.TileLayer), {ssr:false});
const Marker = dynamic(()=>import("react-leaflet").then(m=>m.Marker), {ssr:false});
const Popup = dynamic(()=>import("react-leaflet").then(m=>m.Popup), {ssr:false});
import type { Workshop } from "@/lib/types";

export default function LeafletMap({ workshops, center }: { workshops: Workshop[]; center?: [number, number] }){
  const [ready, setReady] = useState(false);
  useEffect(()=>{ setReady(true); },[]);
  if(!ready) return <div className="h-[420px] bg-slate-100 rounded-xl grid place-items-center text-sm text-neutral-500">Memuat peta...</div>;
  const c: [number,number] = center || [-7.28, 112.74];
  return (
    <div className="h-[420px] rounded-xl overflow-hidden border">
      {/* @ts-ignore */}
      <MapContainer center={c} zoom={12} style={{height:"100%", width:"100%"}}>
        {/* @ts-ignore */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap"/>
        {workshops.map(w=>(
          // @ts-ignore
          <Marker key={w.id} position={[w.lat, w.lng]}>
            {/* @ts-ignore */}
            <Popup><b>{w.name}</b><br/>{w.address}<br/><a href={`https://maps.google.com/?q=${w.lat},${w.lng}`} target="_blank" className="text-neutral-900">Navigasi →</a></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
