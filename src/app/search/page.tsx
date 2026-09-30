import Link from "next/link";
import { fetchParts, fetchArticles, fetchWorkshops, fetchProblems, fetchCategories } from "@/lib/supabase/queries";
import { ArticleCard, WorkshopCard } from "@/components/ui/Card";
export default async function Search({searchParams}:{searchParams: Promise<{q?:string}>}){
  const sp=await searchParams;
  const q = sp.q||"";
  const [parts, articles, workshops, motorProblems, categories] = await Promise.all([
    fetchParts().catch(() => []), fetchArticles().catch(() => []), fetchWorkshops().catch(() => []),
    fetchProblems().catch(() => []), fetchCategories().catch(() => []),
  ]);
  const ql = q.toLowerCase();
  const res = q ? {
    art: articles.filter(a => a.title.toLowerCase().includes(ql) || (a.excerpt||"").toLowerCase().includes(ql)),
    bengkel: workshops.filter(w => w.name.toLowerCase().includes(ql) || w.layanan.some(l => l.toLowerCase().includes(ql)) || w.kecamatan.toLowerCase().includes(ql)),
    masalah: motorProblems.filter(m => m.title.toLowerCase().includes(ql)),
  } : {art:[], bengkel:[], masalah:[]};
  const partRes = q ? parts.filter(p=> p.name.toLowerCase().includes(ql) || p.brand.toLowerCase().includes(ql) || p.deskripsi.toLowerCase().includes(ql)) : [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Search</h1>
      <form className="mt-4 flex gap-2 max-w-xl">
        <input name="q" defaultValue={q} placeholder="ganti oli, ban 90/80, busi..." className="flex-1 h-10 border rounded-full px-4 bg-[var(--card)] text-[var(--foreground)]"/>
        <button className="h-10 px-6 rounded-full bg-[#0A0A0A] text-white font-bold hover:bg-black transition">Cari</button>
      </form>
      {!q ? <p className="mt-6 text-sm text-[var(--muted-foreground)]">Masukkan kata kunci untuk mencari artikel, bengkel, masalah, atau sparepart.</p> : (
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="font-bold">Sparepart ({partRes.length})</h3>
            {partRes.length===0? <p className="text-sm text-[var(--muted-foreground)]">Tidak ada sparepart. Coba <Link href={`/katalog?q=${encodeURIComponent(q)}`} className="underline">cari di Katalog</Link>.</p> : (
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partRes.slice(0,6).map(p=> <Link key={p.id} href={`/katalog/${p.slug}`} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 flex gap-3 hover:border-[var(--foreground)] transition"><img src={p.cover_url} alt={p.name} className="h-16 w-16 rounded-lg object-cover"/><div><div className="mono text-[11px] font-bold text-[var(--muted-foreground)]">{p.category.toUpperCase()}</div><div className="font-bold text-sm leading-tight">{p.brand} {p.name}</div><div className="text-xs">Rp {p.harga_min.toLocaleString("id-ID")} – {p.harga_max.toLocaleString("id-ID")}</div></div></Link>)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">Artikel ({res.art.length})</h3>
            {res.art.length===0? <p className="text-sm text-[var(--muted-foreground)]">Tidak ada artikel.</p> : (
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {res.art.map(a=>{
                  const cn = categories.find(c=>c.id===a.category_id)?.name||"";
                  return <ArticleCard key={a.id} title={a.title} excerpt={a.excerpt} cover={a.cover_url} href={`/perawatan/${a.slug}`} category={cn}/>
                })}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">Bengkel ({res.bengkel.length})</h3>
            {res.bengkel.length===0? <p className="text-sm text-[var(--muted-foreground)]">Tidak ada bengkel.</p> : (
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {res.bengkel.map(w=> <WorkshopCard key={w.id} w={w}/>)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">Masalah ({res.masalah.length})</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {res.masalah.map(m=> <Link key={m.id} href={`/cek-masalah`} className="px-3 py-1.5 bg-[var(--card)] border border-[var(--border)] rounded-full text-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] transition">{m.title}</Link>)}
              {res.masalah.length===0 && <p className="text-sm text-[var(--muted-foreground)]">Tidak ada masalah.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
