import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const TIPO_LABEL: Record<string, string> = {
  PROYECTO: "Proyecto",
  EVALUACION: "Evaluación",
  PORTFOLIO: "Portfolio",
  FINAL: "Final",
};

export default async function AdminReflexionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: reflexiones } = await supabase
    .from("reflexiones")
    .select("id, titulo, slug, tipo, fecha, publicada, created_at")
    .order("fecha", { ascending: false });

  const list = reflexiones ?? [];

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Reflexiones</h1>
        <p className={styles.subtitle}>
          Reflexiones sobre el proceso de aprendizaje (proyectos, evaluaciones, portfolio, final).
        </p>
        <Link href="/admin/reflexiones/nueva" className={styles.nuevaLink}>
          + Nueva reflexión
        </Link>
      </header>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no hay reflexiones.</p>
          <Link href="/admin/reflexiones/nueva" className={styles.nuevaLink}>
            Crear la primera reflexión
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Título</th>
                <th className={styles.th}>Tipo</th>
                <th className={styles.th}>Fecha</th>
                <th className={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className={styles.tr}>
                  <td className={styles.td}>
                    <Link
                      href={`/reflexiones/${r.slug}`}
                      className={styles.tituloLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {r.titulo}
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badge}>{TIPO_LABEL[r.tipo] ?? r.tipo}</span>
                  </td>
                  <td className={styles.td}>{formatDate(r.fecha)}</td>
                  <td className={styles.td}>
                    <span className={r.publicada ? styles.badgePublicada : styles.badgeBorrador}>
                      {r.publicada ? "Publicada" : "Borrador"}
                    </span>
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
