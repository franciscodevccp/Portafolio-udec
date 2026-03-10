-- ============================================
-- Vincular usuario de Auth con la tabla perfiles
-- Ejecutar en SQL Editor después de tener el usuario en Authentication
-- ============================================
-- Usuario: belen@udec.cl
-- UID: 07aef089-a1b7-45d7-8718-e6dead1bf755
-- ============================================

-- 1. Añadir columna que vincula perfil con auth.users (para login y RLS)
ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Crear el perfil del autor vinculado a este usuario (podrás editarlo desde la app)
INSERT INTO public.perfiles (
  nombre,
  nivel_formacion,
  edad,
  intereses,
  gustos,
  datos_relevantes,
  foto_url,
  auth_user_id
) VALUES (
  'Belen',                    -- nombre (editable en la app)
  'Arquitectura FAUG UdeC',   -- nivel_formacion (editable)
  NULL,                       -- edad
  NULL,                       -- intereses
  NULL,                       -- gustos
  NULL,                       -- datos_relevantes
  NULL,                       -- foto_url
  '07aef089-a1b7-45d7-8718-e6dead1bf755'  -- auth_user_id = UID de belen@udec.cl
)
ON CONFLICT (auth_user_id) DO NOTHING;  -- por si ya existe
