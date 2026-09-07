"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchAll } from "@/lib/data/mocks";

export default function SearchBar({ large }: { large?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const r = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const res = q.trim().length >= 2 ? searchAll(q) : { art: [], bengkel: [], masalah: [] };
  const hasResults = res.art.length + res.bengkel.length + res.masalah.length > 0;
  const showDropdown = open && q.trim().length >= 2;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { setOpen(false); r.push(`/search?q=${encodeURIComponent(q)}`); }
  };

  return (
    <div ref={ref} className={`relative w-full ${large ? "max-w-[640px]" : "max-w-xl"}`}>
      <form onSubmit={submit} className="w-full">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </span>
          <input
            value={q}
            onChange={e=>{setQ(e.target.value); setOpen(true);}}
            onFocus={()=> q.trim().length>=2 && setOpen(true)}
            placeholder="Cari: ganti oli, ban bocor, temukan bengkel terdekat..."
            className={`w-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] rounded-full pl-11 pr-4 mono text-[13px] placeholder:text-[var(--muted-foreground)] outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:border-[var(--foreground)] ${large?"h-[48px]":"h-10"}`}
          />
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-[16px] shadow-[4px_4px_0_var(--foreground)] overflow-hidden z-50 max-h-[420px] overflow-y-auto">
          {!hasResults ? (
            <div className="p-4 text-sm text-[#717171] text-center">Tidak ada hasil untuk &quot;{q}&quot;</div>
          ) : (
            <div className="p-2 space-y-3">
              {res.art.length>0 && (
                <div>
                  <div className="mono text-[10px] tracking-[0.12em] font-black text-[#717171] px-2 py-1">ARTIKEL • {res.art.length}</div>
                  {res.art.slice(0,3).map(a=>(
                    <Link key={a.id} href={`/perawatan/${a.slug}`} onClick={()=>setOpen(false)} className="flex gap-3 p-2 rounded-[10px] hover:bg-[#F2F2F2] transition">
                      <img src={a.cover_url} alt="" className="h-10 w-10 rounded-[8px] object-cover border border-black/10 shrink-0"/>
                      <div className="min-w-0"><div className="text-[13px] font-bold leading-tight line-clamp-1">{a.title}</div><div className="text-xs text-[#717171] line-clamp-1">{a.excerpt}</div></div>
                    </Link>
                  ))}
                </div>
              )}
              {res.bengkel.length>0 && (
                <div>
                  <div className="mono text-[10px] tracking-[0.12em] font-black text-[#717171] px-2 py-1">BENGKEL • {res.bengkel.length}</div>
                  {res.bengkel.slice(0,3).map(w=>(
                    <Link key={w.id} href={`/bengkel/${w.id}`} onClick={()=>setOpen(false)} className="flex gap-3 p-2 rounded-[10px] hover:bg-[#F2F2F2] transition">
                      <img src={w.foto_url} alt="" className="h-10 w-10 rounded-[8px] object-cover border border-black/10 shrink-0"/>
                      <div className="min-w-0"><div className="text-[13px] font-bold leading-tight truncate">{w.name}</div><div className="text-xs text-[#717171] truncate">{w.kecamatan} - {w.address}</div></div>
                    </Link>
                  ))}
                </div>
              )}
              {res.masalah.length>0 && (
                <div>
                  <div className="mono text-[10px] tracking-[0.12em] font-black text-[#717171] px-2 py-1">MASALAH • {res.masalah.length}</div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {res.masalah.slice(0,4).map(m=>(
                      <Link key={m.id} href={`/cek-masalah`} onClick={()=>setOpen(false)} className="mono text-[11px] font-bold bg-[#F2F2F2] border border-[#0A0A0A]/10 px-2.5 py-1 rounded-full hover:bg-[#0A0A0A] hover:text-white transition">{m.title}</Link>
                    ))}
                  </div>
                </div>
              )}
              <Link href={`/search?q=${encodeURIComponent(q)}`} onClick={()=>setOpen(false)} className="block mx-2 mb-2 mt-1 h-9 rounded-full bg-[#0A0A0A] text-white mono text-xs font-black tracking-[0.06em] grid place-items-center hover:bg-black transition">LIHAT SEMUA HASIL →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
