"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { comentarioSchema } from "@/lib/validations";
import styles from "./ComentarioForm.module.css";

interface Props {
  evidenciaId?: string;
  evaluacionId?: string;
  onSuccess?: () => void;
}

export default function ComentarioForm({
  evidenciaId,
  evaluacionId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    autor: "",
    contenido: "",
    es_profesor: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      autor: form.autor.trim(),
      contenido: form.contenido.trim(),
      es_profesor: form.es_profesor,
      evidencia_id: evidenciaId || undefined,
      evaluacion_id: evaluacionId || undefined,
    };
    const result = comentarioSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Revisa los campos";
      toast.error(msg);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("comentarios").insert({
      autor: result.data.autor,
      contenido: result.data.contenido,
      es_profesor: result.data.es_profesor,
      evidencia_id: result.data.evidencia_id ?? null,
      evaluacion_id: result.data.evaluacion_id ?? null,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Comentario publicado");
    setForm({ autor: "", contenido: "", es_profesor: false });
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formInner}>
      <div className={styles.field}>
        <label htmlFor="comentario-autor" className={styles.label}>
          Tu nombre
        </label>
        <input
          id="comentario-autor"
          type="text"
          value={form.autor}
          onChange={(e) => setForm((f) => ({ ...f, autor: e.target.value }))}
          className={styles.input}
          required
          disabled={loading}
          placeholder="Ej. Juan Pérez"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="comentario-contenido" className={styles.label}>
          Comentario
        </label>
        <textarea
          id="comentario-contenido"
          value={form.contenido}
          onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
          className={styles.textarea}
          rows={3}
          required
          disabled={loading}
          placeholder="Escribe tu comentario…"
        />
      </div>
      <div className={styles.fieldCheck}>
        <input
          id="comentario-profesor"
          type="checkbox"
          checked={form.es_profesor}
          onChange={(e) =>
            setForm((f) => ({ ...f, es_profesor: e.target.checked }))
          }
          className={styles.checkbox}
          disabled={loading}
        />
        <label htmlFor="comentario-profesor" className={styles.checkLabel}>
          Soy profesor o profesora
        </label>
      </div>
      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Enviando…" : "Publicar comentario"}
      </button>
      </div>
    </form>
  );
}
