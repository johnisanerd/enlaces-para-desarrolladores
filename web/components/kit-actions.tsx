"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Share2, Sparkles, Star } from "lucide-react";
import { AiExplorer } from "@/components/ai-explorer";
import type { ResolvedKit } from "@/lib/kits";

function keyFor(slug: string) { return `kit_progress_v1:${slug}`; }
type Favorite = { title: string; url: string; description?: string };

export function KitActions({ kit }: { kit: ResolvedKit }) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(kit.slug));
      if (raw) {
        const values: unknown = JSON.parse(raw);
        if (Array.isArray(values)) setCompleted(values.filter((v): v is number => Number.isInteger(v) && v >= 0 && v < kit.steps.length));
      }
      const favorites: Favorite[] = JSON.parse(localStorage.getItem("toolkit_favorites") || "[]");
      setSaved(kit.steps.every(({ resource }) => favorites.some(f => f.url === resource.url)));
    } catch { /* Storage might be unavailable; the kit remains usable. */ }
    setMounted(true);
  }, [kit.slug, kit.steps]);

  const toggle = (index: number) => {
    const next = completed.includes(index) ? completed.filter(i => i !== index) : [...completed, index];
    setCompleted(next);
    try { localStorage.setItem(keyFor(kit.slug), JSON.stringify(next)); } catch { /* Ignore blocked storage */ }
  };

  const saveToToolkit = () => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem("toolkit_favorites") || "[]");
      const list: Favorite[] = Array.isArray(raw) ? raw.filter((f): f is Favorite => Boolean(f) && typeof f.url === "string" && typeof f.title === "string") : [];
      const known = new Set(list.map(f => f.url));
      for (const { resource } of kit.steps) {
        if (!known.has(resource.url)) { list.push({ title: resource.title, url: resource.url, description: resource.description }); known.add(resource.url); }
      }
      localStorage.setItem("toolkit_favorites", JSON.stringify(list));
      window.dispatchEvent(new Event("toolkit-updated"));
      setSaved(true);
      setMessage("Herramientas añadidas a Mi Toolkit");
    } catch { setMessage("Tu navegador no permite guardar el kit."); }
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setMessage("Enlace copiado"); }
    catch { setMessage("No se pudo copiar el enlace"); }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: kit.title, text: kit.description, url: window.location.href }); }
      catch (error) { if ((error as Error).name !== "AbortError") void copyLink(); }
    } else void copyLink();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-stretch">
        <button type="button" onClick={saveToToolkit} disabled={saved} className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#CAFC00] px-4 py-3 text-sm font-bold leading-5 text-black transition-colors hover:bg-lime-200 disabled:cursor-default disabled:bg-zinc-800 disabled:text-zinc-400 sm:w-auto sm:rounded-full sm:px-5">
          {saved ? <Check className="h-4 w-4" /> : <Star className="h-4 w-4"/>}{saved ? "En Mi Toolkit" : "Guardar herramientas"}
        </button>
        <button type="button" onClick={()=>setAiOpen(true)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#CAFC00]/55 bg-[#CAFC00]/10 px-4 py-3 text-sm font-semibold leading-5 text-white transition-colors hover:bg-[#CAFC00]/20 sm:w-auto sm:rounded-full sm:px-5"><Sparkles className="h-4 w-4 text-[#CAFC00]"/> Explorar con IA</button>
        <button type="button" onClick={share} className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium leading-5 text-zinc-300 hover:border-zinc-500 hover:text-white sm:w-auto sm:rounded-full"><Share2 className="h-4 w-4"/> Compartir</button>
        <button type="button" onClick={copyLink} title="Copiar enlace" aria-label="Copiar enlace del kit" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-zinc-300 hover:border-zinc-500 hover:text-white sm:w-12 sm:rounded-full sm:px-0"><Copy className="h-4 w-4"/></button>
      </div>
      {message && <p role="status" className="mt-3 text-xs text-[#CAFC00]">{message}</p>}
      <div className="mt-14 border-t border-zinc-800 pt-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div><span className="font-mono text-xs tracking-[.15em] text-[#CAFC00]">RECORRIDO</span><h2 className="mt-2 font-heading text-2xl font-semibold">De una decisión a la siguiente</h2></div>
          <span className="font-mono text-xs text-zinc-500">{mounted ? completed.length : 0} / {kit.steps.length} exploradas</span>
        </div>
        <div className="relative border-l border-zinc-700 pl-6 sm:pl-10">
          {kit.steps.map((step, index) => {
            const done = completed.includes(index);
            return (
              <section key={step.resource.url} className="relative pb-10 last:pb-0">
                <span aria-hidden="true" className={`absolute -left-[31px] top-1 flex h-3 w-3 rounded-full border-2 border-black sm:-left-[47px] ${done?"bg-[#CAFC00]":"bg-zinc-600"}`} />
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-xl">
                    <span className="font-mono text-xs text-zinc-500">PASO {String(index+1).padStart(2,"0")}</span>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">{step.why}</p>
                    <div className="mt-4 rounded-xl border border-zinc-800/80 bg-[#121315] px-4 py-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#CAFC00]">Una prueba pequeña</span>
                      <p className="mt-1 text-sm leading-6 text-zinc-300">{step.tryThis}</p>
                    </div>
                  </div>
                  <div className="w-full shrink-0 rounded-xl border border-zinc-800 bg-zinc-950 p-4 md:w-56">
                    <div className="text-sm font-semibold text-white">{step.resource.title}</div>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">{step.resource.description || "Recurso del catálogo"}</p>
                    <a href={step.resource.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#CAFC00] px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-lime-200">Abrir herramienta ↗</a>
                    <label className="mt-4 flex cursor-pointer items-center gap-2 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
                      <input type="checkbox" checked={done} onChange={()=>toggle(index)} className="accent-[#CAFC00]" /> Ya la exploré
                    </label>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
      {aiOpen && <AiExplorer onClose={()=>setAiOpen(false)} resources={kit.steps.map(({resource})=>({title:resource.title,url:resource.url,description:resource.description}))}/>}
    </>
  );
}
