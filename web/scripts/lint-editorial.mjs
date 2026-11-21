#!/usr/bin/env node
/**
 * Linter editorial para artículos piloto en español.
 * Señala clichés, redundancias y prompts que necesitan rellenarse.
 * No intenta atribuir el texto a personas ni a modelos.
 *
 * Uso: node scripts/lint-editorial.mjs [rutas markdown...]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const defaults = [
  "content/articles/comparar-pdfjs-pdflib-procesar-pdf-navegador.md",
  "content/articles/alternativas-postman-bruno-hoppscotch-insomnia.md",
];
const files = process.argv.slice(2).length ? process.argv.slice(2) : defaults;
const generic = [
  [/en el mundo (actual|digital|de hoy)/i, "Introducción genérica"],
  [/en la era (digital|de la inteligencia artificial)/i, "Introducción genérica"],
  [/lleva(?:r)? (?:tu|tus|la|el) .{2,60} al siguiente nivel/i, "Promesa vacía"],
  [/herramienta (?:poderosa|revolucionaria|imprescindible)/i, "Calificativo sin evidencia"],
  [/cabe destacar que/i, "Conector de relleno"],
  [/en definitiva[,.:]/i, "Cierre automático"],
  [/no solo .{5,120},? sino (?:que )?también/i, "Contraste repetitivo"],
];
let errors = 0, warnings = 0;
for (const filename of files) {
  const full = resolve(filename);
  let markdown;
  try { markdown = readFileSync(full, "utf8"); }
  catch (error) { console.error(`ERROR ${filename}: ${error.message}`); errors++; continue; }
  const lines = markdown.split(/\r?\n/);
  let fence = null;
  let promptCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const marker = line.match(/^\s*```(\w*)/);
    if (marker) {
      if (!fence) { fence = marker[1]; if (fence === "prompt") promptCount++; }
      else fence = null;
      continue;
    }
    if (fence === "prompt") {
      if (/\[[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s_-]{2,}\]|\{\{[^}]+\}\}|<(?:tu|your|insert)[^>]*>/i.test(line)) {
        console.error(`ERROR ${filename}:${i+1}: prompt con campo pendiente de completar`);
        errors++;
      }
      continue;
    }
    if (fence) continue;
    for (const [pattern, reason] of generic) {
      if (pattern.test(line)) {
        console.warn(`AVISO ${filename}:${i+1}: ${reason}`);
        warnings++;
      }
    }
  }
  if (promptCount === 0) { console.warn(`AVISO ${filename}: sin bloques de prompt`); warnings++; }
}
console.log(`Revisión editorial: ${files.length} archivo(s), ${errors} errores, ${warnings} avisos.`);
process.exitCode = errors ? 1 : 0;
