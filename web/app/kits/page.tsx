import Link from "next/link";
import { ArrowUpRight, ArrowRight, Compass } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getKits } from "@/lib/kits";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kits de herramientas para desarrollar proyectos",
  description: "Kits para construir interfaces, probar APIs, generar PDFs, automatizar tests, documentar arquitecturas y mantener proyectos.",
  alternates: { canonical: `${SITE_CONFIG.url}/kits` },
  openGraph: { title: "Kits | Enlaces para Desarrolladores", description: "Menos pestañas abiertas. Un camino concreto para construir.", url: `${SITE_CONFIG.url}/kits` },
};

const accents = { lime: "text-[#CAFC00]", blue: "text-sky-300", violet: "text-violet-300" } as const;
const borders = { lime: "hover:border-[#CAFC00]/60", blue: "hover:border-sky-300/50", violet: "hover:border-violet-300/50" } as const;

export default async function KitsPage() {
  const kits = await getKits();
  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-[#CAFC00] selection:text-black">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 sm:px-8">
        <nav aria-label="Ruta de navegación" className="mb-10 text-xs text-zinc-500"><Link href="/" className="hover:text-white">Inicio</Link> <span aria-hidden="true">/</span> <span className="text-zinc-300">Kits</span></nav>
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_290px] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-[#CAFC00]"><span className="h-px w-9 bg-[#CAFC00]" /> Una biblioteca de recorridos</div>
            <h1 className="max-w-4xl font-heading text-5xl font-bold leading-[1.05] tracking-[-.055em] sm:text-7xl">Menos pestañas.<br/><span className="text-[#CAFC00]">Más dirección.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">Un buen recurso resuelve una tarea. Un buen kit te ayuda a conectar varias. Elige qué quieres construir y sigue un recorrido corto por herramientas que ya están en nuestro catálogo.</p>
          </div>
          <div className="border-t border-zinc-700 pt-5 lg:border-l lg:border-t-0 lg:pl-6">
            <div className="font-heading text-5xl font-semibold tracking-tight text-white">{String(kits.length).padStart(2,"0")}</div>
            <p className="mt-2 text-sm text-zinc-400">Kits curados a mano. Mira el resultado, elige una ruta y empieza.</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {kits.map((kit, index) => (
            <Link key={kit.slug} href={`/kits/${kit.slug}`} className={`group relative flex min-h-[342px] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-zinc-800 bg-[#101112] p-6 transition-colors ${borders[kit.accent]} sm:p-8`}>
              <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/[.045] transition-transform duration-500 group-hover:scale-110" aria-hidden="true"><div className="absolute inset-6 rounded-full border border-white/[.045]"/><div className="absolute inset-12 rounded-full border border-white/[.045]"/></div>
              <div className="relative">
                <div className="mb-7 flex items-center justify-between gap-3"><span className={`font-mono text-[11px] tracking-[.12em] ${accents[kit.accent]}`}>{kit.eyebrow}</span><span className="font-mono text-xs text-zinc-600">{String(index+1).padStart(2,"0")} / {String(kits.length).padStart(2,"0")}</span></div>
                <h2 className="max-w-md font-heading text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[2.15rem]">{kit.title}</h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">{kit.description}</p>
                <div className="mt-6 rounded-xl border border-[#CAFC00]/20 bg-[#CAFC00]/[.055] px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[.13em] text-[#CAFC00]">LO QUE CONSIGUES</span>
                  <p className="mt-1 font-heading text-base font-semibold leading-6 text-white">{kit.result}</p>
                </div>
              </div>
              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div className="min-w-0 flex-1"><span className="block text-xs text-zinc-500">{kit.duration} · Herramientas incluidas</span></div>
                <span className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#CAFC00] px-5 text-sm font-bold text-black transition-colors group-hover:bg-lime-200">Explorar kit <ArrowUpRight className="h-4 w-4"/></span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-20 flex flex-col gap-7 border-y border-zinc-800 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4"><Compass className="mt-1 h-6 w-6 shrink-0 text-[#CAFC00]" /><div><h2 className="font-heading text-xl font-semibold">¿No encuentras tu recorrido?</h2><p className="mt-2 max-w-lg text-sm leading-6 text-zinc-400">Puedes seguir explorando el catálogo completo. Los kits no sustituyen la búsqueda: organizan una selección para tareas específicas.</p></div></div>
          <Link href="/" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#CAFC00] px-5 py-3 text-sm font-semibold text-[#CAFC00] hover:bg-[#CAFC00] hover:text-black">Ver todas las herramientas <ArrowRight className="h-4 w-4"/></Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
