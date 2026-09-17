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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Cek email untuk konfirmasi (jika email confirmation aktif). Atau langsung login jika auto-confirm.");
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
        <input placeholder="Password (min 6)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-10 border rounded-lg px-3" required minLength={6} />
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
