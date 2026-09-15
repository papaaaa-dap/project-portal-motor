"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const MapContainer = dynamic(()=>import("react-leaflet").then(m=>m.MapContainer), {ssr:false});
const TileLayer = dynamic(()=>import("react-leaflet").then(m=>m.TileLayer), {ssr:false});
const Marker = dynamic(()=>import("react-leaflet").then(m=>m.Marker), {ssr:false});
const Popup = dynamic(()=>import("react-leaflet").then(m=>m.Popup), {ssr:false});
import type { Workshop } from "@/lib/types";

function getCustomIcon(){
  if(typeof window==="undefined") return undefined;
  const L = (window as any).L || require("leaflet");
  // fix default icon paths for Next.js (leaflet expects images at /marker-icon.png which 404)
  const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
  const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
  return L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export default function LeafletMap({ workshops, center }: { workshops: Workshop[]; center?: [number, number] }){
  const [ready, setReady] = useState(false);
  const [icon, setIcon] = useState<any>(undefined);
  useEffect(()=>{
    setReady(true);
    setIcon(getCustomIcon());
    // also patch default for any other marker
    try{
      const L = require("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }catch{}
  },[]);
  if(!ready) return <div className="h-[420px] bg-neutral-100 rounded-xl grid place-items-center text-sm text-neutral-600 border">Memuat peta...</div>;
  const c: [number,number] = center || [-7.28, 112.74];
  return (
    <div className="h-[420px] rounded-xl overflow-hidden border border-[#0A0A0A]/10 bg-white">
      {/* @ts-ignore */}
      <MapContainer center={c} zoom={12} style={{height:"100%", width:"100%"}}>
        {/* @ts-ignore */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap"/>
        {workshops.map(w=>(
          // @ts-ignore
          <Marker key={w.id} position={[w.lat, w.lng]} icon={icon}>
            {/* @ts-ignore */}
            <Popup><b>{w.name}</b><br/><span className="text-xs">{w.address}</span><br/><a href={`https://maps.google.com/?q=${w.lat},${w.lng}`} target="_blank" className="text-neutral-900 font-bold text-xs">Navigasi →</a></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
