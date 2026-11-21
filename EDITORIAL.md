# Guía editorial — Enlaces para Desarrolladores

## Propósito
Publicar contenido técnico de alta calidad que ayude a desarrolladores a entender, comparar, elegir y probar herramientas. La utilidad para el lector va antes que la frecuencia de publicación y las palabras clave.

## Voz y perspectiva
- Escribir en **primera persona**, con tono de desarrollador curioso que investiga y comparte hallazgos.
- Hablar con naturalidad: directo, específico, cercano y sin grandilocuencia.
- Empezar con una pregunta, dificultad o decisión concreta; evitar introducciones genéricas.
- Mostrar razonamiento y criterios, no solo enumerar herramientas.
- Usar español claro; mantener los nombres técnicos y términos de búsqueda cuando aporten precisión.
- No atribuir experiencias reales al autor si no están documentadas. **Nunca inventar pruebas, instalaciones, métricas, resultados ni anécdotas.**
- Distinguir claramente entre «lo probé» (con evidencia), «revisé su documentación» y «mi interpretación es».
- Si el artículo se genera con ayuda de IA, la primera persona expresa la voz editorial, no una experiencia ficticia del modelo.

## Formatos principales
### Tutorial o solución específica
1. Problema y resultado esperado.
2. Requisitos y contexto de versiones.
3. Pasos reproducibles, código y resultado.
4. Errores comunes y limitaciones.
5. Alternativas y enlaces relevantes del catálogo.
6. Prompt opcional para adaptar el tutorial a otro proyecto.

### Comparativa
1. Para qué decisión sirve la comparativa.
2. Criterios explícitos (por ejemplo: licencia, privacidad, hosting, precio, integraciones, mantenimiento).
3. **Tabla** con datos verificados y fecha de comprobación cuando corresponda.
4. Ventajas y limitaciones por opción; no forzar un ganador absoluto.
5. Recomendación condicionada al caso de uso.
6. Prompt copiable para comparar las opciones en el contexto del lector.

### Lista curada
1. Problema o necesidad común.
2. Criterios de selección y exclusión.
3. Tabla-resumen (recurso, para qué sirve, ventaja, limitación, enlace).
4. Comentario propio de cada recurso: por qué está aquí y cuándo lo elegiría.
5. Enlaces directos a recursos del catálogo.
6. Prompt para explorar, comparar o aplicar la lista.

## Bloques de prompts
Cada prompt debe:
- Tener un objetivo claro y una etiqueta «Copiar prompt» en la interfaz si existe soporte.
- Ser autocontenido, listo para copiar y probar tal cual, sin variables, corchetes, huecos ni datos que el lector deba completar antes de usarlo.
- Proponer una tarea concreta con contexto y herramientas ya mencionadas en el artículo. Si necesita datos personales o del proyecto, pedirlos conversacionalmente después de la primera respuesta, sin bloquear la primera ejecución.
- Pedir a la IA que contraste documentación, indique incertidumbres y no invente compatibilidad ni licencias.
- Evitar solicitar secretos, credenciales o información sensible.
- Incluir una nota breve de que las respuestas de la IA requieren verificación.

Ejemplo listo para copiar:

```text
Compara tres formas de procesar archivos PDF en el navegador sin subir el documento a un servidor: PDF.js, pdf-lib y una herramienta web con procesamiento local. Explica qué permite hacer cada opción, sus límites y cómo verificar si realmente procesa archivos en el dispositivo. Presenta una tabla con privacidad, funciones, licencia y facilidad de integración. Distingue hechos documentados de suposiciones, incluye enlaces oficiales verificables y recomienda una opción para leer PDFs y otra para editarlos. Si no puedes comprobar un dato, indícalo.
```

## Encabezados con ritmo editorial
- Los H2 y H3 pueden ser **preguntas, frases breves o afirmaciones**. Elegir según intención y lectura: no seguir un patrón fijo ni exigir una cuota de preguntas.
- Una pregunta es útil cuando anticipa la duda concreta de quien lee; una frase corta sirve para orientar, hacer una transición o marcar una conclusión.
- Evitar titulares repetidos que podrían trasladarse a cualquier artículo cambiando el nombre de la herramienta.
- Mantener la jerarquía semántica de encabezados para que el índice automático sea útil.

## Personalidad escritora: el curador que abre el taller
Quien narra es un desarrollador curioso, algo escéptico ante las promesas del marketing y generoso al mostrar cómo llegar a una respuesta. La voz se reconoce por su atención a las consecuencias prácticas, no por muletillas.
- **Persigue una pregunta específica.** Muestra por qué importa y qué criterios permiten decidir.
- **Tiene criterio, no dogmas.** Puede inclinarse por una alternativa, pero dice para qué escenario y con qué límites.
- **No finge un laboratorio.** Distingue entre documentación consultada, deducción, ejemplo ilustrativo y prueba ejecutada.
- **Habla como alguien que usaría lo que describe.** Nombra archivos, operaciones, obstáculos y comprobaciones concretas.
- **Deja espacio al lector.** No explica lo evidente ni infla párrafos para llenar un esquema SEO.
- **Tiene humor discreto cuando cabe**, sin convertir toda comparación en una broma.
- **Varía la cadencia.** Algunas ideas piden un párrafo largo; otras una línea corta. No repetir una plantilla de apertura y cierre.
- **Construye escenas pequeñas verificables**, como el punto en que una colección de API debe entrar en Git, en vez de narrar anécdotas personales inexistentes.
- **Da una respuesta útil antes de adornarla.** El estilo acompaña a la explicación.

