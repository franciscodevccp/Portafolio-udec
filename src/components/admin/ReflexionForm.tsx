"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { reflexionSchema } from "@/lib/validations";
import { slugify, todayLocal } from "@/lib/utils";
import DatePicker from "@/components/ui/DatePicker";
import CustomSelect from "@/components/ui/CustomSelect";
import type { TipoReflexion } from "@/types/database";
import styles from "./ReflexionForm.module.css";

const TIPOS: { value: TipoReflexion; label: string }[] = [
  { value: "PROYECTO", label: "Sobre mis proyectos" },
  { value: "EVALUACION", label: "Sobre mis evaluaciones" },
  { value: "PORTFOLIO", label: "Sobre mi portfolio" },
  { value: "FINAL", label: "Reflexión final" },
];

export default function ReflexionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    tipo: "PROYECTO" as TipoReflexion,
    fecha: todayLocal(),
    publicada: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      tipo: form.tipo,
      fecha: form.fecha,
      publicada: form.publicada,
    };
    const result = reflexionSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Revisa los campos";
      toast.error(msg);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const slug = `${slugify(result.data.titulo)}-${Date.now()}`;
    const fechaIso = `${result.data.fecha}T12:00:00.000Z`;

    const { error } = await supabase.from("reflexiones").insert({
      titulo: result.data.titulo,
      slug,
      contenido: result.data.contenido,
      tipo: result.data.tipo,
      fecha: fechaIso,
      publicada: result.data.publicada,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Reflexión creada");
    router.push("/admin/reflexiones");
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
        <label id="tipo-label" htmlFor="tipo" className={styles.label}>
          Tipo de reflexión
        </label>
        <CustomSelect
          id="tipo"
          value={form.tipo}
          onChange={(v) =>
            setForm((f) => ({ ...f, tipo: v as TipoReflexion }))
          }
          options={TIPOS}
          disabled={loading}
          aria-label="Tipo de reflexión"
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
        <label htmlFor="contenido" className={styles.label}>
          Contenido
        </label>
        <textarea
          id="contenido"
          value={form.contenido}
          onChange={(e) =>
            setForm((f) => ({ ...f, contenido: e.target.value }))
          }
          className={styles.textarea}
          rows={8}
          required
          disabled={loading}
        />
      </div>
      <div className={styles.fieldCheck}>
        <input
          id="publicada"
          type="checkbox"
          checked={form.publicada}
          onChange={(e) =>
            setForm((f) => ({ ...f, publicada: e.target.checked }))
          }
          className={styles.checkbox}
          disabled={loading}
        />
        <label htmlFor="publicada" className={styles.checkLabel}>
          Publicada (visible en el sitio público)
        </label>
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Guardando…" : "Crear reflexión"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/reflexiones")}
          className={styles.cancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
