import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import styles from "../page.module.css";

export default async function EvidenciasPage() {
  const supabase = await createClient();
  const { data: evidencias } = await supabase
    .from("evidencias")
    .select("id, titulo, slug, fecha, semana, contenido")
    .eq("publicada", true)
    .order("fecha", { ascending: false });

  const list = evidencias ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.listPageHeader}>
        <h1 className={styles.sectionTitle}>Evidencias</h1>
        <p className={styles.sectionDesc}>
          Entradas semanales del portfolio. Haz clic en una para ver el detalle y dejar comentarios.
        </p>
      </header>

      {list.length === 0 ? (
        <div className={styles.empty}>
          Aún no hay evidencias publicadas.
        </div>
      ) : (
        <ul className={styles.evidenciaGrid}>
          {list.map((e) => (
            <li key={e.id}>
              <Link href={`/evidencias/${e.slug}`} className={styles.evidenciaCard}>
                <span className={styles.evidenciaSemana}>Semana {e.semana}</span>
                <h2 className={styles.evidenciaTitle}>{e.titulo}</h2>
                <time className={styles.evidenciaFecha} dateTime={e.fecha}>
                  {formatDate(e.fecha)}
                </time>
                {e.contenido && (
                  <p className={styles.evidenciaExtracto}>
                    {String(e.contenido).replace(/<[^>]*>/g, "").trim().slice(0, 120)}
                    {String(e.contenido).replace(/<[^>]*>/g, "").trim().length > 120 ? "…" : ""}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
