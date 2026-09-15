"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";

const nav = [
  { href: "/katalog", label: "KATALOG" },
  { href: "/bengkel", label: "BENGKEL" },
  { href: "/cek-masalah", label: "CEK" },
  { href: "/panduan-darurat", label: "DARURAT" },
  { href: "/edukasi", label: "EDUKASI" },
];

function ThemeToggle(){
  const [theme, setTheme] = useState<"light"|"dark">("light");
  useEffect(()=>{
    const saved = localStorage.getItem("motoku-theme") as "light"|"dark"|null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial==="dark");
  },[]);
  const toggle = ()=>{
    const next = theme==="dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("motoku-theme", next);
    document.documentElement.classList.toggle("dark", next==="dark");
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="h-9 w-9 grid place-items-center rounded-full border border-[#0A0A0A]/15 bg-white dark:bg-[#171717] dark:border-white/15 dark:text-white hover:border-[#0A0A0A] dark:hover:border-white transition">
      {theme==="dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="h-[6px] hazard-stripe w-full" aria-hidden />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex h-[64px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/logo-motorkita.jpeg"
            alt="Motorkita"
            width={160}
            height={44}
            className="h-[32px] sm:h-[36px] w-auto object-contain dark:invert"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map(n => {
            const active = path === n.href;
            return (
              <Link key={n.href} href={n.href} className={`mono text-[12px] tracking-[0.08em] font-bold px-3 py-1.5 rounded-[6px] border transition ${active ? "bg-[#0A0A0A] dark:bg-white text-white dark:text-black border-[#0A0A0A] dark:border-white" : "text-[#0A0A0A] dark:text-white border-transparent hover:bg-[#0A0A0A]/[0.06] dark:hover:bg-white/10 hover:border-[#0A0A0A]/10"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex flex-1 max-w-[420px] mx-2">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/motor-saya" className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#0A0A0A] dark:bg-white text-white dark:text-black mono text-[12px] font-black tracking-[0.06em] border border-[#0A0A0A] dark:border-white hover:bg-white hover:text-[#0A0A0A] dark:hover:bg-black dark:hover:text-white transition">
            <span className="h-2 w-2 rounded-full bg-white dark:bg-black animate-pulse hidden sm:block" />
            MOTOR SAYA
          </Link>
          <Link href="/login" className="mono text-[12px] font-bold tracking-[0.06em] px-3 py-1.5 rounded-full border border-[#0A0A0A]/15 dark:border-white/15 hover:border-[#0A0A0A] dark:hover:border-white transition">MASUK</Link>
          <button onClick={()=>setOpen(v=>!v)} className="lg:hidden h-9 w-9 grid place-items-center rounded-[8px] bg-[#0A0A0A] dark:bg-white text-white dark:text-black"><span className="mono text-[12px]">{open ? "✕" : "≡"}</span></button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-4">
          <div className="mb-3 md:hidden"><SearchBar /></div>
          <div className="grid grid-cols-2 gap-2">
            {nav.map(n=>(
              <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className={`mono text-[12px] font-bold tracking-wide px-3 py-3 rounded-[10px] border text-center ${path===n.href?"bg-[#0A0A0A] dark:bg-white text-white dark:text-black":"bg-white dark:bg-[#171717] border-[#0A0A0A]/10 dark:border-white/10"}`}>{n.label}</Link>
            ))}
          </div>
          <Link href="/motor-saya" onClick={()=>setOpen(false)} className="mt-3 flex items-center justify-center h-11 rounded-full bg-[#0A0A0A] dark:bg-white text-white dark:text-black border border-[#0A0A0A] dark:border-white mono text-[12px] font-black">MOTOR SAYA →</Link>
        </div>
      )}
    </header>
  );
}
