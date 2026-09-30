"use client";
import { useEffect, useMemo, useState } from "react";
import { maintenanceRules as fallbackRules } from "@/lib/data/mocks";
import { fetchPartsSupabase } from "@/lib/repo/partsRepo";
import { fetchMotorSpecsSupabase } from "@/lib/repo/motorSpecsRepo";
import type { Part, MotorSpecItem } from "@/lib/types";
import { getMotorSpec } from "@/lib/data/motorSpecs";
import type { MaintenanceRecord, MaintenanceRule, Motorcycle } from "@/lib/types";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchMotorcycles, addMotorcycle, deleteMotorcycle, getMotorcyclesMock, touchMotorcycleAfterService } from "@/lib/repo/motorcyclesRepo";
import { fetchAllRecords, addRecord, deleteRecord } from "@/lib/repo/maintenanceRepo";
import { createClient } from "@/lib/supabase/client";

const POPULAR_PRESETS = [
  { brand: "Honda", model: "Vario 160", year: 2023, type: "matic" as const, kilometer: 15000 },
  { brand: "Honda", model: "BeAT 110", year: 2022, type: "matic" as const, kilometer: 12000 },
  { brand: "Yamaha", model: "NMAX 155", year: 2023, type: "matic" as const, kilometer: 20000 },
  { brand: "Yamaha", model: "Aerox 155", year: 2022, type: "matic" as const, kilometer: 18000 },
  { brand: "Honda", model: "Vario 125", year: 2022, type: "matic" as const, kilometer: 14000 },
  { brand: "Yamaha", model: "Vixion 150", year: 2021, type: "manual" as const, kilometer: 25000 },
  { brand: "Vespa", model: "Sprint 150", year: 2022, type: "matic" as const, kilometer: 11000 },
];

