"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { perfilSchema } from "@/lib/validations";
import type { Perfil } from "@/types/database";
import styles from "./PerfilForm.module.css";

const BUCKET = "eportfolio";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface Props {
  perfil: Perfil | null;
}

export default function PerfilForm({ perfil }: Props) {
  const [loading, setLoading] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nombre: "",
    nivel_formacion: "",
    edad: "",
    intereses: "",
    gustos: "",
    datos_relevantes: "",
  });

  useEffect(() => {
    if (perfil) {
      setForm({
        nombre: perfil.nombre ?? "",
        nivel_formacion: perfil.nivel_formacion ?? "",
        edad: perfil.edad != null ? String(perfil.edad) : "",
        intereses: perfil.intereses ?? "",
        gustos: perfil.gustos ?? "",
        datos_relevantes: perfil.datos_relevantes ?? "",
      });
      setFotoPreview(perfil.foto_url ?? null);
    }
  }, [perfil]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoPreview(perfil?.foto_url ?? null);
      setFileName("");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato no válido. Usa JPG, PNG, GIF o WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`El archivo no puede superar ${MAX_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    setFotoPreview(URL.createObjectURL(file));
  }

  function quitarFoto() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFotoPreview(null);
    setFileName("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.edad.trim()) {
      const n = parseInt(form.edad, 10);
      if (Number.isNaN(n) || n < 1 || n > 120) {
        toast.error("Edad debe ser un número entre 1 y 120");
        return;
      }
    }
    const edadNum = form.edad.trim() ? parseInt(form.edad, 10) : undefined;
    const data = {
      nombre: form.nombre.trim() || undefined,
      nivel_formacion: form.nivel_formacion.trim() || undefined,
      edad: edadNum,
      intereses: form.intereses.trim() || undefined,
      gustos: form.gustos.trim() || undefined,
      datos_relevantes: form.datos_relevantes.trim() || undefined,
      foto_url: undefined as string | undefined,
    };
    const result = perfilSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Revisa los campos";
      toast.error(msg);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    let fotoUrl: string | null = perfil?.foto_url ?? null;

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Sesión no encontrada");
        setLoading(false);
        return;
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `perfil/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) {
        toast.error(uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      fotoUrl = urlData.publicUrl;
    } else if (fotoPreview === null && perfil?.foto_url) {
      fotoUrl = null;
    }

    const payload = {
      nombre: result.data.nombre ?? "",
      nivel_formacion: result.data.nivel_formacion ?? "",
      edad: result.data.edad ?? null,
      intereses: result.data.intereses ?? null,
      gustos: result.data.gustos ?? null,
      datos_relevantes: result.data.datos_relevantes ?? null,
      foto_url: fotoUrl,
    };

    if (perfil) {
      const { error } = await supabase
        .from("perfiles")
        .update(payload)
        .eq("id", perfil.id);
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Perfil actualizado");
      if (fotoUrl !== null) setFotoPreview(fotoUrl);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Sesión no encontrada");
        setLoading(false);
        return;
      }
      const { error } = await supabase.from("perfiles").insert({
        ...payload,
        auth_user_id: user.id,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Perfil creado");
      window.location.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="nombre" className={styles.label}>Nombre</label>
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
        <label htmlFor="nivel_formacion" className={styles.label}>Nivel de formación</label>
        <input
          id="nivel_formacion"
          type="text"
          value={form.nivel_formacion}
          onChange={(e) => setForm((f) => ({ ...f, nivel_formacion: e.target.value }))}
          className={styles.input}
          placeholder="Ej: Arquitectura FAUG UdeC, 3º año (opcional)"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="edad" className={styles.label}>Edad</label>
        <input
          id="edad"
          type="number"
          min={1}
          max={120}
          value={form.edad}
          onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))}
          className={styles.input}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="intereses" className={styles.label}>Intereses</label>
        <textarea
          id="intereses"
          value={form.intereses}
          onChange={(e) => setForm((f) => ({ ...f, intereses: e.target.value }))}
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="gustos" className={styles.label}>Gustos</label>
        <textarea
          id="gustos"
          value={form.gustos}
          onChange={(e) => setForm((f) => ({ ...f, gustos: e.target.value }))}
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="datos_relevantes" className={styles.label}>Otros datos relevantes</label>
        <textarea
          id="datos_relevantes"
          value={form.datos_relevantes}
          onChange={(e) => setForm((f) => ({ ...f, datos_relevantes: e.target.value }))}
          className={styles.textarea}
          rows={3}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Foto de perfil (opcional)</label>
        <div className={styles.fileWrap}>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={loading}
            id="foto-perfil"
          />
          <label htmlFor="foto-perfil" className={styles.fileLabel}>
            Elegir imagen
          </label>
          <span className={styles.fileName}>
            {fileName || (fotoPreview ? "Imagen actual" : "JPG, PNG, GIF o WebP · máx. 5 MB")}
          </span>
        </div>
        {fotoPreview && (
          <div className={styles.previewWrap}>
            <img src={fotoPreview} alt="Vista previa" className={styles.previewImg} />
            <button
              type="button"
              onClick={quitarFoto}
              className={styles.quitarFoto}
              disabled={loading}
            >
              Quitar foto
            </button>
          </div>
        )}
      </div>
      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Guardando…" : "Guardar perfil"}
      </button>
    </form>
  );
}
