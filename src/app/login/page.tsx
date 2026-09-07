"use client";
import Link from "next/link";
export default function Login(){
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Masuk ke MotoKu</h1>
      <p className="text-sm text-neutral-500">Login untuk akses Motor Saya, bookmark, dan reminder.</p>
      <form className="mt-6 space-y-3 bg-white border rounded-xl p-6" onSubmit={e=>e.preventDefault()}>
        <input placeholder="Email" type="email" className="w-full h-10 border rounded-lg px-3"/>
        <input placeholder="Password" type="password" className="w-full h-10 border rounded-lg px-3"/>
        <button className="w-full h-10 rounded-full bg-neutral-900 text-white font-bold">Masuk</button>
        <p className="text-xs text-center text-neutral-500">Belum punya akun? <Link href="/register" className="text-neutral-900 font-semibold">Daftar</Link></p>
        <p className="text-xs text-center text-slate-400">MVP: auth Supabase akan aktif setelah env diset.</p>
      </form>
    </div>
  );
}
