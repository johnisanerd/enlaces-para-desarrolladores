import { Suspense } from "react";
import { getLinks } from "@/lib/data";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { GalleryClientSide } from "@/components/gallery-clientside";
import { SiteFooter } from "@/components/site-footer";
import { SITE_CONFIG } from "@/lib/site-config";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

// Revalidate every hour (literal required by Next.js static AST analyzer)
export const revalidate = 3600;

export default async function Home() {
  const categories = await getLinks();

  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-[var(--primary)] selection:text-black relative overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />
      
      <SiteHeader />
      
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": SITE_CONFIG.name,
            "description": SITE_CONFIG.description,
            "url": SITE_CONFIG.url,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": categories.map((cat, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "item": {
                  "@type": "CreativeWorkSeries",
                  "name": cat.name,
                  "description": `Recursos sobre ${cat.name}`
                }
              }))
            }
          })
        }}
      />

      <div className="pt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
         <Hero />
         <Link href="/kits" className="group my-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#CAFC00]/20 bg-[#CAFC00]/[0.045] px-6 py-5 transition-colors hover:border-[#CAFC00]/60 sm:flex-row sm:items-center">
           <div className="flex items-start gap-4"><Layers3 className="mt-1 h-5 w-5 shrink-0 text-[#CAFC00]"/><div><span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#CAFC00]">NUEVO · KITS</span><h2 className="mt-1 font-heading text-xl font-semibold text-white">¿Qué estás intentando construir?</h2><p className="mt-1 text-sm text-zinc-400">Tres recorridos cortos para convertir recursos sueltos en un plan concreto.</p></div></div>
           <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#CAFC00]">Explorar kits <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span>
         </Link>
         <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Cargando recursos de desarrollo...</div>}>
            <GalleryClientSide initialCategories={categories} />
         </Suspense>
      </div>

      <SiteFooter />
    </main>
  );
}
