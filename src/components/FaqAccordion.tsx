"use client";
import { useState } from "react";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items, allowContact=false }: { items: FaqItem[]; allowContact?: boolean }){
  const [open, setOpen] = useState<number|null>(0);
  return (
    <div className="space-y-2">
      {items.map((f,i)=>{
        const isOpen = open===i;
        return (
          <div key={i} className={`bg-[var(--card)] border rounded-[14px] overflow-hidden ${isOpen?"border-[var(--foreground)] shadow-[2px_2px_0_var(--foreground)]":"border-[var(--border)]"}`}>
            <button onClick={()=> setOpen(isOpen?null:i)} className="w-full text-left px-4 py-3 flex items-center justify-between gap-3">
              <span className="font-bold text-sm leading-tight text-[var(--foreground)]">{f.q}</span>
              <span className={`shrink-0 h-7 w-7 rounded-full grid place-items-center border text-xs font-black transition ${isOpen?"bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]":"bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"}`}>{isOpen?"−":"+"}</span>
            </button>
            {isOpen && <div className="px-4 pb-4 text-sm leading-relaxed text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">{f.a}</div>}
          </div>
        );
      })}
      {allowContact && (
        <div className="mt-6 bg-[#0A0A0A] text-white rounded-[14px] p-5">
          <h4 className="font-black tracking-tight">Masih bingung?</h4>
          <p className="text-sm text-white/70 mt-1">Hubungi tim Motorkita — bukan bot, balas manual jam kerja.</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 mono text-xs">
            <a href="mailto:halo@motorkita.id" className="h-9 px-4 rounded-full bg-white text-[#0A0A0A] font-black grid place-items-center hover:bg-neutral-200 transition">halo@motorkita.id</a>
            <a href="https://wa.me/6285852209624" target="_blank" className="h-9 px-4 rounded-full border border-white/20 text-white font-bold grid place-items-center hover:bg-white/10 transition">WA 0811-2345-678</a>
          </div>
          <p className="mono text-[11px] text-white/40 mt-2">Jam balas: 08:00–17:00 WIB • Surabaya</p>
        </div>
      )}
    </div>
  );
}
