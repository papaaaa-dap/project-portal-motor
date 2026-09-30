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
    setLoading(true);

    if (!configured) {
      localStorage.setItem("motorkita_mock_user", JSON.stringify({ email, name }));
      setMsg("Pendaftaran berhasil! Mengalihkan ke halaman masuk...");
      setTimeout(() => {
        setLoading(false);
        router.push("/login");
      }, 600);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    if (data?.user?.identities?.length === 0) {
      setMsg("Email ini sudah terdaftar. Silakan gunakan menu Masuk.");
      return;
    }

    setMsg("Pendaftaran berhasil! Mengalihkan ke halaman masuk...");
    setTimeout(() => router.push("/login"), 800);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black tracking-tight">Daftar Akun Motorkita</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Buat akun untuk mengelola kendaraan dan riwayat servis Anda.
        </p>
      </div>

      <form className="space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-bold mono tracking-wide mb-1 text-[var(--foreground)]">NAMA LENGKAP</label>
          <input
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 border rounded-lg px-3 bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--foreground)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mono tracking-wide mb-1 text-[var(--foreground)]">EMAIL</label>
          <input
            placeholder="contoh@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 border rounded-lg px-3 bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--foreground)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold mono tracking-wide mb-1 text-[var(--foreground)]">PASSWORD</label>
          <div className="relative">
            <input
              placeholder="Minimal 6 karakter"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border rounded-lg pl-3 pr-10 bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--foreground)]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
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
        </div>

        <button
          disabled={loading}
          className="w-full h-11 rounded-full bg-[var(--foreground)] text-[var(--background)] font-bold text-sm hover:opacity-90 transition disabled:opacity-60 mt-2"
        >
          {loading ? "Memproses..." : "Daftar Akun"}
        </button>

        {msg && <p className="text-xs text-center py-2 px-3 bg-[var(--muted)] border rounded-lg text-[var(--foreground)] font-medium">{msg}</p>}

        <p className="text-xs text-center text-[var(--muted-foreground)] pt-2">
          Sudah punya akun? <Link href="/login" className="text-[var(--foreground)] font-bold underline">Masuk</Link>
        </p>
      </form>
    </div>
  );
}
