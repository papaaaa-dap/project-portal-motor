"use client";
import { useState } from "react";
import type { MaintenanceRule } from "@/lib/types";

export default function RuleForm({
  onSave,
  onClose,
  initial,
}: {
  onSave: (r: MaintenanceRule) => void;
  onClose: () => void;
  initial?: MaintenanceRule | null;
}) {
  const [motorType, setMotorType] = useState<"matic" | "manual" | "all">(initial?.motor_type || "all");
  const [category, setCategory] = useState(initial?.category || "Oli");
  const [title, setTitle] = useState(initial?.title || "");
  const [intervalKm, setIntervalKm] = useState(String(initial?.interval_km || 2000));
  const [intervalDays, setIntervalDays] = useState(String(initial?.interval_days || 60));
  const [description, setDescription] = useState(initial?.description || "");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!title) return setErr("Judul wajib diisi");
    const km = parseInt(intervalKm);
    const days = parseInt(intervalDays);
    if (isNaN(km) || km <= 0) return setErr("Interval KM harus angka > 0");
    if (isNaN(days) || days <= 0) return setErr("Interval Hari harus angka > 0");

    const r: MaintenanceRule = {
      id: initial?.id || `r-${Date.now()}`,
      motor_type: motorType,
      category,
      title,
      interval_km: km,
      interval_days: days,
      description,
    };
    onSave(r);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-xl bg-white rounded-[16px] border border-[#0A0A0A] p-5">
        <div className="flex justify-between items-center">
          <h3 className="font-black">{initial ? "Edit Aturan Perawatan" : "Tambah Aturan Perawatan"}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center">✕</button>
        </div>
        <p className="mono text-[11px] text-neutral-500 mt-1">
          Aturan interval servis ini digunakan pada perhitungan Motor Saya & Pengingat Servis.
        </p>

        <div className="mt-4 grid gap-3">
          <label className="text-xs font-bold">
            Judul Perawatan *
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ganti Oli Mesin / Servis CVT"
              className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">
              Kategori Motor
              <select
                value={motorType}
                onChange={(e) => setMotorType(e.target.value as "matic" | "manual" | "all")}
                className="mt-1 w-full h-9 border rounded-lg px-2 text-sm font-normal bg-white"
              >
                <option value="all">Semua Motor (All)</option>
                <option value="matic">Matic Only</option>
                <option value="manual">Manual Only</option>
              </select>
            </label>

            <label className="text-xs font-bold">
              Kategori Komponen
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Oli / CVT / Rem / Ban / Aki"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">
              Interval (KM) *
              <input
                type="number"
                value={intervalKm}
                onChange={(e) => setIntervalKm(e.target.value)}
                placeholder="2000"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>

            <label className="text-xs font-bold">
              Interval (Hari) *
              <input
                type="number"
                value={intervalDays}
                onChange={(e) => setIntervalDays(e.target.value)}
                placeholder="60"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>
          </div>

          <label className="text-xs font-bold">
            Deskripsi & Panduan
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Wajib 2.000km/2 bulan. Pakai SAE & JASO sesuai buku manual..."
              className="mt-1 w-full border rounded-lg p-3 text-sm font-normal"
            />
          </label>

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}

          <div className="flex gap-2">
            <button onClick={submit} className="flex-1 h-10 rounded-full bg-[#0A0A0A] text-white text-sm font-black">
              {initial ? "Simpan" : "Simpan Aturan"}
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
