import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export default async function AdminEvaluacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: evaluaciones } = await supabase
    .from("evaluaciones")
    .select("id, titulo, slug, fecha, calificacion, created_at")
    .order("fecha", { ascending: false });

  const list = evaluaciones ?? [];

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Evaluaciones</h1>
        <p className={styles.subtitle}>
          Listado de evaluaciones (en base a las evidencias mostradas).
        </p>
        <Link href="/admin/evaluaciones/nueva" className={styles.nuevaLink}>
          + Nueva evaluación
        </Link>
      </header>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no hay evaluaciones.</p>
          <Link href="/admin/evaluaciones/nueva" className={styles.nuevaLink}>
            Crear la primera evaluación
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Título</th>
                <th className={styles.th}>Fecha</th>
                <th className={styles.th}>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className={styles.tr}>
                  <td className={styles.td}>
                    <Link
                      href={`/evaluacion/${e.slug}`}
                      className={styles.tituloLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {e.titulo}
                    </Link>
                  </td>
                  <td className={styles.td}>{formatDate(e.fecha)}</td>
                  <td className={styles.td}>
                    {e.calificacion != null ? (
                      <span className={styles.calificacion}>{e.calificacion}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
