"use client";
import { useEffect, useMemo, useState } from "react";
import { maintenanceRules as fallbackRules } from "@/lib/data/mocks";
import { fetchPartsSupabase } from "@/lib/repo/partsRepo";
import type { Part } from "@/lib/types";
import { getMotorSpec } from "@/lib/data/motorSpecs";
import type { MaintenanceRecord, MaintenanceRule, Motorcycle } from "@/lib/types";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchMotorcycles, addMotorcycle, deleteMotorcycle, getMotorcyclesMock, touchMotorcycleAfterService } from "@/lib/repo/motorcyclesRepo";
import { fetchAllRecords, addRecord, deleteRecord } from "@/lib/repo/maintenanceRepo";
import { createClient } from "@/lib/supabase/client";

const initial: Motorcycle[] = [
  { id:"m1", brand:"Honda", model:"Vario 160", year:2023, type:"matic", cc:160, kilometer:18500, last_service_date:"2026-01-10" },
  { id:"m2", brand:"Yamaha", model:"NMAX 155", year:2022, type:"matic", cc:155, kilometer:32000, last_service_date:"2026-02-01" },
  { id:"m3", brand:"Yamaha", model:"Vixion 150", year:2021, type:"manual", cc:150, kilometer:28500, last_service_date:"2026-02-12" },
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
      return { rule, sisaKm, sisaHari, status, basis: `Terakhir: ${last.service_date} @ ${last.kilometer.toLocaleString()} km` };
    }
    const sisaKm = rule.interval_km - (m.kilometer % rule.interval_km || rule.interval_km);
    const sisaHari = rule.interval_days - daysSince(m.last_service_date);
    const status: Reminder["status"] = sisaKm <= 0 || sisaHari <= 0 ? "overdue" : sisaKm <= 500 || sisaHari <= 14 ? "soon" : "ok";
    return { rule, sisaKm, sisaHari, status, basis: "Estimasi (belum ada riwayat servis ini)" };
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

const badge: Record<Reminder["status"], string> = {
  overdue: "bg-red-600 text-white border-red-700",
  soon: "bg-amber-400 text-black border-amber-500",
  ok: "bg-green-600 text-white border-green-700",
};
const badgeLabel: Record<Reminder["status"], string> = { overdue: "BUTUH SEKARANG", soon: "SEGERA", ok: "AMAN" };

