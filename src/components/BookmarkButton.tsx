"use client";
import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { toggleBookmarkArticle, toggleBookmarkWorkshop, getBookmarksMock } from "@/lib/repo/bookmarksRepo";

export default function BookmarkButton({ kind, id, className }: { kind: "article" | "workshop"; id: string; className?: string }) {
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { articles, workshops } = getBookmarksMock();
    setActive(kind === "article" ? articles.includes(id) : workshops.includes(id));
  }, [kind, id]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setBusy(true);
    const next = kind === "article" ? await toggleBookmarkArticle(id) : await toggleBookmarkWorkshop(id);
    setActive(next);
    setBusy(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={active ? "Hapus bookmark" : "Simpan"}
      className={`h-8 px-2.5 rounded-full border text-xs font-bold flex items-center gap-1 transition ${active ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white border-[#0A0A0A]/15 hover:border-[#0A0A0A]"} ${className || ""}`}
      title={isSupabaseConfigured() ? (active ? "Tersimpan — klik hapus" : "Simpan ke Tersimpan") : "Tersimpan lokal (login untuk sync)"}
    >
      <span>{active ? "★" : "☆"}</span> {active ? "Tersimpan" : "Simpan"}
    </button>
  );
}
