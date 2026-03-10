# Estructura ePortfolio (según profesor) — Estado actual

Este documento relaciona la estructura pedida por el profesor con lo implementado en el proyecto.

---

## 1. Identificación del autor

| Pedido por el profesor | En el proyecto | Estado |
|------------------------|----------------|--------|
| Nombre, nivel de formación, edad, otro | `perfiles`: nombre, nivel_formacion, edad | ✅ Implementado |
| Intereses y gustos | `perfiles`: intereses, gustos | ✅ Implementado |
| Otros datos relevantes para el autor | `perfiles`: datos_relevantes | ✅ Implementado |
| Foto del autor | `perfiles`: foto_url (subida de imagen) | ✅ Implementado |

**Admin:** **Mi Perfil** — formulario completo con todos los campos y subida de foto.

---

## 2. Introducción (sentido otorgado al portfolio)

| Pedido por el profesor | En el proyecto | Estado |
|------------------------|----------------|--------|
| Sentido otorgado al portfolio | `introducciones`: sentido_portfolio | ✅ Implementado |
| Objetivos del eportfolio (para el autor) | `introducciones`: objetivos | ✅ Implementado |
| Experiencias previas de aprendizaje (otros cursos y niveles) | `introducciones`: experiencias_previas | ✅ Implementado |
| Expectativas (objetivos de aprendizaje con el eportfolio) | `introducciones`: expectativas | ✅ Implementado |

**Admin:** **Introducción** — formulario completo.

---

## 3. Información asignatura(s) involucrada(s)

| Pedido por el profesor | En el proyecto | Estado |
|------------------------|----------------|--------|
| Programa | `asignaturas`: programa | ✅ Implementado |
| Planificación | `asignaturas`: planificacion | ✅ Implementado |
| Normas para su desarrollo | `asignaturas`: normas | ✅ Implementado |
| Otros | `asignaturas`: otros | ✅ Implementado |
| Archivo (ej. PDF del programa) | `asignaturas`: archivo_url (subida de archivo) | ✅ Implementado |

**Admin:** **Asignatura** — formulario completo + subida de PDF.

---

## 4. Mis evidencias (archivos y trabajos ordenados cronológicamente, registros semanales)

| Pedido por el profesor | En el proyecto | Estado |
|------------------------|----------------|--------|
| Orden cronológico, registros semanales | `evidencias`: semana, fecha; listado ordenado por fecha | ✅ Implementado |
| Evidencias: imágenes, textos, videos, audio, links, páginas web, redes sociales, etc. | `evidencias.contenido` (texto) + tabla `medios` (IMAGEN, VIDEO, AUDIO, LINK, etc.) | ✅ Implementado |
| Antecedentes sobre cada evidencia incorporada | `evidencias`: antecedentes | ✅ Implementado |
| Objetivo de las evidencias (por qué es importante, propósito, por qué se muestra) | `evidencias`: objetivo, proposito | ✅ Implementado |
| Comentarios sobre las evidencias (alumnos/profesores) | Tabla `comentarios` (evidencia_id, autor, contenido, es_profesor) | ✅ En BD; falta UI para ver/añadir en público y admin |
| Reflexión sobre las evidencias | `evidencias`: reflexion | ✅ Implementado |
| Otros de interés del autor | `evidencias`: otros | ✅ Implementado |

**Admin:** **Evidencias** — listado + **Nueva evidencia** con: título, semana, fecha, contenido, antecedentes, objetivo, propósito, reflexión, otros, subida de imágenes/videos/audio, enlaces (URLs), y publicación.

**Pendiente (opcional):** Página/vista para ver y gestionar comentarios por evidencia (y por evaluación).

---

## 5. Evaluación (en base a las evidencias mostradas)

