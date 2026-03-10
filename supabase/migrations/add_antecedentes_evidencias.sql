-- Antecedentes sobre cada evidencia (contexto / background)
ALTER TABLE evidencias ADD COLUMN IF NOT EXISTS antecedentes TEXT;
