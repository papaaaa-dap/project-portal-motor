import Link from "next/link";
import { articles, categories } from "@/lib/data/mocks";
import { ArticleCard } from "@/components/ui/Card";
export default async function Edukasi({searchParams}:{searchParams: Promise<{cat?:string}>}){
  const sp=await searchParams;
  const cat = sp.cat;
  let list = articles.filter(a=> categories.find(c=>c.id===a.category_id)?.type==="edukasi");
  if(cat) list = list.filter(a=> categories.find(c=>c.id===a.category_id)?.slug===cat);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Edukasi</span></div>
      <h1 className="mt-2 text-2xl font-bold">Edukasi Motor</h1>
      <p className="text-sm text-neutral-500">Pengetahuan dasar, tips merawat, dan FAQ dengan bahasa awam.</p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <Link href="/edukasi" className={`px-3 py-1.5 rounded-full text-sm border ${!cat?"bg-neutral-900 text-white":"bg-white"}`}>Semua</Link>
        {categories.filter(c=>c.type==="edukasi").map(c=>(
          <Link key={c.id} href={`/edukasi?cat=${c.slug}`} className={`px-3 py-1.5 rounded-full text-sm border ${cat===c.slug?"bg-neutral-900 text-white":"bg-white"}`}>{c.name}</Link>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(a=>{
          const cn = categories.find(c=>c.id===a.category_id)?.name||"";
          return <ArticleCard key={a.id} title={a.title} excerpt={a.excerpt} cover={a.cover_url} href={`/perawatan/${a.slug}`} category={cn}/>
        })}
      </div>
    </div>
  );
}
