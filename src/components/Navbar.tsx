"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase";

const nav = [
  { href: "/katalog", label: "KATALOG" },
  { href: "/bengkel", label: "BENGKEL" },
  { href: "/cek-masalah", label: "CEK" },
  { href: "/panduan-darurat", label: "DARURAT" },
  { href: "/edukasi", label: "EDUKASI" },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      try {
        const raw = localStorage.getItem("motorkita_mock_user");
        if (raw) setUserEmail((JSON.parse(raw) as { email: string }).email);
      } catch {}
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem("motorkita_mock_user");
      setUserEmail(null);
      router.refresh();
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/auth/signout", { method: "POST" });
    setUserEmail(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="h-[6px] hazard-stripe w-full" aria-hidden />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex h-[64px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/logo-motorkita.png"
            alt="Motorkita"
            width={160}
            height={44}
            className="h-[32px] sm:h-[36px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map(n => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mono text-[12px] tracking-[0.08em] font-bold px-3 py-1.5 rounded-[6px] border transition ${
                  active
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "text-[#0A0A0A] border-transparent hover:bg-[#0A0A0A]/[0.06] hover:border-[#0A0A0A]/10"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex flex-1 max-w-[420px] mx-2">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/motor-saya"
            className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#0A0A0A] text-white mono text-[12px] font-black tracking-[0.06em] border border-[#0A0A0A] hover:bg-white hover:text-[#0A0A0A] transition"
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse hidden sm:block" />
            MOTOR SAYA
          </Link>
          {userEmail ? (
            <>
              <span className="hidden sm:inline mono text-[11px] font-bold max-w-[140px] truncate px-2">{userEmail}</span>
              <button
                onClick={logout}
                className="mono text-[12px] font-bold tracking-[0.06em] px-3 py-1.5 rounded-full border border-[#0A0A0A]/15 hover:bg-[#0A0A0A] hover:text-white transition"
              >
                KELUAR
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="mono text-[12px] font-bold tracking-[0.06em] px-3 py-1.5 rounded-full border border-[#0A0A0A]/15 hover:border-[#0A0A0A] transition"
            >
              MASUK
            </Link>
          )}
          <button
            onClick={() => setOpen(v => !v)}
            className="lg:hidden h-9 w-9 grid place-items-center rounded-[8px] bg-[#0A0A0A] text-white"
          >
            <span className="mono text-[12px]">{open ? "✕" : "≡"}</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-4">
          <div className="mb-3 md:hidden">
            <SearchBar />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`mono text-[12px] font-bold tracking-wide px-3 py-3 rounded-[10px] border text-center ${
                  path === n.href
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white border-[#0A0A0A]/10"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
          <Link
            href="/motor-saya"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center h-11 rounded-full bg-[#0A0A0A] text-white border border-[#0A0A0A] mono text-[12px] font-black"
          >
            MOTOR SAYA →
          </Link>
        </div>
      )}
    </header>
  );
}
