import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchArticles, fetchCategories } from "@/lib/supabase/queries";

async function getArticle(slug: string) {
  const articles = await fetchArticles().catch(() => []);
  return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Artikel tidak ditemukan" };
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: { title: a.title, description: a.excerpt, images: [{ url: a.cover_url, alt: a.title }] },
  };
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) {
    // legacy: slug oli lama → arahkan ke katalog oli, selain itu 404 ramah
    const { oliList } = await import("@/lib/data/oli");
    if (oliList.find((o) => o.slug === slug)) redirect(`/oli/${slug}`);
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h1 className="text-xl font-black">Artikel tidak ditemukan</h1>
        <p className="mt-2 text-sm text-neutral-500">Mungkin sudah dihapus atau slug berubah.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/edukasi" className="px-4 py-2 rounded-full border bg-white text-sm">← Edukasi</Link>
          <Link href="/katalog" className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold">Katalog →</Link>
        </div>
      </div>
    );
  }
  const categories = await fetchCategories().catch(() => []);
  const catName = categories.find((c) => c.id === a.category_id)?.name || "Edukasi";
  const paragraphs = (a.content || a.excerpt || "").split(/\n+/).filter(Boolean);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-slate-900">Home</Link> /{" "}
        <Link href="/edukasi" className="hover:text-slate-900">Edukasi</Link> /{" "}
        <span className="text-slate-900 font-medium">{catName}</span>
      </div>
      <span className="mono mt-3 inline-block text-[10px] tracking-[0.12em] font-black bg-[#0A0A0A] text-white px-2 py-1 rounded-full">
        {catName.toUpperCase()}
      </span>
      <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight leading-tight">{a.title}</h1>
      <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{a.excerpt}</p>
      <img src={a.cover_url} alt={a.title} className="mt-4 w-full h-64 object-cover rounded-[16px] border border-[#0A0A0A]/10" />
      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-neutral-800">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/edukasi" className="px-4 py-2 rounded-full border bg-white text-sm">← Artikel lain</Link>
        <Link href="/bengkel" className="px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-sm font-bold">Cari Bengkel →</Link>
        <Link href="/cek-masalah" className="px-4 py-2 rounded-full border bg-white text-sm">Cek Masalah</Link>
      </div>
    </div>
  );
}
