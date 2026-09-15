import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { ArticleCard, WorkshopCard, CategoryCard } from "@/components/ui/Card";
import { workshops, motorProblems } from "@/lib/data/mocks";
import { parts } from "@/lib/data/parts";
import { faqs } from "@/lib/data/oli";
import FaqAccordion from "@/components/FaqAccordion";

export default function HomePage(){
  return (
    <div className="bg-white">
      {/* HERO - Bespoke Arch Reference (restore) */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-10 md:pt-14 pb-6 text-center relative">
          <h1 className="font-black tracking-[-0.05em] leading-[0.9] text-[38px] sm:text-[52px] lg:text-[68px] text-[#0A0A0A]">
            <span className="block">Save Your Bike,</span>
            <span className="block">Save Your Time.</span>
          </h1>
          <p className="mt-4 mx-auto max-w-[46ch] text-[15px] leading-relaxed text-[#717171]">Satu tempat untuk memahami, merawat, dan menemukan kebutuhan motor. Tanpa login, langsung pakai.</p>
        </div>

        {/* Curved image band */}
        <div className="relative mx-auto max-w-[1400px] px-2 sm:px-4">
          <svg width="0" height="0" aria-hidden>
            <defs>
              <clipPath id="heroCurve" clipPathUnits="objectBoundingBox">
                <path d="M0,0.18 Q0.5,0 1,0.18 L1,0.82 Q0.5,1 0,0.82 Z" />
              </clipPath>
            </defs>
          </svg>
          <div className="relative overflow-hidden" style={{clipPath:"url(#heroCurve)"}}>
            <div className="grid grid-cols-4 gap-[3px] bg-white h-[220px] sm:h-[300px] md:h-[380px] lg:h-[420px]">
              {[
                "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
                "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
                "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
                "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80",
              ].map((src,i)=>(
                <div key={i} className="relative overflow-hidden bg-[#F2F2F2]">
                  <img src={src} alt="" className="h-full w-full object-cover"/>
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom caption + actions */}
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 pt-6 pb-8 text-center">
          <p className="text-sm leading-relaxed text-[#717171]">Motorkita hadir dari blank — dari cek gejala 30 detik sampai navigasi bengkel 24 jam, semua tanpa template berulang.</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3">
            <div className="w-full max-w-[600px]"><SearchBar large /></div>
            <div className="flex gap-2 mono text-xs font-black">
              <Link href="/bengkel" className="h-11 px-6 rounded-full bg-[#0A0A0A] text-white grid place-items-center hover:bg-black transition">Cari Bengkel</Link>
              <Link href="/katalog" className="h-11 px-6 rounded-full bg-white border border-[#0A0A0A] text-[#0A0A0A] grid place-items-center hover:bg-[#0A0A0A] hover:text-white transition">Lihat Katalog</Link>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2 mono text-[11px] font-bold">
            {["GANTI OLI","BAN BOCOR","SERVIS CVT"].map(t=>(
              <Link key={t} href={`/search?q=${encodeURIComponent(t.toLowerCase())}`} className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#0A0A0A]/10 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition">{t}</Link>
            ))}
          </div>
        </div>

        {/* ticker + trust strip */}
        <div className="border-y border-[#0A0A0A] bg-[#0A0A0A] text-white overflow-hidden">
          <div className="flex mono text-[11px] tracking-[0.14em] font-black whitespace-nowrap animate-[marquee_18s_linear_infinite]">
            <span className="py-2 px-6">● TEMUKAN 12 BENGKEL ● GANTI OLI 2.000KM ● SERVIS CVT 8.000KM ● BAN 29-36 PSI ● DARURAT 24 JAM ●</span>
            <span className="py-2 px-6">● TEMUKAN 12 BENGKEL ● GANTI OLI 2.000KM ● SERVIS CVT 8.000KM ● BAN 29-36 PSI ● DARURAT 24 JAM ●</span>
          </div>
        </div>
        <div className="bg-[#FFFFFF] border-b border-[#0A0A0A]/10">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-3 flex items-center justify-center gap-3 mono text-[11px]">
            <div className="flex -space-x-1">
              {[1,2,3].map(i=> <img key={i} src={`https://i.pravatar.cc/100?img=${10+i}`} alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover"/>)}
            </div>
            <span className="text-[#717171]"><b className="text-[#0A0A0A]">1.200+</b> pengendara cek motor minggu ini <span className="hidden sm:inline">- Bukan diagnosis bengkel, cek awal untuk ambil keputusan</span></span>
          </div>
        </div>
      </section>

      {/* Katalog */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 bg-[#FFFFFF]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#0A0A0A]">KATALOG — OLI & SPAREPART</h2>
            <p className="text-sm text-[#717171] mt-1 max-w-[60ch]">Harga part only Surabaya • Oli, CVT, ban, busi, filter, rem, aki, rantai — tap untuk detail.</p>
          </div>
          <Link href="/katalog" className="mono text-xs font-black tracking-[0.08em] h-9 px-4 rounded-full bg-white border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white flex items-center gap-2 transition">LIHAT SEMUA →</Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 mono text-[11px] font-bold">
          {[
            ["oli-mesin","Oli Mesin"],["cvt","CVT"],["ban","Ban"],["busi","Busi"],["kampas-rem","Kampas"], ["aki","Aki"]
          ].map(([slug,label])=> <Link key={slug} href={`/katalog?cat=${slug}`} className="px-3 py-1 rounded-full border border-[#0A0A0A]/15 hover:bg-[#0A0A0A] hover:text-white transition">{label}</Link>)}
        </div>
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {parts.slice(0,8).map(p=>{
            const cat = p.category;
            const badge = cat==="oli-mesin" ? (p.specs["SAE"]||"") : cat==="ban" ? (p.specs["Ukuran"]||"") : cat==="busi" ? (p.specs["Tipe"]||"") : p.specs[Object.keys(p.specs)[0]]||"";
            return (
            <Link key={p.id} href={`/katalog/${p.slug}`} className="group bg-white rounded-[16px] border border-[#0A0A0A] overflow-hidden flex flex-col hover:shadow-[4px_4px_0_#0A0A0A] hover:-translate-y-[1px] transition-all">
              <div className="h-[130px] bg-[#F2F2F2] relative overflow-hidden">
                <img src={p.cover_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-500" />
                <span className="absolute top-2 left-2 mono text-[10px] font-black bg-[#0A0A0A] text-white px-2 py-1 rounded-full">{p.category.replace("-"," ").toUpperCase()}</span>
                <span className="absolute top-2 right-2 mono text-[10px] font-bold bg-white border border-[#0A0A0A]/15 px-2 py-1 rounded-full">{badge}</span>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="mono text-[10px] font-black tracking-[0.08em] text-neutral-500">{p.brand.toUpperCase()}</div>
                <div className="font-black text-[13px] leading-tight line-clamp-1">{p.name}</div>
                <div className="mono text-[11px] text-neutral-500">{p.satuan}</div>
                <div className="mt-2 font-black text-sm">Rp {p.harga_min.toLocaleString("id-ID")} – {p.harga_max.toLocaleString("id-ID")}</div>
                <div className="mono text-[10px] text-neutral-500 line-clamp-1">{p.cocok_motor.slice(0,2).join(", ")}</div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      {/* Darurat */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-2">
        <div className="relative overflow-hidden rounded-[20px] border border-[#0A0A0A] bg-white">
          <div className="h-[10px] bg-[#0A0A0A] w-full" />
          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 p-6 sm:p-7">
            <div>
              <div className="inline-flex items-center gap-2 mono text-[11px] font-black tracking-[0.12em] bg-[#0A0A0A] text-white px-3 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse"/> PANDUAN DARURAT - CEPAT
              </div>
              <h3 className="mt-3 text-[22px] font-black tracking-[-0.03em] leading-tight text-[#0A0A0A]">MOGOK DI JALAN? <span className="bg-[#0A0A0A] text-white px-2 -rotate-[0.5deg] inline-block">JANGAN PANIK.</span></h3>
              <p className="mt-2 text-sm text-[#717171] leading-relaxed">Ban bocor, rem blong, overheat, kehabisan bensin - langkah 3-tap + cari layanan terdekat.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {motorProblems.filter(p=>p.is_emergency).slice(0,4).map(p=>(
                  <Link key={p.id} href={`/panduan-darurat#${p.slug}`} className="mono text-[11px] font-bold bg-[#FFFFFF] border border-[#0A0A0A]/15 px-3 py-1.5 rounded-full hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition">{p.title.toUpperCase()}</Link>
                ))}
              </div>
            </div>
            <div className="bg-[#0A0A0A] rounded-[16px] p-5 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative">
                <div className="mono text-[11px] tracking-[0.12em] text-white/60">SIAP NAVIGASI</div>
                <div className="mt-2 mono text-xs leading-relaxed text-white/80">Temukan tambal ban & bengkel 24 jam terdekat, hitung jarak real-time, langsung buka Google Maps.</div>
              </div>
              <Link href="/panduan-darurat" className="relative mt-4 h-11 rounded-full bg-white text-[#0A0A0A] mono text-xs font-black tracking-[0.08em] grid place-items-center border border-white hover:bg-neutral-100 transition">BUKA PANDUAN →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bengkel */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#0A0A0A]">TEMUKAN TERDEKAT - SURABAYA</h2>
            <p className="text-sm text-[#717171] mt-1">Urutkan pakai lokasi, langsung navigasi.</p>
          </div>
          <Link href="/bengkel" className="mono text-xs font-black tracking-[0.08em] h-9 px-4 rounded-full bg-[#0A0A0A] text-white grid place-items-center hover:bg-black transition">LIHAT PETA →</Link>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workshops.slice(0,6).map(w=> <WorkshopCard key={w.id} w={w} />)}
        </div>
      </section>

      {/* Edukasi */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6">
        <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#0A0A0A]">PAHAM MOTOR, GA GAMPANG DITIPU BENGKEL</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <CategoryCard name="Tips Merawat" href="/edukasi?cat=tips" />
          <CategoryCard name="Mengenal Komponen" href="/edukasi?cat=pengetahuan" />
          <CategoryCard name="Tips Berkendara" href="/edukasi?cat=tips" />
          <CategoryCard name="FAQ" href="/edukasi?cat=faq" />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#0A0A0A]">FAQ — JAWABAN CEPAT</h2>
            <p className="text-sm text-[#717171] mt-1">Pertanyaan paling sering soal oli & perawatan.</p>
          </div>
          <Link href="/edukasi" className="mono text-xs font-black tracking-[0.08em] h-9 px-4 rounded-full bg-[#0A0A0A] text-white grid place-items-center hover:bg-black transition">LIHAT EDUKASI →</Link>
        </div>
        <div className="mt-4"><FaqAccordion items={faqs.slice(0,4)} /></div>
        <div className="mt-4 text-center">
          <Link href="/edukasi" className="mono text-xs font-bold text-[#0A0A0A] underline decoration-2 underline-offset-4">Lihat semua 6 FAQ + kontak →</Link>
        </div>
      </section>

      {/* CTA Motor Saya */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-10">
        <div className="relative overflow-hidden bg-[#0A0A0A] rounded-[20px] border border-[#0A0A0A] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative text-white max-w-[56ch]">
            <h3 className="text-[22px] font-black tracking-[-0.03em] leading-tight">SIMPAN MOTORMU DI MOTORKITA</h3>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">Dapatkan rekomendasi perawatan rule-based, riwayat servis, dan pengingat - untuk N motor sekaligus. Sinkron Supabase saat login.</p>
            <div className="mt-3 flex gap-2 mono text-[11px] font-bold">
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">REMINDER OLI 2.000KM</span>
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">RULE CVT 8.000KM</span>
            </div>
          </div>
          <Link href="/motor-saya" className="relative h-12 px-8 rounded-full bg-white text-[#0A0A0A] mono text-xs font-black tracking-[0.08em] grid place-items-center border border-white hover:bg-neutral-100 transition shrink-0">BUKA MOTOR SAYA →</Link>
        </div>
      </section>

      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
