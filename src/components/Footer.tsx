import Link from "next/link";
export default function Footer(){
  return (
    <footer className="bg-[#0A0A0A] text-[#FFFFFF] relative overflow-hidden">
      <div className="h-[8px] hazard-stripe w-full" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-[8px] bg-white text-[#0A0A0A] grid place-items-center font-black">M</span>
              <span className="font-black tracking-[-0.04em] text-lg">MOTOKU</span>
              <span className="mono text-[10px] tracking-[0.12em] bg-white/10 px-2 py-1 rounded-full">INDONESIA</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70 max-w-[36ch]">Satu tempat untuk memahami, merawat, dan menemukan kebutuhan motor. Dari cek gejala sampai navigasi bengkel - tanpa login, langsung pakai.</p>
            <p className="mono mt-3 text-[11px] tracking-[0.12em] text-white/60">SAVE YOUR BIKE • SAVE YOUR TIME</p>
            <div className="mt-4 flex gap-2 mono text-[11px]">
              <span className="px-2 py-1 rounded-full border border-white/15">12 ARTIKEL</span>
              <span className="px-2 py-1 rounded-full border border-white/15">12 BENGKEL</span>
              <span className="px-2 py-1 rounded-full border border-white/15">8 DIAGNOSA</span>
            </div>
          </div>
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-black text-white/90">KANAL</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/perawatan" className="hover:text-white">Perawatan</Link></li>
              <li><Link href="/bengkel" className="hover:text-white">Temukan</Link></li>
              <li><Link href="/edukasi" className="hover:text-white">Edukasi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-black text-white/90">BANTUAN</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/cek-masalah" className="hover:text-white">Cek Masalah</Link></li>
              <li><Link href="/panduan-darurat" className="hover:text-white text-white">Panduan Darurat →</Link></li>
              <li><Link href="/search" className="hover:text-white">Search</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-black text-white/90">PERSONAL</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/motor-saya" className="hover:text-white">Motor Saya</Link></li>
              <li><Link href="/login" className="hover:text-white">Login / Register</Link></li>
              <li className="mono text-[11px] text-white/40 pt-2">© 2026 MotoKu. Bukan diagnosis profesional. Selalu ke bengkel untuk perbaikan.</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2 justify-between items-center mono text-[11px] text-white/50">
          <span>BUILT FOR THE ROAD • SURABAYA → NASIONAL</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white" /> SYSTEM OK</span>
        </div>
      </div>
    </footer>
  );
}
