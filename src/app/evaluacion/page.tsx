import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import styles from "../page.module.css";

export default async function EvaluacionListPage() {
  const supabase = await createClient();
  const { data: evaluaciones } = await supabase
    .from("evaluaciones")
    .select("id, titulo, slug, fecha, calificacion")
    .order("fecha", { ascending: false });

  const list = evaluaciones ?? [];

  return (
    <div className={styles.page}>
      <h1 className={styles.sectionTitle}>Evaluación</h1>
      <p className={styles.sectionDesc}>
        Criterios, escalas, metodología y calificaciones en base a las evidencias mostradas.
      </p>

      {list.length === 0 ? (
        <div className={styles.empty}>
          Aún no hay evaluaciones publicadas.
        </div>
      ) : (
        <ul className={styles.evidenciaGrid}>
          {list.map((e) => (
            <li key={e.id}>
              <Link href={`/evaluacion/${e.slug}`} className={styles.evidenciaCard}>
                <span className={styles.evidenciaSemana}>
                  {e.calificacion != null ? `Calificación: ${e.calificacion}` : "Evaluación"}
                </span>
                <h2 className={styles.evidenciaTitle}>{e.titulo}</h2>
                <time className={styles.evidenciaFecha} dateTime={e.fecha}>
                  {formatDate(e.fecha)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
