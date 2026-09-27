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
    if (!configured) {
      setMsg("Supabase belum dikonfigurasi (.env). Mode mock: klik 'Masuk Mock' di bawah.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }
    // role-based redirect: admin → /admin, user → next (default /motor-saya)
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

  const mockLogin = () => {
    localStorage.setItem("motorkita_mock_user", JSON.stringify({ email: email || "demo@motorkita.id" }));
    setMsg("Mock login sukses — redirect ke Motor Saya (tanpa Supabase). Set env untuk auth asli.");
    setTimeout(() => router.push("/motor-saya"), 600);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Masuk ke RideIn</h1>
      <p className="text-sm text-neutral-500">Login untuk akses Motor Saya dan reminder servis.</p>
      {!configured && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <b>Mode mock aktif:</b> env Supabase belum diset. Auth asli akan aktif setelah <code>.env.local</code> diisi (lihat <code>.env.example</code>).
        </div>
      )}
      <form className="mt-6 space-y-3 bg-white border rounded-xl p-6" onSubmit={onSubmit}>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 border rounded-lg px-3" required />
        <div className="relative">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 border rounded-lg pl-3 pr-10"
            required
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
        <button disabled={loading} className="w-full h-10 rounded-full bg-neutral-900 text-white font-bold disabled:opacity-60">
          {loading ? "Memproses..." : "Masuk"}
        </button>
        {msg && <p className="text-xs text-center py-2 px-3 bg-neutral-50 border rounded-lg">{msg}</p>}
        {!configured && (
          <button type="button" onClick={mockLogin} className="w-full h-10 rounded-full border bg-white font-bold text-sm">
            Masuk Mock (tanpa Supabase)
          </button>
        )}
        <p className="text-xs text-center text-neutral-500">
          Belum punya akun? <Link href="/register" className="text-neutral-900 font-semibold">Daftar</Link>
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
