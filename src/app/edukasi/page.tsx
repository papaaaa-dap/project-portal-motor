import Link from "next/link";
import { fetchArticles, fetchCategories } from "@/lib/supabase/queries";
import { ArticleCard } from "@/components/ui/Card";
import FaqAccordion from "@/components/FaqAccordion";
import { faqs } from "@/lib/data/oli";

export default async function Edukasi({
  searchParams,
}: {
  searchParams?: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const cat = sp?.cat;
  const [articles, categories] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchCategories().catch(() => []),
  ]);

  const edukasiCategories = categories.filter((c) => c.type === "edukasi");
  const activeCategory = cat
    ? edukasiCategories.find(
        (c) => c.slug.toLowerCase() === cat.toLowerCase() || c.name.toLowerCase() === cat.toLowerCase()
      )
    : null;

  // Exact matching by category_id or slug or name
  let filteredList = activeCategory
    ? articles.filter((a) => a.category_id === activeCategory.id)
    : cat
    ? articles.filter((a) => {
        const cn = categories.find((c) => c.id === a.category_id)?.name || "";
        return cn.toLowerCase().includes(cat.toLowerCase());
      })
    : articles;

  // Fallback: If filter returns 0 articles, display all articles so page is never empty!
  const isFallback = cat && filteredList.length === 0 && articles.length > 0;
  const displayList = isFallback ? articles : filteredList;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>{" "}
        / <span className="text-slate-900 font-medium">Edukasi</span>
      </div>
      <h1 className="mt-2 text-2xl font-black tracking-tight">EDUKASI MOTOR</h1>
      <p className="text-sm text-neutral-600">
        Pengetahuan dasar, tips merawat, dan FAQ dengan bahasa awam.
      </p>

      {/* Category filter pills */}
      <div className="mt-4 flex gap-2 flex-wrap items-center">
        <Link
          href="/edukasi"
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
            !cat ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          Semua
        </Link>
        {edukasiCategories.map((c) => {
          const isSelected = cat?.toLowerCase() === c.slug.toLowerCase() || cat?.toLowerCase() === c.name.toLowerCase();
          return (
            <Link
              key={c.id}
              href={`/edukasi?cat=${c.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                isSelected
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      {cat && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-neutral-100 border rounded-full px-3 py-1 text-xs">
            <span className="text-neutral-600">Kategori aktif:</span>
            <span className="font-bold">{activeCategory?.name || cat}</span>
            <Link href="/edukasi" className="ml-1 text-neutral-400 hover:text-black font-bold">
              ✕ Clear
            </Link>
          </div>

          {isFallback && (
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              Belum ada artikel khusus di kategori ini. Menampilkan semua artikel edukasi:
            </span>
          )}
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayList.map((a) => {
          const cn = categories.find((c) => c.id === a.category_id)?.name || "Edukasi";
          return (
            <ArticleCard
              key={a.id}
              title={a.title}
              excerpt={a.excerpt}
              cover={a.cover_url}
              href={`/perawatan/${a.slug}`}
              category={cn}
            />
          );
        })}

        {displayList.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-neutral-500 bg-neutral-50 rounded-2xl border">
            Belum ada artikel edukasi. Tambah artikel via CMS Admin.
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-black tracking-tight">FAQ — PERTANYAAN SERING</h2>
        <p className="text-sm text-neutral-600 mt-1">Jawaban singkat, kalau masih bingung hubungi kami di bawah.</p>
        <div className="mt-4">
          <FaqAccordion items={faqs} allowContact />
        </div>
      </div>
    </div>
  );
}