| Pedido por el profesor | En el proyecto | Estado |
|------------------------|----------------|--------|
| Antecedentes de la evaluación | `evaluaciones`: antecedentes | ✅ En BD |
| Criterios | `evaluaciones`: criterios | ✅ En BD |
| Escalas | `evaluaciones`: escalas | ✅ En BD |
| Metodología | `evaluaciones`: metodologia | ✅ En BD |
| Comentario de las evaluaciones (alumnos/profesores) | Tabla `comentarios` (evaluacion_id) | ✅ En BD |
| Indicación de las calificaciones obtenidas | `evaluaciones`: calificacion | ✅ En BD |
| Reflexión sobre la evaluación recibida | `evaluaciones`: reflexion | ✅ En BD |
| Otros de interés del autor | `evaluaciones`: otros | ✅ En BD |

**Admin:** **Evaluaciones** — solo placeholder (listado y “Nueva evaluación” aún sin implementar).

**Pendiente:** Listado de evaluaciones + formulario Nueva evaluación (y, si se desea, vista pública de evaluaciones).

---

## 6. Reflexiones sobre mi proceso de aprendizaje (propias/externas)

| Pedido por el profesor | En el proyecto | Estado |
|------------------------|----------------|--------|
| Sobre mis proyectos | `reflexiones` con tipo PROYECTO | ✅ En BD |
| Sobre mis evaluaciones | `reflexiones` con tipo EVALUACION | ✅ En BD |
| Sobre mi portfolio | `reflexiones` con tipo PORTFOLIO | ✅ En BD |
| (y reflexión final) | `reflexiones` con tipo FINAL | ✅ En BD |

**Admin:** **Reflexiones** — solo placeholder (listado y “Nueva reflexión” aún sin implementar).

**Pendiente:** Listado de reflexiones + formulario Nueva reflexión (título, contenido, tipo, fecha, publicada) y vista pública.

---

## 7. Comentarios (alumnos/profesores)

- **Sobre evidencias:** tabla `comentarios` con `evidencia_id`. Backend listo; falta pantalla para ver y, si aplica, añadir/moderar.
- **Sobre evaluaciones:** tabla `comentarios` con `evaluacion_id`. Mismo caso.

**Admin:** **Comentarios** — solo placeholder (“Próximamente”).

**Pendiente:** Listado de comentarios (por evidencia/evaluación), moderación y, en sitio público, formulario para que alumnos/profesores dejen comentarios (si el profesor lo pide).

---

## Resumen

| Bloque | Base de datos | Admin (formularios/listados) | Público |
|--------|----------------|------------------------------|---------|
| **Identificación del autor** | ✅ | ✅ Mi Perfil | Pendiente usar datos en “Sobre mí” |
| **Introducción** | ✅ | ✅ Introducción | Pendiente mostrar en /introduccion |
| **Asignatura(s)** | ✅ | ✅ Asignatura | Pendiente mostrar en /asignatura |
| **Mis evidencias** | ✅ | ✅ Listado + Nueva evidencia | Parcial: home con últimas; falta /evidencias y ficha por evidencia |
| **Evaluación** | ✅ | ⏳ Placeholder | Pendiente |
| **Reflexiones** | ✅ | ⏳ Placeholder | Pendiente |
| **Comentarios** | ✅ | ⏳ Placeholder | Pendiente |

**Prioridad sugerida para cerrar la estructura del profesor:**

1. **Evaluaciones:** listado + formulario “Nueva evaluación” en admin (y opcionalmente vista pública).
2. **Reflexiones:** listado + formulario “Nueva reflexión” en admin (y vista pública por tipo).
3. **Comentarios:** listado/moderación en admin y, si se requiere, formulario de comentarios en público.
4. **Páginas públicas:** completar sobre-mi, introduccion, asignatura, evidencias (listado + detalle), evaluacion, reflexiones usando los datos de Supabase.

Si indicas por qué bloque quieres seguir (por ejemplo “Evaluaciones” o “páginas públicas”), se puede bajar esto a tareas concretas de código paso a paso.
