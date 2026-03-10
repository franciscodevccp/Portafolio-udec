"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { evaluacionSchema } from "@/lib/validations";
import { slugify, todayLocal } from "@/lib/utils";
import DatePicker from "@/components/ui/DatePicker";
import styles from "./EvaluacionForm.module.css";

export default function EvaluacionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    fecha: todayLocal(),
    antecedentes: "",
    criterios: "",
    escalas: "",
    metodologia: "",
    calificacion: "",
    reflexion: "",
    otros: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const calificacionNum = form.calificacion.trim()
      ? parseFloat(form.calificacion.replace(",", "."))
      : undefined;
    const data = {
      titulo: form.titulo.trim(),
      fecha: form.fecha,
      antecedentes: form.antecedentes.trim() || undefined,
      criterios: form.criterios.trim() || undefined,
      escalas: form.escalas.trim() || undefined,
      metodologia: form.metodologia.trim() || undefined,
      calificacion: calificacionNum,
      reflexion: form.reflexion.trim() || undefined,
      otros: form.otros.trim() || undefined,
    };
    const result = evaluacionSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Revisa los campos";
      toast.error(msg);
      return;
    }
    if (calificacionNum != null && (calificacionNum < 1 || calificacionNum > 7)) {
      toast.error("La calificación debe estar entre 1 y 7.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const slug = `${slugify(result.data.titulo)}-${Date.now()}`;
    const fechaIso = `${result.data.fecha}T12:00:00.000Z`;

    const { error } = await supabase.from("evaluaciones").insert({
      titulo: result.data.titulo,
      slug,
      fecha: fechaIso,
      antecedentes: result.data.antecedentes || null,
      criterios: result.data.criterios || null,
      escalas: result.data.escalas || null,
      metodologia: result.data.metodologia || null,
      calificacion: result.data.calificacion ?? null,
      reflexion: result.data.reflexion || null,
      otros: result.data.otros || null,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Evaluación creada");
    router.push("/admin/evaluaciones");
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="titulo" className={styles.label}>
          Título
        </label>
        <input
          id="titulo"
          type="text"
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          className={styles.input}
          required
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="fecha" className={styles.label}>
          Fecha
        </label>
        <DatePicker
          id="fecha"
          value={form.fecha}
          onChange={(v) => setForm((f) => ({ ...f, fecha: v }))}
          disabled={loading}
          placeholder="Elegir fecha"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="antecedentes" className={styles.label}>
          Antecedentes de la evaluación
        </label>
        <textarea
          id="antecedentes"
          value={form.antecedentes}
          onChange={(e) =>
            setForm((f) => ({ ...f, antecedentes: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="criterios" className={styles.label}>
          Criterios
        </label>
        <textarea
          id="criterios"
          value={form.criterios}
          onChange={(e) =>
            setForm((f) => ({ ...f, criterios: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="escalas" className={styles.label}>
          Escalas
        </label>
        <textarea
          id="escalas"
          value={form.escalas}
          onChange={(e) =>
            setForm((f) => ({ ...f, escalas: e.target.value }))
          }
          className={styles.textarea}
          rows={2}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="metodologia" className={styles.label}>
          Metodología
        </label>
        <textarea
          id="metodologia"
          value={form.metodologia}
          onChange={(e) =>
            setForm((f) => ({ ...f, metodologia: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="calificacion" className={styles.label}>
          Calificación obtenida (1–7)
        </label>
        <input
          id="calificacion"
          type="text"
          inputMode="decimal"
          value={form.calificacion}
          onChange={(e) =>
            setForm((f) => ({ ...f, calificacion: e.target.value }))
          }
          className={styles.input}
          placeholder="Opcional, ej. 5.5"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="reflexion" className={styles.label}>
          Reflexión sobre la evaluación recibida
        </label>
        <textarea
          id="reflexion"
          value={form.reflexion}
          onChange={(e) =>
            setForm((f) => ({ ...f, reflexion: e.target.value }))
          }
          className={styles.textarea}
          rows={4}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="otros" className={styles.label}>
          Otros de interés del autor
        </label>
        <textarea
          id="otros"
          value={form.otros}
          onChange={(e) =>
            setForm((f) => ({ ...f, otros: e.target.value }))
          }
          className={styles.textarea}
          rows={2}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Guardando…" : "Crear evaluación"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/evaluaciones")}
          className={styles.cancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
