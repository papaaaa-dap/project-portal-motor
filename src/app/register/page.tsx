"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!configured) {
      localStorage.setItem("motorkita_mock_user", JSON.stringify({ email, name }));
      setMsg("Mock daftar sukses — silakan Masuk Mock di halaman login.");
      setTimeout(() => router.push("/login"), 800);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
        setMsg("Batas email Supabase tercapai (Rate Limit). Untuk testing/dev, matikan 'Confirm email' di Supabase Dashboard -> Authentication -> Providers -> Email.");
      } else {
        setMsg(error.message);
      }
      return;
    }

    if (data?.user?.identities?.length === 0) {
      setMsg("Email ini sudah terdaftar. Silakan ke halaman Masuk/Login.");
      return;
    }

    setMsg("Pendaftaran berhasil! Akun Anda langsung aktif tanpa konfirmasi email. Mengalihkan ke halaman login...");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Daftar RideIn</h1>
      {!configured && (
        <p className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 text-amber-900">
          Mode mock — isi env untuk Supabase auth asli.
        </p>
      )}
      <form className="mt-6 space-y-3 bg-white border rounded-xl p-6" onSubmit={onSubmit}>
        <input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 border rounded-lg px-3" required />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 border rounded-lg px-3" required />
        <div className="relative">
          <input
            placeholder="Password (min 6)"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 border rounded-lg pl-3 pr-10"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition"
            title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.015 10.015 0 014.122-.963c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-6.177-3.47a3 3 0 004.243-4.243M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <button disabled={loading} className="w-full h-10 rounded-full bg-[#0A0A0A] text-white font-bold hover:bg-black transition disabled:opacity-60">
          {loading ? "Memproses..." : "Daftar"}
        </button>
        {msg && <p className="text-xs text-center py-2 px-3 bg-neutral-50 border rounded-lg break-words">{msg}</p>}
        <p className="text-xs text-center text-neutral-500">
          Sudah punya akun? <Link href="/login" className="text-neutral-900 font-semibold">Masuk</Link>
        </p>
      </form>
    </div>
  );
}
