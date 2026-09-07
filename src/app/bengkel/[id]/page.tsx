import Link from "next/link";
import { workshops } from "@/lib/data/mocks";
export default async function Detail({params}:{params: Promise<{id:string}>}){
  const {id}=await params;
  const w = workshops.find(x=>x.id===id);
  if(!w) return <div className="mx-auto max-w-3xl px-4 py-10">Bengkel tidak ditemukan.</div>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/bengkel" className="hover:text-slate-900">← Kembali ke daftar</Link></div>
      <img src={w.foto_url} alt={w.name} className="mt-4 w-full h-56 object-cover rounded-xl"/>
      <h1 className="mt-4 text-2xl font-bold">{w.name}</h1>
      <p className="text-sm text-neutral-500">{w.address} • {w.kecamatan}</p>
      <p className="mt-2 text-sm">⭐ {w.rating} • {w.jam_operasional} • {w.kontak}</p>
      <div className="mt-2 flex flex-wrap gap-2">{w.layanan.map(l=> <span key={l} className="text-xs bg-slate-100 px-2 py-1 rounded-full">{l}</span>)}</div>
      <div className="mt-6 flex gap-2">
        <a href={`https://maps.google.com/?q=${w.lat},${w.lng}`} target="_blank" className="px-6 py-3 rounded-full bg-neutral-1000 text-slate-900 font-bold hover:bg-neutral-800">Navigasi ke Peta →</a>
        <a href={`tel:${w.kontak}`} className="px-6 py-3 rounded-full border bg-white font-medium">Hubungi</a>
      </div>
      <p className="mt-6 text-xs text-neutral-500 bg-neutral-100 border border-neutral-200 p-3 rounded-lg">Jam operasional dapat berubah. Hubungi bengkel sebelum berangkat.</p>
    </div>
  );
}
