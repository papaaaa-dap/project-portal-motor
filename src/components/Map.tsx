"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const MapContainer = dynamic(()=>import("react-leaflet").then(m=>m.MapContainer), {ssr:false});
const TileLayer = dynamic(()=>import("react-leaflet").then(m=>m.TileLayer), {ssr:false});
const Marker = dynamic(()=>import("react-leaflet").then(m=>m.Marker), {ssr:false});
const Popup = dynamic(()=>import("react-leaflet").then(m=>m.Popup), {ssr:false});
import type { Workshop } from "@/lib/types";
import { mapsUrlForWorkshop } from "@/lib/maps";

function getCustomIcon(){
  if(typeof window==="undefined") return undefined;
  const L = (window as any).L || require("leaflet");
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
function getUserIcon(){
  if(typeof window==="undefined") return undefined;
  const L = (window as any).L || require("leaflet");
  return L.divIcon({
    className: "user-loc",
    html: '<div style="width:14px;height:14px;background:#2563eb;border:2px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(37,99,235,0.25)"></div>',
    iconSize: [14,14],
    iconAnchor: [7,7],
  });
}

export default function LeafletMap({ workshops, center, userLocation }: { workshops: Workshop[]; center?: [number, number]; userLocation?: [number, number] | null }){
  const [ready, setReady] = useState(false);
  const [icon, setIcon] = useState<any>(undefined);
  const [userIcon, setUserIcon] = useState<any>(undefined);
  useEffect(()=>{
    setReady(true);
    setIcon(getCustomIcon());
    setUserIcon(getUserIcon());
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
        {userLocation && (
          // @ts-ignore
          <Marker position={userLocation} icon={userIcon}>
            {/* @ts-ignore */}
            <Popup><b>Lokasi kamu</b><br/><span className="text-xs">Realtime — update tiap gerak</span></Popup>
          </Marker>
        )}
        {workshops.filter(w=> (w as unknown as { lat?: number; lng?: number }).lat != null && (w as unknown as { lat?: number; lng?: number }).lng != null).map(w=>(
          // @ts-ignore
          <Marker key={w.id} position={[(w as unknown as { lat: number }).lat, (w as unknown as { lng: number }).lng]} icon={icon}>
            {/* @ts-ignore */}
            <Popup><b>{w.name}</b><br/><span className="text-xs">{w.address} • {(w as unknown as { jam_operasional: string }).jam_operasional}</span><br/><a href={mapsUrlForWorkshop(w as unknown as { lat?: number; lng?: number; maps_url?: string })} target="_blank" className="text-neutral-900 font-bold text-xs">Navigasi →</a></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