function rulesFor(m: Motorcycle, rules: MaintenanceRule[]): MaintenanceRule[] {
  const t = m.type === "kopling" ? "manual" : m.type;
  return rules.filter((r) => r.motor_type === "all" || r.motor_type === t);
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

type Reminder = { rule: MaintenanceRule; sisaKm: number; sisaHari: number; status: "overdue" | "soon" | "ok"; basis: string };

function computeReminders(m: Motorcycle, recs: MaintenanceRecord[], rules: MaintenanceRule[]): Reminder[] {
  return rulesFor(m, rules).map((rule) => {
    const last = recs.find((r) => r.service_type === rule.title);
    if (last) {
      const pakaiKm = Math.max(0, m.kilometer - last.kilometer);
      const sisaKm = rule.interval_km - pakaiKm;
      const sisaHari = rule.interval_days - daysSince(last.service_date);
      const status: Reminder["status"] = sisaKm <= 0 || sisaHari <= 0 ? "overdue" : sisaKm <= 500 || sisaHari <= 14 ? "soon" : "ok";
      return { rule, sisaKm, sisaHari, status, basis: `Terakhir: ${last.service_date} (${last.kilometer.toLocaleString()} km)` };
    }
    const sisaKm = rule.interval_km - (m.kilometer % rule.interval_km || rule.interval_km);
    const sisaHari = rule.interval_days - daysSince(m.last_service_date);
    const status: Reminder["status"] = sisaKm <= 0 || sisaHari <= 0 ? "overdue" : sisaKm <= 500 || sisaHari <= 14 ? "soon" : "ok";
    return { rule, sisaKm, sisaHari, status, basis: "Estimasi awal (belum ada catatan servis)" };
  }).sort((a, b) => Math.min(a.sisaKm / a.rule.interval_km, a.sisaHari / a.rule.interval_days) - Math.min(b.sisaKm / b.rule.interval_km, b.sisaHari / b.rule.interval_days));
}

function getOliRekom(m: Motorcycle, parts: Part[]){
  const oli = parts.filter(p=> p.category==="oli-mesin");
  const exact = oli.filter(o=> o.cocok_motor.some(cm=> {
    const full = `${m.brand} ${m.model}`.toLowerCase();
    return full.includes(cm.toLowerCase()) || cm.toLowerCase().includes(m.model.toLowerCase());
  }));
  if(exact.length) return exact.slice(0,2);
  if(m.type==="matic" && (m.cc||0) <=125) return oli.filter(o=> (o.specs["Untuk"]||"").includes("Matic")).slice(0,2);
  if(m.type==="matic") return oli.slice(0,2);
  return oli.filter(o=> (o.specs["Untuk"]||"").includes("Manual") || (o.specs["Untuk"]||"").includes("Matic & Manual")).slice(0,2);
}

const badgeStyle: Record<Reminder["status"], string> = {
  overdue: "bg-red-50 text-red-700 border-red-200",
  soon: "bg-amber-50 text-amber-800 border-amber-200",
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const badgeText: Record<Reminder["status"], string> = {
  overdue: "⚠ Butuh Servis!",
  soon: "🟡 Segera Servis",
  ok: "✓ Kondisi Aman",
};

export default function MotorSaya(){
  const [list, setList]=useState<Motorcycle[]>([]);
  const [rules, setRules]=useState<MaintenanceRule[]>(fallbackRules);
  const [records, setRecords]=useState<Record<string, MaintenanceRecord[]>>({});
  const [showForm, setShowForm]=useState(false);
  const [form, setForm]=useState({brand:"", model:"", year:2023, type:"matic" as "matic" | "manual" | "kopling", kilometer:10000});
  const [loading, setLoading]=useState(false);
  const [userEmail, setUserEmail]=useState<string | null>(null);
  const [msg, setMsg]=useState("");
  const [openServis, setOpenServis]=useState<string | null>(null);
  const [sForm, setSForm]=useState({type:"Ganti Oli Mesin", date:new Date().toISOString().slice(0,10), km:0, cost:"", notes:""});
  const [allParts, setAllParts]=useState<Part[]>([]);
  const [dbSpecs, setDbSpecs]=useState<MotorSpecItem[]>([]);
  const [activeTab, setActiveTab]=useState<Record<string, "jadwal" | "spek" | "riwayat">>({});

  useEffect(()=>{
    fetchPartsSupabase().then(setAllParts).catch(()=>{});
    fetchMotorSpecsSupabase().then(setDbSpecs).catch(()=>{});
    (async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const sb = createClient();
        const { data } = await sb.from("maintenance_rules").select("*");
        if (data && data.length) setRules(data as unknown as MaintenanceRule[]);
      } catch {}
    })();
  },[]);

  useEffect(()=>{
    const load = async ()=>{
      if(isSupabaseConfigured()){
        const sb = createClient();
        const { data: { user } } = await sb.auth.getUser();
        setUserEmail(user?.email ?? null);
        if(user){
          try{
            const remote = await fetchMotorcycles();
            setList(remote);
            setRecords(await fetchAllRecords(remote.map((m) => m.id)));
            return;
          }catch{}
        }
      }
      const mock = getMotorcyclesMock();
      setList(mock);
      setRecords(await fetchAllRecords(mock.map((m) => m.id)));
    };
    load();
  },[]);

  const add = async (e?: React.FormEvent)=>{
    if(e) e.preventDefault();
    if(!form.brand.trim() || !form.model.trim()) {
      setMsg("Mohon isi Merek dan Model motor Anda.");
      return;
    }
    setLoading(true); setMsg("");
    try{
      const payload = {
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year) || 2023,
        type: form.type,
        cc: undefined,
        kilometer: Number(form.kilometer) || 0,
        last_service_date: new Date().toISOString().slice(0,10)
      } as Omit<Motorcycle, "id">;

      const next = await addMotorcycle(payload);
      setList(next);
      setRecords(await fetchAllRecords(next.map((m) => m.id)));
      setShowForm(false);
      setForm({brand:"", model:"", year:2023, type:"matic", kilometer:10000});
      setMsg("✅ Motor berhasil ditambahkan!");
    }catch(err: unknown){
      setMsg("Gagal menambah motor: " + (err as Error).message);
    }
    setLoading(false);
  };

  const applyPreset = (p: typeof POPULAR_PRESETS[0]) => {
    setForm({
      brand: p.brand,
      model: p.model,
      year: p.year,
      type: p.type,
      kilometer: p.kilometer
    });
  };

  const remove = async (id: string, name: string)=>{
    if(!confirm(`Apakah Anda yakin ingin menghapus ${name} dari daftar motor Anda?`)) return;
    setLoading(true);
    try{
      const next = await deleteMotorcycle(id);
      setList(next);
      setMsg("Motor berhasil dihapus.");
    }catch(err: unknown){
      setMsg("Gagal menghapus: " + (err as Error).message);
    }
    setLoading(false);
  };

  const openAddServis = (m: Motorcycle) => {
    setOpenServis(m.id);
    setSForm({ type: "Ganti Oli Mesin", date: new Date().toISOString().slice(0,10), km: m.kilometer, cost: "", notes: "" });
  };

  const saveServis = async (m: Motorcycle) => {
    if (!sForm.km && sForm.km !== 0) return;
    setLoading(true); setMsg("");
    try {
      const rule = rules.find((r) => r.title === sForm.type);
      const km = Number(sForm.km) || m.kilometer;
      const nextKm = rule ? km + rule.interval_km : undefined;
      const d = new Date(sForm.date + "T00:00:00");
      const nextDate = rule && !isNaN(d.getTime()) ? new Date(d.getTime() + rule.interval_days * 86400000).toISOString().slice(0, 10) : undefined;
      const updated = await addRecord({
        motorcycle_id: m.id,
        service_type: sForm.type,
        kilometer: km,
        service_date: sForm.date,
        cost: sForm.cost ? Number(sForm.cost) : null,
        notes: sForm.notes || null,
        next_service_km: nextKm,
        next_service_date: nextDate,
      });
      setRecords((prev) => ({ ...prev, [m.id]: updated }));
      const nextList = await touchMotorcycleAfterService(m.id, km, sForm.date);
      if (nextList.length) setList(nextList);
      else setList((prev) => prev.map((x) => x.id === m.id ? { ...x, kilometer: Math.max(x.kilometer, km), last_service_date: sForm.date } : x));
      setOpenServis(null);
      setMsg("✅ Catatan servis berhasil disimpan!");
    } catch (err: unknown) { setMsg("Gagal simpan servis: " + (err as Error).message); }
    setLoading(false);
  };

  const hapusServis = async (m: Motorcycle, id: string) => {
    if(!confirm("Hapus catatan servis ini?")) return;
    setLoading(true);
    try {
      const updated = await deleteRecord(id, m.id);
      setRecords((prev) => ({ ...prev, [m.id]: updated }));
    } catch (err: unknown) { setMsg("Gagal hapus: " + (err as Error).message); }
    setLoading(false);
  };

  const urgentCount = useMemo(() => {
    let n = 0;
    for (const m of list) for (const r of computeReminders(m, records[m.id] || [], rules)) if (r.status === "overdue") n++;
    return n;
  }, [list, records, rules]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <span>🏍 Garasi Digital Anda</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">MOTOR SAYA</h1>
            <p className="text-sm text-neutral-300 mt-1 max-w-xl">
              Pantau kesehatan motor, dapatkan jadwal pengingat ganti oli & perawatan tepat waktu berdasarkan speedometer Anda.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 text-neutral-900 font-bold hover:bg-amber-300 transition flex items-center justify-center gap-2 shadow"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Motor Baru
          </button>
        </div>

        {/* Sync Status Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {userEmail ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Tersinkronisasi dengan akun: {userEmail}
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-200 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
                Tersimpan di browser lokal. <Link href="/login" className="underline font-bold text-white hover:text-amber-300">Login</Link> untuk sinkronisasi otomatis ke akun Anda.
              </span>
            )}
          </div>
          {msg && (
            <span className="bg-white/20 text-white px-3 py-1 rounded-full font-medium">
              {msg}
            </span>
          )}
        </div>
      </div>

      {/* 3 Step Guide */}
      <div className="mt-8 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Cara Kerja & Alur Fitur Motor Saya</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-black text-sm flex items-center justify-center shrink-0">1</div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">1. Masukkan Motor</h4>
              <p className="text-xs text-neutral-600 mt-0.5">Pilih jenis motor Anda & isi posisi kilometer speedometer saat ini.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-black text-sm flex items-center justify-center shrink-0">2</div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">2. Cek Pengingat Servis</h4>
              <p className="text-xs text-neutral-600 mt-0.5">Sistem akan otomatis menghitung kapan harus ganti oli, ban, rem, & CVT.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-black text-sm flex items-center justify-center shrink-0">3</div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">3. Catat Habis Servis</h4>
              <p className="text-xs text-neutral-600 mt-0.5">Klik "+ Catat Servis" tiap dari bengkel agar pengingat berikutnya otomatis diperbarui!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alert Banner if any overdue */}
      {urgentCount > 0 && (
        <div className="mt-6 bg-red-500 text-white rounded-xl p-4 font-bold text-sm flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>Ada <b>{urgentCount} komponen perawatan</b> yang sudah saatnya diganti / diservis! Cek detail di bawah.</span>
          </div>
        </div>
      )}

      {/* Modal / Card Form Tambah Motor */}
      {showForm && (
        <div className="mt-6 bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-xl relative animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center pb-4 mb-4 border-b">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Tambah Motor ke Garasi</h3>
              <p className="text-xs text-neutral-500">Pilih dari rekomendasi cepat atau ketik detail motor Anda.</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>

          {/* Quick Presets */}
          <div className="mb-5">
            <label className="text-xs font-bold text-neutral-500 block mb-2">PILIH CEPAT MOTOR POPULER:</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PRESETS.map((p) => (
                <button
                  key={`${p.brand}-${p.model}`}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-xs font-medium transition"
                >
                  + {p.brand} {p.model}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={add} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Merek Motor <span className="text-red-500">*</span></label>
                <input
                  placeholder="Contoh: Honda, Yamaha, Vespa"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full h-10 border rounded-lg px-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Model / Tipe <span className="text-red-500">*</span></label>
                <input
                  placeholder="Contoh: Vario 160, NMAX 155, BeAT"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full h-10 border rounded-lg px-3 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Tipe Transmisi</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full h-10 border rounded-lg px-3 text-sm bg-white"
                >
                  <option value="matic">Matic (Otomatis)</option>
                  <option value="manual">Manual (Gigi / Bebek)</option>
                  <option value="kopling">Kopling Manual (Sport)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Tahun Pembuatan</label>
                <input
                  type="number"
                  placeholder="2023"
                  value={form.year || ""}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 2023 })}
                  className="w-full h-10 border rounded-lg px-3 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Kilometer Saat Ini (KM)</label>
                <input
                  type="number"
                  placeholder="Contoh: 15000"
                  value={form.kilometer || ""}
                  onChange={(e) => setForm({ ...form, kilometer: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 border rounded-lg px-3 text-sm font-mono"
                  required
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">Cek angka di speedometer motor Anda saat ini.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-black transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Motor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Motor Cards */}
      <div className="mt-8 space-y-6">
        {list.map((m) => {
          const recs = records[m.id] || [];
          const reminders = computeReminders(m, recs, rules);
          const matchedDbSpec = dbSpecs.find(
            (s) => s.brand.toLowerCase() === m.brand.toLowerCase() && s.model.toLowerCase() === m.model.toLowerCase()
          );
          const specs = matchedDbSpec
            ? {
                oli: matchedDbSpec.oli,
                volumeOli: matchedDbSpec.volume_oli,
                banDepan: matchedDbSpec.ban_depan,
                banBelakang: matchedDbSpec.ban_belakang,
                aki: matchedDbSpec.aki,
                busi: matchedDbSpec.busi,
                foto: "/motor2.jpeg",
              }
            : getMotorSpec(m.brand, m.model) || {
                oli: "Gunakan Oli Standar Pabrik",
                banDepan: "-",
                banBelakang: "-",
                aki: "-",
                busi: "-",
                foto: "/motor2.jpeg",
              };
          const isPresisi = !!matchedDbSpec || !!getMotorSpec(m.brand, m.model);
          const oliRec = getOliRekom(m, allParts);
          const tab = activeTab[m.id] || "jadwal";

          return (
            <div key={m.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-300 transition">
              {/* Motor Header Banner */}
              <div className="bg-neutral-900 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0 border border-white/10 shadow-inner">
                    🏍️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black tracking-tight">{m.brand} {m.model}</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                        {m.type} • {m.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-300 font-mono">
                      <span>Speedometer: <b className="text-amber-300">{m.kilometer.toLocaleString()} km</b></span>
                      <span>•</span>
                      <span>Servis Terakhir: {m.last_service_date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => openServis === m.id ? setOpenServis(null) : openAddServis(m)}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-900 text-xs font-bold hover:bg-amber-300 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    + Catat Servis
                  </button>
                  <button
                    onClick={() => remove(m.id, `${m.brand} ${m.model}`)}
                    disabled={loading}
                    className="p-2 rounded-xl bg-white/10 text-neutral-300 hover:bg-red-500 hover:text-white transition text-xs font-bold"
                    title="Hapus Motor"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form Tambah Catatan Servis Inline */}
              {openServis === m.id && (
                <div className="bg-amber-50/70 border-b border-amber-200 p-5">
                  <h4 className="text-sm font-bold text-amber-950 mb-1">Catat Servis Baru untuk {m.brand} {m.model}</h4>
                  <p className="text-xs text-amber-900 mb-3">Isi komponen yang baru saja diservis agar jadwal pengingat otomatis diperbarui.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">Jenis Servis</label>
                      <select
                        value={sForm.type}
                        onChange={(e) => setSForm({ ...sForm, type: e.target.value })}
                        className="w-full h-9 border rounded-lg px-3 text-xs bg-white"
                      >
                        {rulesFor(m, rules).map((r) => (
                          <option key={r.id} value={r.title}>{r.title} (Interval: {r.interval_km.toLocaleString()} km)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">Tanggal Servis</label>
                      <input
                        type="date"
                        value={sForm.date}
                        onChange={(e) => setSForm({ ...sForm, date: e.target.value })}
                        className="w-full h-9 border rounded-lg px-3 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">KM di Speedometer Saat Servis</label>
                      <input
                        type="number"
                        placeholder={String(m.kilometer)}
                        value={sForm.km}
                        onChange={(e) => setSForm({ ...sForm, km: Number(e.target.value) })}
                        className="w-full h-9 border rounded-lg px-3 text-xs bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">Biaya (Rp, Opsional)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 75000"
                        value={sForm.cost}
                        onChange={(e) => setSForm({ ...sForm, cost: e.target.value })}
                        className="w-full h-9 border rounded-lg px-3 text-xs bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">Catatan Tambahan (Opsional)</label>
                      <input
                        placeholder="Contoh: Ganti oli merk MPX2 di Bengkel AHASS"
                        value={sForm.notes}
                        onChange={(e) => setSForm({ ...sForm, notes: e.target.value })}
                        className="w-full h-9 border rounded-lg px-3 text-xs bg-white"
                      />
                    </div>

                    <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setOpenServis(null)}
                        className="px-4 py-2 rounded-lg border bg-white text-xs font-semibold text-neutral-700"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => saveServis(m)}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-black transition disabled:opacity-50"
                      >
                        {loading ? "Menyimpan..." : "Simpan Catatan Servis"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Tabs inside Card */}
              <div className="flex border-b text-xs font-bold text-neutral-600 bg-neutral-50 px-4 pt-2 gap-1">
                <button
                  onClick={() => setActiveTab((prev) => ({ ...prev, [m.id]: "jadwal" }))}
                  className={`px-4 py-2 rounded-t-lg border-t border-x transition ${tab === "jadwal" ? "bg-white text-neutral-900 border-neutral-200 -mb-px font-extrabold" : "border-transparent hover:text-neutral-900"}`}
                >
                  📋 Jadwal Pengingat Servis ({reminders.length})
                </button>
                <button
                  onClick={() => setActiveTab((prev) => ({ ...prev, [m.id]: "spek" }))}
                  className={`px-4 py-2 rounded-t-lg border-t border-x transition ${tab === "spek" ? "bg-white text-neutral-900 border-neutral-200 -mb-px font-extrabold" : "border-transparent hover:text-neutral-900"}`}
                >
                  🔧 Spesifikasi Pabrik Motor
                </button>
                <button
                  onClick={() => setActiveTab((prev) => ({ ...prev, [m.id]: "riwayat" }))}
                  className={`px-4 py-2 rounded-t-lg border-t border-x transition ${tab === "riwayat" ? "bg-white text-neutral-900 border-neutral-200 -mb-px font-extrabold" : "border-transparent hover:text-neutral-900"}`}
                >
                  📝 Riwayat Servis ({recs.length})
                </button>
              </div>

              <div className="p-5">
                {/* TAB 1: Jadwal Pengingat Servis */}
                {tab === "jadwal" && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {reminders.map(({ rule, sisaKm, sisaHari, status, basis }) => (
                        <div key={rule.id} className={`p-4 rounded-xl border ${badgeStyle[status]} flex flex-col justify-between`}>
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-sm text-neutral-900">{rule.title}</h4>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeStyle[status]}`}>
                                {badgeText[status]}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600 mt-1">{rule.description || `Interval ideal: tiap ${rule.interval_km.toLocaleString()} km.`}</p>
                          </div>

                          <div className="mt-3 pt-3 border-t border-black/5">
                            <div className="font-mono text-xs font-bold">
                              {sisaKm <= 0 || sisaHari <= 0 ? (
                                <span className="text-red-700 font-bold">⚠️ Sudah melewati batas servis! Segera ke bengkel.</span>
                              ) : (
                                <span>Tersisa <b>{sisaKm.toLocaleString()} km</b> lagi (sekitar {sisaHari} hari)</span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">{basis}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Rekomendasi Oli Cepat */}
                    {oliRec.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <label className="text-xs font-bold text-neutral-500 block mb-2">REKOMENDASI OLI TERBAIK UNTUK {m.brand.toUpperCase()} {m.model.toUpperCase()}:</label>
                        <div className="flex flex-wrap gap-2">
                          {oliRec.map((o) => (
                            <Link
                              key={o.id}
                              href={`/katalog/${o.slug}`}
                              className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-medium hover:bg-neutral-900 hover:text-white transition flex items-center gap-1.5"
                            >
                              <span>🛢 {o.brand} {o.name}</span>
                              <span className="font-bold text-neutral-900 hover:text-amber-300">Rp {o.harga_min.toLocaleString("id-ID")}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Spesifikasi Pabrik Motor */}
                {tab === "spek" && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {isPresisi ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          ✓ Presisi Buku Manual Resmi
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          ℹ️ Gunakan Rekomendasi Standar Pabrik
                        </span>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="bg-neutral-50 border rounded-xl p-3">
                        <div className="font-bold text-neutral-400 text-[10px] uppercase">Oli Mesin Standar</div>
                        <div className="font-semibold text-neutral-900 mt-1">{specs.oli}</div>
                        {specs.volumeOli && <div className="text-[10px] font-mono text-neutral-500 mt-0.5">Kapasitas: {specs.volumeOli}</div>}
                      </div>

                      <div className="bg-neutral-50 border rounded-xl p-3">
                        <div className="font-bold text-neutral-400 text-[10px] uppercase">Ukuran Ban Standar</div>
                        <div className="font-semibold text-neutral-900 mt-1">Depan: {specs.banDepan}</div>
                        <div className="font-semibold text-neutral-900">Belakang: {specs.banBelakang}</div>
                      </div>

                      <div className="bg-neutral-50 border rounded-xl p-3">
                        <div className="font-bold text-neutral-400 text-[10px] uppercase">Tipe Aki / Baterai</div>
                        <div className="font-semibold text-neutral-900 mt-1">{specs.aki}</div>
                      </div>

                      <div className="bg-neutral-50 border rounded-xl p-3">
                        <div className="font-bold text-neutral-400 text-[10px] uppercase">Tipe Busi Standar</div>
                        <div className="font-semibold text-neutral-900 mt-1">{specs.busi}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href="/katalog" className="text-xs px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold hover:bg-black transition">
                        Cek Katalog Sparepart
                      </Link>
                      <Link href="/bengkel" className="text-xs px-4 py-2 rounded-xl border border-neutral-300 font-bold hover:bg-neutral-100 transition">
                        Cari Bengkel Terdekat
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 3: Riwayat Servis */}
                {tab === "riwayat" && (
                  <div>
                    {recs.length === 0 ? (
                      <div className="text-center py-6 bg-neutral-50 border border-dashed rounded-xl">
                        <p className="text-sm font-bold text-neutral-700">Belum Ada Riwayat Servis Terdaftar</p>
                        <p className="text-xs text-neutral-500 mt-1">Klik "+ Catat Servis" di atas setelah Anda melakukan pergantian oli / servis di bengkel.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recs.map((r) => (
                          <div key={r.id} className="p-3 border rounded-xl bg-neutral-50 flex justify-between items-center text-xs">
                            <div>
                              <div className="font-bold text-neutral-900 text-sm">{r.service_type}</div>
                              <div className="font-mono text-neutral-600 mt-0.5">
                                📅 {r.service_date} • 🛣️ {r.kilometer.toLocaleString()} km {r.cost ? ` • 💰 Rp ${Number(r.cost).toLocaleString("id-ID")}` : ""}
                              </div>
                              {r.notes && <div className="text-neutral-500 italic mt-0.5">"{r.notes}"</div>}
                            </div>
                            <button
                              onClick={() => hapusServis(m, r.id)}
                              disabled={loading}
                              className="text-neutral-400 hover:text-red-600 font-bold text-xs p-1"
                              title="Hapus riwayat"
                            >
                              ✕ Hapus
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State when zero motors */}
        {list.length === 0 && (
          <div className="bg-white border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center my-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl mb-3">
              🏍️
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Garasi Motor Anda Masih Kosong</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-6">
              Tambahkan motor pertama Anda sekarang untuk memantau waktu ganti oli, servis rutin, dan sparepart yang cocok secara otomatis.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-bold hover:bg-black transition shadow"
            >
              + Tambah Motor Pertama Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
