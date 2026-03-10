import { z } from "zod";

export const evidenciaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  semana: z.number().int().min(1).max(20),
  fecha: z.string(),
  contenido: z.string().min(10, "El contenido es muy corto"),
  antecedentes: z.string().optional(),
  objetivo: z.string().optional(),
  proposito: z.string().optional(),
  reflexion: z.string().optional(),
  otros: z.string().optional(),
  publicada: z.boolean().default(false),
});

export const evaluacionSchema = z.object({
  titulo: z.string().min(3),
  antecedentes: z.string().optional(),
  criterios: z.string().optional(),
  escalas: z.string().optional(),
  metodologia: z.string().optional(),
  calificacion: z.number().min(1).max(7).optional(),
  reflexion: z.string().optional(),
  otros: z.string().optional(),
  fecha: z.string(),
});

export const reflexionSchema = z.object({
  titulo: z.string().min(3),
  contenido: z.string().min(10),
  tipo: z.enum(["PROYECTO", "EVALUACION", "PORTFOLIO", "FINAL"]),
  fecha: z.string(),
  publicada: z.boolean().default(false),
});

export const comentarioSchema = z.object({
  autor: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  contenido: z
    .string()
    .min(5, "El comentario debe tener al menos 5 caracteres."),
  es_profesor: z.boolean().default(false),
  evidencia_id: z.string().uuid().optional(),
  evaluacion_id: z.string().uuid().optional(),
}).refine(
  (data) => (data.evidencia_id != null) !== (data.evaluacion_id != null),
  { message: "Debe indicar evidencia o evaluación (solo uno)." }
);

export const perfilSchema = z.object({
  nombre: z.string().optional(),
  nivel_formacion: z.string().optional(),
  edad: z.number().int().optional(),
  intereses: z.string().optional(),
  gustos: z.string().optional(),
  datos_relevantes: z.string().optional(),
  foto_url: z.string().url().optional().or(z.literal("")),
});

export const introduccionSchema = z.object({
  sentido_portfolio: z.string().optional(),
  objetivos: z.string().optional(),
  experiencias_previas: z.string().optional(),
  expectativas: z.string().optional(),
});

export const asignaturaSchema = z.object({
  nombre: z.string().optional(),
  programa: z.string().optional(),
  planificacion: z.string().optional(),
  normas: z.string().optional(),
  otros: z.string().optional(),
  archivo_url: z.string().optional(),
});
