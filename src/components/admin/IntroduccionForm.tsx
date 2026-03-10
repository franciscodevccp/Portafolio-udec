"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { introduccionSchema } from "@/lib/validations";
import type { Introduccion } from "@/types/database";
import styles from "./IntroduccionForm.module.css";

interface Props {
  introduccion: Introduccion | null;
}

export default function IntroduccionForm({ introduccion }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sentido_portfolio: "",
    objetivos: "",
    experiencias_previas: "",
    expectativas: "",
  });

  useEffect(() => {
    if (introduccion) {
      setForm({
        sentido_portfolio: introduccion.sentido_portfolio ?? "",
        objetivos: introduccion.objetivos ?? "",
        experiencias_previas: introduccion.experiencias_previas ?? "",
        expectativas: introduccion.expectativas ?? "",
      });
    }
  }, [introduccion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      sentido_portfolio: form.sentido_portfolio.trim() || undefined,
      objetivos: form.objetivos.trim() || undefined,
      experiencias_previas: form.experiencias_previas.trim() || undefined,
      expectativas: form.expectativas.trim() || undefined,
    };
    const result = introduccionSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Revisa los campos";
      toast.error(msg);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const payload = {
      sentido_portfolio: result.data.sentido_portfolio ?? "",
      objetivos: result.data.objetivos ?? "",
      experiencias_previas: result.data.experiencias_previas || null,
      expectativas: result.data.expectativas || null,
    };

    if (introduccion) {
      const { error } = await supabase
        .from("introducciones")
        .update(payload)
        .eq("id", introduccion.id);
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Introducción actualizada");
    } else {
      const { error } = await supabase.from("introducciones").insert(payload);
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Introducción creada");
      window.location.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="sentido_portfolio" className={styles.label}>
          Sentido del portfolio
        </label>
        <textarea
          id="sentido_portfolio"
          value={form.sentido_portfolio}
          onChange={(e) =>
            setForm((f) => ({ ...f, sentido_portfolio: e.target.value }))
          }
          className={styles.textarea}
          rows={4}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="objetivos" className={styles.label}>
          Objetivos del eportfolio (propósitos de aprendizaje)
        </label>
        <p className={styles.hint}>
          Incluya planificación, gestión del tiempo y estrategias de estudio con los que espera alcanzar los propósitos (requisito del taller).
        </p>
        <textarea
          id="objetivos"
          value={form.objetivos}
          onChange={(e) =>
            setForm((f) => ({ ...f, objetivos: e.target.value }))
          }
          className={styles.textarea}
          rows={4}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="experiencias_previas" className={styles.label}>
          Experiencias previas
        </label>
        <textarea
          id="experiencias_previas"
          value={form.experiencias_previas}
          onChange={(e) =>
            setForm((f) => ({ ...f, experiencias_previas: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="expectativas" className={styles.label}>
          Expectativas
        </label>
        <textarea
          id="expectativas"
          value={form.expectativas}
          onChange={(e) =>
            setForm((f) => ({ ...f, expectativas: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Guardando…" : "Guardar introducción"}
      </button>
    </form>
  );
}