## Sistema de énfasis editorial
Se mantiene Markdown por ahora: añadir MDX completo sería un salto de complejidad innecesario para tres tratamientos tipográficos y un resumen. Las directivas seguras permiten una composición más libre sin ejecutar componentes arbitrarios de autores:
- `:mark[texto]`: énfasis sobrio en verde, útil para una idea clave.
- `:large[texto]`: una frase o pocas palabras ligeramente mayores para crear ritmo.
- `:shine[texto]`: brillo animado lento reservado para una palabra decisiva, sin usarlo en cada sección.
- Campo de frontmatter `tldr`: array de 2 a 4 ideas en texto claro; aparece al principio del artículo bajo «En pocas palabras».

Estos recursos **no son requisitos por artículo**. Deben ser excepcionales y dar pistas semánticas, no llamar la atención sin motivo. Una página puede prescindir completamente de animaciones. Respetar `prefers-reduced-motion` y no introducir información que solo se entienda gracias al efecto. No colocar directivas en títulos o metadatos; funcionan dentro del contenido Markdown.

Ejemplo:
```md
---
tldr:
  - "PDF.js sirve para mostrar páginas; pdf-lib trabaja con creación y modificación."
  - "Puedo usar las dos bibliotecas en una aplicación si necesito ambos flujos."
---

## Dos bibliotecas, dos operaciones

Mostrar un archivo y modificarlo son :large[tareas distintas]. Antes de elegir, me importa :mark[qué hará el usuario]. La :shine[privacidad] también depende de si la aplicación envía datos a un servidor.
```

## Revisión automatizada
- Ejecutar `cd web && npm run lint:editorial` sobre los artículos piloto; admite rutas Markdown como argumentos.
- El validador marca fórmulas genéricas y falla cuando detecta campos por rellenar en prompts.
- No pretende identificar quién escribió un texto ni emite porcentajes de IA: requiere una revisión humana posterior.
- Se puede ampliar el control con un motor como [textlint](https://github.com/textlint/textlint) y reglas propias para español.

## Revisión de estilo antes de publicar
1. Entrar directamente en el problema, una observación verificable o una decisión; quitar aperturas tipo «En el mundo actual» y preámbulos vacíos.
2. Sustituir afirmaciones amplias («revolucionario», «imprescindible», «potente», «lleva al siguiente nivel») por una función, condición o limitación concreta.
3. Evitar fórmulas repetidas como «no es X, sino Y», «no solo X, también Y» y tríadas decorativas; conservar contrastes cuando expliquen una diferencia real.
4. No abusar de guiones largos, dos puntos dramáticos, negritas, preguntas retóricas o frases de una sola línea. Dar a cada recurso tipográfico un motivo.
5. Variar longitud de oraciones y párrafos de forma natural; no imponer el mismo número de apartados ni una tabla en todas las secciones.
6. Conectar párrafos por causa, consecuencia, ejemplo, objeción o excepción. Evitar listas de afirmaciones independientes sin hilo.
7. Eliminar conectores de relleno («Además», «Cabe destacar», «En definitiva») cuando no agregan una relación necesaria.
8. No atribuir valor a algo por el simple hecho de existir. Explicar qué resuelve, para quién y bajo qué condiciones.
9. No simular entusiasmo, frustración, descubrimientos ni pruebas personales. La primera persona debe tener sustento documental o experimental.
10. Usar ejemplos concretos, nombres de funciones, comandos y resultados solo cuando puedan verificarse. Si falta evidencia, investigar o recortar la afirmación.
11. No cerrar con un resumen ritual ni una invitación genérica. Terminar con una decisión útil, un límite pendiente o el siguiente paso concreto.
12. Leer el texto en voz alta: corregir frases que suenen a presentación corporativa o que podrían insertarse en cualquier artículo cambiando solo el nombre de la herramienta.
13. Revisar si la tabla o lista ayuda a decidir; quitar columnas repetitivas, clasificaciones artificiales y comparaciones sin evidencia.
14. Comprobar que cada prompt se pueda pegar y ejecutar inmediatamente, sin campos por rellenar, y que produzca un resultado útil por sí solo.

Estas reglas son criterios de edición, no prohibiciones mecánicas. No sacrificar precisión ni naturalidad para cumplir un detector.

## Evidencia y calidad antes de publicar
- Verificar enlaces y documentación primaria.
- Indicar versiones y fecha cuando los datos puedan cambiar.
- Si se afirma que una herramienta fue probada, conservar comandos, capturas, entorno o resultados reproducibles.
- Separar hechos de opiniones; incluir inconvenientes reales.
- Revisar legibilidad móvil de tablas y bloques de código.
- Añadir título descriptivo, descripción útil, encabezados claros, enlaces internos pertinentes y canonical correcto.
- No publicar páginas casi idénticas ni contenido masivo para cubrir palabras clave.
- No establecer una frecuencia obligatoria: **publicar menos, pero mejor**.

## Ejemplo de apertura
«Quería resolver una tarea sencilla: trabajar con PDFs sin enviar archivos a un servidor. Revisé varias opciones y descubrí que la diferencia importante no era cuántos botones tenían, sino dónde se procesaban los documentos. En esta guía comparo lo que pude verificar y explico en qué casos elegiría cada una.»

Esta apertura **no** afirma que se instalaron o probaron herramientas; solo expresa una investigación documental.
