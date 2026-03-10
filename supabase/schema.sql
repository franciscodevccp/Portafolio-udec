-- ============================================
-- ePortfolio FAUG — Schema + RLS para Supabase
-- Ejecutar en SQL Editor (Run) por bloques o todo junto
-- ============================================

-- Extension para UUIDs (Supabase ya la tiene; por si acaso)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE tipo_medio AS ENUM (
  'IMAGEN', 'VIDEO', 'AUDIO', 'DOCUMENTO', 'LINK', 'OTRO'
);

CREATE TYPE tipo_reflexion AS ENUM (
  'PROYECTO', 'EVALUACION', 'PORTFOLIO', 'FINAL'
);

-- ============================================
-- TABLAS
-- ============================================

-- Perfil del autor (Sobre mí) — una sola fila en la práctica
CREATE TABLE perfiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre            TEXT NOT NULL,
  nivel_formacion   TEXT NOT NULL,
  edad              INT,
  intereses         TEXT,
  gustos            TEXT,
  datos_relevantes  TEXT,
  foto_url          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Introducción (sentido del portfolio)
CREATE TABLE introducciones (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sentido_portfolio     TEXT NOT NULL,
  objetivos             TEXT NOT NULL,
  experiencias_previas  TEXT,
  expectativas          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asignatura
CREATE TABLE asignaturas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  programa        TEXT,
  planificacion   TEXT,
  normas          TEXT,
  otros           TEXT,
  archivo_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Etiquetas (para evidencias)
CREATE TABLE etiquetas (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE
);

-- Evidencias (entradas semanales: archivos y trabajos ordenados cronológicamente, registros semanales)
CREATE TABLE evidencias (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo        TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  semana        INT NOT NULL,
  fecha         TIMESTAMPTZ NOT NULL,
  contenido     TEXT NOT NULL,
  antecedentes  TEXT,
  objetivo      TEXT,
  proposito     TEXT,
  reflexion     TEXT,
  otros         TEXT,
  publicada     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medios (multimedia por evidencia)
CREATE TABLE medios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url           TEXT NOT NULL,
  tipo          tipo_medio NOT NULL,
  descripcion   TEXT,
  evidencia_id  UUID NOT NULL REFERENCES evidencias(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Relación muchos a muchos: evidencias <-> etiquetas
CREATE TABLE evidencia_etiquetas (
  evidencia_id UUID NOT NULL REFERENCES evidencias(id) ON DELETE CASCADE,
  etiqueta_id  UUID NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
  PRIMARY KEY (evidencia_id, etiqueta_id)
);

-- Evaluaciones
CREATE TABLE evaluaciones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  antecedentes    TEXT,
  criterios       TEXT,
  escalas         TEXT,
  metodologia     TEXT,
  calificacion    REAL,
  reflexion       TEXT,
  otros           TEXT,
  fecha           TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentarios (evidencias o evaluaciones)
CREATE TABLE comentarios (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autor          TEXT NOT NULL,
  contenido      TEXT NOT NULL,
  es_profesor    BOOLEAN NOT NULL DEFAULT false,
  evidencia_id   UUID REFERENCES evidencias(id) ON DELETE CASCADE,
  evaluacion_id  UUID REFERENCES evaluaciones(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT comentario_debe_tener_evidencia_o_evaluacion
    CHECK (
      (evidencia_id IS NOT NULL AND evaluacion_id IS NULL) OR
      (evidencia_id IS NULL AND evaluacion_id IS NOT NULL)
    )
);

-- Reflexiones
CREATE TABLE reflexiones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  contenido   TEXT NOT NULL,
  tipo        tipo_reflexion NOT NULL,
  fecha       TIMESTAMPTZ NOT NULL,
  publicada   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices útiles
CREATE INDEX idx_evidencias_publicada_fecha ON evidencias(publicada, fecha DESC);
CREATE INDEX idx_evidencias_semana ON evidencias(semana);
CREATE INDEX idx_evidencias_slug ON evidencias(slug);
CREATE INDEX idx_medios_evidencia_id ON medios(evidencia_id);
CREATE INDEX idx_comentarios_evidencia_id ON comentarios(evidencia_id);
CREATE INDEX idx_comentarios_evaluacion_id ON comentarios(evaluacion_id);
CREATE INDEX idx_reflexiones_publicada ON reflexiones(publicada);
CREATE INDEX idx_reflexiones_tipo ON reflexiones(tipo);

-- Trigger para updated_at (opcional)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER perfiles_updated_at
  BEFORE UPDATE ON perfiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER introducciones_updated_at
  BEFORE UPDATE ON introducciones FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER asignaturas_updated_at
  BEFORE UPDATE ON asignaturas FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER evidencias_updated_at
  BEFORE UPDATE ON evidencias FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER evaluaciones_updated_at
  BEFORE UPDATE ON evaluaciones FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER reflexiones_updated_at
  BEFORE UPDATE ON reflexiones FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE perfiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE introducciones     ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaturas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE etiquetas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidencias         ENABLE ROW LEVEL SECURITY;
ALTER TABLE medios             ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidencia_etiquetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluaciones       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflexiones        ENABLE ROW LEVEL SECURITY;

-- ----------
-- Perfiles: lectura pública; escritura solo autenticados
-- ----------
CREATE POLICY "perfiles_select_anon"
  ON perfiles FOR SELECT TO anon USING (true);

CREATE POLICY "perfiles_all_authenticated"
  ON perfiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Introducciones: igual
-- ----------
CREATE POLICY "introducciones_select_anon"
  ON introducciones FOR SELECT TO anon USING (true);

CREATE POLICY "introducciones_all_authenticated"
  ON introducciones FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Asignaturas: igual
-- ----------
CREATE POLICY "asignaturas_select_anon"
  ON asignaturas FOR SELECT TO anon USING (true);

CREATE POLICY "asignaturas_all_authenticated"
  ON asignaturas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Etiquetas: lectura pública; escritura autenticados
-- ----------
CREATE POLICY "etiquetas_select_anon"
  ON etiquetas FOR SELECT TO anon USING (true);

CREATE POLICY "etiquetas_all_authenticated"
  ON etiquetas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Evidencias: público solo ve publicadas; autenticados todo
-- ----------
CREATE POLICY "evidencias_select_public"
  ON evidencias FOR SELECT TO anon USING (publicada = true);

CREATE POLICY "evidencias_all_authenticated"
  ON evidencias FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Medios: mismo criterio que evidencias (por evidencia_id)
-- ----------
CREATE POLICY "medios_select_public"
  ON medios FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM evidencias e
      WHERE e.id = medios.evidencia_id AND e.publicada = true
    )
  );

CREATE POLICY "medios_all_authenticated"
  ON medios FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Evidencia-Etiquetas (tabla puente)
-- ----------
CREATE POLICY "evidencia_etiquetas_select_anon"
  ON evidencia_etiquetas FOR SELECT TO anon USING (true);

CREATE POLICY "evidencia_etiquetas_all_authenticated"
  ON evidencia_etiquetas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Evaluaciones: lectura pública; escritura autenticados
-- ----------
CREATE POLICY "evaluaciones_select_anon"
  ON evaluaciones FOR SELECT TO anon USING (true);

CREATE POLICY "evaluaciones_all_authenticated"
  ON evaluaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Comentarios: cualquiera puede leer y crear (anon + authenticated)
-- ----------
CREATE POLICY "comentarios_select_anon"
  ON comentarios FOR SELECT TO anon USING (true);

CREATE POLICY "comentarios_insert_anon"
  ON comentarios FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "comentarios_all_authenticated"
  ON comentarios FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------
-- Reflexiones: público solo ve publicadas; autenticados todo
-- ----------
CREATE POLICY "reflexiones_select_public"
  ON reflexiones FOR SELECT TO anon USING (publicada = true);

CREATE POLICY "reflexiones_all_authenticated"
  ON reflexiones FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- SERVICIO (opcional): permitir service_role todo
-- Las políticas anteriores no aplican a service_role por defecto.
-- ============================================
-- No hace falta: service_role bypasea RLS en Supabase.
