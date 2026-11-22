import { getLinks, type LinkItem } from "@/lib/data";

/**
 * Un kit es una guía editorial, no una copia del catálogo.
 * Las URLs identifican los recursos existentes en README.md.
 * Si desaparece un enlace, el build falla para impedir fichas huérfanas.
 */
export interface KitDefinition {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  outcome: string;
  result: string;
  audience: string;
  duration: string;
  accent: "lime" | "blue" | "violet";
  steps: { title: string; why: string; resourceUrl: string; tryThis: string }[];
  relatedArticles: { title: string; href: string }[];
}

export interface ResolvedKit extends Omit<KitDefinition, "steps"> {
  steps: (KitDefinition["steps"][number] & { resource: LinkItem })[];
}

export const kitDefinitions: KitDefinition[] = [
  {
    slug: "interfaz-con-personalidad",
    eyebrow: "DISEÑO / FRONTEND",
    title: "Una interfaz que responde",
    description: "Animaciones pequeñas, decisiones visibles y componentes que no parecen sacados de la misma plantilla.",
    outcome: "Construir una página con feedback visual coherente, sin convertir cada botón en un espectáculo.",
    result: "Una interfaz con animaciones y estados claros",
    audience: "Para quien ya tiene una interfaz y quiere mejorar cómo se siente.",
    duration: "4 estaciones",
    accent: "lime",
    steps: [
      { title: "Decidir qué merece moverse", why: "Antes de animar, descubre qué interacción necesita señalar un cambio de estado.", resourceUrl: "https://cssfx.netlify.app/", tryThis: "Elige un hover y úsalo solo en la acción principal de una pantalla." },
      { title: "Dar ritmo a las transiciones", why: "Un mismo lenguaje de movimiento hace que componentes distintos parezcan parte del mismo producto.", resourceUrl: "https://tailwind-animations.com/", tryThis: "Prueba una animación de entrada y elimina cualquier otra que compita con ella." },
      { title: "Elegir iconos que ayuden a leer", why: "El icono debe reforzar la acción, no sustituir una etiqueta difícil de adivinar.", resourceUrl: "https://lucide-animated.com/", tryThis: "Añade un icono a un estado de éxito y comprueba que el mensaje siga siendo claro sin la animación." },
      { title: "Separar cada componente del resto", why: "Probar estados de forma aislada evita que las inconsistencias desaparezcan dentro de una página enorme.", resourceUrl: "https://github.com/storybookjs/storybook", tryThis: "Documenta los estados normal, loading, error y disabled de un solo componente." },
    ],
    relatedArticles: [{ title: "Micro-interacciones y sombras CSS", href: "/blog/animaciones-sombras-css-micro-interacciones-web" }],
  },
  {
    slug: "api-del-contrato-a-la-prueba",
    eyebrow: "BACKEND / APIS",
    title: "Una API que se puede entender",
    description: "De la primera petición a la documentación que otra persona realmente puede utilizar.",
    outcome: "Tener un flujo pequeño para explorar una API, documentarla y generar un cliente sin adivinar endpoints.",
    result: "API documentada, probada y con cliente generado",
    audience: "Para quien ya construyó una API y necesita hacerla fácil de probar.",
    duration: "3 estaciones",
    accent: "blue",
    steps: [
      { title: "Enviar la primera petición", why: "Una colección mínima permite verificar respuestas antes de escribir documentación extensa.", resourceUrl: "https://hoppscotch.com", tryThis: "Prueba una solicitud GET y documenta sus encabezados y respuesta de error." },
      { title: "Documentar sin duplicar", why: "Una especificación OpenAPI facilita que la documentación se mantenga vinculada al contrato.", resourceUrl: "https://github.com/redocly/redoc", tryThis: "Renderiza un contrato OpenAPI pequeño y revisa si las respuestas de error están explicadas." },
      { title: "Consumir el contrato desde otro proyecto", why: "Generar un cliente revela huecos en nombres, tipos y respuestas de la especificación.", resourceUrl: "https://github.com/OpenAPITools/openapi-generator", tryThis: "Genera un cliente de prueba y revisa manualmente cómo maneja errores." },
    ],
    relatedArticles: [{ title: "Bruno, Hoppscotch e Insomnia", href: "/blog/alternativas-postman-bruno-hoppscotch-insomnia" }],
  },
  {
    slug: "open-source-que-se-mantiene",
    eyebrow: "OPEN SOURCE / FLUJO",
    title: "Publicar es el comienzo",
    description: "Un README ayuda a llegar; mantener dependencias y documentar decisiones ayuda a quedarse.",
    outcome: "Preparar las bases de un repositorio que otras personas puedan comprender y contribuir.",
    result: "Repositorio documentado y fácil de mantener",
    audience: "Para quien está empezando a recibir usuarios o contribuciones.",
    duration: "3 estaciones",
    accent: "violet",
    steps: [
      { title: "Escribir para quien llega después", why: "Una documentación navegable reduce preguntas repetidas y hace visibles las decisiones.", resourceUrl: "https://github.com/meta/docusaurus", tryThis: "Crea una página de instalación y otra con preguntas frecuentes reales." },
      { title: "Reducir el trabajo de actualización", why: "Revisar dependencias a mano suele ser una tarea que se aplaza hasta que algo falla.", resourceUrl: "https://github.com/renovatebot/renovate", tryThis: "Configura una propuesta de actualización y revisa el impacto antes de fusionarla." },
      { title: "Aislar el entorno de ejecución", why: "Una guía reproducible vale más cuando no depende de la configuración de un solo portátil.", resourceUrl: "https://github.com/podman-container-tools/podman", tryThis: "Describe cómo ejecutar una aplicación pequeña con contenedores sin privilegios." },
    ],
    relatedArticles: [],
  },
  {
    slug: "pdf-para-aplicaciones",
    eyebrow: "DOCUMENTOS / JAVASCRIPT",
    title: "PDF sin complicaciones",
    description: "Genera documentos y convierte contenido en PDF desde una aplicación.",
    outcome: "Diseñar un flujo de generación y conversión de PDFs, con una opción para componentes React y otra para servicio independiente.",
    result: "PDFs generados desde React o un servicio",
    audience: "Para apps que necesitan reportes, contratos o archivos descargables.",
    duration: "3 estaciones",
    accent: "lime",
    steps: [
      { title: "Crear un documento ligero", why: "Empieza por un archivo mínimo antes de incorporar diseños complejos.", resourceUrl: "https://github.com/Lulzx/tinypdf", tryThis: "Genera un PDF con título, fecha y una tabla simple." },
      { title: "Componer desde React", why: "Si tu aplicación usa componentes, evalúa cómo reutilizar esa estructura para documentos.", resourceUrl: "https://github.com/akii09/pdfx", tryThis: "Dibuja un comprobante en React y revisa cómo se exporta." },
      { title: "Convertir contenido del servidor", why: "Un servicio separado puede encargarse de conversiones sin acoplarlas al frontend.", resourceUrl: "https://github.com/gotenberg/gotenberg", tryThis: "Convierte una página HTML pequeña en PDF y revisa el resultado." },
    ],
    relatedArticles: [{ title: "PDF.js o pdf-lib", href: "/blog/comparar-pdfjs-pdflib-procesar-pdf-navegador" }],
  },
  {
    slug: "pruebas-para-web",
    eyebrow: "CALIDAD / TESTING",
    title: "Pruebas que detectan errores",
    description: "Cubre funciones, recorridos del navegador y páginas completas.",
    outcome: "Montar una estrategia pequeña de pruebas unitarias, E2E y revisión de experiencia.",
    result: "Pruebas automatizadas para funciones y pantallas",
    audience: "Para quien quiere prevenir regresiones antes de desplegar.",
    duration: "3 estaciones",
    accent: "blue",
    steps: [
      { title: "Cubrir una función crítica", why: "Una prueba concreta revela errores sin depender de interfaces complejas.", resourceUrl: "https://github.com/vitest-dev/vitest", tryThis: "Escribe tres casos para una función de validación: correcto, vacío y límite." },
      { title: "Reproducir un recorrido real", why: "Una prueba E2E encuentra problemas entre pantallas y estados.", resourceUrl: "https://github.com/microsoft/playwright", tryThis: "Automatiza el recorrido desde un formulario hasta su confirmación." },
      { title: "Revisar varias páginas", why: "Un informe transversal encuentra problemas de rendimiento antes de que se repitan.", resourceUrl: "https://github.com/harlan-zw/unlighthouse", tryThis: "Revisa unas pocas rutas y selecciona una mejora medible." },
    ],
    relatedArticles: [],
  },
  {
    slug: "diagramar-una-arquitectura",
    eyebrow: "ARQUITECTURA / DOCUMENTACIÓN",
    title: "Explicar un sistema en diagramas",
    description: "Convierte relaciones difíciles de contar en mapas que el equipo puede revisar.",
    outcome: "Tener una vista simple del sistema y diagramas que puedan evolucionar junto al código.",
    result: "Un mapa legible de servicios y dependencias",
    audience: "Para equipos que necesitan explicar decisiones y dependencias.",
    duration: "3 estaciones",
    accent: "violet",
    steps: [
      { title: "Dibujar el flujo inicial", why: "Primero define las relaciones que importan, sin entrar en detalles de implementación.", resourceUrl: "https://openflowkit.com/", tryThis: "Dibuja cliente, API y base de datos y añade dos flujos de datos." },
      { title: "Documentar la arquitectura viva", why: "Una representación cercana al código facilita mantener el mapa al día.", resourceUrl: "https://github.com/likec4/likec4", tryThis: "Modela tres servicios y verifica cómo cambian sus relaciones." },
      { title: "Generar una vista portátil", why: "Exportar a SVG permite compartir diagramas sin obligar al lector a usar un editor.", resourceUrl: "https://github.com/lukilabs/beautiful-mermaid", tryThis: "Renderiza un diagrama pequeño y revisa su legibilidad a escala móvil." },
    ],
    relatedArticles: [],
  },
];

function normalizeUrl(url: string): string {
  try {
    const value = new URL(url);
    return `${value.hostname.toLowerCase().replace(/^www\./, "")}${value.pathname.replace(/\/$/, "")}`;
  } catch {
    return url.replace(/\/$/, "").toLowerCase();
  }
}

export async function getKits(): Promise<ResolvedKit[]> {
  const categories = await getLinks();
  const byUrl = new Map<string, LinkItem>();
  for (const category of categories) {
    for (const item of category.links) {
      const key = normalizeUrl(item.url);
      if (!byUrl.has(key)) byUrl.set(key, item);
    }
  }
  return kitDefinitions.map((kit) => ({
    ...kit,
    steps: kit.steps.map((step) => {
      const resource = byUrl.get(normalizeUrl(step.resourceUrl));
      if (!resource) throw new Error(`Kit "${kit.slug}" referencia un recurso ausente del README: ${step.resourceUrl}`);
      return { ...step, resource };
    }),
  }));
}

export async function getKit(slug: string): Promise<ResolvedKit | undefined> {
  return (await getKits()).find((kit) => kit.slug === slug);
}
