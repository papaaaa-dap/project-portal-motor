"use client";
import { useState } from "react";
import type { Article } from "@/lib/types";
import { slugify } from "@/lib/repo/articlesRepo";
import CoverUpload from "@/components/admin/CoverUpload";

export const EDUKASI_CATEGORIES = [
  { id: "pengetahuan", name: "Pengetahuan", slug: "pengetahuan" },
  { id: "komponen", name: "Mengenal Komponen", slug: "komponen" },
  { id: "tips-merawat", name: "Tips Merawat", slug: "tips-merawat" },
  { id: "tips-berkendara", name: "Tips Berkendara", slug: "tips-berkendara" },
];

export default function ArticleForm({
  onSave,
  onClose,
  initial,
}: {
  onSave: (a: Article) => void;
  onClose: () => void;
  initial?: Article | null;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [catId, setCatId] = useState(
    initial?.category_id || EDUKASI_CATEGORIES[0].id
  );
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [cover, setCover] = useState(initial?.cover_url || "");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!title) return setErr("Judul artikel wajib diisi");
    const a: Article = {
      id: initial?.id || `a-${Date.now()}`,
      category_id: catId,
      title,
      slug: initial?.slug || slugify(title),
      excerpt: excerpt || title.slice(0, 80),
      content: content || excerpt || title,
      cover_url: cover || "/motor3.jpeg",
      published: true,
      created_at: initial?.created_at || new Date().toISOString().slice(0, 10),
    };
    onSave(a);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-xl bg-white rounded-[16px] border border-[#0A0A0A] p-5">
        <div className="flex justify-between items-center">
          <h3 className="font-black">{initial ? "Edit Artikel" : "Tambah Artikel"}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center">
            ✕
          </button>
        </div>
        <p className="mono text-[11px] text-neutral-500 mt-1">
          Pilih 1 dari 4 kategori edukasi motor di bawah ini, lalu isi judul dan konten artikel.
        </p>

        <div className="mt-4 grid gap-3">
          <label className="text-xs font-bold">
            Judul Artikel *
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Cara Membaca Kode SAE Pada Oli Mesin"
              className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
            />
          </label>

          <label className="text-xs font-bold">
            Kategori Edukasi *
            <select
              value={catId}
              onChange={(e) => setCatId(e.target.value)}
              className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal bg-white"
            >
              {EDUKASI_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-bold">
            Excerpt (Ringkasan Singkat)
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Ringkasan 1-2 kalimat untuk kartu artikel"
              className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"
            />
          </label>

          <label className="text-xs font-bold">
            Content (Isi Lengkap Artikel)
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Isi penjelasan lengkap artikel..."
              className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"
            />
          </label>

          <CoverUpload value={cover} onChange={setCover} folder="articles" label="Cover (upload / URL)" />

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}

          <div className="flex gap-2">
            <button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">
              {initial ? "Simpan Perubahan" : "Simpan Artikel"}
            </button>
            <button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
