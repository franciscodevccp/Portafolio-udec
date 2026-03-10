"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { timeAgo } from "@/lib/utils";
import styles from "./page.module.css";

type CommentRow = {
  id: string;
  autor: string;
  contenido: string;
  es_profesor: boolean;
  evidencia_id: string | null;
  evaluacion_id: string | null;
  created_at: string;
  evidencias: { titulo: string; slug: string } | null;
  evaluaciones: { titulo: string; slug: string } | null;
};

export default function ComentariosList({ list }: { list: CommentRow[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este comentario?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("comentarios").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Comentario eliminado");
    router.refresh();
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Autor</th>
            <th className={styles.th}>Contenido</th>
            <th className={styles.th}>Contexto</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th} aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {list.map((c) => {
            const contexto = c.evidencias
              ? { tipo: "Evidencia", titulo: c.evidencias.titulo, slug: c.evidencias.slug, path: "/evidencias" }
              : c.evaluaciones
                ? { tipo: "Evaluación", titulo: c.evaluaciones.titulo, slug: c.evaluaciones.slug, path: "/evaluacion" }
                : null;
            return (
              <tr key={c.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.autor}>{c.autor}</span>
                  {c.es_profesor && (
                    <span className={styles.badgeProfesor}>Profesor</span>
                  )}
                </td>
                <td className={styles.td}>
                  <span className={styles.contenido}>
                    {c.contenido.length > 80 ? c.contenido.slice(0, 80) + "…" : c.contenido}
                  </span>
                </td>
                <td className={styles.td}>
                  {contexto ? (
                    <Link
                      href={`${contexto.path}/${contexto.slug}`}
                      className={styles.contextoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contexto.tipo}: {contexto.titulo}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className={styles.td}>
                  <time dateTime={c.created_at}>{timeAgo(c.created_at)}</time>
                </td>
                <td className={styles.td}>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className={styles.deleteBtn}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
