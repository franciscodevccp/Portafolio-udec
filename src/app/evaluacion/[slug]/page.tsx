import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { Evaluacion, Comentario } from "@/types/database";
import ComentariosSection from "@/components/public/ComentariosSection";
import styles from "./page.module.css";

export default async function EvaluacionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: evalData } = await supabase
    .from("evaluaciones")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!evalData) notFound();
  const e = evalData as Evaluacion;

  const { data: comentariosData } = await supabase
    .from("comentarios")
    .select("id, autor, contenido, es_profesor, created_at")
    .eq("evaluacion_id", e.id)
    .order("created_at", { ascending: true });

  const comentariosForPage = (comentariosData ?? []) as Comentario[];

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>Evaluación</span>
          <h1 className={styles.title}>{e.titulo}</h1>
          <div className={styles.meta}>
            <time className={styles.fecha} dateTime={e.fecha}>
              {formatDate(e.fecha)}
            </time>
            {e.calificacion != null && (
              <>
                <span className={styles.metaSep}>·</span>
                <span className={styles.calificacion}>
                  Calificación: {e.calificacion}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {e.antecedentes && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Antecedentes de la evaluación</h2>
          <div className={styles.content}>{e.antecedentes}</div>
        </section>
      )}

      {e.criterios && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Criterios</h2>
          <div className={styles.content}>{e.criterios}</div>
        </section>
      )}

      {e.escalas && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Escalas</h2>
          <div className={styles.content}>{e.escalas}</div>
        </section>
      )}

      {e.metodologia && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Metodología</h2>
          <div className={styles.content}>{e.metodologia}</div>
        </section>
      )}

      {e.reflexion && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reflexión sobre la evaluación recibida</h2>
          <div className={styles.content}>{e.reflexion}</div>
        </section>
      )}

      {e.otros && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Otros de interés del autor</h2>
          <div className={styles.content}>{e.otros}</div>
        </section>
      )}

      <ComentariosSection
        evaluacionId={e.id}
        comentarios={comentariosForPage}
      />
    </article>
  );
}
