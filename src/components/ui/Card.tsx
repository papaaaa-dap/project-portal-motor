import Link from "next/link";
import { getOpenStatus } from "@/lib/openStatus";
import BookmarkButton from "@/components/BookmarkButton";

export function ArticleCard({title, excerpt, cover, href, category, id}:{title:string; excerpt:string; cover:string; href:string; category:string; id?:string}){
  return (
    <div className="group relative bg-white rounded-[16px] border border-[#0A0A0A] overflow-hidden flex flex-col hover:shadow-[4px_4px_0_#0A0A0A] hover:-translate-y-[2px] transition-all">
      <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
      <div className="h-[176px] overflow-hidden bg-[#F2F2F2] relative">
        <img src={cover} alt={title} className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-500"/>
        <div className="absolute inset-0 ring-1 ring-inset ring-[#0A0A0A]/10 pointer-events-none" />
        {id && <div className="absolute top-2 right-2 z-20"><BookmarkButton kind="article" id={id} /></div>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="mono text-[10px] tracking-[0.12em] font-black bg-[#0A0A0A] text-white border border-[#0A0A0A] px-2 py-1 rounded-full w-fit">{category.toUpperCase()}</span>
        <h3 className="mt-2 font-black leading-[1.15] text-[15px] tracking-[-0.02em] line-clamp-2 group-hover:underline decoration-2 underline-offset-4">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#717171] line-clamp-2">{excerpt}</p>
        <div className="mt-3 flex items-center gap-1.5 mono text-[11px] font-bold tracking-[0.06em]">
          <span className="h-6 px-2 rounded-full bg-[#0A0A0A] text-white grid place-items-center">BACA</span>
          <span className="text-[#0A0A0A] group-hover:translate-x-0.5 transition">→</span>
        </div>
      </div>
    </div>
  );
}
export function WorkshopCard({w}:{w:any}){
  const open = getOpenStatus(w.jam_operasional);
  return (
    <div className="group bg-white rounded-[14px] border border-[#0A0A0A] p-3 flex gap-3 hover:shadow-[3px_3px_0_#0A0A0A] hover:-translate-y-[1px] transition-all relative">
      <Link href={`/bengkel/${w.id}`} className="absolute inset-0 z-10" aria-label={w.name} />
      <div className="absolute top-2 right-2 z-20"><BookmarkButton kind="workshop" id={w.id} /></div>
      <div className="relative shrink-0">
        <img src={w.foto_url} alt={w.name} className="h-[84px] w-[84px] rounded-[10px] object-cover border border-[#0A0A0A]/10"/>
        <span className="absolute -bottom-2 -right-2 bg-[#0A0A0A] text-white border border-[#0A0A0A] mono text-[10px] font-black px-1.5 py-0.5 rounded-full">{w.rating}</span>
        <span className={`absolute -top-1 -left-1 mono text-[9px] font-black px-1.5 py-0.5 rounded-full border ${open.isOpen ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"}`}>{open.isOpen ? "BUKA" : "TUTUP"}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-black text-[13px] leading-tight tracking-[-0.02em] line-clamp-1">{w.name.toUpperCase()}</h3>
        <p className="mono text-[11px] truncate flex items-center gap-1.5">
          <span className={open.isOpen ? "text-green-700 font-bold" : "text-red-600 font-bold"}>● {open.isOpen ? "Buka" : "Tutup"}</span>
          <span className="text-[#717171]">• {open.label}</span>
        </p>
        <p className="mono text-[11px] text-[#717171] truncate">{w.kecamatan} • {w.jam_operasional}</p>
        <p className="text-[11px] text-[#717171] truncate mt-0.5">{w.address}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">{w.layanan.slice(0,3).map((l:string)=><span key={l} className="mono text-[10px] font-bold tracking-wide bg-[#FFFFFF] border border-[#0A0A0A]/10 px-2 py-0.5 rounded-full">{l.toUpperCase()}</span>)}</div>
      </div>
    </div>
  );
}
export function CategoryCard({name, href}:{name:string; href:string}){
  return (
    <Link href={href} className="group relative bg-white border border-[#0A0A0A] rounded-[14px] px-4 py-4 flex items-center justify-between hover:bg-[#0A0A0A] hover:text-white transition">
      <span className="mono text-[12px] font-black tracking-[0.08em]">{name.toUpperCase()}</span>
      <span className="h-7 w-7 rounded-full bg-[#0A0A0A] text-white grid place-items-center group-hover:bg-white group-hover:text-[#0A0A0A] transition">→</span>
    </Link>
  );
}
