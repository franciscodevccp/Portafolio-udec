"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { asignaturaSchema } from "@/lib/validations";
import type { Asignatura } from "@/types/database";
import styles from "./AsignaturaForm.module.css";

const BUCKET = "eportfolio";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["application/pdf"];

interface Props {
  asignatura: Asignatura | null;
}

export default function AsignaturaForm({ asignatura }: Props) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [quitarArchivo, setQuitarArchivo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nombre: "",
    programa: "",
    planificacion: "",
    normas: "",
    otros: "",
  });

  useEffect(() => {
    if (asignatura) {
      setForm({
        nombre: asignatura.nombre ?? "",
        programa: asignatura.programa ?? "",
        planificacion: asignatura.planificacion ?? "",
        normas: asignatura.normas ?? "",
        otros: asignatura.otros ?? "",
      });
    }
  }, [asignatura]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("");
      setQuitarArchivo(false);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Solo se permiten archivos PDF.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`El archivo no puede superar ${MAX_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    setQuitarArchivo(false);
  }

  function handleQuitarArchivo() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileName("");
    setQuitarArchivo(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      nombre: form.nombre.trim() || undefined,
      programa: form.programa.trim() || undefined,
      planificacion: form.planificacion.trim() || undefined,
      normas: form.normas.trim() || undefined,
      otros: form.otros.trim() || undefined,
      archivo_url: undefined as string | undefined,
    };
    const result = asignaturaSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Revisa los campos";
      toast.error(msg);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    let archivoUrl: string | null = quitarArchivo ? null : asignatura?.archivo_url ?? null;

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop() || "pdf";
      const path = `asignatura/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) {
        toast.error(uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      archivoUrl = urlData.publicUrl;
    }

    const payload = {
      nombre: result.data.nombre ?? "",
      programa: result.data.programa || null,
      planificacion: result.data.planificacion || null,
      normas: result.data.normas || null,
      otros: result.data.otros || null,
      archivo_url: archivoUrl,
    };

    if (asignatura) {
      const { error } = await supabase
        .from("asignaturas")
        .update(payload)
        .eq("id", asignatura.id);
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Asignatura actualizada");
    } else {
      const { error } = await supabase.from("asignaturas").insert(payload);
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Asignatura creada");
      window.location.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="nombre" className={styles.label}>
          Nombre de la asignatura
        </label>
        <input
          id="nombre"
          type="text"
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          className={styles.input}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="programa" className={styles.label}>
          Programa
        </label>
        <textarea
          id="programa"
          value={form.programa}
          onChange={(e) =>
            setForm((f) => ({ ...f, programa: e.target.value }))
          }
          className={styles.textarea}
          rows={4}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="planificacion" className={styles.label}>
          Planificación
        </label>
        <textarea
          id="planificacion"
          value={form.planificacion}
          onChange={(e) =>
            setForm((f) => ({ ...f, planificacion: e.target.value }))
          }
          className={styles.textarea}
          rows={4}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="normas" className={styles.label}>
          Normas
        </label>
        <textarea
          id="normas"
          value={form.normas}
          onChange={(e) =>
            setForm((f) => ({ ...f, normas: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="otros" className={styles.label}>
          Otros
        </label>
        <textarea
          id="otros"
          value={form.otros}
          onChange={(e) =>
            setForm((f) => ({ ...f, otros: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Archivo (programa, PDF, etc.) — opcional
        </label>
        <div className={styles.fileWrap}>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={loading}
            id="archivo-asignatura"
          />
          <label htmlFor="archivo-asignatura" className={styles.fileLabel}>
            Elegir archivo
          </label>
          <span className={styles.fileName}>
            {fileName ||
              (asignatura?.archivo_url && !quitarArchivo
                ? "Archivo actual"
                : "PDF · máx. 5 MB")}
          </span>
        </div>
        {asignatura?.archivo_url && !quitarArchivo && (
          <p className={styles.archivoActual}>
            <a
              href={asignatura.archivo_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.archivoLink}
            >
              Ver archivo actual
            </a>
          </p>
        )}
        {(fileName || (asignatura?.archivo_url && !quitarArchivo)) && (
          <button
            type="button"
            onClick={handleQuitarArchivo}
            className={styles.quitarArchivo}
            disabled={loading}
          >
            Quitar archivo
          </button>
        )}
      </div>
      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Guardando…" : "Guardar asignatura"}
      </button>
    </form>
  );
}
