import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { Calendar, ArrowLeft, Clock, Users } from "lucide-react";
import { EditorialActions } from "@/components/editorial-actions";
import { EditorialPromptCopy } from "@/components/editorial-prompt-copy";
import { SITE_CONFIG } from "@/lib/site-config";
import { kitDefinitions } from "@/lib/kits";
import type { Metadata } from "next";

export const revalidate = 3600;

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

// Generar los parámetros estáticos para todas las páginas en tiempo de compilación (Static Site Generation)
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generar metadatos dinámicos para SEO (Open Graph, Twitter) de cada post
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const siteUrl = SITE_CONFIG.url;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${siteUrl}${post.image}`;

  return {
    title: post.title,
    description: post.copy,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.copy,
      type: "article",
      url: postUrl,
      publishedTime: post.date,
      authors: ["El Equipo"],
      images: [
        {
          url: imageUrl,
          alt: post.imageAlt || post.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.copy,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  // Calcular tiempo estimado de lectura aproximado (200 palabras por minuto)
  const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min de lectura`;
  };

  const readingTime = calculateReadingTime(post.rawContent);
  const relatedKits = kitDefinitions.filter((kit) => kit.relatedArticles.some((article) => article.href === `/blog/${post.slug}`));

  // Formatear fecha en español de forma limpia
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const [y, m, d] = parts;
      const monthIdx = parseInt(m, 10) - 1;
      const dayNum = parseInt(d, 10);
      return `${dayNum} de ${months[monthIdx] || m} de ${y}`;
    }
    return dateStr;
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-[var(--primary)] selection:text-black relative overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />

      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            headline: post.title,
            description: post.copy,
            mainEntityOfPage: `${SITE_CONFIG.url}/blog/${post.slug}`,
            url: `${SITE_CONFIG.url}/blog/${post.slug}`,
            datePublished: post.date,
            ...(post.updated ? { dateModified: post.updated } : {}),
            author: { "@type": "Organization", name: "El Equipo", url: SITE_CONFIG.url },
            publisher: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
            image: post.image.startsWith("http") ? post.image : `${SITE_CONFIG.url}${post.image}`,
            inLanguage: "es"
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_CONFIG.url },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_CONFIG.url}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_CONFIG.url}/blog/${post.slug}` }
            ]
          }
        ]
      }).replace(/</g, "\\u003c") }} />
      <EditorialPromptCopy />
      <div className="pt-32 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20">
        <nav aria-label="Ruta de navegación" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Inicio</Link><span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-zinc-200">{post.title}</span>
        </nav>
        {/* Back Link Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[var(--primary)] transition-colors duration-200 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Volver al blog</span>
        </Link>

        {/* Article Header info */}
        <header className="mb-10">
          {post.category && (
            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/20 uppercase tracking-wider mb-4">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-zinc-500 border-y border-white/5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Users aria-hidden="true" className="h-4 w-4" />
              <span className="font-bold text-zinc-300">El Equipo</span>
            </div>
          </div>
        </header>

        {post.tldr.length > 0 && (
          <aside aria-labelledby="article-tldr" className="editorial-tldr mb-10 py-2">
            <div className="mb-4 flex items-center gap-3">
              <h2 id="article-tldr" className="font-heading text-lg font-bold tracking-tight text-white">En pocas palabras</h2>
              <span className="ml-auto font-mono text-xs font-semibold uppercase tracking-widest text-[#CAFC00]">TL;DR</span>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {post.tldr.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-0.5 font-mono font-bold text-[#CAFC00]">0{index + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
        {post.toc.length >= 2 && (
          <nav aria-label="Tabla de contenidos" className="mb-10 rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">En este artículo</h2>
            <ol className="space-y-2 text-sm">
              {post.toc.map((heading) => (
                <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
                  <a href={`#${heading.id}`} className="text-zinc-400 hover:text-[#CAFC00]">{heading.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {/* Dynamic HTML Content with custom styles (Markdown compiler result) */}
        <article className="prose-custom mb-16 text-zinc-300 leading-relaxed text-base sm:text-lg">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-6"
          />
        </article>

        {/* Stylesheet inline para formatear el Markdown de forma premium y limpia */}
        <style dangerouslySetInnerHTML={{ __html: `
          .prose-custom h2, .prose-custom h3 { scroll-margin-top: 7rem; font-family: var(--font-space-grotesk), sans-serif; }
          .prose-custom h2 {
            font-size: 1.5rem;
            font-weight: 800;
            color: #ffffff;
            margin-top: 2rem;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
          }
          .prose-custom h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffffff;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .prose-custom p {
            margin-bottom: 1.25rem;
            color: #d4d4d8;
          }
          .prose-custom strong {
            color: #ffffff;
            font-weight: 600;
          }
          .prose-custom a {
            color: #CAFC00;
            text-decoration: underline;
            text-underline-offset: 4px;
            font-weight: 600;
            transition: color 0.2s;
          }
          .prose-custom a:hover {
            color: #ffffff;
          }
          .prose-custom ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
            space-y: 0.5rem;
          }
          .prose-custom ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .prose-custom li {
            margin-bottom: 0.5rem;
          }
          .prose-custom code {
            font-family: monospace;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875em;
            color: #f4f4f5;
            border: 1px border rgba(255, 255, 255, 0.05);
          }
          .prose-custom pre {
            background-color: #09090b;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 0.75rem;
            padding: 1.25rem;
            overflow-x: auto;
            margin-bottom: 1.5rem;
            font-family: monospace;
          }
          .prose-custom pre code {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
            border: none;
            color: #e4e4e7;
          }
          .prose-custom .editorial-table-scroll { overflow-x: auto; margin: 1.5rem 0; border-radius: .5rem; }
          .prose-custom table { width: 100%; border-collapse: collapse; min-width: 520px; font-size: .875rem; }
          .prose-custom th, .prose-custom td { border: 1px solid #3f3f46; padding: .75rem; text-align: left; vertical-align: top; }
          .prose-custom th { background: #18181b; color: #fff; }
          .prose-custom .editorial-prompt { border: 1px solid #52525b; border-radius: .75rem; overflow: hidden; margin: 2rem 0; }
          .prose-custom .editorial-prompt-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 1rem; background: #18181b; color: #fff; font-size: .875rem; font-weight: 600; }
          .prose-custom .editorial-prompt-header button { background: #CAFC00; color: #090909; border-radius: .5rem; padding: .6rem .9rem; font-weight: 700; cursor: pointer; }
          .prose-custom .editorial-prompt pre { margin: 0; border: 0; border-radius: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
          .prose-custom .editorial-large { font-family: var(--font-space-grotesk), sans-serif; font-size: clamp(1.06em, 1.25em, 1.35em); font-weight: 750; color: #fff; letter-spacing: -.025em; }
          .prose-custom .editorial-mark { color: #CAFC00; font-weight: 700; text-decoration-line: underline; text-decoration-color: rgba(202, 252, 0, .4); text-underline-offset: .2em; }
          .prose-custom .editorial-shine { color: #CAFC00; font-weight: 750; background: linear-gradient(110deg, #CAFC00 0%, #CAFC00 35%, #fff 48%, #CAFC00 61%, #CAFC00 100%); background-size: 260% auto; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: editorial-shine 7s linear infinite; }
          @keyframes editorial-shine { 0%, 32% { background-position: 110% center; } 65%, 100% { background-position: -110% center; } }
          @media (prefers-reduced-motion: reduce) { .prose-custom .editorial-shine { animation: none; background: none; -webkit-text-fill-color: initial; color: #CAFC00; } }
          @media (prefers-contrast: more) { .prose-custom .editorial-shine { animation: none; background: none; -webkit-text-fill-color: initial; color: #CAFC00; } }
          .prose-custom .editorial-with-icon { display: inline; white-space: normal; }
          .prose-custom .editorial-sup-icon { display: inline-flex; position: relative; top: -.28em; margin-left: .18em; vertical-align: super; color: #CAFC00; line-height: 1; }
          .prose-custom .editorial-sup-icon svg { display: inline-block; width: .77em; height: .77em; }
          .prose-custom .editorial-references-tree { margin: 1rem 0 2rem; }
          .prose-custom .editorial-references-tree ul { list-style: none; margin: 0; padding-left: 1.4rem; border-left: 1px solid rgba(202,252,0,.35); }
          .prose-custom .editorial-references-tree li { position: relative; margin: 0; padding: .5rem 0 .5rem 1rem; }
          .prose-custom .editorial-references-tree li::before { content: ""; position: absolute; left: -1.4rem; top: 1.18rem; width: 1.3rem; border-top: 1px solid rgba(202,252,0,.35); }
          .prose-custom .editorial-references-tree li:last-child::after { content: ""; position: absolute; left: -1.45rem; top: 1.2rem; bottom: 0; width: 2px; background: #090909; }
          .prose-custom .editorial-references-tree a { display: inline-flex; align-items: center; gap: .35rem; text-decoration: none; overflow-wrap: anywhere; }
          .prose-custom .editorial-references-tree a::after { content: "↗"; font-size: .72em; opacity: .7; }
          .prose-custom blockquote {
            border-left: 4px solid #CAFC00;
            padding-left: 1.25rem;
            font-style: italic;
            color: #a1a1aa;
            margin: 1.5rem 0;
          }
        ` }} />

        {relatedKits.length > 0 && (
          <aside aria-label="Kits relacionados" className="mb-12 border-t border-zinc-800 pt-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#CAFC00]">PARA SEGUIR EXPLORANDO</span>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-white">Pon las herramientas en contexto</h2>
            <div className="mt-5 grid gap-3">
              {relatedKits.map((kit) => (
                <Link key={kit.slug} href={`/kits/${kit.slug}`} className="group flex items-center justify-between gap-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5 hover:border-[#CAFC00]/60">
                  <div><span className="text-xs text-zinc-500">{kit.eyebrow}</span><h3 className="mt-1 font-heading text-lg font-semibold text-white">{kit.title}</h3><p className="mt-2 text-sm text-zinc-400">{kit.outcome}</p></div>
                  <span className="shrink-0 text-[#CAFC00]" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
        {/* Footer actions / Share */}
        <footer className="border-t border-white/5 pt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la lista</span>
          </Link>

          <EditorialActions title={post.title} description={post.copy} markdown={post.rawContent} />
        </footer>
      </div>

      <SiteFooter />
    </main>
  );
}
