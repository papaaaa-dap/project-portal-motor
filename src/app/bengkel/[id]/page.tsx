import Link from "next/link";
import { workshops } from "@/lib/data/mocks";
import { mapsUrlForWorkshop } from "@/lib/maps";
import { getOpenStatus } from "@/lib/openStatus";
import { waLink, isWa } from "@/lib/wa";

export default async function Detail({params}:{params: Promise<{id:string}>}){
  const {id}=await params;
  const w = workshops.find(x=>x.id===id) as unknown as { id:string; name:string; address:string; kecamatan:string; lat?:number; lng?:number; maps_url?:string; foto_url:string; rating:number; jam_operasional:string; kontak:string; layanan:string[] } | undefined;
  if(!w) return <div className="mx-auto max-w-3xl px-4 py-10">Bengkel tidak ditemukan.</div>;
  const open = getOpenStatus(w.jam_operasional);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/bengkel" className="hover:text-slate-900">← Kembali ke daftar</Link></div>
      <img src={w.foto_url} alt={w.name} className="mt-4 w-full h-56 object-cover rounded-xl"/>
      <h1 className="mt-4 text-2xl font-bold">{w.name}</h1>
      <p className="text-sm text-neutral-500">{w.address} • {w.kecamatan}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 mono text-xs font-black px-2.5 py-1 rounded-full border ${open.isOpen ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"}`}>
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> {open.isOpen ? "BUKA" : "TUTUP"}
        </span>
        <span className="text-sm text-neutral-700">{open.label}</span>
        <span className="text-sm text-neutral-500">• {w.jam_operasional}</span>
      </div>
      <p className="mt-2 text-sm">⭐ {w.rating} • {w.kontak} {isWa(w.kontak) && <span className="mono text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">WA tersedia</span>}</p>
      <div className="mt-2 flex flex-wrap gap-2">{w.layanan.map(l=> <span key={l} className="text-xs bg-slate-100 px-2 py-1 rounded-full">{l}</span>)}</div>
      <div className="mt-6 flex gap-2 flex-wrap">
        <a href={mapsUrlForWorkshop(w)} target="_blank" className="px-6 py-3 rounded-full bg-[#0A0A0A] text-white font-bold hover:bg-black transition">Navigasi ke Peta →</a>
        <a href={waLink(w.kontak, w.name)} target="_blank" className={`px-6 py-3 rounded-full font-bold border transition ${isWa(w.kontak) ? "bg-green-600 text-white border-green-600 hover:bg-green-700" : "bg-white border-[#0A0A0A]/15"}`}>{isWa(w.kontak) ? "Chat WA →" : "Hubungi"}</a>
      </div>
      <p className="mt-6 text-xs text-neutral-500 bg-neutral-100 border border-neutral-200 p-3 rounded-lg">Waktu Jakarta (WIB). {open.isOpen ? "Sedang buka — langsung gas." : "Sedang tutup — cek jam buka di atas."} Hubungi bengkel sebelum berangkat.</p>
    </div>
  );
}
