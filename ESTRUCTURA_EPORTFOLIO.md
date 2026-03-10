# Estructura ePortfolio — Requisitos oficiales y estado

Este documento recoge los requisitos oficiales del taller y cómo se cubren en el proyecto.

---

## Requisitos oficiales (Para el trabajo con ePortfolio)

El ePortfolio consiste en un **registro personal del proceso de avance** desarrollado en el taller, con evidencias digitales que permitan visualizar el aprendizaje y un soporte para la **revisión y reflexión** en torno a la propia construcción de aprendizaje en arquitectura y su autorregulación.

El ePortfolio se desarrolla en base a **blog**, de acuerdo con la estructura propuesta en la plataforma CANVAS.

### Creación del ePortfolio

- **a)** Crear el ePortfolio dentro de la **primera semana de clases** (09 al 13 marzo 2026).
- **b)** Enviar la **dirección del blog** al profesor Miguel Roco (**mroco@udec.cl**), quien dispondrá en CANVAS los enlaces hacia el ePortfolio de cada estudiante.

### Desarrollo del ePortfolio (7 puntos)

| # | Requisito | En el proyecto |
|---|-----------|----------------|
| **1** | Establecer los **propósitos de aprendizaje** para el semestre (personales): planificación, gestión del tiempo y estrategias de estudio para alcanzar los propósitos comprometidos. | **Introducción** (sentido, objetivos, expectativas). Incluir ahí planificación y estrategias. |
| **2** | Al menos **una entrada por semana** del período de clases (**mínimo 17 entradas**). | **Evidencias** por semana y fecha. Objetivo: ≥17 entradas publicadas. |
| **3** | El blog debe disponer **visible el “archivo del blog” y las fechas** para cada entrada. | Página **Archivo** (`/archivo`) con entradas agrupadas por mes y fecha visible. |
| **4** | Registrar **evidencias de aprendizaje** (proceso y evaluaciones): imágenes, enlaces, vídeos, presentaciones online, audio, etc. | **Evidencias** con contenido + **medios** (IMAGEN, VIDEO, AUDIO, LINK, etc.). |
| **5** | Acompañar las evidencias con **reflexiones, ideas y comentarios personales** que expliquen los aprendizajes logrados. | Campo **reflexión** en cada evidencia + sección **Reflexiones**. |
| **6** | Desarrollar **retroalimentación** en ePortfolios de otros miembros del taller: **al menos 10 registros por etapa de evaluación**, en distintos ePortfolios. | Actividad externa (comentar en otros blogs). No se registra en esta app; cumplimiento personal. |
| **7** | Al menos **una reflexión integral** al final de cada ejercicio, y **una reflexión final** de todo el proceso al finalizar el semestre. | **Reflexiones** con tipos: por ejercicio (PROYECTO, EVALUACION, PORTFOLIO) y **FINAL**. |

### Criterios importantes

- El ePortfolio se valora por la **coherencia entre los objetivos de aprendizaje planteados y su logro** a través del trabajo en el taller.
- Se lleva un **registro de la trayectoria** de cada alumno en relación con el desarrollo del taller.
- El ePortfolio es el **medio de verificación** del logro de los objetivos de aprendizaje.
- Los **comentarios y observaciones del profesor** respecto del seguimiento se disponen **directamente en el ePortfolio** del estudiante (comentarios en evidencias/evaluaciones).

---

## Estado actual del proyecto (detalle por bloque)

### 1. Identificación del autor (Sobre mí)

| Requisito | En el proyecto | Estado |
|-----------|----------------|--------|
| Nombre, nivel de formación, edad, otro | `perfiles`: nombre, nivel_formacion, edad | ✅ |
| Intereses y gustos | `perfiles`: intereses, gustos | ✅ |
| Otros datos relevantes | `perfiles`: datos_relevantes | ✅ |
| Foto del autor | `perfiles`: foto_url | ✅ |

**Admin:** Mi Perfil — formulario completo.

---

### 2. Introducción (propósitos y sentido)

| Requisito | En el proyecto | Estado |
|-----------|----------------|--------|
| Sentido del portfolio | `introducciones`: sentido_portfolio | ✅ |
| Objetivos del eportfolio | `introducciones`: objetivos | ✅ |
| Experiencias previas | `introducciones`: experiencias_previas | ✅ |
| Expectativas | `introducciones`: expectativas | ✅ |

**Admin:** Introducción. **Recomendación:** redactar aquí también planificación, gestión del tiempo y estrategias de estudio (requisito 1).

---

### 3. Asignatura

| Requisito | En el proyecto | Estado |
|-----------|----------------|--------|
| Programa, planificación, normas, otros | `asignaturas` | ✅ |
| Archivo PDF del programa | `asignaturas`: archivo_url | ✅ |

**Admin:** Asignatura.

---

### 4. Evidencias (entradas semanales, mínimo 17)

| Requisito | En el proyecto | Estado |
|-----------|----------------|--------|
| Una entrada por semana, fechas visibles | `evidencias`: semana, fecha; listado y Archivo | ✅ |
| Imágenes, vídeos, audio, enlaces, etc. | `evidencias.contenido` + tabla `medios` | ✅ |
| Antecedentes, objetivo, propósito | `evidencias`: antecedentes, objetivo, proposito | ✅ |
| Reflexión sobre cada evidencia | `evidencias`: reflexion | ✅ |
| Comentarios (profesor/otros) | Tabla `comentarios` (evidencia_id) | ✅ |

**Admin:** Evidencias — listado + Nueva evidencia. **Público:** listado en home y en Archivo; detalle por evidencia con comentarios.

---

### 5. Evaluación

| Requisito | En el proyecto | Estado |
|-----------|----------------|--------|
| Criterios, escalas, metodología, calificación | `evaluaciones` | ✅ |
| Reflexión y comentarios | `evaluaciones`: reflexion; `comentarios` (evaluacion_id) | ✅ |

**Admin:** Evaluaciones. **Público:** listado y ficha por evaluación.

---

### 6. Reflexiones

| Requisito | En el proyecto | Estado |
|-----------|----------------|--------|
| Reflexión por ejercicio / integral | `reflexiones` tipo PROYECTO, EVALUACION, PORTFOLIO | ✅ |
| Reflexión final del semestre | `reflexiones` tipo FINAL | ✅ |

**Admin:** Reflexiones. **Público:** listado por tipo en home y en /reflexiones.

---

### 7. Archivo del blog y fechas

- **Página Archivo** (`/archivo`): entradas (evidencias) agrupadas por mes con **fecha visible** en cada entrada. Enlace en la navegación pública.

---

## Resumen de cobertura

| Bloque | BD | Admin | Público |
|--------|-----|-------|--------|
| Identificación (Sobre mí) | ✅ | ✅ | ✅ (en home) |
| Introducción (propósitos) | ✅ | ✅ | ✅ (en home) |
| Asignatura | ✅ | ✅ | ✅ (en home) |
| Evidencias (≥17 entradas) | ✅ | ✅ | ✅ + Archivo |
| Evaluación | ✅ | ✅ | ✅ (en home) |
| Reflexiones | ✅ | ✅ | ✅ (en home) |
| Archivo y fechas | — | — | ✅ /archivo |
| Comentarios (profesor en tu ePortfolio) | ✅ | ✅ Comentarios | ✅ en evidencias/evaluaciones |

**Requisito 6 (10 comentarios en otros ePortfolios):** se cumple fuera de esta aplicación, comentando en los blogs de otros estudiantes.
