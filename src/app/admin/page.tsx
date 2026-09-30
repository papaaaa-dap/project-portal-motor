"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Part, Workshop, Article, MotorProblem, MaintenanceRule, MotorSpecItem } from "@/lib/types";
import PartForm from "@/components/admin/PartForm";
import WorkshopForm from "@/components/admin/WorkshopForm";
import ArticleForm, { EDUKASI_CATEGORIES } from "@/components/admin/ArticleForm";
import ProblemForm from "@/components/admin/ProblemForm";
import RuleForm from "@/components/admin/RuleForm";
import MotorSpecForm from "@/components/admin/MotorSpecForm";
import { fetchPartsSupabase, deletePartSupabase } from "@/lib/repo/partsRepo";
import { fetchWorkshopsSupabase, deleteWorkshopSupabase } from "@/lib/repo/workshopsRepo";
import {
  fetchArticlesSupabase,
  upsertArticleSupabase,
  deleteArticleSupabase,
} from "@/lib/repo/articlesRepo";
import { fetchProblemsSupabase, deleteProblemSupabase } from "@/lib/repo/problemsRepo";
import { fetchRulesSupabase, upsertRuleSupabase, deleteRuleSupabase } from "@/lib/repo/rulesRepo";
import { fetchMotorSpecsSupabase, upsertMotorSpecSupabase, deleteMotorSpecSupabase } from "@/lib/repo/motorSpecsRepo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";
import { checkStorageHealth, STORAGE_FIX_SQL, type StorageHealth } from "@/lib/repo/storageRepo";
import { ADMIN_RLS_FIX_SQL } from "@/lib/repo/rlsFix";

const TABS = ["Katalog", "Bengkel", "Artikel", "Masalah", "Perawatan", "Spek Motor"] as const;
const PROJECT_REF = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace("https://", "").split(".")[0] || "?";

