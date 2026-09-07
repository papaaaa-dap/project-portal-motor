import Link from "next/link";
import { articles, categories } from "@/lib/data/mocks";
import { ArticleCard } from "@/components/ui/Card";
export default async function Detail({params}:{params: Promise<{slug:string}>}){
  const {slug} = await params;
  const a = articles.find(x=>x.slug===slug);
  if(!a) return <div className="mx-auto max-w-3xl px-4 py-10">Artikel tidak ditemukan. <Link href="/perawatan" className="text-neutral-900">Kembali</Link></div>;
  const cat = categories.find(c=>c.id===a.category_id);
  const related = articles.filter(x=>x.category_id===a.category_id && x.id!==a.id).slice(0,3);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <Link href="/perawatan" className="hover:text-slate-900">Perawatan</Link> / <span className="text-slate-900">{a.title}</span></div>
      <span className="mt-3 inline-block text-xs font-semibold bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">{cat?.name}</span>
      <h1 className="mt-2 text-2xl font-bold leading-tight">{a.title}</h1>
      <p className="text-sm text-neutral-500">{a.created_at} • 3 menit baca</p>
      <img src={a.cover_url} alt={a.title} className="mt-4 w-full h-64 object-cover rounded-xl"/>
      <article className="mt-6 prose prose-slate max-w-none text-slate-700 leading-relaxed">{a.content}<br/><br/>Gunakan rute: <span className="font-semibold">Baca → Pahami → Cek Masalah → Cari Bengkel → Rawat.</span></article>
      <div className="mt-8 flex gap-2">
        <Link href="/cek-masalah" className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Cek Masalah Terkait</Link>
        <Link href="/bengkel" className="px-4 py-2 rounded-full border bg-white text-sm">Cari Bengkel</Link>
      </div>
      {related.length>0 && (
        <div className="mt-10">
          <h3 className="font-bold">Artikel Terkait</h3>
          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            {related.map(r=>{
              const cn = categories.find(c=>c.id===r.category_id)?.name||"";
              return <ArticleCard key={r.id} title={r.title} excerpt={r.excerpt} cover={r.cover_url} href={`/perawatan/${r.slug}`} category={cn}/>
            })}
          </div>
        </div>
      )}
    </div>
  );
}
