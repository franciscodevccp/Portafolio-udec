# Scripts SQL para Supabase

Ejecutar en el **SQL Editor** de tu proyecto (Supabase Dashboard).

## Orden

1. **schema.sql** — Tablas, índices, triggers, RLS (todo el esquema).
2. **storage.sql** — Bucket `eportfolio` y políticas de Storage (multimedia).

## Cómo ejecutar

1. En Supabase: **SQL Editor** → **New query**.
2. Pega el contenido de `schema.sql` y pulsa **Run** (o Ctrl+Enter).
3. Repite con `storage.sql`.

Si algo falla (p. ej. “relation already exists”), puedes ejecutar por bloques: primero enums y tablas, luego RLS, etc.

## Resumen RLS

| Tabla | Anónimo (visitante) | Autenticado (admin) |
|-------|----------------------|---------------------|
| perfiles, introducciones, asignaturas, etiquetas, evaluaciones | Lectura | CRUD completo |
| evidencias, reflexiones | Solo lectura donde `publicada = true` | CRUD completo |
| comentarios | Lectura + crear | CRUD completo |
| medios | Lectura si la evidencia está publicada | CRUD completo |
| Storage `eportfolio` | Lectura | Subir, actualizar, borrar |

El admin será un usuario de **Supabase Auth**; al iniciar sesión tendrá permisos de autenticado.
