import { redirect } from "next/navigation";
export default async function OliPage({searchParams}:{searchParams: Promise<{q?:string}>}){
  const sp = await searchParams;
  const q = sp.q ? `?q=${encodeURIComponent(sp.q)}` : "";
  redirect(`/katalog?cat=oli-mesin${q?"&"+q.slice(1):""}`);
}
