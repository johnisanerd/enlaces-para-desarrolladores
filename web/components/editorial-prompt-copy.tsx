"use client";

import { useEffect } from "react";

export function EditorialPromptCopy() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>("[data-copy-prompt]");
      if (!button) return;
      const code = button.closest(".editorial-prompt")?.querySelector("pre code")?.textContent;
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "¡Copiado!";
        window.setTimeout(() => { button.textContent = "Copiar prompt"; }, 1800);
      } catch {
        button.textContent = "No se pudo copiar";
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
