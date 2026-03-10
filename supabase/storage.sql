-- ============================================
-- Storage: bucket para multimedia (ePortfolio)
-- Ejecutar después de schema.sql
-- ============================================

-- Crear bucket público para lecturas (las subidas siguen protegidas por RLS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'eportfolio',
  'eportfolio',
  true,
  5242880,  -- 5 MB por archivo
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas: anon/authenticated pueden leer; solo authenticated puede subir/borrar
CREATE POLICY "eportfolio_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'eportfolio');

CREATE POLICY "eportfolio_authenticated_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'eportfolio');

CREATE POLICY "eportfolio_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'eportfolio');

CREATE POLICY "eportfolio_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'eportfolio');