export default function Admin() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Katalog");
  const [list, setList] = useState<Part[]>([]);
  const [wList, setWList] = useState<Workshop[]>([]);
  const [aList, setAList] = useState<Article[]>([]);
  const [pList, setPList] = useState<MotorProblem[]>([]);
  const [rList, setRList] = useState<MaintenanceRule[]>([]);
  const [specList, setSpecList] = useState<MotorSpecItem[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [wQ, setWQ] = useState("");
  const [showForm, setShowForm] = useState<null | "part" | "bengkel" | "artikel" | "masalah" | "rule" | "spec">(null);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [editingW, setEditingW] = useState<Workshop | null>(null);
  const [editingA, setEditingA] = useState<Article | null>(null);
  const [editingP, setEditingP] = useState<MotorProblem | null>(null);
  const [editingR, setEditingR] = useState<MaintenanceRule | null>(null);
  const [editingSpec, setEditingSpec] = useState<MotorSpecItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminChecked, setAdminChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState<StorageHealth | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedRls, setCopiedRls] = useState(false);

  const copyStorageSql = async () => {
    try {
      await navigator.clipboard.writeText(STORAGE_FIX_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Gagal menyalin — blokir clipboard browser.");
    }
  };

  const copyRlsSql = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_RLS_FIX_SQL);
      setCopiedRls(true);
      setTimeout(() => setCopiedRls(false), 2000);
    } catch {
      alert("Gagal menyalin — blokir clipboard browser.");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [p, w, a, m, r, s] = await Promise.all([
          fetchPartsSupabase().catch(() => []),
          fetchWorkshopsSupabase().catch(() => []),
          fetchArticlesSupabase().catch(() => []),
          fetchProblemsSupabase().catch(() => []),
          fetchRulesSupabase().catch(() => []),
          fetchMotorSpecsSupabase().catch(() => []),
        ]);
        setList(p);
        setWList(w);
        setAList(a);
        setPList(m);
        setRList(r);
        setSpecList(s);
      } catch {}
      try {
        setStorage(await checkStorageHealth());
      } catch {}
      if (isSupabaseConfigured()) {
        const sb = createClient();
        const { data } = await sb.auth.getUser();
        const email = data.user?.email ?? null;
        setAdminEmail(email);
        if (!data.user) {
          setIsAdmin(false);
          setAdminChecked(true);
          setLoading(false);
          return;
        }
        const { data: profile } = await sb.from("profiles").select("role").eq("id", data.user.id).single();
        setIsAdmin(profile?.role === "admin");
        setAdminChecked(true);
        if (profile?.role !== "admin") {
          setTimeout(() => {
            if (window.location.pathname === "/admin") {
              alert("Akun ini bukan admin. Mengalihkan ke beranda.");
              window.location.href = "/motor-saya";
            }
          }, 400);
        }
      } else {
        setAdminChecked(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSavePart = async (p: Part) => {
    if (!isAdmin) { alert("Butuh role admin."); return; }
    try {
      const { upsertPartSupabase } = await import("@/lib/repo/partsRepo");
      setList(await upsertPartSupabase(p));
    } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleSaveW = async (w: Workshop) => {
    if (!isAdmin) { alert("Butuh role admin."); return; }
    try {
      const { upsertWorkshopSupabase } = await import("@/lib/repo/workshopsRepo");
      setWList(await upsertWorkshopSupabase(w));
    } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleSaveA = async (a: Article) => {
    if (!isAdmin) { alert("Butuh role admin."); return; }
    try {
      setAList(await upsertArticleSupabase(a));
    } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleSaveP = async (p: MotorProblem) => {
    if (!isAdmin) { alert("Butuh role admin."); return; }
    try {
      const { upsertProblemSupabase } = await import("@/lib/repo/problemsRepo");
      setPList(await upsertProblemSupabase(p));
    } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleSaveR = async (r: MaintenanceRule) => {
    if (!isAdmin) { alert("Butuh role admin."); return; }
    try {
      setRList(await upsertRuleSupabase(r));
    } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };

  const handleDeletePart = async (idOrSlug: string) => {
    if (!isAdmin) return;
    if (!confirm("Hapus part ini?")) return;
    try { setList(await deletePartSupabase(idOrSlug)); } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleDeleteW = async (idOrSlug: string) => {
    if (!isAdmin) return;
    if (!confirm("Hapus bengkel?")) return;
    try { setWList(await deleteWorkshopSupabase(idOrSlug)); } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleDeleteA = async (idOrSlug: string) => {
    if (!isAdmin) return;
    if (!confirm("Hapus artikel?")) return;
    try { setAList(await deleteArticleSupabase(idOrSlug)); } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleDeleteP = async (idOrSlug: string) => {
    if (!isAdmin) return;
    if (!confirm("Hapus masalah?")) return;
    try { setPList(await deleteProblemSupabase(idOrSlug)); } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleDeleteR = async (id: string) => {
    if (!isAdmin) return;
    if (!confirm("Hapus aturan perawatan ini?")) return;
    try { setRList(await deleteRuleSupabase(id)); } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleSaveSpec = async (spec: MotorSpecItem) => {
    if (!isAdmin) { alert("Butuh role admin."); return; }
    try {
      setSpecList(await upsertMotorSpecSupabase(spec));
    } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };
  const handleDeleteSpec = async (id: string) => {
    if (!isAdmin) return;
    if (!confirm("Hapus spesifikasi motor ini?")) return;
    try { setSpecList(await deleteMotorSpecSupabase(id)); } catch (e: unknown) { alert("Supabase error: " + (e as Error).message); }
  };

  const cats = ["Semua", ...Array.from(new Set(list.map((p) => p.category)))];
  const filtered = list.filter((p) => {
    if (cat !== "Semua" && p.category !== cat) return false;
    if (
      q &&
      !(
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.category.includes(q.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const filteredW = wList.filter((w) => {
    if (!wQ.trim()) return true;
    const s = wQ.toLowerCase().trim();
    return (
      w.name.toLowerCase().includes(s) ||
      w.kecamatan.toLowerCase().includes(s) ||
      w.address.toLowerCase().includes(s) ||
      (w.layanan || []).some((l) => l.toLowerCase().includes(s))
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap justify-between gap-3 items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight">PANEL KELOLA KONTEN — MOTORKITA</h1>
          <p className="text-sm text-neutral-600">
            Sistem Manajemen Data —{" "}
            {adminEmail ? (
              <>
                Terhubung sebagai <b>{adminEmail}</b>
                {adminChecked && isAdmin ? " (Administrator)" : adminChecked ? " (Akses Terbatas)" : ""}
              </>
            ) : (
              "Belum Terhubung"
            )}
            . {isAdmin ? "Akses Manajemen Data Aktif." : "Memerlukan akses Administrator."}
            {loading && " Memuat data..."}
          </p>
          {adminChecked && !isAdmin && adminEmail && (
            <p className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2 text-amber-900">
              Akun <b>{adminEmail}</b> belum memiliki akses admin. Silakan ubah role akun menjadi <code>admin</code> pada database.
            </p>
          )}
          {adminChecked && !adminEmail && (
            <p className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2 text-amber-900">
              Belum login —{" "}
              <Link href="/login" className="underline font-bold">
                Masuk ke Akun Admin
              </Link>
            </p>
          )}
          {storage && !storage.ok && (
            <div className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2 text-amber-900">
              <div>
                <b>Storage:</b> {storage.message}
              </div>
            </div>
          )}
          {storage?.ok && (
            <p className="mt-2 text-xs bg-green-50 border border-green-200 rounded-lg p-2 text-green-800">
              <b>Penyimpanan Gambar:</b> Terhubung dan Siap Digunakan.
            </p>
          )}
        </div>
        <span
          className={`h-9 px-4 rounded-full text-xs font-black border grid place-items-center ${
            isAdmin ? "bg-green-600 text-white border-green-600" : "bg-white border-[#0A0A0A]/15"
          }`}
        >
          {isAdmin ? "✓ Admin Aktif" : "Bukan Admin"}
        </span>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-bold border whitespace-nowrap ${
              tab === t ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white hover:bg-neutral-100"
            }`}
          >
            {t}{" "}
            {t === "Katalog"
              ? `(${list.length})`
              : t === "Bengkel"
              ? `(${wList.length})`
              : t === "Artikel"
              ? `(${aList.length})`
              : t === "Masalah"
              ? `(${pList.length})`
              : `(${rList.length})`}
          </button>
        ))}
      </div>
      <p className="mono mt-1 text-[11px] text-neutral-500">
        Alur konten: Katalog → /katalog • Bengkel → /bengkel • Artikel → /edukasi • Masalah → /cek-masalah & /panduan-darurat • Perawatan → /motor-saya.
      </p>

      {tab === "Katalog" && (
        <div className="mt-4 bg-white border border-[#0A0A0A] rounded-[16px] p-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <h3 className="font-black">KATALOG — OLI & SPAREPART</h3>
            <button
              disabled={!isAdmin}
              onClick={() => {
                setEditingPart(null);
                setShowForm("part");
              }}
              className={`h-9 px-4 rounded-full text-sm font-black ${
                isAdmin ? "bg-[#0A0A0A] text-white hover:bg-black" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              + Tambah Part
            </button>
          </div>
          <p className="mono text-[11px] text-neutral-500 mt-1">Part only • Jasa terpisah ±30-120rb. Data Supabase langsung.</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari: Shell, Ban, Busi..."
              className="h-9 flex-1 min-w-[180px] border rounded-full px-4 text-sm bg-white"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="h-9 border rounded-full px-3 text-sm bg-white"
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="h-9 px-3 rounded-full bg-neutral-100 border mono text-xs grid place-items-center">
              {filtered.length} item
            </span>
          </div>

          <div className="mt-3 max-h-[420px] overflow-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 mono text-[11px] sticky top-0">
                <tr>
                  <th className="text-left p-2">Nama</th>
                  <th className="text-left p-2">Kategori</th>
                  <th className="text-left p-2">Harga</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-neutral-50">
                    <td className="p-2">
                      <div className="font-bold leading-tight truncate max-w-[220px]">
                        {p.brand} {p.name}
                      </div>
                      <div className="mono text-[11px] text-neutral-500 truncate max-w-[220px]">{p.slug}</div>
                    </td>
                    <td className="p-2 mono text-xs">{p.category}</td>
                    <td className="p-2 text-xs whitespace-nowrap">Rp {p.harga_min.toLocaleString("id-ID")}</td>
                    <td className="p-2 flex gap-1">
                      <button
                        disabled={!isAdmin}
                        onClick={() => {
                          setEditingPart(p);
                          setShowForm("part");
                        }}
                        className={`h-7 px-2 rounded-full text-xs font-bold border ${
                          isAdmin ? "bg-white hover:bg-[#0A0A0A] hover:text-white" : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        disabled={!isAdmin}
                        onClick={() => handleDeletePart(p.slug || p.id)}
                        className={`h-7 px-2 rounded-full text-xs font-bold border ${
                          isAdmin
                            ? "bg-white hover:bg-red-600 hover:text-white hover:border-red-600"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sm text-neutral-500">
                      Belum ada part di Supabase. Tambah via tombol di atas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Bengkel" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Bengkel ({wList.length})</h3>
            <button
              disabled={!isAdmin}
              onClick={() => {
                setEditingW(null);
                setShowForm("bengkel");
              }}
              className={`h-8 px-3 rounded-full text-xs font-black border ${
                isAdmin ? "bg-[#0A0A0A] text-white hover:bg-black" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              + Tambah Bengkel
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">CRUD Supabase langsung — tabel workshops.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={wQ}
              onChange={(e) => setWQ(e.target.value)}
              placeholder="Cari: nama, kecamatan, layanan... cth: Tambal Ban"
              className="h-9 flex-1 min-w-[180px] border rounded-full px-4 text-sm bg-white"
            />
            <span className="h-9 px-3 rounded-full bg-neutral-100 border mono text-xs grid place-items-center">
              {filteredW.length} / {wList.length}
            </span>
          </div>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {filteredW.map((w) => (
              <li key={w.id} className="flex justify-between items-center border-b py-2 gap-2">
                <span className="truncate pr-2">
                  <b>{w.name}</b>{" "}
                  {(w.lat == null || w.lng == null) && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 ml-1">
                      tanpa pin
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 block truncate">
                    — {w.kecamatan} • {w.jam_operasional} • {(w.layanan || []).slice(0, 2).join(", ")}
                    {(w.lat == null || w.lng == null) && " • klik Edit → isi Lat/Lng"}
                  </span>
                </span>
                <span className="flex gap-1 shrink-0">
                  <button
                    disabled={!isAdmin}
                    onClick={() => {
                      setEditingW(w);
                      setShowForm("bengkel");
                    }}
                    className={`h-7 px-2 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-[#0A0A0A] hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleDeleteW(w.slug || w.id)}
                    className={`h-7 px-2 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-red-600 hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Hapus
                  </button>
                </span>
              </li>
            ))}
            {filteredW.length === 0 && (
              <li className="py-8 text-center text-sm text-neutral-500">
                {wList.length === 0 ? "Belum ada bengkel di Supabase." : `Tidak ketemu "${wQ}". Coba kata lain.`}
              </li>
            )}
          </ul>
        </div>
      )}

      {tab === "Artikel" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Edukasi / Artikel ({aList.length})</h3>
            <button
              disabled={!isAdmin}
              onClick={() => {
                setEditingA(null);
                setShowForm("artikel");
              }}
              className={`h-8 px-3 rounded-full text-xs font-black border ${
                isAdmin ? "bg-[#0A0A0A] text-white hover:bg-black" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              + Tambah Artikel
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Tambah & kelola artikel edukasi motor. Pilih kategori saat menambah artikel.
          </p>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {aList.map((a) => {
              const matchedCat = EDUKASI_CATEGORIES.find(
                (c) => c.id === a.category_id || c.slug === a.category_id
              );
              const cName = matchedCat ? matchedCat.name : "Pengetahuan";
              return (
                <li key={a.id} className="flex justify-between items-center border-b py-2 gap-2">
                  <span className="truncate pr-2">
                    <b>{a.title}</b>{" "}
                    <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-700 font-bold">
                      {cName}
                    </span>{" "}
                    <span className="text-xs text-neutral-500">— {a.slug}</span>
                  </span>
                  <span className="flex gap-1 shrink-0">
                    <button
                      disabled={!isAdmin}
                      onClick={() => {
                        setEditingA(a);
                        setShowForm("artikel");
                      }}
                      className={`h-7 px-2 rounded-full text-xs font-bold border ${
                        isAdmin ? "bg-white hover:bg-[#0A0A0A] hover:text-white" : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      disabled={!isAdmin}
                      onClick={() => handleDeleteA(a.slug || a.id)}
                      className={`h-7 px-2 rounded-full text-xs font-bold border ${
                        isAdmin ? "bg-white hover:bg-red-600 hover:text-white" : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      Hapus
                    </button>
                  </span>
                </li>
              );
            })}
            {aList.length === 0 && (
              <li className="py-8 text-center text-sm text-neutral-500">Belum ada artikel di Supabase.</li>
            )}
          </ul>
        </div>
      )}

      {tab === "Masalah" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Masalah & Darurat ({pList.length})</h3>
            <button
              disabled={!isAdmin}
              onClick={() => {
                setEditingP(null);
                setShowForm("masalah");
              }}
              className={`h-8 px-3 rounded-full text-xs font-black border ${
                isAdmin ? "bg-[#0A0A0A] text-white hover:bg-black" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              + Tambah Masalah
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Emergency tampil di Panduan Darurat & Cek Masalah.</p>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {pList.map((m) => (
              <li key={m.id} className="flex justify-between items-center border-b py-2 gap-2">
                <span className="truncate pr-2">
                  {m.title}{" "}
                  <span className={`text-xs px-1 rounded ${m.is_emergency ? "bg-amber-100 text-amber-900" : "bg-neutral-100"}`}>
                    {m.is_emergency ? "darurat" : "biasa"}
                  </span>{" "}
                  <span className="text-xs text-neutral-500">— {m.category}</span>
                </span>
                <span className="flex gap-1 shrink-0">
                  <button
                    disabled={!isAdmin}
                    onClick={() => {
                      setEditingP(m);
                      setShowForm("masalah");
                    }}
                    className={`h-7 px-2 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-[#0A0A0A] hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleDeleteP(m.slug || m.id)}
                    className={`h-7 px-2 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-red-600 hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Hapus
                  </button>
                </span>
              </li>
            ))}
            {pList.length === 0 && <li className="py-8 text-center text-sm text-neutral-500">Belum ada masalah di Supabase.</li>}
          </ul>
        </div>
      )}

      {tab === "Perawatan" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Aturan Perawatan Berkala ({rList.length})</h3>
            <button
              disabled={!isAdmin}
              onClick={() => {
                setEditingR(null);
                setShowForm("rule");
              }}
              className={`h-8 px-3 rounded-full text-xs font-black border ${
                isAdmin ? "bg-[#0A0A0A] text-white hover:bg-black" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              + Tambah Aturan
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">CRUD Supabase — tabel maintenance_rules (digunakan untuk Motor Saya).</p>
          <ul className="mt-3 text-sm space-y-1 max-h-[420px] overflow-auto">
            {rList.map((r) => (
              <li key={r.id} className="flex justify-between items-center border-b py-2 gap-2">
                <span className="truncate pr-2">
                  <b>{r.title}</b>{" "}
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 border rounded font-mono">
                    {r.motor_type}
                  </span>{" "}
                  <span className="text-xs text-neutral-500">
                    — {r.category} • {r.interval_km.toLocaleString("id-ID")} km / {r.interval_days} hari
                  </span>
                </span>
                <span className="flex gap-1 shrink-0">
                  <button
                    disabled={!isAdmin}
                    onClick={() => {
                      setEditingR(r);
                      setShowForm("rule");
                    }}
                    className={`h-7 px-2 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-[#0A0A0A] hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleDeleteR(r.id)}
                    className={`h-7 px-2 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-red-600 hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Hapus
                  </button>
                </span>
              </li>
            ))}
            {rList.length === 0 && (
              <li className="py-8 text-center text-sm text-neutral-500">Belum ada aturan perawatan di Supabase.</li>
            )}
          </ul>
        </div>
      )}

      {tab === "Spek Motor" && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold">Spesifikasi Motor Resmi Pabrikan ({specList.length})</h3>
            <button
              disabled={!isAdmin}
              onClick={() => {
                setEditingSpec(null);
                setShowForm("spec");
              }}
              className={`h-8 px-3 rounded-full text-xs font-black border ${
                isAdmin ? "bg-[#0A0A0A] text-white hover:bg-black" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              + Tambah Spek Motor
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">CRUD Supabase — tabel motor_specs (otomatis dipasang di Motor Saya).</p>
          <ul className="mt-3 text-sm space-y-2 max-h-[460px] overflow-auto">
            {specList.map((s) => (
              <li key={s.id} className="border rounded-xl p-3 bg-neutral-50 flex justify-between items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <b>{s.brand} {s.model}</b>
                    <span className="text-[10px] px-2 py-0.5 bg-neutral-200 border rounded font-mono uppercase font-bold">
                      {s.type}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    🛢️ Oli: <b>{s.oli}</b> ({s.volume_oli}) • 🛞 Ban: D {s.ban_depan} / B {s.ban_belakang} • 🔋 Aki: {s.aki} • ⚡ Busi: {s.busi}
                  </div>
                  {s.catatan && <div className="text-[11px] text-neutral-500 italic mt-0.5">"{s.catatan}"</div>}
                </div>
                <span className="flex gap-1 shrink-0">
                  <button
                    disabled={!isAdmin}
                    onClick={() => {
                      setEditingSpec(s);
                      setShowForm("spec");
                    }}
                    className={`h-7 px-3 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-[#0A0A0A] hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleDeleteSpec(s.id)}
                    className={`h-7 px-3 rounded-full text-xs font-bold border ${
                      isAdmin ? "bg-white hover:bg-red-600 hover:text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    Hapus
                  </button>
                </span>
              </li>
            ))}
            {specList.length === 0 && (
              <li className="py-8 text-center text-sm text-neutral-500">Belum ada spesifikasi motor di Supabase.</li>
            )}
          </ul>
        </div>
      )}

      {showForm === "part" && <PartForm initial={editingPart} onSave={handleSavePart} onClose={() => setShowForm(null)} />}
      {showForm === "bengkel" && <WorkshopForm initial={editingW} onSave={handleSaveW} onClose={() => setShowForm(null)} />}
      {showForm === "artikel" && <ArticleForm initial={editingA} onSave={handleSaveA} onClose={() => setShowForm(null)} />}
      {showForm === "masalah" && <ProblemForm initial={editingP} onSave={handleSaveP} onClose={() => setShowForm(null)} />}
      {showForm === "rule" && <RuleForm initial={editingR} onSave={handleSaveR} onClose={() => setShowForm(null)} />}
      {showForm === "spec" && <MotorSpecForm initial={editingSpec} onSave={handleSaveSpec} onClose={() => setShowForm(null)} />}

      <div className="mt-6">
        <Link href="/" className="text-sm text-neutral-900 hover:underline">
          ← Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
