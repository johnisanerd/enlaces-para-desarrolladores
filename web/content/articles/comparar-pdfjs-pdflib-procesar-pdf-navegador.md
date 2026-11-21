---
title: "PDF.js o pdf-lib: cuál usar para trabajar con PDF en el navegador"
copy: "Comparo PDF.js y pdf-lib según su propósito, operaciones habituales y límites, con ejemplos y un prompt listo para probar."
category: "PDF y JavaScript"
date: "2026-11-21"
published: true
tldr:
  - "PDF.js sirve para representar páginas de un PDF; pdf-lib se enfoca en crear y modificar documentos."
  - "Si necesito ambas funciones, puedo utilizar las dos bibliotecas en una misma aplicación."
  - "Que el procesamiento ocurra en el navegador depende también de la aplicación: conviene revisar las solicitudes de red."
imageAlt: "Comparativa de bibliotecas JavaScript para archivos PDF"
---

Un PDF puede parecer un solo problema hasta que intento :mark[hacer algo con él]. Mostrar sus páginas dentro de una aplicación y añadir una página nueva al documento exigen :large[operaciones distintas]. Para lo primero revisé PDF.js; para lo segundo, pdf-lib. Comparé sus funciones documentadas para averiguar dónde encaja cada una.

## PDF.js y pdf-lib: dos trabajos distintos

[PDF.js](https://mozilla.github.io/pdf.js/) es un proyecto de Mozilla orientado a interpretar y representar documentos PDF. Su caso de uso típico es construir un visor. [pdf-lib](https://pdf-lib.js.org/) permite crear y modificar documentos PDF desde JavaScript; resulta más apropiada para formularios, combinación de páginas y generación de archivos.

| Criterio | PDF.js | pdf-lib |
| --- | --- | --- |
| Objetivo principal | Visualizar e interpretar PDF | Crear y modificar PDF |
| Mostrar páginas en pantalla | Sí, mediante renderizado | No es su objetivo principal |
| Crear un documento nuevo | No es su función principal | Sí |
| Modificar un PDF existente | Capacidades limitadas, según la operación | Sí, para operaciones soportadas |
| Entorno | Navegador y otros entornos JavaScript compatibles | Navegador y Node.js |
| Referencia | [Documentación](https://mozilla.github.io/pdf.js/) | [Documentación](https://pdf-lib.js.org/) |

La tabla compara el propósito documentado de ambos proyectos; no representa una prueba de rendimiento.

## ¿Qué usar para mostrar páginas PDF en mi web?

Empezaría por PDF.js. Su documentación cubre el renderizado de páginas en el navegador; para construir un visor con navegación, zoom o búsqueda todavía tendría que decidir qué componentes reutilizar. No daría por hecho que una biblioteca que dibuja páginas ya resuelve toda la experiencia del lector.

## Para agregar páginas o rellenar formularios

Ahí miraría pdf-lib. Tiene APIs para crear documentos, trabajar con páginas y manejar formularios. Si el requisito fuera editar el texto existente de cualquier PDF como en un procesador de textos, no prometería que pueda hacerlo: esa tarea requiere otra evaluación.

## ¿Dónde se procesa realmente el archivo?

Que una biblioteca pueda ejecutarse en el navegador no garantiza por sí solo que la aplicación conserve la :icon[privacidad|lock]. Si la web envía el archivo a una API, deja de ser procesamiento exclusivamente local. Para comprobarlo, inspeccionaría la pestaña Network del navegador mientras cargo y proceso un PDF de prueba que no contenga datos sensibles.

## ¿Puedo construir un visor y un editor sencillo con ambas?

```prompt
Diseña una aplicación pequeña en JavaScript que permita seleccionar un archivo PDF local, previsualizar sus páginas con PDF.js y generar una copia con una página en blanco añadida mediante pdf-lib. Propón una estructura mínima de archivos, el código necesario y las dependencias. No uses un backend ni subas el PDF a un servidor. Explica cómo comprobar en las herramientas de desarrollo del navegador que el archivo no se envía por la red. Si alguna API cambia entre versiones, indica cómo verificarlo en la documentación oficial.
```

## Preguntas frecuentes sobre PDF.js y pdf-lib

### ¿PDF.js y pdf-lib son alternativas directas?

No las trataría como sustitutos directos. PDF.js está orientada a mostrar documentos y pdf-lib a crearlos o modificarlos. En una misma aplicación pueden cubrir tareas diferentes.

### ¿Puedo procesar un PDF sin servidor?

Sí, cuando la operación se ejecuta en el navegador. Revisaría también el código de la aplicación y las solicitudes de red: usar una biblioteca compatible con navegador no impide que el sitio envíe archivos a una API.

### ¿Cuál usaría para un editor completo?

Depende de lo que el editor deba cambiar. Añadir páginas, rellenar formularios y reescribir texto existente no son la misma operación; empezaría por concretar una de ellas y comprobar el soporte de la biblioteca.

## Referencias

- [PDF.js — Mozilla](https://mozilla.github.io/pdf.js/)
- [pdf-lib — Documentación](https://pdf-lib.js.org/)
