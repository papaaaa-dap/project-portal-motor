import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white relative overflow-hidden border-t border-neutral-800">
      <div className="h-[6px] hazard-stripe w-full" aria-hidden />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo-motorkita.png"
                alt="Motorkita"
                width={140}
                height={38}
                className="h-8 w-auto object-contain invert"
              />
              <span className="mono text-[10px] tracking-[0.12em] bg-white/10 px-2 py-0.5 rounded-full text-white/90">
                INDONESIA
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Platform lengkap untuk perawatan, diagnosa mandiri, dan lokasi bengkel terdekat sepeda motor Anda.
            </p>
            <div className="mono text-[11px] tracking-[0.1em] text-neutral-400">
              SAVE YOUR BIKE • SAVE YOUR TIME
            </div>
            <div className="flex flex-wrap gap-2 pt-1 mono text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300">
                KATALOG LENGKAP
              </span>
              <span className="px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300">
                BENGKEL TERVERIFIKASI
              </span>
            </div>
          </div>

          {/* Col 2: Kanal Utama */}
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-black text-white/90 mb-4 uppercase">
              Layanan Utama
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/katalog" className="hover:text-white transition">
                  Katalog Oli & Sparepart
                </Link>
              </li>
              <li>
                <Link href="/bengkel" className="hover:text-white transition">
                  Cari Bengkel Terdekat
                </Link>
              </li>
              <li>
                <Link href="/edukasi" className="hover:text-white transition">
                  Edukasi Perawatan
                </Link>
              </li>
              <li>
                <Link href="/panduan-darurat" className="hover:text-white transition flex items-center gap-1">
                  Panduan Darurat <span className="text-amber-400">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Diagnosa & Tools */}
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-black text-white/90 mb-4 uppercase">
              Bantuan & Fitur
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/cek-masalah" className="hover:text-white transition">
                  Cek Masalah Gejala Motor
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Pencarian Produk & Bengkel
                </Link>
              </li>
              <li>
                <Link href="/motor-saya" className="hover:text-white transition">
                  Motor Saya & Reminder Servis
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi & Akun */}
          <div>
            <h4 className="mono text-[11px] tracking-[0.14em] font-black text-white/90 mb-4 uppercase">
              Akun & Layanan
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Daftar Akun Baru
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-neutral-800 space-y-1 mono text-[11px] text-neutral-500">
              <p>Khusus motor standar Indonesia.</p>
              <p className="text-neutral-400 font-medium">halo@motorkita.my.id</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-3 justify-between items-center mono text-[11px] text-neutral-500">
          <span>© 2026 MOTORKITA • SURABAYA & NASIONAL</span>
          <span className="flex items-center gap-2 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            SISTEM AKTIF
          </span>
        </div>
      </div>
    </footer>
  );
}
