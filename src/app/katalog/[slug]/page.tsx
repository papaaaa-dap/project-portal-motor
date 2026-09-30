import Link from "next/link";
import type { Metadata } from "next";
import { fetchParts, fetchWorkshops } from "@/lib/supabase/queries";

const label: Record<string,string> = {
  "oli-mesin":"Oli Mesin","oli-gardan":"Oli Gardan","oli-samping":"Oli Samping 2T",
  "cvt":"CVT","ban":"Ban","busi":"Busi","filter-udara":"Filter Udara",
  "rem":"Rem","kampas-rem":"Kampas Rem","aki":"Aki","rantai":"Rantai & Gir","kelistrikan":"Kelistrikan"
};

async function getPart(slug: string) {
  const parts = await fetchParts().catch(() => []);
  const source = parts;
  return source.find((x) => x.slug === slug);
}

export async function generateMetadata({params}:{params: Promise<{slug:string}>}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPart(slug);
  if (!p) return { title: "Part tidak ditemukan" };
  const title = `${p.brand} ${p.name} — Rp ${p.harga_min.toLocaleString("id-ID")}`;
  const description = `${p.deskripsi} Cocok untuk ${p.cocok_motor.slice(0, 3).join(", ")}. Interval ganti ${p.interval_km.toLocaleString()}km.`;
  return { title, description, openGraph: { title, description, images: [{ url: p.cover_url, alt: p.name }] } };
}

export default async function PartDetail({params}:{params: Promise<{slug:string}>}){
  const {slug}=await params;
  const [source, ws] = await Promise.all([fetchParts().catch(() => []), fetchWorkshops().catch(() => [])]);
  const p = source.find(x=>x.slug===slug);
  if(!p) return <div className="mx-auto max-w-3xl px-4 py-10">Part tidak ditemukan. <Link href="/katalog" className="underline">Kembali ke katalog</Link></div>;
  const bengkelList = p.bengkel_ids.map(id=>ws.find(w=>w.id===id || w.slug===id)!).filter(Boolean);
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="text-sm text-[var(--muted-foreground)]"><Link href="/" className="hover:text-[var(--foreground)]">Home</Link> / <Link href="/katalog" className="hover:text-[var(--foreground)]">Katalog</Link> / <Link href={`/katalog?cat=${p.category}`} className="hover:text-[var(--foreground)]">{label[p.category]}</Link> / <span className="text-[var(--foreground)] font-medium">{p.name}</span></div>
      <div className="mt-4 grid md:grid-cols-[360px_1fr] gap-6">
        <div className="bg-[var(--muted)] rounded-[16px] overflow-hidden border border-[var(--border)] h-fit">
          <img src={p.cover_url} alt={p.name} className="w-full h-64 object-cover" />
          <div className="p-4 bg-[var(--card)]">
            <div className="flex gap-2 flex-wrap">
              <span className="mono text-xs font-black bg-[#0A0A0A] text-white px-2 py-1 rounded-full">{label[p.category]}</span>
              {Object.entries(p.specs).slice(0,3).map(([k,v])=> <span key={k} className="mono text-xs font-bold border px-2 py-1 rounded-full">{k}: {v}</span>)}
            </div>
            <div className="mt-3">
              <div className="mono text-[11px] text-[var(--muted-foreground)]">HARGA PART (jasa terpisah)</div>
              <div className="text-2xl font-black">Rp {p.harga_min.toLocaleString("id-ID")} – {p.harga_max.toLocaleString("id-ID")}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{p.satuan} • Interval {p.interval_km.toLocaleString()}km {p.interval_bulan?`/ ${p.interval_bulan} bulan`:""}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="mono text-xs tracking-[0.12em] font-black text-[var(--muted-foreground)]">{p.brand.toUpperCase()}</div>
          <h1 className="text-2xl font-black tracking-tight">{p.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">{p.deskripsi}</p>

          <div className="mt-4 bg-[var(--muted)] border rounded-xl p-3">
            <div className="mono text-[11px] font-black tracking-[0.08em]">SPEK LENGKAP</div>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(p.specs).map(([k,v])=> <div key={k} className="bg-[var(--card)] border rounded-lg px-3 py-2"><dt className="mono text-[10px] font-bold text-[var(--muted-foreground)]">{k.toUpperCase()}</dt><dd className="font-medium">{v}</dd></div>)}
              <div className="bg-[var(--card)] border rounded-lg px-3 py-2"><dt className="mono text-[10px] font-bold text-[var(--muted-foreground)]">INTERVAL</dt><dd className="font-medium">{p.interval_km.toLocaleString()}km</dd></div>
              <div className="bg-[var(--card)] border rounded-lg px-3 py-2"><dt className="mono text-[10px] font-bold text-[var(--muted-foreground)]">SATUAN</dt><dd className="font-medium">{p.satuan}</dd></div>
            </dl>
          </div>

          <h3 className="mt-4 font-bold text-sm">Keunggulan</h3>
          <ul className="mt-2 space-y-1">
            {p.keunggulan.map(k=> <li key={k} className="text-sm flex gap-2"><span className="text-green-600">✓</span>{k}</li>)}
          </ul>

          <h3 className="mt-4 font-bold text-sm">Cocok untuk motor</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.cocok_motor.map(m=> <span key={m} className="text-xs bg-[var(--muted)] border px-3 py-1 rounded-full">{m}</span>)}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs leading-relaxed text-amber-900">
            Part only — jasa pasang ±30-120rb tergantung bengkel & kesulitan. Selalu minta rincian part + jasa sebelum setuju.
          </div>

          <h3 className="mt-6 font-bold">Tersedia di bengkel</h3>
          <div className="mt-2 space-y-2">
            {bengkelList.map(w=>(
              <div key={w.id} className="flex items-center justify-between bg-[var(--card)] border rounded-xl p-3">
                <div><div className="font-semibold text-sm">{w.name}</div><div className="text-xs text-[var(--muted-foreground)]">{w.kecamatan} • {w.jam_operasional}</div></div>
                <div className="flex gap-2">
                  <Link href={`/bengkel/${w.id}`} className="h-8 px-3 rounded-full border text-xs font-bold grid place-items-center">Lihat</Link>
                  <a href={`https://maps.google.com/?q=${w.lat},${w.lng}`} target="_blank" className="h-8 px-3 rounded-full bg-[#0A0A0A] text-white text-xs font-bold grid place-items-center">Navigasi →</a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Link href="/katalog" className="px-4 py-2 rounded-full border bg-[var(--card)] text-sm">← Katalog lain</Link>
            <Link href="/bengkel" className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold">Cari Bengkel Terdekat →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
