"use client";
import { useState } from "react";
import type { MotorSpecItem } from "@/lib/types";

export default function MotorSpecForm({
  onSave,
  onClose,
  initial,
}: {
  onSave: (s: MotorSpecItem) => void;
  onClose: () => void;
  initial?: MotorSpecItem | null;
}) {
  const [brand, setBrand] = useState(initial?.brand || "");
  const [model, setModel] = useState(initial?.model || "");
  const [type, setType] = useState<"matic" | "manual" | "kopling">(initial?.type || "matic");
  const [oli, setOli] = useState(initial?.oli || "");
  const [volumeOli, setVolumeOli] = useState(initial?.volume_oli || "");
  const [banDepan, setBanDepan] = useState(initial?.ban_depan || "");
  const [banBelakang, setBanBelakang] = useState(initial?.ban_belakang || "");
  const [aki, setAki] = useState(initial?.aki || "");
  const [busi, setBusi] = useState(initial?.busi || "");
  const [catatan, setCatatan] = useState(initial?.catatan || "");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!brand.trim() || !model.trim()) return setErr("Merek dan Model wajib diisi.");
    const item: MotorSpecItem = {
      id: initial?.id || `spec-${Date.now()}`,
      brand: brand.trim(),
      model: model.trim(),
      type,
      oli: oli.trim() || "Oli Standar Pabrik",
      volume_oli: volumeOli.trim() || "0.8L",
      ban_depan: banDepan.trim() || "-",
      ban_belakang: banBelakang.trim() || "-",
      aki: aki.trim() || "-",
      busi: busi.trim() || "-",
      catatan: catatan.trim(),
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto">
      <div className="mx-auto max-w-xl bg-white rounded-[16px] border border-[#0A0A0A] p-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="font-extrabold text-lg text-neutral-900">{initial ? "Edit Spesifikasi Motor" : "Tambah Spesifikasi Motor Baru"}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full border grid place-items-center font-bold">✕</button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 mb-4">
          Spesifikasi resmi motor ini akan otomatis ditampilkan di fitur <b>Motor Saya</b> untuk seluruh pengguna.
        </p>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold text-neutral-700">
              Merek Motor *
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Contoh: Honda, Yamaha, Vespa"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>

            <label className="text-xs font-bold text-neutral-700">
              Model / Tipe Motor *
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Contoh: Vario 160, NMAX 155"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs font-bold text-neutral-700">
              Tipe Transmisi
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="mt-1 w-full h-9 border rounded-lg px-2 text-sm font-normal bg-white"
              >
                <option value="matic">Matic</option>
                <option value="manual">Manual (Gigi)</option>
                <option value="kopling">Kopling Sport</option>
              </select>
            </label>

            <label className="text-xs font-bold text-neutral-700">
              Kapasitas Oli (Volume)
              <input
                value={volumeOli}
                onChange={(e) => setVolumeOli(e.target.value)}
                placeholder="Contoh: 0.8L atau 0.9L"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>

            <label className="text-xs font-bold text-neutral-700">
              Rekomendasi Oli
              <input
                value={oli}
                onChange={(e) => setOli(e.target.value)}
                placeholder="Contoh: 10W-30 MB"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold text-neutral-700">
              Ukuran Ban Depan
              <input
                value={banDepan}
                onChange={(e) => setBanDepan(e.target.value)}
                placeholder="Contoh: 90/80-14"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>

            <label className="text-xs font-bold text-neutral-700">
              Ukuran Ban Belakang
              <input
                value={banBelakang}
                onChange={(e) => setBanBelakang(e.target.value)}
                placeholder="Contoh: 100/80-14"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold text-neutral-700">
              Tipe Aki / Baterai
              <input
                value={aki}
                onChange={(e) => setAki(e.target.value)}
                placeholder="Contoh: GTZ6V (MF 12V 5Ah)"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>

            <label className="text-xs font-bold text-neutral-700">
              Tipe Busi Standar
              <input
                value={busi}
                onChange={(e) => setBusi(e.target.value)}
                placeholder="Contoh: NGK CPR8EA-9"
                className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
              />
            </label>
          </div>

          <label className="text-xs font-bold text-neutral-700">
            Catatan / Keterangan Tambahan
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Matic 160cc eSP+, garansi 5 tahun"
              className="mt-1 w-full h-9 border rounded-lg px-3 text-sm font-normal"
            />
          </label>

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">{err}</div>}

          <div className="flex gap-2 pt-2">
            <button onClick={submit} className="flex-1 h-10 rounded-full bg-neutral-900 text-white text-sm font-extrabold hover:bg-black transition">
              {initial ? "Simpan Perubahan" : "Simpan Spesifikasi Motor"}
            </button>
            <button onClick={onClose} className="h-10 px-6 rounded-full border bg-white text-sm font-bold hover:bg-neutral-100 transition">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
