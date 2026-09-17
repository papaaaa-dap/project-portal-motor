"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { workshops, articles } from "@/lib/data/mocks";
import { WorkshopCard, ArticleCard } from "@/components/ui/Card";
import { getBookmarksMock, fetchBookmarks } from "@/lib/repo/bookmarksRepo";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function TersimpanPage(){
  const [aIds, setAIds]=useState<string[]>([]);
  const [wIds, setWIds]=useState<string[]>([]);
  const [tab, setTab]=useState<"bengkel"|"artikel">("bengkel");

  useEffect(()=>{
    const load = async ()=>{
      if(isSupabaseConfigured()){
        try{ const { articles: a, workshops: w } = await fetchBookmarks(); setAIds(a); setWIds(w); return;}catch{}
      }
      const { articles: a, workshops: w } = getBookmarksMock();
      setAIds(a); setWIds(w);
    };
    load();
    const h = ()=>{ const { articles: a, workshops: w } = getBookmarksMock(); setAIds(a); setWIds(w); };
    window.addEventListener("storage", h);
    return ()=> window.removeEventListener("storage", h);
  },[]);

  const aList = articles.filter(a=> aIds.includes(a.id));
  const wList = workshops.filter(w=> wIds.includes(w.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Tersimpan</span></div>
      <h1 className="mt-2 text-2xl font-black">TERSIMPAN</h1>
      <p className="text-sm text-neutral-500">Artikel & bengkel yang kamu ★ Simpan. {isSupabaseConfigured() ? "Sync ke Supabase jika login." : "Lokal (login untuk sync)."}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={()=>setTab("bengkel")} className={`px-4 py-2 rounded-full text-sm font-bold border ${tab==="bengkel" ? "bg-[#0A0A0A] text-white" : "bg-white"}`}>Bengkel ({wList.length})</button>
        <button onClick={()=>setTab("artikel")} className={`px-4 py-2 rounded-full text-sm font-bold border ${tab==="artikel" ? "bg-[#0A0A0A] text-white" : "bg-white"}`}>Artikel ({aList.length})</button>
        <Link href="/bengkel" className="ml-auto h-9 px-4 rounded-full border bg-white text-sm font-bold grid place-items-center">Cari Bengkel →</Link>
      </div>

      {tab==="bengkel" && (
        wList.length ? <div className="mt-6 grid sm:grid-cols-2 gap-3">{wList.map(w=> <WorkshopCard key={w.id} w={w as unknown as { id: string } & typeof w} />)}</div>
        : <div className="mt-10 text-center border rounded-xl p-10 bg-white"><p className="font-bold">Belum ada bengkel tersimpan</p><p className="text-sm text-neutral-500">Buka <Link href="/bengkel" className="underline">Bengkel</Link> → klik ☆ Simpan di kartu.</p></div>
      )}
      {tab==="artikel" && (
        aList.length ? <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{aList.map(a=> <ArticleCard key={a.id} id={a.id} title={a.title} excerpt={a.excerpt} cover={a.cover_url} href={`/perawatan/${a.slug}`} category={a.category_id} />)}</div>
        : <div className="mt-10 text-center border rounded-xl p-10 bg-white"><p className="font-bold">Belum ada artikel tersimpan</p><p className="text-sm text-neutral-500">Buka katalog → klik ☆ Simpan.</p></div>
      )}
    </div>
  );
}
