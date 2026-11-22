# Propuesta: estructura editorial y SEO para artículos

## Estado actual comprobado
Los artículos viven en `web/content/articles/*.md` y se leen mediante `web/lib/articles.ts` con `gray-matter` y `marked`. El frontmatter actual cubre título, descripción corta (`copy`), categoría, fecha, publicación e imagen. La vista `web/app/blog/[slug]/page.tsx` muestra el HTML y los metadatos, pero no genera índice, breadcrumbs estructurados ni schema `BlogPosting`.

## Contrato recomendado (evolución compatible)
Mantener Markdown como fuente de verdad. Incorporar opcionalmente:
- `updated`: fecha real de revisión sustantiva, nunca generada automáticamente.
- `reviewedBy` y `sources`: referencias comprobables.
- `faq`: array de pares `question`/`answer`, si hay preguntas reales.
- `toc: true`: activar tabla de contenidos cuando existan varios encabezados.
- `readingTime`: calcularlo, no almacenarlo.
- Bloques fenced `prompt`: generar botón «Copiar prompt» sin variables ni placeholders.

## Renderizado
1. Parsear Markdown en servidor con identificadores estables para H2/H3; generar TOC desde los mismos encabezados.
2. Mostrar `Inicio / Blog / Artículo` con enlaces accesibles y JSON-LD `BreadcrumbList`.
3. Generar `BlogPosting` JSON-LD desde título, URL canónica, imagen, fecha, autor y `dateModified` solo si existe.
4. Mostrar FAQ como HTML visible y accesible. No añadir `FAQPage` automáticamente para buscar rich results; Google restringe esa presentación a determinados sitios de autoridad.
5. Renderizar tablas con contenedor `overflow-x-auto` y encabezados semánticos.
6. Renderizar fences `prompt` con botón de copia; sanitizar HTML y evitar interpolación insegura.
7. Validar frontmatter con esquema tipado (por ejemplo Zod), comprobando fechas, URL y unicidad de encabezados.
8. Conservar `published: false` en borradores; excluirlos del listado, sitemap y rutas públicas.

## Revisión previa a publicar
- Fuentes primarias revisadas y afirmaciones respaldadas.
- Ninguna experiencia personal inventada.
- Prompts listos para pegar, sin campos editables.
- TOC, breadcrumbs y FAQ coherentes con el contenido visible.
- JSON-LD válido y sin propiedades ficticias.
- Preview, build, accesibilidad móvil y sitemap verificados.

## Orden de implementación
1. Schema tipado y renderizado de encabezados con IDs.
2. TOC + breadcrumbs visuales y JSON-LD.
3. BlogPosting JSON-LD.
4. Tabla responsive + bloques prompt copiables.
5. FAQ estructurada opcional y revisión editorial.
