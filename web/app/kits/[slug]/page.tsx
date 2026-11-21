import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getKit, getKits, kitDefinitions } from "@/lib/kits";
import { KitActions } from "@/components/kit-actions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }
export function generateStaticParams() { return kitDefinitions.map(kit => ({ slug: kit.slug })); }
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug} = await params;
  const kit=kitDefinitions.find(k=>k.slug===slug);
  if(!kit)return {title:"Kit no encontrado", robots:{index:false}};
  const url=`${SITE_CONFIG.url}/kits/${slug}`;
  return {title:`${kit.title} | Kits de herramientas`,description:kit.description,alternates:{canonical:url},openGraph:{title:kit.title,description:kit.description,url,type:"article"}};
}
export default async function KitDetailPage({params}:Props){
  const {slug}=await params;
  const kit=await getKit(slug);
  if(!kit)notFound();
  const more=(await getKits()).filter(k=>k.slug!==kit.slug).slice(0,2);
  const schema={
    "@context":"https://schema.org",
    "@graph":[
      {"@type":"BreadcrumbList",itemListElement:[
        {"@type":"ListItem",position:1,name:"Inicio",item:SITE_CONFIG.url},
        {"@type":"ListItem",position:2,name:"Kits",item:`${SITE_CONFIG.url}/kits`},
        {"@type":"ListItem",position:3,name:kit.title,item:`${SITE_CONFIG.url}/kits/${kit.slug}`},
      ]},
      {"@type":"CollectionPage",name:kit.title,description:kit.description,url:`${SITE_CONFIG.url}/kits/${kit.slug}`,inLanguage:"es",mainEntity:{"@type":"ItemList",itemListElement:kit.steps.map((step,index)=>({"@type":"ListItem",position:index+1,name:step.resource.title,url:step.resource.url}))}}
    ]
  };
  return <main className="min-h-screen bg-black text-zinc-100 selection:bg-[#CAFC00] selection:text-black">
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8">
      <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-white">Inicio</Link><span>/</span><Link href="/kits" className="hover:text-white">Kits</Link><span>/</span><span className="text-zinc-300">{kit.title}</span>
      </nav>
      <div className="mt-12 grid gap-10 border-b border-zinc-800 pb-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[.18em] text-[#CAFC00]"><span className="h-px w-8 bg-[#CAFC00]"/>{kit.eyebrow}</div>
          <h1 className="max-w-3xl font-heading text-5xl font-bold leading-[1.06] tracking-[-.055em] sm:text-7xl">{kit.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">{kit.description}</p>
        </div>
        <aside className="self-start rounded-2xl border border-zinc-800 bg-[#121314] p-6">
          <span className="font-mono text-xs uppercase tracking-[.14em] text-[#CAFC00]">Nota de ruta / {kit.duration}</span>
          <h2 className="mt-5 font-heading text-2xl font-semibold text-white">Al terminar</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{kit.outcome}</p>
          <div className="my-5 h-px bg-zinc-800" />
          <span className="font-mono text-xs text-zinc-500">PARA QUIÉN</span>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{kit.audience}</p>
        </aside>
      </div>
      <section className="mt-10" aria-label="Herramientas y recorrido"><KitActions kit={kit}/></section>
      <section className="mt-16">
        {kit.relatedArticles.length>0 && <div className="mb-14">
          <h2 className="font-heading text-xl font-semibold">Para profundizar</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {kit.relatedArticles.map(article=><Link key={article.href} href={article.href} className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-[#CAFC00] hover:text-[#CAFC00]">{article.title}<ArrowUpRight className="h-4 w-4"/></Link>)}
          </div>
        </div>}
        <div className="flex flex-col justify-between gap-5 border-t border-zinc-800 pt-10 sm:flex-row sm:items-center">
          <div><h2 className="font-heading text-2xl font-semibold">El siguiente recorrido</h2><p className="mt-2 text-sm text-zinc-500">Estos kits se pueden seguir en cualquier orden.</p></div>
          <Link href="/kits" className="inline-flex items-center gap-2 text-sm font-semibold text-[#CAFC00] hover:underline"><ArrowLeft className="h-4 w-4"/> Todos los kits</Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{more.map(next=><Link key={next.slug} href={`/kits/${next.slug}`} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#111213] p-5 hover:border-[#CAFC00]/60"><div><span className="font-mono text-[10px] text-zinc-500">{next.eyebrow}</span><h3 className="mt-2 font-heading text-lg font-semibold">{next.title}</h3></div><ArrowUpRight className="h-5 w-5 text-[#CAFC00]"/></Link>)}</div>
      </section>
    </div><SiteFooter/>
  </main>;
}
