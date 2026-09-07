import Link from "next/link";
import { searchAll, categories } from "@/lib/data/mocks";
import { ArticleCard, WorkshopCard } from "@/components/ui/Card";
export default async function Search({searchParams}:{searchParams: Promise<{q?:string}>}){
  const sp=await searchParams;
  const q = sp.q||"";
  const res = q? searchAll(q) : {art:[], bengkel:[], masalah:[]};
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Search</h1>
      <form className="mt-4 flex gap-2 max-w-xl">
        <input name="q" defaultValue={q} placeholder="ganti oli" className="flex-1 h-10 border rounded-full px-4 bg-white"/>
        <button className="h-10 px-6 rounded-full bg-neutral-1000 font-bold">Cari</button>
      </form>
      {!q ? <p className="mt-6 text-sm text-neutral-500">Masukkan kata kunci untuk mencari artikel, bengkel, atau masalah motor.</p> : (
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="font-bold">Artikel ({res.art.length})</h3>
            {res.art.length===0? <p className="text-sm text-neutral-500">Tidak ada artikel.</p> : (
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
            {res.bengkel.length===0? <p className="text-sm text-neutral-500">Tidak ada bengkel.</p> : (
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {res.bengkel.map(w=> <WorkshopCard key={w.id} w={w}/>)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">Masalah ({res.masalah.length})</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {res.masalah.map(m=> <Link key={m.id} href={`/cek-masalah`} className="px-3 py-1.5 bg-white border rounded-full text-sm hover:bg-neutral-900 hover:text-white">{m.title}</Link>)}
              {res.masalah.length===0 && <p className="text-sm text-neutral-500">Tidak ada masalah.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
