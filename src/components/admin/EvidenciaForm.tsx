"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { evidenciaSchema } from "@/lib/validations";
import { slugify, todayLocal, toDateInputValue } from "@/lib/utils";
import type { TipoMedio } from "@/types/database";
import type { Evidencia } from "@/types/database";
import DatePicker from "@/components/ui/DatePicker";
import styles from "./EvidenciaForm.module.css";

const BUCKET = "eportfolio";
const MAX_SIZE_MB = 5;
const MAX_IMAGENES = 20;
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEOS = ["video/mp4", "video/webm"];
const ALLOWED_AUDIO = ["audio/mpeg", "audio/wav"];
const ALLOWED_MEDIA = [...ALLOWED_IMAGES, ...ALLOWED_VIDEOS, ...ALLOWED_AUDIO];

function getTipoMedio(mime: string): TipoMedio {
  if (ALLOWED_IMAGES.includes(mime)) return "IMAGEN";
  if (ALLOWED_VIDEOS.includes(mime)) return "VIDEO";
  if (ALLOWED_AUDIO.includes(mime)) return "AUDIO";
  return "OTRO";
}

interface Props {
  defaultSemana?: number;
  evidencia?: Evidencia | null;
}

export default function EvidenciaForm({ defaultSemana = 1, evidencia = null }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [archivos, setArchivos] = useState<File[]>([]);
  const [enlaces, setEnlaces] = useState<string[]>([]);
  const [nuevoEnlace, setNuevoEnlace] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    titulo: evidencia?.titulo ?? "",
    semana: String(evidencia?.semana ?? defaultSemana),
    fecha: evidencia ? toDateInputValue(evidencia.fecha) : todayLocal(),
    contenido: evidencia?.contenido ?? "",
    antecedentes: evidencia?.antecedentes ?? "",
    objetivo: evidencia?.objetivo ?? "",
    proposito: evidencia?.proposito ?? "",
    reflexion: evidencia?.reflexion ?? "",
    otros: evidencia?.otros ?? "",
    publicada: evidencia?.publicada ?? false,
  });

  useEffect(() => {
    if (evidencia) {
      setForm({
        titulo: evidencia.titulo,
        semana: String(evidencia.semana),
        fecha: toDateInputValue(evidencia.fecha),
        contenido: evidencia.contenido ?? "",
        antecedentes: evidencia.antecedentes ?? "",
        objetivo: evidencia.objetivo ?? "",
        proposito: evidencia.proposito ?? "",
        reflexion: evidencia.reflexion ?? "",
        otros: evidencia.otros ?? "",
        publicada: evidencia.publicada ?? false,
      });
    }
  }, [evidencia]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid: File[] = [];
    for (const file of files) {
      if (!ALLOWED_MEDIA.includes(file.type)) {
        toast.error(`${file.name}: solo imágenes, video o audio (JPG, PNG, GIF, WebP, MP4, WebM, MP3, WAV).`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: máximo ${MAX_SIZE_MB} MB.`);
        continue;
      }
      valid.push(file);
    }
    const newImages = valid.filter((f) => ALLOWED_IMAGES.includes(f.type));
    const newOthers = valid.filter((f) => !ALLOWED_IMAGES.includes(f.type));
    setArchivos((prev) => {
      const currentImages = prev.filter((f) => ALLOWED_IMAGES.includes(f.type));
      const spaceLeft = Math.max(0, MAX_IMAGENES - currentImages.length);
      const toAddImages = newImages.slice(0, spaceLeft);
      if (newImages.length > spaceLeft) {
        toast.error(`Máximo ${MAX_IMAGENES} imágenes. Se añaden ${toAddImages.length} de ${newImages.length}.`);
      }
      return [...prev, ...toAddImages, ...newOthers];
    });
    e.target.value = "";
  }

  function quitarArchivo(index: number) {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  }

  function agregarEnlace() {
    const url = nuevoEnlace.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("Escribe una URL válida (ej. https://...)");
      return;
    }
    setEnlaces((prev) => [...prev, url]);
    setNuevoEnlace("");
  }

  function quitarEnlace(index: number) {
    setEnlaces((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const semanaNum = parseInt(form.semana, 10);
    const data = {
      titulo: form.titulo.trim(),
      semana: semanaNum,
      fecha: form.fecha,
      contenido: form.contenido.trim(),
      antecedentes: form.antecedentes.trim() || undefined,
      objetivo: form.objetivo.trim() || undefined,
      proposito: form.proposito.trim() || undefined,
      reflexion: form.reflexion.trim() || undefined,
      otros: form.otros.trim() || undefined,
      publicada: form.publicada,
    };
    const result = evidenciaSchema.safeParse(data);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const errors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(flat)) {
        const text = Array.isArray(messages) ? messages[0] : messages;
        if (text) errors[key] = text;
      }
      setFieldErrors(errors);
      const msg = Object.values(errors).join(" ");
      toast.error(msg);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    const supabase = createClient();
    const fechaIso = `${result.data.fecha}T12:00:00.000Z`;
    let evidenciaId: string;

    if (evidencia?.id) {
      evidenciaId = evidencia.id;
      const { error } = await supabase
        .from("evidencias")
        .update({
          titulo: result.data.titulo,
          semana: result.data.semana,
          fecha: fechaIso,
          contenido: result.data.contenido,
          antecedentes: result.data.antecedentes || null,
          objetivo: result.data.objetivo || null,
          proposito: result.data.proposito || null,
          reflexion: result.data.reflexion || null,
          otros: result.data.otros || null,
          publicada: result.data.publicada,
        })
        .eq("id", evidenciaId);

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
    } else {
      const slug = `${slugify(result.data.titulo)}-${Date.now()}`;
      const { data: evidenciaCreada, error } = await supabase
        .from("evidencias")
        .insert({
          titulo: result.data.titulo,
          slug,
          semana: result.data.semana,
          fecha: fechaIso,
          contenido: result.data.contenido,
          antecedentes: result.data.antecedentes || null,
          objetivo: result.data.objetivo || null,
          proposito: result.data.proposito || null,
          reflexion: result.data.reflexion || null,
          otros: result.data.otros || null,
          publicada: result.data.publicada,
        })
        .select("id")
        .single();

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
      if (!evidenciaCreada) {
        setLoading(false);
        toast.error("Error al crear");
        return;
      }
      evidenciaId = evidenciaCreada.id;
    }

    let mediosOk = 0;
    for (let i = 0; i < archivos.length; i++) {
      const file = archivos[i];
      const ext = file.name.split(".").pop() || (file.type.startsWith("video/") ? "mp4" : "jpg");
      const path = `evidencias/${evidenciaId}/${Date.now()}-${i}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (uploadError) {
        toast.error(`No se pudo subir ${file.name}: ${uploadError.message}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const tipo = getTipoMedio(file.type);
      const { error: medioError } = await supabase.from("medios").insert({
        evidencia_id: evidenciaId,
        url: urlData.publicUrl,
        tipo,
        descripcion: null,
      });
      if (medioError) {
        toast.error(`Error al guardar ${file.name}`);
        continue;
      }
      mediosOk++;
    }

    for (const url of enlaces) {
      const { error: medioError } = await supabase.from("medios").insert({
        evidencia_id: evidenciaId,
        url,
        tipo: "LINK" as TipoMedio,
        descripcion: null,
      });
      if (medioError) toast.error(`Error al guardar enlace: ${url.slice(0, 30)}...`);
    }

    setLoading(false);
    const totalMedios = mediosOk + enlaces.length;
    if (evidencia) {
      if (totalMedios > 0) {
        toast.success(`Evidencia actualizada. ${totalMedios} medio(s) añadido(s).`);
      } else {
        toast.success("Evidencia actualizada");
      }
    } else {
      if (totalMedios > 0) {
        toast.success(`Evidencia creada con ${totalMedios} medio(s).`);
      } else {
        toast.success("Evidencia creada");
      }
    }
    router.push("/admin/evidencias");
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="titulo" className={styles.label}>
          Título
        </label>
        {fieldErrors.titulo && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.titulo}
          </p>
        )}
        <input
          id="titulo"
          type="text"
          value={form.titulo}
          onChange={(e) => {
            setForm((f) => ({ ...f, titulo: e.target.value }));
            if (fieldErrors.titulo) setFieldErrors((err) => { const next = { ...err }; delete next.titulo; return next; });
          }}
          className={fieldErrors.titulo ? styles.inputError : styles.input}
          required
          disabled={loading}
          aria-invalid={!!fieldErrors.titulo}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="semana" className={styles.label}>
            Semana
          </label>
          <input
            id="semana"
            type="number"
            min={1}
            max={20}
            value={form.semana}
            onChange={(e) => setForm((f) => ({ ...f, semana: e.target.value }))}
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
      </div>
      <div className={styles.field}>
        <label htmlFor="contenido" className={styles.label}>
          Contenido de la evidencia
        </label>
        {fieldErrors.contenido && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.contenido}
          </p>
        )}
        <textarea
          id="contenido"
          value={form.contenido}
          onChange={(e) => {
            setForm((f) => ({ ...f, contenido: e.target.value }));
            if (fieldErrors.contenido) setFieldErrors((err) => { const next = { ...err }; delete next.contenido; return next; });
          }}
          className={fieldErrors.contenido ? styles.textareaError : styles.textarea}
          rows={6}
          required
          disabled={loading}
          aria-invalid={!!fieldErrors.contenido}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="antecedentes" className={styles.label}>
          Antecedentes sobre la evidencia
        </label>
        <textarea
          id="antecedentes"
          value={form.antecedentes}
          onChange={(e) =>
            setForm((f) => ({ ...f, antecedentes: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
          placeholder="Contexto o background de esta evidencia (opcional)"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="objetivo" className={styles.label}>
          Objetivo de las evidencias
        </label>
        <p className={styles.hint}>Por qué es importante, cuál es su propósito, por qué se muestra.</p>
        <textarea
          id="objetivo"
          value={form.objetivo}
          onChange={(e) =>
            setForm((f) => ({ ...f, objetivo: e.target.value }))
          }
          className={styles.textarea}
          rows={2}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="proposito" className={styles.label}>
          Propósito
        </label>
        <textarea
          id="proposito"
          value={form.proposito}
          onChange={(e) =>
            setForm((f) => ({ ...f, proposito: e.target.value }))
          }
          className={styles.textarea}
          rows={2}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="reflexion" className={styles.label}>
          Reflexión sobre las evidencias
        </label>
        <textarea
          id="reflexion"
          value={form.reflexion}
          onChange={(e) =>
            setForm((f) => ({ ...f, reflexion: e.target.value }))
          }
          className={styles.textarea}
          rows={3}
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
      <div className={styles.field}>
        <label className={styles.label}>Imágenes (carrusel en la evidencia)</label>
        <p className={styles.hint}>
          Hasta {MAX_IMAGENES} imágenes. Se mostrarán primero en un carrusel. Opcional: video y audio.
        </p>
        <div className={styles.fileWrap}>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_MEDIA.join(",")}
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={loading}
            id="medios-evidencia"
          />
          <label htmlFor="medios-evidencia" className={styles.fileLabel}>
            Elegir archivos
          </label>
          <span className={styles.fileName}>
            {archivos.length === 0
              ? `Hasta ${MAX_IMAGENES} imágenes + video/audio (JPG, PNG, GIF, WebP, MP4, WebM, MP3, WAV) · máx. ${MAX_SIZE_MB} MB`
              : `${archivos.filter((f) => ALLOWED_IMAGES.includes(f.type)).length} imagen(es), ${archivos.filter((f) => !ALLOWED_IMAGES.includes(f.type)).length} otro(s)`}
          </span>
        </div>
        {archivos.some((f) => ALLOWED_IMAGES.includes(f.type)) && (
          <div className={styles.previewCarouselWrap}>
            <p className={styles.previewLabel}>Vista previa (carrusel)</p>
            <div className={styles.previewCarousel}>
              {archivos
                .filter((f) => ALLOWED_IMAGES.includes(f.type))
                .map((file, index) => (
                  <div key={`${file.name}-${index}`} className={styles.previewSlide}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className={styles.previewImg}
                    />
                    <div className={styles.previewMeta}>
                      <span className={styles.previewNombre}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const idx = archivos.indexOf(file);
                          if (idx !== -1) quitarArchivo(idx);
                        }}
                        className={styles.quitarArchivo}
                        disabled={loading}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {archivos.filter((f) => !ALLOWED_IMAGES.includes(f.type)).length > 0 && (
          <ul className={styles.listaArchivos}>
            <span className={styles.archivoOtrosLabel}>Videos / audio:</span>
            {archivos
              .filter((f) => !ALLOWED_IMAGES.includes(f.type))
              .map((file, index) => {
                const globalIndex = archivos.indexOf(file);
                return (
                  <li key={`${file.name}-${globalIndex}`} className={styles.archivoItem}>
                    <span className={styles.archivoNombre}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => quitarArchivo(globalIndex)}
                      className={styles.quitarArchivo}
                      disabled={loading}
                    >
                      Quitar
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Enlaces (páginas web, redes sociales, etc.)</label>
        <div className={styles.enlaceRow}>
          <input
            type="url"
            value={nuevoEnlace}
            onChange={(e) => setNuevoEnlace(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarEnlace())}
            className={styles.input}
            placeholder="https://..."
            disabled={loading}
          />
          <button type="button" onClick={agregarEnlace} className={styles.btnEnlace} disabled={loading}>
            Añadir enlace
          </button>
        </div>
        {enlaces.length > 0 && (
          <ul className={styles.listaArchivos}>
            {enlaces.map((url, index) => (
              <li key={`${url}-${index}`} className={styles.archivoItem}>
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.enlaceUrl}>
                  {url.length > 50 ? url.slice(0, 50) + "…" : url}
                </a>
                <button type="button" onClick={() => quitarEnlace(index)} className={styles.quitarArchivo} disabled={loading}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
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
          {loading ? "Guardando…" : evidencia ? "Guardar cambios" : "Crear evidencia"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/evidencias")}
          className={styles.cancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
