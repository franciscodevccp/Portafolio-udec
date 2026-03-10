import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { Evidencia, Medio, Comentario } from "@/types/database";
import ComentariosSection from "@/components/public/ComentariosSection";
import ImageCarousel from "@/components/public/ImageCarousel";
import styles from "./page.module.css";

export default async function EvidenciaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: evidencia } = await supabase
    .from("evidencias")
    .select("*")
    .eq("slug", slug)
    .eq("publicada", true)
    .single();

  if (!evidencia) notFound();
  const e = evidencia as Evidencia;

  const [{ data: mediosData }, { data: comentariosData }] = await Promise.all([
    supabase
      .from("medios")
      .select("id, url, tipo, descripcion")
      .eq("evidencia_id", e.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("comentarios")
      .select("id, autor, contenido, es_profesor, created_at")
      .eq("evidencia_id", e.id)
      .order("created_at", { ascending: true }),
  ]);

  const medios = (mediosData ?? []) as Medio[];
  const comentariosForPage = (comentariosData ?? []) as Comentario[];
  const imagenes = medios.filter((m) => m.tipo === "IMAGEN");
  const otrosMedios = medios.filter((m) => m.tipo !== "IMAGEN");

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>Evidencia</span>
          <h1 className={styles.title}>{e.titulo}</h1>
          <div className={styles.meta}>
            <time className={styles.fecha} dateTime={e.fecha}>
              {formatDate(e.fecha)}
            </time>
            <span className={styles.metaSep}>·</span>
            <span className={styles.semana}>Semana {e.semana}</span>
          </div>
        </div>
      </header>

      {imagenes.length > 0 && (
        <ImageCarousel
          images={imagenes.map((m) => ({
            id: m.id,
            url: m.url,
            descripcion: m.descripcion,
          }))}
        />
      )}

      {e.antecedentes && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Antecedentes</h2>
          <div className={styles.content}>{e.antecedentes}</div>
        </section>
      )}

      {e.objetivo && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Objetivo</h2>
          <div className={styles.content}>{e.objetivo}</div>
        </section>
      )}

      {e.proposito && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Propósito</h2>
          <div className={styles.content}>{e.proposito}</div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contenido</h2>
        <div className={styles.content}>{e.contenido}</div>
      </section>

      {otrosMedios.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Medios (videos, audio, enlaces)</h2>
          <div className={styles.medios}>
            {otrosMedios.map((m) => (
              <div key={m.id} className={styles.medio}>
                {m.tipo === "IMAGEN" && (
                  <figure>
                    <img
                      src={m.url}
                      alt={m.descripcion ?? "Imagen de la evidencia"}
                      className={styles.mediaImg}
                    />
                    {m.descripcion && (
                      <figcaption className={styles.caption}>
                        {m.descripcion}
                      </figcaption>
                    )}
                  </figure>
                )}
                {m.tipo === "VIDEO" && (
                  <figure>
                    <video
                      src={m.url}
                      controls
                      className={styles.mediaVideo}
                      preload="metadata"
                    />
                    {m.descripcion && (
                      <figcaption className={styles.caption}>
                        {m.descripcion}
                      </figcaption>
                    )}
                  </figure>
                )}
                {m.tipo === "AUDIO" && (
                  <figure>
                    <audio src={m.url} controls className={styles.mediaAudio} />
                    {m.descripcion && (
                      <figcaption className={styles.caption}>
                        {m.descripcion}
                      </figcaption>
                    )}
                  </figure>
                )}
                {(m.tipo === "LINK" || m.tipo === "DOCUMENTO" || m.tipo === "OTRO") && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {m.descripcion ?? m.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {e.reflexion && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reflexión</h2>
          <div className={styles.content}>{e.reflexion}</div>
        </section>
      )}

      {e.otros && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Otros</h2>
          <div className={styles.content}>{e.otros}</div>
        </section>
      )}

      <ComentariosSection
        evidenciaId={e.id}
        comentarios={comentariosForPage}
      />
    </article>
  );
}
