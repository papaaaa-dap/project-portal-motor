import Link from "next/link";
import { getOpenStatus } from "@/lib/openStatus";

export function ArticleCard({title, excerpt, cover, href, category, id}:{title:string; excerpt:string; cover:string; href:string; category:string; id?:string}){
  return (
    <div className="group relative bg-[var(--card)] rounded-[16px] border border-[var(--border)] overflow-hidden flex flex-col hover:shadow-[4px_4px_0_var(--border)] hover:-translate-y-[2px] transition-all">
      <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
      <div className="h-[176px] overflow-hidden bg-[var(--muted)] relative">
        <img src={cover} alt={title} className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-500"/>
        <div className="absolute inset-0 ring-1 ring-inset ring-[var(--foreground)]/10 pointer-events-none" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="mono text-[10px] tracking-[0.12em] font-black bg-[var(--foreground)] text-[var(--background)] border border-[var(--foreground)] px-2 py-1 rounded-full w-fit">{category.toUpperCase()}</span>
        <h3 className="mt-2 font-black leading-[1.15] text-[15px] tracking-[-0.02em] line-clamp-2 group-hover:underline decoration-2 underline-offset-4">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted-foreground)] line-clamp-2">{excerpt}</p>
        <div className="mt-3 flex items-center gap-1.5 mono text-[11px] font-bold tracking-[0.06em]">
          <span className="h-6 px-2 rounded-full bg-[var(--foreground)] text-[var(--background)] grid place-items-center">BACA</span>
          <span className="text-[var(--foreground)] group-hover:translate-x-0.5 transition">→</span>
        </div>
      </div>
    </div>
  );
}
export function WorkshopCard({w}:{w:any}){
  const open = getOpenStatus(w.jam_operasional);
  return (
    <div className="group bg-[var(--card)] rounded-[14px] border border-[var(--border)] p-3 flex gap-3 hover:shadow-[3px_3px_0_var(--border)] hover:-translate-y-[1px] transition-all relative">
      <Link href={`/bengkel/${w.id}`} className="absolute inset-0 z-10" aria-label={w.name} />
      <div className="relative shrink-0">
        <img src={w.foto_url} alt={w.name} className="h-[84px] w-[84px] rounded-[10px] object-cover border border-[var(--border)]"/>
        <span className="absolute -bottom-2 -right-2 bg-[var(--foreground)] text-[var(--background)] border border-[var(--foreground)] mono text-[10px] font-black px-1.5 py-0.5 rounded-full">{w.rating}</span>
        <span className={`absolute -top-1 -left-1 mono text-[9px] font-black px-1.5 py-0.5 rounded-full border ${open.isOpen ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"}`}>{open.isOpen ? "BUKA" : "TUTUP"}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-black text-[13px] leading-tight tracking-[-0.02em] line-clamp-1">{w.name.toUpperCase()}</h3>
        <p className="mono text-[11px] truncate flex items-center gap-1.5">
          <span className={open.isOpen ? "text-green-600 font-bold" : "text-red-600 font-bold"}>● {open.isOpen ? "Buka" : "Tutup"}</span>
          <span className="text-[var(--muted-foreground)]">• {open.label}</span>
        </p>
        <p className="mono text-[11px] text-[var(--muted-foreground)] truncate">{w.kecamatan} • {w.jam_operasional}</p>
        <p className="text-[11px] text-[var(--muted-foreground)] truncate mt-0.5">{w.address}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">{w.layanan.slice(0,3).map((l:string)=><span key={l} className="mono text-[10px] font-bold tracking-wide bg-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded-full">{l.toUpperCase()}</span>)}</div>
      </div>
    </div>
  );
}
export function CategoryCard({name, href}:{name:string; href:string}){
  return (
    <Link href={href} className="group relative bg-[var(--card)] border border-[var(--border)] rounded-[14px] px-4 py-4 flex items-center justify-between hover:bg-[var(--foreground)] hover:text-[var(--background)] transition">
      <span className="mono text-[12px] font-black tracking-[0.08em]">{name.toUpperCase()}</span>
      <span className="h-7 w-7 rounded-full bg-[var(--foreground)] text-[var(--background)] grid place-items-center group-hover:bg-[var(--background)] group-hover:text-[var(--foreground)] transition">→</span>
    </Link>
  );
}
