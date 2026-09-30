"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/motor-saya";
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
      localStorage.setItem("motorkita_mock_user", JSON.stringify({ email: email || "rider@motorkita.id" }));
      setMsg("Berhasil masuk. Mengalihkan...");
      setTimeout(() => {
        setLoading(false);
        router.push(next);
        router.refresh();
      }, 500);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setMsg("Email atau kata sandi tidak sesuai.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        setLoading(false);
        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push(next);
        }
        router.refresh();
        return;
      }
    } catch {}
    setLoading(false);
    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black tracking-tight">Masuk ke Motorkita</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Akses fitur Motor Saya, riwayat perawatan, dan pengingat servis.
        </p>
      </div>

      <form className="space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm" onSubmit={onSubmit}>
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
              placeholder="Masukkan password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border rounded-lg pl-3 pr-10 bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--foreground)]"
              required
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
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {msg && <p className="text-xs text-center py-2 px-3 bg-[var(--muted)] border rounded-lg text-[var(--foreground)] font-medium">{msg}</p>}

        <p className="text-xs text-center text-[var(--muted-foreground)] pt-2">
          Belum punya akun? <Link href="/register" className="text-[var(--foreground)] font-bold underline">Daftar Akun Baru</Link>
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-10 text-sm text-neutral-500">Memuat...</div>}>
      <LoginInner />
    </Suspense>
  );
}