export default function MotorSaya(){
  const [list, setList]=useState<Motorcycle[]>([]);
  const [rules, setRules]=useState<MaintenanceRule[]>(fallbackRules);
  const [records, setRecords]=useState<Record<string, MaintenanceRecord[]>>({});
  const [show, setShow]=useState(false);
  const [form, setForm]=useState({brand:"", model:"", year:2024, type:"matic" as const, kilometer:0});
  const [loading, setLoading]=useState(false);
  const [userEmail, setUserEmail]=useState<string | null>(null);
  const [msg, setMsg]=useState("");
  const [openServis, setOpenServis]=useState<string | null>(null);
  const [sForm, setSForm]=useState({type:"Ganti Oli Mesin", date:new Date().toISOString().slice(0,10), km:0, cost:"", notes:""});
  const [allParts, setAllParts]=useState<Part[]>([]);

  useEffect(()=>{
    fetchPartsSupabase().then(setAllParts).catch(()=>{});
    // rules live dari Supabase, fallback ke seed statis jika belum configured
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
            // login: Supabase murni — kosong = kosong, jangan tampilkan demo
            const remote = await fetchMotorcycles();
            setList(remote);
            setRecords(await fetchAllRecords(remote.map((m) => m.id)));
            return;
          }catch{}
        }
      }
      const mock = getMotorcyclesMock();
      const base = mock.length ? mock : initial;
      setList(base);
      setRecords(await fetchAllRecords(base.map((m) => m.id)));
    };
    load();
  },[]);

  const add = async ()=>{
    if(!form.brand || !form.model) return;
    setLoading(true); setMsg("");
    try{
      const payload = { brand: form.brand, model: form.model, year: form.year, type: form.type, cc: undefined, kilometer: form.kilometer, last_service_date: new Date().toISOString().slice(0,10) } as Omit<Motorcycle, "id">;
      const next = await addMotorcycle(payload);
      setList(next);
      setRecords(await fetchAllRecords(next.map((m) => m.id)));
      setShow(false); setForm({brand:"", model:"", year:2024, type:"matic", kilometer:0});
      setMsg(isSupabaseConfigured() && userEmail ? "Tersimpan ke Supabase ✓" : "Tersimpan lokal (login untuk sync)");
    }catch(e: unknown){ setMsg("Gagal: " + (e as Error).message); }
    setLoading(false);
  };
  const remove = async (id: string)=>{
    setLoading(true);
    try{
      const next = await deleteMotorcycle(id);
      setList(next);
    }catch(e: unknown){ setMsg("Gagal hapus: " + (e as Error).message); }
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
      setMsg("Riwayat servis tersimpan ✓");
    } catch (e: unknown) { setMsg("Gagal simpan servis: " + (e as Error).message); }
    setLoading(false);
  };

  const hapusServis = async (m: Motorcycle, id: string) => {
    setLoading(true);
    try {
      const updated = await deleteRecord(id, m.id);
      setRecords((prev) => ({ ...prev, [m.id]: updated }));
    } catch (e: unknown) { setMsg("Gagal hapus: " + (e as Error).message); }
    setLoading(false);
  };

  const urgentCount = useMemo(() => {
    let n = 0;
    for (const m of list) for (const r of computeReminders(m, records[m.id] || [], rules)) if (r.status === "overdue") n++;
    return n;
  }, [list, records, rules]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black tracking-tight">MOTOR SAYA</h1>
      <p className="text-sm text-neutral-600">Kelola N motor, catat tiap servis, dan dapat pengingat real berdasar riwayat — bukan estimasi mentah. <span className="font-semibold text-neutral-900">Khusus motor standar</span> — belum bore-up / belum ganti ECU / knalpot racing.</p>
      {urgentCount > 0 && (
        <div className="mt-3 bg-red-600 text-white rounded-xl p-3 text-sm font-bold mono">⚠ {urgentCount} perawatan BUTUH SEKARANG — cek daftar di bawah.</div>
      )}
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs leading-relaxed text-amber-900">
        <b>Disclaimer:</b> Rekomendasi di bawah untuk motor standar pabrik. Jika sudah modif mesin, konsultasi bengkel — interval oli, busi, dan CVT/rantai bisa lebih pendek. Data perawatan lengkap ada di <Link href="/katalog" className="underline font-semibold">Katalog</Link> & <Link href="/edukasi" className="underline font-semibold">Edukasi</Link>.
      </div>
      <div className="mt-4 flex gap-2 items-center flex-wrap">
        <button onClick={()=>setShow(v=>!v)} className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold hover:bg-black transition">+ Tambah Motor</button>
        {userEmail ? <span className="mono text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full">● {userEmail} — sync Supabase aktif</span> : <Link href="/login" className="px-4 py-2 rounded-full border bg-white text-sm">Login untuk sinkronisasi Supabase</Link>}
        {loading && <span className="mono text-xs text-neutral-500">Menyimpan...</span>}
        {msg && <span className="mono text-xs bg-neutral-100 border px-2 py-1 rounded-full">{msg}</span>}
      </div>
      {show && (
        <div className="mt-4 bg-white border rounded-xl p-4 grid sm:grid-cols-5 gap-2">
          <input placeholder="Merek" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} className="h-10 border rounded-lg px-3"/>
          <input placeholder="Model" value={form.model} onChange={e=>setForm({...form, model:e.target.value})} className="h-10 border rounded-lg px-3"/>
          <input type="number" placeholder="Tahun" value={form.year} onChange={e=>setForm({...form, year:parseInt(e.target.value)||0})} className="h-10 border rounded-lg px-3"/>
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value as any})} className="h-10 border rounded-lg px-3">
            <option value="matic">Matic</option><option value="manual">Manual</option><option value="kopling">Kopling</option>
          </select>
          <input type="number" placeholder="Kilometer" value={form.kilometer} onChange={e=>setForm({...form, kilometer:parseInt(e.target.value)||0})} className="h-10 border rounded-lg px-3"/>
          <button onClick={add} disabled={loading} className="sm:col-span-5 h-10 rounded-full bg-neutral-900 text-white font-bold disabled:opacity-50">{loading ? "Menyimpan..." : "Simpan"}</button>
        </div>
      )}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {list.map(m=>{
          const recs = records[m.id] || [];
          const reminders = computeReminders(m, recs, rules);
          const specs = getMotorSpec(m.brand, m.model) || { oli: "Cek Katalog Oli — belum ada spek presisi, pakai generik", banDepan: "-", banBelakang: "-", aki: "-", busi: "-", foto: "/motor2.jpeg" };
          const isPresisi = !!getMotorSpec(m.brand, m.model);
          const oliRec = getOliRekom(m, allParts);
          return (
            <div key={m.id} className="bg-white border border-[#0A0A0A]/10 rounded-[16px] overflow-hidden flex flex-col">
              <div className="h-36 bg-[#F2F2F2] relative overflow-hidden">
                <img src={specs.foto} alt={`${m.brand} ${m.model}`} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 mono text-[10px] font-black bg-[#0A0A0A] text-white px-2 py-1 rounded-full">{m.type.toUpperCase()} • {m.cc ? `${m.cc}CC` : m.type}</span>
                <button onClick={()=> remove(m.id)} disabled={loading} className="absolute top-2 right-2 h-7 px-2 rounded-full bg-white border border-[#0A0A0A]/15 text-xs font-bold disabled:opacity-50">Hapus</button>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-black tracking-tight">{m.brand} {m.model} • {m.year}</h3>
                <p className="text-xs text-neutral-600">{m.kilometer.toLocaleString()} km • Servis terakhir: {m.last_service_date} • {recs.length} riwayat</p>

                {!isPresisi && <div className="mt-2 mono text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-800 px-2 py-1 rounded-full w-fit">SPEK GENERIK — belum presisi buku manual</div>}
                {isPresisi && <div className="mono text-[10px] font-black bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-full w-fit">✓ PREISI BUKU MANUAL</div>}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">OLI STANDAR</div><div className="font-medium leading-tight">{specs.oli}</div>{specs.volumeOli && <div className="mono text-[10px] text-neutral-500">{specs.volumeOli}</div>}</div>
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">BAN</div><div className="font-medium">D {specs.banDepan} • B {specs.banBelakang}</div></div>
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">AKI</div><div className="font-medium">{specs.aki}</div></div>
                  <div className="bg-neutral-50 border rounded-lg p-2"><div className="mono text-[10px] font-bold text-neutral-500">BUSI</div><div className="font-medium">{specs.busi}</div></div>
                </div>

                <h4 className="mt-4 text-sm font-bold">Pengingat Real — dari riwayat</h4>
                <ul className="mt-2 space-y-2">
                  {reminders.map(({rule, sisaKm, sisaHari, status, basis})=>(
                    <li key={rule.id} className="bg-neutral-50 border rounded-lg px-3 py-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-semibold">{rule.title}</span>
                        <span className={`mono text-[10px] font-black px-2 py-0.5 rounded-full border ${badge[status]}`}>{badgeLabel[status]}</span>
                      </div>
                      <div className="mono text-[11px] text-neutral-600 mt-1">
                        {sisaKm <= 0 || sisaHari <= 0 ? "Sudah lewat jadwal — servis sekarang." : `${sisaKm.toLocaleString()} km lagi • ~${sisaHari} hari lagi`}
                      </div>
                      <div className="text-[11px] text-neutral-500">{basis} • interval {rule.interval_km.toLocaleString()}km / {rule.interval_days}h</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex flex-wrap gap-1">
                  {oliRec.map(o=> <Link key={o.id} href={`/katalog/${o.slug}`} className="text-[11px] bg-white border border-amber-200 px-2 py-1 rounded-full font-medium hover:bg-[#0A0A0A] hover:text-white transition">{o.brand} {o.name} • Rp {o.harga_min.toLocaleString("id-ID")}</Link>)}
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={()=> openServis === m.id ? setOpenServis(null) : openAddServis(m)} className="px-3 py-1.5 rounded-full bg-[#0A0A0A] text-white text-xs font-bold">+ Catat Servis</button>
                  <Link href="/katalog" className="px-3 py-1.5 rounded-full border bg-white text-xs font-bold">Katalog</Link>
                  <Link href="/bengkel" className="px-3 py-1.5 rounded-full border bg-white text-xs font-bold">Bengkel</Link>
                </div>

                {openServis === m.id && (
                  <div className="mt-3 border rounded-xl p-3 grid grid-cols-2 gap-2 bg-neutral-50">
                    <select value={sForm.type} onChange={(e)=>setSForm({...sForm, type:e.target.value})} className="col-span-2 h-10 border rounded-lg px-3 bg-white">
                      {rulesFor(m, rules).map((r)=><option key={r.id} value={r.title}>{r.title} — tiap {r.interval_km.toLocaleString()}km</option>)}
                    </select>
                    <input type="date" value={sForm.date} onChange={(e)=>setSForm({...sForm, date:e.target.value})} className="h-10 border rounded-lg px-3 bg-white"/>
                    <input type="number" placeholder="Km saat servis" value={sForm.km} onChange={(e)=>setSForm({...sForm, km:Number(e.target.value)})} className="h-10 border rounded-lg px-3 bg-white"/>
                    <input type="number" placeholder="Biaya Rp (opsional)" value={sForm.cost} onChange={(e)=>setSForm({...sForm, cost:e.target.value})} className="h-10 border rounded-lg px-3 bg-white"/>
                    <input placeholder="Catatan (opsional)" value={sForm.notes} onChange={(e)=>setSForm({...sForm, notes:e.target.value})} className="h-10 border rounded-lg px-3 bg-white"/>
                    <button onClick={()=>saveServis(m)} disabled={loading} className="col-span-2 h-10 rounded-full bg-neutral-900 text-white font-bold disabled:opacity-50">{loading ? "Menyimpan..." : "Simpan Servis"}</button>
                  </div>
                )}

                <h4 className="mt-4 text-sm font-bold">Riwayat Servis ({recs.length})</h4>
                {recs.length === 0 ? (
                  <p className="mt-1 text-xs text-neutral-500">Belum ada riwayat — pengingat masih estimasi. Catat servis pertama biar reminder jadi real.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {recs.map((r)=>(
                      <li key={r.id} className="border rounded-lg px-3 py-2 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="font-bold">{r.service_type}</span>
                          <button onClick={()=>hapusServis(m, r.id)} disabled={loading} className="text-neutral-400 hover:text-red-600 font-bold disabled:opacity-50">Hapus</button>
                        </div>
                        <div className="mono text-[11px] text-neutral-600">{r.service_date} • {r.kilometer.toLocaleString()} km{r.cost ? ` • Rp ${Number(r.cost).toLocaleString("id-ID")}` : ""}</div>
                        {r.notes && <div className="text-neutral-600 mt-0.5">{r.notes}</div>}
                        {(r.next_service_km || r.next_service_date) && (
                          <div className="mono text-[11px] text-green-700 mt-0.5">Berikutnya: {r.next_service_km ? `${Number(r.next_service_km).toLocaleString()} km` : ""}{r.next_service_km && r.next_service_date ? " / " : ""}{r.next_service_date || ""}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {list.length===0 && <p className="mt-10 text-center text-neutral-500">Belum ada motor. Tambah dulu.</p>}
    </div>
  );
}
