import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import EvidenciaRowActions from "./EvidenciaRowActions";
import styles from "./page.module.css";

export default async function AdminEvidenciasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: evidencias } = await supabase
    .from("evidencias")
    .select("id, titulo, slug, semana, fecha, publicada, created_at")
    .order("fecha", { ascending: false });

  const list = evidencias ?? [];

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Evidencias</h1>
        <p className={styles.subtitle}>
          Listado de evidencias. Crea y gestiona las entradas semanales.
        </p>
        <Link href="/admin/evidencias/nueva" className={styles.nuevaLink}>
          + Nueva evidencia
        </Link>
      </header>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no hay evidencias.</p>
          <Link href="/admin/evidencias/nueva" className={styles.nuevaLink}>
            Crear la primera evidencia
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Título</th>
                <th className={styles.th}>Semana</th>
                <th className={styles.th}>Fecha</th>
                <th className={styles.th}>Estado</th>
                <th className={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className={styles.tr}>
                  <td className={styles.td}>
                    <Link href={`/evidencias/${e.slug}`} className={styles.tituloLink} target="_blank" rel="noopener noreferrer">
                      {e.titulo}
                    </Link>
                  </td>
                  <td className={styles.td}>{e.semana}</td>
                  <td className={styles.td}>{formatDate(e.fecha)}</td>
                  <td className={styles.td}>
                    <span className={e.publicada ? styles.badgePublicada : styles.badgeBorrador}>
                      {e.publicada ? "Publicada" : "Borrador"}
                    </span>
                  </td>
                  <EvidenciaRowActions id={e.id} publicada={e.publicada} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
