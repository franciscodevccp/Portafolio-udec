import { createClient } from "@/lib/supabase/server";
import type { Asignatura } from "@/types/database";
import styles from "./page.module.css";

async function getAsignatura(): Promise<Asignatura | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("asignaturas")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data as Asignatura | null;
}

export default async function AsignaturaPage() {
  const asignatura = await getAsignatura();

  if (!asignatura) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Asignatura</h1>
        <p className={styles.empty}>
          Aún no hay información de la asignatura. El autor puede completarla desde el panel de administración.
        </p>
      </div>
    );
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>Asignatura</span>
          <h1 className={styles.title}>{asignatura.nombre}</h1>
          {asignatura.archivo_url && (
            <a
              href={asignatura.archivo_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docLink}
            >
              Descargar programa (PDF)
            </a>
          )}
        </div>
      </header>

      {asignatura.programa && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Programa</h2>
          <div className={styles.content}>{asignatura.programa}</div>
        </section>
      )}

      {asignatura.planificacion && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Planificación</h2>
          <div className={styles.content}>{asignatura.planificacion}</div>
        </section>
      )}

      {asignatura.normas && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Normas para su desarrollo</h2>
          <div className={styles.content}>{asignatura.normas}</div>
        </section>
      )}

      {asignatura.otros && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Otros</h2>
          <div className={styles.content}>{asignatura.otros}</div>
        </section>
      )}
    </article>
  );
}
