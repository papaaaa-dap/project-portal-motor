import Link from "next/link";
import { articles, categories } from "@/lib/data/mocks";
import { ArticleCard } from "@/components/ui/Card";
import SearchBar from "@/components/SearchBar";

export default async function PerawatanPage({searchParams}:{searchParams: Promise<{cat?:string; q?:string; page?:string}>}){
  const sp = await searchParams;
  const cat = sp.cat;
  const q = sp.q?.toLowerCase()||"";
  let filtered = articles.filter(a=> categories.find(c=>c.id===a.category_id)?.type==="perawatan");
  if(cat) filtered = filtered.filter(a=> categories.find(c=>c.id===a.category_id)?.slug===cat);
  if(q) filtered = filtered.filter(a=> a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  // pagination 6 per page
  const page = Math.max(1, parseInt(sp.page||"1"));
  const per=6;
  const totalPages = Math.max(1, Math.ceil(filtered.length/per));
  const paged = filtered.slice((page-1)*per, page*per);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Perawatan</span></div>
      <h1 className="mt-2 text-2xl font-bold">Perawatan Motor</h1>
      <div className="mt-4"><SearchBar /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/perawatan" className={`px-3 py-1.5 rounded-full text-sm border ${!cat?"bg-neutral-900 text-white":"bg-white hover:bg-slate-100"}`}>Semua</Link>
        {categories.filter(c=>c.type==="perawatan").map(c=>(
          <Link key={c.id} href={`/perawatan?cat=${c.slug}`} className={`px-3 py-1.5 rounded-full text-sm border ${cat===c.slug?"bg-neutral-900 text-white":"bg-white hover:bg-slate-100"}`}>{c.name}</Link>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map(a=>{
          const cname = categories.find(c=>c.id===a.category_id)?.name||"";
          return <ArticleCard key={a.id} title={a.title} excerpt={a.excerpt} cover={a.cover_url} href={`/perawatan/${a.slug}`} category={cname} />
        })}
      </div>
      {paged.length===0 && <p className="mt-8 text-center text-neutral-500">Tidak ada artikel.</p>}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({length: totalPages}).map((_,i)=>(
          <Link key={i} href={`/perawatan?${new URLSearchParams({...(cat?{cat}:{}), page:String(i+1)}).toString()}`} className={`h-8 w-8 grid place-items-center rounded-full text-sm border ${page===i+1?"bg-neutral-900 text-white":"bg-white"}`}>{i+1}</Link>
        ))}
      </div>
    </div>
  );
}
