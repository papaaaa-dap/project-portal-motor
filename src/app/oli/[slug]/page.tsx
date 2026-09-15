import { redirect } from "next/navigation";
export default async function OliDetail({params}:{params: Promise<{slug:string}>}){
  const {slug} = await params;
  redirect(`/katalog/${slug}`);
}
