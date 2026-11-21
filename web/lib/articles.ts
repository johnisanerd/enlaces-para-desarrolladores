import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Marked, Renderer } from "marked";
import DOMPurify from "isomorphic-dompurify";

export interface Article {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  copy: string;
  category: string;
  date: string;
  published: boolean;
  content: string;
  rawContent: string;
  updated?: string;
  toc: { id: string; text: string; level: number }[];
  faq: { question: string; answer: string }[];
  tldr: string[];
}

const articlesDirectory = path.join(process.cwd(), "content", "articles");

/**
 * Obtiene todos los artículos editoriales de content/articles/ que estén publicados (published === true).
 * Ordenados de forma descendente por fecha.
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const fileNames = await fs.readdir(articlesDirectory);
    const mdFiles = fileNames.filter((fileName) => fileName.endsWith(".md"));

    const articlesPromises = mdFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        image: data.image || `/og/posts/${slug}.webp`,
        imageAlt: data.imageAlt || "",
        copy: data.copy || "",
        category: data.category || "",
        date: data.date
          ? data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : String(data.date)
          : "",
        published: typeof data.published === "boolean" ? data.published : false,
        content: "",
        rawContent: content,
        updated: data.updated ? String(data.updated) : undefined,
        toc: [],
        faq: [],
        tldr: Array.isArray(data.tldr) ? data.tldr.filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0) : [],
      };
    });

    const allArticles = await Promise.all(articlesPromises);

    return allArticles
      .filter((article) => {
        if (!article.published) return false;
        if (!article.date) return false;
        return article.date <= todayStr;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}

/**
 * Obtiene un artículo específico por su slug y procesa su contenido Markdown a HTML.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    if (data.published === false) {
      return null;
    }

    if (data.date) {
      const postDateStr = data.date instanceof Date
        ? data.date.toISOString().split("T")[0]
        : String(data.date);
      const todayStr = new Date().toISOString().split("T")[0];
      if (postDateStr > todayStr) {
        return null;
      }
    }

    const toc: { id: string; text: string; level: number }[] = [];
    const seen = new Map<string, number>();
    const renderer = new Renderer();
    renderer.heading = function ({ text, depth, tokens }) {
      const label = text.replace(/<[^>]+>/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "");
      const base = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "seccion";
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count + 1}` : base;
      if (depth === 2 || depth === 3) toc.push({ id, text: label, level: depth });
      return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
    };
    renderer.table = function (token) {
      const header = token.header.map((cell) => `<th scope="col">${this.parser.parseInline(cell.tokens)}</th>`).join("");
      const rows = token.rows.map((row) => `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`).join("");
      return `<div class="editorial-table-scroll" role="region" aria-label="Tabla comparativa" tabindex="0"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
    };
    renderer.code = function ({ text, lang }) {
      const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      if (lang === "prompt") return `<div class="editorial-prompt"><div class="editorial-prompt-header"><span>Pruébalo con tu IA</span><button type="button" data-copy-prompt aria-label="Copiar prompt">Copiar prompt</button></div><pre><code>${escaped}</code></pre></div>`;
      return `<pre><code class="language-${(lang || "text").replace(/[^a-z0-9-]/gi, "")}">${escaped}</code></pre>`;
    };
    // Directivas editoriales de Markdown, restringidas a texto simple y una palabra/frase corta.
    // No ejecutan JSX, JavaScript ni HTML escrito por autores.
    const escapeHtml = (value: string) =>
      value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const editorialKinds = ["shine", "large", "mark"] as const;
    const parser = new Marked({ renderer });
    parser.use({
      extensions: editorialKinds.map((kind) => ({
        name: `editorial-${kind}`,
        level: "inline" as const,
        start: (src: string) => src.indexOf(`:${kind}[`),
        tokenizer(src: string) {
          const prefix = `:${kind}[`;
          if (!src.startsWith(prefix)) return;
          const end = src.indexOf("]", prefix.length);
          if (end < 0) return;
          const label = src.slice(prefix.length, end);
          if (!label || label.length > 100 || label.includes("[") || label.includes("\n")) return;
          return { type: `editorial-${kind}`, raw: src.slice(0, end + 1), text: label };
        },
        renderer(token) {
          return `<span class="editorial-${kind}">${escapeHtml(String(token.text ?? ""))}</span>`;
        },
      })),
    });
    const rawHtml = await parser.parse(content);
    const processedContent = DOMPurify.sanitize(rawHtml);
    const faq: { question: string; answer: string }[] = [];
    const faqStart = toc.findIndex((item) => item.level === 2 && /preguntas frecuentes/i.test(item.text));
    if (faqStart >= 0) {
      for (const heading of toc.slice(faqStart + 1)) {
        if (heading.level === 2) break;
        if (heading.level === 3) faq.push({ question: heading.text, answer: "" });
      }
    }

    return {
      slug,
      title: data.title || "",
      image: data.image || `/og/posts/${slug}.webp`,
      imageAlt: data.imageAlt || "",
      copy: data.copy || "",
      category: data.category || "",
      date: data.date
        ? data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : String(data.date)
        : "",
      published: typeof data.published === "boolean" ? data.published : false,
      content: processedContent,
      rawContent: content,
      updated: data.updated ? String(data.updated) : undefined,
      toc,
      faq,
      tldr: Array.isArray(data.tldr) ? data.tldr.filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0) : [],
    };
  } catch (error) {
    if ((error as { code?: string }).code !== "ENOENT") {
      console.error(`Error leyendo el artículo con slug ${slug}:`, error);
    }
    return null;
  }
}
