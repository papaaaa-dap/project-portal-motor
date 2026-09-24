"use client";
import { useRef, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { uploadCover } from "@/lib/repo/storageRepo";

// Upload cover/file + preview + fallback tempel URL manual.
// value = URL final (public Storage URL, URL manual, atau path lokal seperti /motor1.jpeg).
export default function CoverUpload({
  value,
  onChange,
  folder,
  label = "Foto",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: "parts" | "workshops" | "articles";
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [raw, setRaw] = useState("");
  const storageReady = isSupabaseConfigured();

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setErr("");
    setRaw("");
    setUploading(true);
    try {
      const url = await uploadCover(f, folder);
      onChange(url);
    } catch (e: unknown) {
      const e2 = e as Error;
      setErr(e2.message);
      const cause = (e as { cause?: unknown }).cause;
      if (typeof cause === "string" && cause !== e2.message) setRaw(cause);
      console.error("[uploadCover] raw:", cause ?? e2);
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="text-xs font-bold">{label}</div>
      <div className="mt-1 flex items-start gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-[#F2F2F2] grid place-items-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <span className="mono text-[10px] text-neutral-400">NO IMG</span>
          )}
        </div>
        <div className="flex-1 grid gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={uploading || !storageReady}
              onClick={() => inputRef.current?.click()}
              title={storageReady ? "Upload ke Supabase Storage" : "Isi .env.local dulu untuk aktifkan upload"}
              className="h-9 px-4 rounded-full bg-[#0A0A0A] text-white text-xs font-bold disabled:opacity-40"
            >
              {uploading ? "Mengupload..." : "Upload File"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="h-9 px-4 rounded-full border bg-white text-xs font-bold">
                Hapus
              </button>
            )}
          </div>
          <input
            value={value}
            onChange={(e) => { setErr(""); onChange(e.target.value); }}
            placeholder="https://... (atau kosongkan = foto lokal default)"
            className="w-full h-9 border rounded-lg px-3 text-sm font-normal"
          />
          {!storageReady && (
            <p className="mono text-[10px] text-neutral-500">Upload nonaktif — Supabase belum dikonfigurasi. Tempel URL manual atau kosongkan.</p>
          )}
          {err && (
            <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
              <div>{err}</div>
              {raw && <div className="mono text-[10px] text-red-500 mt-1 break-all">raw: {raw}</div>}
            </div>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }}
      />
    </div>
  );
}
