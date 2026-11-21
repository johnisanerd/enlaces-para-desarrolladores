"use client";

import { useState } from "react";
import { Check, Copy, Sparkles, X, GitCompareArrows, BookOpen, ShieldCheck, Wrench } from "lucide-react";

export interface AiResource {
  title: string;
  url: string;
  description?: string;
}

const goals = {
  compare: "Compara los recursos seleccionados: diferencias, ventajas, limitaciones y cuándo elegir cada uno. Incluye una tabla breve y una recomendación condicionada al caso de uso.",
  learn: "Explícame cómo empezar a utilizar estos recursos con ejemplos prácticos y enlaces a su documentación.",
  evaluate: "Evalúa estos recursos para un proyecto real: compatibilidad, mantenimiento, licencia si está documentada, riesgos y alternativas.",
  build: "Propón un proyecto pequeño que combine estos recursos, con pasos de implementación y ejemplos.",
} as const;

type Goal = keyof typeof goals;

export function AiExplorer({ resources, onClose }: { resources: AiResource[]; onClose: () => void }) {
  const [goal, setGoal] = useState<Goal>("compare");
  const [context, setContext] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const prompt = [
    "Quiero explorar recursos de Enlaces para Desarrolladores.",
    "",
    "Recursos seleccionados:",
    ...resources.map((resource, index) =>
      `${index + 1}. ${resource.title}\n   URL: ${resource.url}\n   Descripción del catálogo: ${resource.description || "Sin descripción"}`
    ),
    "",
    "Objetivo:",
    goals[goal],
    ...(context.trim() ? ["", "Contexto de mi proyecto:", context.trim()] : []),
    "",
    "Distingue hechos verificados de inferencias. No inventes funciones, licencias ni compatibilidades. Si puedes navegar, comprueba la documentación oficial y señala datos que puedan estar desactualizados.",
  ].join("\n");

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setError(false);
    } catch {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="ai-explorer-title" className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--primary)]"><Sparkles className="h-4 w-4" /><span className="text-xs font-mono">EXPLORAR CON IA</span></div>
            <h2 id="ai-explorer-title" className="mt-2 text-xl font-semibold text-white">Tu toolkit + IA</h2>
            <p className="mt-1 text-sm text-zinc-400">{resources.length} {resources.length === 1 ? "recurso seleccionado" : "recursos seleccionados"}. Listo para tu asistente favorito.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-md p-2 text-zinc-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {resources.map((resource) => <span key={resource.url} className="max-w-full truncate rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">{resource.title}</span>)}
        </div>
        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-semibold text-zinc-200">¿Para qué lo usarás?</legend>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["compare", "Comparar", GitCompareArrows],
              ["learn", "Aprender", BookOpen],
              ["evaluate", "Evaluar", ShieldCheck],
              ["build", "Crear", Wrench],
            ] as const).map(([value, label, Icon]) => (
              <label key={value} className={`cursor-pointer rounded-lg border px-3 py-2.5 text-sm transition-colors ${goal === value ? "border-[var(--primary)] bg-[var(--primary)]/10 text-white" : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"}`}>
                <input type="radio" name="ai-goal" value={value} checked={goal === value} onChange={() => { setGoal(value); setCopied(false); }} className="sr-only" />
                <span className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0" />{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="ai-context" className="mt-5 block text-sm font-semibold text-zinc-200">Contexto <span className="font-normal text-zinc-500">(opcional)</span></label>
        <textarea id="ai-context" value={context} onChange={(event) => { setContext(event.target.value); setCopied(false); }} maxLength={2000} rows={3} placeholder="Ej.: Estoy creando una app con Next.js y necesito opciones gratuitas..." className="mt-2 w-full resize-y rounded-lg border border-zinc-800 bg-black p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" />
        <details className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-3">
          <summary className="cursor-pointer text-xs font-mono text-zinc-400">Ver prompt</summary>
          <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-relaxed text-zinc-300">{prompt}</pre>
        </details>
        {error && <p role="alert" className="mt-3 text-xs text-red-400">No se pudo copiar automáticamente. Selecciona el texto de la vista previa para copiarlo manualmente.</p>}
        <button type="button" onClick={copyPrompt} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-4 text-base font-extrabold text-black shadow-[0_0_28px_rgba(202,252,0,0.22)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(202,252,0,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Prompt copiado" : "Copiar prompt"}
        </button>
        <p className="mt-3 text-center text-xs text-zinc-500">Solo se copia el texto. No enviamos datos a una IA.</p>
      </section>
    </div>
  );
}
