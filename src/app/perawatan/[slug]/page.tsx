import { redirect } from "next/navigation";
export default async function Detail({params}:{params: Promise<{slug:string}>}){
  const {slug}=await params;
  // try oli first, otherwise redirect to oli list
  const { oliList } = await import("@/lib/data/oli");
  if(oliList.find(o=>o.slug===slug)) redirect(`/oli/${slug}`);
  redirect("/oli");
}
