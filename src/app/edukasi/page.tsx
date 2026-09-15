import Link from "next/link";
import { articles, categories } from "@/lib/data/mocks";
import { ArticleCard } from "@/components/ui/Card";
import FaqAccordion from "@/components/FaqAccordion";
import { faqs } from "@/lib/data/oli";
export default async function Edukasi({searchParams}:{searchParams: Promise<{cat?:string}>}){
  const sp=await searchParams;
  const cat = sp.cat;
  let list = articles.filter(a=> categories.find(c=>c.id===a.category_id)?.type==="edukasi");
  if(cat) list = list.filter(a=> categories.find(c=>c.id===a.category_id)?.slug===cat);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-sm text-neutral-500"><Link href="/" className="hover:text-slate-900">Home</Link> / <span className="text-slate-900 font-medium">Edukasi</span></div>
      <h1 className="mt-2 text-2xl font-black tracking-tight">EDUKASI MOTOR</h1>
      <p className="text-sm text-neutral-600">Pengetahuan dasar, tips merawat, dan FAQ dengan bahasa awam.</p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <Link href="/edukasi" className={`px-3 py-1.5 rounded-full text-sm border font-medium ${!cat?"bg-[#0A0A0A] text-white border-[#0A0A0A]":"bg-white"}`}>Semua</Link>
        {categories.filter(c=>c.type==="edukasi").map(c=>(
          <Link key={c.id} href={`/edukasi?cat=${c.slug}`} className={`px-3 py-1.5 rounded-full text-sm border ${cat===c.slug?"bg-[#0A0A0A] text-white border-[#0A0A0A]":"bg-white"}`}>{c.name}</Link>
        ))}
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(a=>{
          const cn = categories.find(c=>c.id===a.category_id)?.name||"";
          return <ArticleCard key={a.id} title={a.title} excerpt={a.excerpt} cover={a.cover_url} href={`/perawatan/${a.slug}`} category={cn}/>
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-black tracking-tight">FAQ — PERTANYAAN SERING</h2>
        <p className="text-sm text-neutral-600 mt-1">Jawaban singkat, kalau masih bingung hubungi kami di bawah.</p>
        <div className="mt-4"><FaqAccordion items={faqs} allowContact /></div>
      </div>
    </div>
  );
}
