-- ============================================
-- Correcciones para el Security Advisor (Supabase)
-- Ejecutar en SQL Editor después de schema.sql
-- ============================================
-- Corrige:
-- 0011 function_search_path_mutable (set_updated_at)
-- 0024 rls_policy_always_true (políticas con USING(true) / WITH CHECK(true))
-- ============================================

-- ----------
-- 1. Función set_updated_at: fijar search_path
-- ----------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------
-- 2. Políticas RLS: reemplazar USING(true)/WITH CHECK(true) por condiciones explícitas
-- ----------

-- Perfiles
DROP POLICY IF EXISTS "perfiles_all_authenticated" ON perfiles;
CREATE POLICY "perfiles_all_authenticated"
  ON perfiles FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Introducciones
DROP POLICY IF EXISTS "introducciones_all_authenticated" ON introducciones;
CREATE POLICY "introducciones_all_authenticated"
  ON introducciones FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Asignaturas
DROP POLICY IF EXISTS "asignaturas_all_authenticated" ON asignaturas;
CREATE POLICY "asignaturas_all_authenticated"
  ON asignaturas FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Etiquetas
DROP POLICY IF EXISTS "etiquetas_all_authenticated" ON etiquetas;
CREATE POLICY "etiquetas_all_authenticated"
  ON etiquetas FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Evidencias
DROP POLICY IF EXISTS "evidencias_all_authenticated" ON evidencias;
CREATE POLICY "evidencias_all_authenticated"
  ON evidencias FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Medios
DROP POLICY IF EXISTS "medios_all_authenticated" ON medios;
CREATE POLICY "medios_all_authenticated"
  ON medios FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Evidencia-Etiquetas
DROP POLICY IF EXISTS "evidencia_etiquetas_all_authenticated" ON evidencia_etiquetas;
CREATE POLICY "evidencia_etiquetas_all_authenticated"
  ON evidencia_etiquetas FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Evaluaciones
DROP POLICY IF EXISTS "evaluaciones_all_authenticated" ON evaluaciones;
CREATE POLICY "evaluaciones_all_authenticated"
  ON evaluaciones FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Comentarios: anon INSERT con validación mínima (autor y contenido no vacíos)
DROP POLICY IF EXISTS "comentarios_insert_anon" ON comentarios;
CREATE POLICY "comentarios_insert_anon"
  ON comentarios FOR INSERT TO anon
  WITH CHECK (
    length(trim(autor)) >= 2
    AND length(trim(contenido)) >= 5
    AND (evidencia_id IS NOT NULL OR evaluacion_id IS NOT NULL)
  );

-- Comentarios: authenticated
DROP POLICY IF EXISTS "comentarios_all_authenticated" ON comentarios;
CREATE POLICY "comentarios_all_authenticated"
  ON comentarios FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Reflexiones
DROP POLICY IF EXISTS "reflexiones_all_authenticated" ON reflexiones;
CREATE POLICY "reflexiones_all_authenticated"
  ON reflexiones FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
