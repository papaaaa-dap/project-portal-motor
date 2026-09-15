"use client";
import { useState } from "react";
import type { Article } from "@/lib/types";
import { categories } from "@/lib/data/mocks";
import { slugify } from "@/lib/repo/articlesRepo";

export default function ArticleForm({ onSave, onClose, initial }: { onSave:(a:Article)=>void; onClose:()=>void; initial?: Article|null }){
  const [title, setTitle] = useState(initial?.title||"");
  const [catId, setCatId] = useState(initial?.category_id || categories[0].id);
  const [excerpt, setExcerpt] = useState(initial?.excerpt||"");
  const [content, setContent] = useState(initial?.content||"");
  const [cover, setCover] = useState(initial?.cover_url||"");
  const [err, setErr]=useState("");
  const submit=()=>{
    if(!title) return setErr("Judul wajib");
    const a: Article = {
      id: initial?.id || `a-${Date.now()}`,
      category_id: catId, title, slug: initial?.slug || slugify(title),
      excerpt: excerpt || title.slice(0,80), content: content || excerpt || title,
      cover_url: cover || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
      published: true, created_at: initial?.created_at || new Date().toISOString().slice(0,10)
    };
    onSave(a); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-xl bg-white rounded-[16px] border border-[#0A0A0A] p-5">
        <div className="flex justify-between items-center"><h3 className="font-black">{initial?"Edit Artikel":"Tambah Artikel"}</h3><button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center">✕</button></div>
        <p className="mono text-[11px] text-neutral-500 mt-1">Slug auto dari judul. Cover pakai URL dulu — nanti upload.</p>
        <div className="mt-4 grid gap-3">
          <label className="text-xs font-bold">Judul *<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Kapan Harus Ganti Oli?" className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Kategori<select value={catId} onChange={e=>setCatId(e.target.value)} className="mt-1 w-full h-9 border rounded-lg px-2 text-sm font-normal">{categories.map(c=> <option key={c.id} value={c.id}>{c.name} — {c.type}</option>)}</select></label>
          <label className="text-xs font-bold">Excerpt<textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={2} placeholder="Ringkasan 1-2 kalimat" className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Content<textarea value={content} onChange={e=>setContent(e.target.value)} rows={3} placeholder="Isi lengkap artikel" className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"/></label>
          <label className="text-xs font-bold">Cover URL<input value={cover} onChange={e=>setCover(e.target.value)} placeholder="https://..." className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"/></label>
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}
          <div className="flex gap-2"><button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">{initial?"Simpan":"Simpan Artikel"}</button><button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold">Batal</button></div>
        </div>
      </div>
    </div>
  );
}
