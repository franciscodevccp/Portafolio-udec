/**
 * Tipos para las tablas de Supabase (ePortfolio).
 * Coinciden con el schema en supabase/schema.sql
 */

export type TipoMedio =
  | "IMAGEN"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENTO"
  | "LINK"
  | "OTRO";

export type TipoReflexion =
  | "PROYECTO"
  | "EVALUACION"
  | "PORTFOLIO"
  | "FINAL";

export interface Perfil {
  id: string;
  nombre: string;
  nivel_formacion: string;
  edad: number | null;
  intereses: string | null;
  gustos: string | null;
  datos_relevantes: string | null;
  foto_url: string | null;
  auth_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Introduccion {
  id: string;
  sentido_portfolio: string;
  objetivos: string;
  experiencias_previas: string | null;
  expectativas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asignatura {
  id: string;
  nombre: string;
  programa: string | null;
  planificacion: string | null;
  normas: string | null;
  otros: string | null;
  archivo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Etiqueta {
  id: string;
  nombre: string;
}

export interface Evidencia {
  id: string;
  titulo: string;
  slug: string;
  semana: number;
  fecha: string;
  contenido: string;
  antecedentes: string | null;
  objetivo: string | null;
  proposito: string | null;
  reflexion: string | null;
  otros: string | null;
  publicada: boolean;
  created_at: string;
  updated_at: string;
  medios?: Medio[];
  etiquetas?: Etiqueta[];
  comentarios?: Comentario[];
}

export interface Medio {
  id: string;
  url: string;
  tipo: TipoMedio;
  descripcion: string | null;
  evidencia_id: string;
  created_at: string;
}

export interface Evaluacion {
  id: string;
  titulo: string;
  slug: string;
  antecedentes: string | null;
  criterios: string | null;
  escalas: string | null;
  metodologia: string | null;
  calificacion: number | null;
  reflexion: string | null;
  otros: string | null;
  fecha: string;
  created_at: string;
  updated_at: string;
  comentarios?: Comentario[];
}

export interface Comentario {
  id: string;
  autor: string;
  contenido: string;
  es_profesor: boolean;
  evidencia_id: string | null;
  evaluacion_id: string | null;
  created_at: string;
}

export interface Reflexion {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  tipo: TipoReflexion;
  fecha: string;
  publicada: boolean;
  created_at: string;
  updated_at: string;
}
