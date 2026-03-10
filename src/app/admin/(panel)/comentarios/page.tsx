import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import ComentariosList from "./ComentariosList";
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

export default async function AdminComentariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: rows } = await supabase
    .from("comentarios")
    .select(`
      id,
      autor,
      contenido,
      es_profesor,
      evidencia_id,
      evaluacion_id,
      created_at,
      evidencias(titulo, slug),
      evaluaciones(titulo, slug)
    `)
    .order("created_at", { ascending: false });

  const list = (rows ?? []) as CommentRow[];

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Comentarios</h1>
        <p className={styles.subtitle}>
          Comentarios de alumnos y profesores sobre evidencias y evaluaciones. Puedes eliminar los inapropiados.
        </p>
      </header>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no hay comentarios.</p>
        </div>
      ) : (
        <ComentariosList list={list} />
      )}
    </div>
  );
}
