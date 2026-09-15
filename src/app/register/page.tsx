"use client";
import Link from "next/link";
export default function Register(){
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Daftar RideIn</h1>
      <form className="mt-6 space-y-3 bg-white border rounded-xl p-6" onSubmit={e=>e.preventDefault()}>
        <input placeholder="Nama" className="w-full h-10 border rounded-lg px-3"/>
        <input placeholder="Email" type="email" className="w-full h-10 border rounded-lg px-3"/>
        <input placeholder="Password" type="password" className="w-full h-10 border rounded-lg px-3"/>
        <button className="w-full h-10 rounded-full bg-[#0A0A0A] text-white font-bold hover:bg-black transition">Daftar</button>
        <p className="text-xs text-center text-neutral-500">Sudah punya akun? <Link href="/login" className="text-neutral-900 font-semibold">Masuk</Link></p>
      </form>
    </div>
  );
}
