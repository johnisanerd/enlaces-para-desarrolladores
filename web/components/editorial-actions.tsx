"use client";

import { useState } from "react";
import { Check, FileText, Share2, Link as LinkIcon, ChevronDown } from "lucide-react";
import { trackShare } from "@/lib/analytics";

interface Props { title: string; description: string; markdown: string; }

export function EditorialActions({ title, description, markdown }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "markdown" | null>(null);
  const getUrl = () => window.location.href;
  const copy = async (text: string, kind: "link" | "markdown") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      setCopied(null);
    }
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: getUrl() });
        trackShare({ title, method: "native_share", url: getUrl() });
      } catch (error) {
        if ((error as Error).name !== "AbortError") setOpen(true);
      }
    } else setOpen((prev) => !prev);
  };
  const url = typeof window === "undefined" ? "" : window.location.href;
  const socialLinks = [
    { name: "WhatsApp", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}` },
    { name: "X", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];
  return (
    <div className="flex flex-wrap items-start justify-end gap-2">
      <div className="relative">
        <button type="button" onClick={share} aria-expanded={open} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#CAFC00]">
          <Share2 className="h-4 w-4" /> Compartir <ChevronDown className="h-3.5 w-3.5" />
        </button>
        {open && (
          <div className="absolute bottom-full right-0 z-20 mb-2 w-44 rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-xl" aria-label="Opciones para compartir">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" onClick={() => { trackShare({ title, method: "clipboard", url: getUrl() }); setOpen(false); }} className="block rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">{social.name}</a>
            ))}
            <button type="button" onClick={() => { void copy(getUrl(), "link"); setOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800">
              <LinkIcon className="h-4 w-4" /> Copiar enlace
            </button>
          </div>
        )}
      </div>
      <button type="button" onClick={() => void copy(markdown, "markdown")} className="inline-flex items-center gap-2 rounded-full border border-[#CAFC00]/30 bg-[#CAFC00]/10 px-4 py-2 text-sm font-semibold text-[#CAFC00] hover:bg-[#CAFC00]/20 focus-visible:outline-2 focus-visible:outline-[#CAFC00]">
        {copied === "markdown" ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        {copied === "markdown" ? "Markdown copiado" : "Copiar contenido"}
      </button>
    </div>
  );
}
