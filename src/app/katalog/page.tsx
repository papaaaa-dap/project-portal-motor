import Link from "next/link";
import { parts } from "@/lib/data/parts";
import { workshops } from "@/lib/data/mocks";
import type { PartCategory } from "@/lib/types";

const cats: { slug: PartCategory; label: string }[] = [
  { slug: "oli-mesin", label: "Oli Mesin" },
  { slug: "oli-gardan", label: "Oli Gardan" },
  { slug: "oli-samping", label: "Oli Samping 2T" },
  { slug: "cvt", label: "CVT" },
  { slug: "ban", label: "Ban" },
  { slug: "busi", label: "Busi" },
  { slug: "filter-udara", label: "Filter Udara" },
  { slug: "kampas-rem", label: "Kampas Rem" },
  { slug: "rem", label: "Rem & Minyak" },
  { slug: "aki", label: "Aki" },
  { slug: "rantai", label: "Rantai & Gir" },
  { slug: "kelistrikan", label: "Kelistrikan" },
];

const catLabel = (c: PartCategory) => cats.find(x=>x.slug===c)?.label || c;

export default async function KatalogPage({searchParams}:{searchParams: Promise<{cat?:string; q?:string}>}){
  const sp = await searchParams;
  const cat = sp.cat as PartCategory | undefined;
  const q = sp.q?.toLowerCase() || "";
  let list = [...parts];
  if(cat) list = list.filter(p=> p.category===cat);
  if(q) list = list.filter(p=> p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.deskripsi.toLowerCase().includes(q) || Object.values(p.specs).join(" ").toLowerCase().includes(q));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Katalog</span></div>
      <h1 className="mt-2 text-2xl font-black tracking-tight">KATALOG — OLI & SPAREPART LENGKAP</h1>
      <p className="text-sm text-neutral-600 mt-1">Part only — jasa bengkel terpisah ±30-120rb. Harga real Surabaya • Update April 2026 • Tap kartu untuk spek & bengkel yang jual.</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin flex-nowrap">
        <Link href="/katalog" className={`shrink-0 px-3 py-1.5 rounded-full text-sm border font-medium ${!cat?"bg-[#0A0A0A] text-white border-[#0A0A0A]":"bg-white hover:bg-neutral-100"}`}>Semua ({parts.length})</Link>
        {cats.map(c=>{
          const cnt = parts.filter(p=>p.category===c.slug).length;
          const active = cat===c.slug;
          return <Link key={c.slug} href={`/katalog?cat=${c.slug}`} className={`shrink-0 px-3 py-1.5 rounded-full text-sm border ${active?"bg-[#0A0A0A] text-white border-[#0A0A0A]":"bg-white hover:bg-neutral-100"}`}>{c.label} ({cnt})</Link>;
        })}
      </div>

      <div className="mt-3">
        <form action="/katalog" className="flex gap-2 max-w-md">
          {cat && <input type="hidden" name="cat" value={cat} />}
          <input name="q" defaultValue={sp.q||""} placeholder="Cari: Shell, NMAX, 90/80-14, CPR8..." className="flex-1 h-10 border rounded-full px-4 bg-white text-sm" />
          <button className="h-10 px-5 rounded-full bg-[#0A0A0A] text-white text-sm font-bold">Cari</button>
        </form>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(p=>{
          const bengkelNames = p.bengkel_ids.map(id=> workshops.find(w=>w.id===id)?.name).filter(Boolean).slice(0,2);
          const specKeys = Object.keys(p.specs).slice(0,2);
          return (
            <Link key={p.id} href={`/katalog/${p.slug}`} className="group bg-white border border-[#0A0A0A] rounded-[16px] overflow-hidden flex flex-col hover:shadow-[4px_4px_0_#0A0A0A] hover:-translate-y-[1px] transition-all">
              <div className="h-40 bg-[#F2F2F2] relative overflow-hidden">
                <img src={p.cover_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" />
                <span className="absolute top-2 left-2 mono text-[10px] font-black bg-[#0A0A0A] text-white px-2 py-1 rounded-full">{catLabel(p.category).toUpperCase()}</span>
                <span className="absolute top-2 right-2 mono text-[10px] font-bold bg-white border border-[#0A0A0A]/15 px-2 py-1 rounded-full">{specKeys.map(k=> p.specs[k]).join(" • ")}</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="mono text-[11px] tracking-[0.08em] font-black text-neutral-500">{p.brand.toUpperCase()}</div>
                <h3 className="font-black text-[14px] leading-tight tracking-[-0.02em] line-clamp-1">{p.name}</h3>
                <p className="mono text-[11px] text-neutral-500">{p.satuan} • {p.interval_km.toLocaleString()}km</p>
                <p className="mt-1 text-[12px] leading-relaxed text-neutral-600 line-clamp-2">{p.deskripsi}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.keunggulan.slice(0,2).map(k=> <span key={k} className="text-[11px] bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-full line-clamp-1">{k}</span>)}
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <div className="mono text-[11px] text-neutral-500">HARGA PART</div>
                    <div className="font-black text-[15px]">Rp {p.harga_min.toLocaleString("id-ID")} – {p.harga_max.toLocaleString("id-ID")}</div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1">{p.cocok_motor.slice(0,2).join(", ")}</div>
                  </div>
                  <span className="h-8 px-3 rounded-full bg-[#0A0A0A] text-white mono text-[11px] font-black grid place-items-center">DETAIL →</span>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="mono text-[10px] font-bold text-neutral-500">TERSEDIA DI</div>
                  <div className="text-[11px] text-neutral-600 truncate">{bengkelNames.join(" • ")}{p.bengkel_ids.length>2?` +${p.bengkel_ids.length-2}`:""}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {list.length===0 && <p className="mt-10 text-center text-neutral-500">Tidak ada part cocok filter.</p>}

      <div className="mt-8 bg-[#0A0A0A] text-white rounded-[16px] p-5">
        <h3 className="font-black">Butuh rekomendasi cepat?</h3>
        <p className="text-sm text-white/70 mt-1">Pilih motor di Motor Saya → kami filter oli & part yang cocok otomatis. Atau tanya bengkel terdekat via peta.</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <Link href="/motor-saya" className="h-9 px-4 rounded-full bg-white text-[#0A0A0A] mono text-xs font-black grid place-items-center">CEK MOTOR SAYA →</Link>
          <Link href="/bengkel" className="h-9 px-4 rounded-full border border-white/20 text-white mono text-xs font-bold grid place-items-center">LIHAT BENGKEL</Link>
        </div>
      </div>
    </div>
  );
}
