import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { Reflexion } from "@/types/database";
import styles from "./page.module.css";

const TIPO_LABEL: Record<string, string> = {
  PROYECTO: "Sobre mis proyectos",
  EVALUACION: "Sobre mis evaluaciones",
  PORTFOLIO: "Sobre mi portfolio",
  FINAL: "Reflexión final",
};

export default async function ReflexionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("reflexiones")
    .select("*")
    .eq("slug", slug)
    .eq("publicada", true)
    .single();

  if (!data) notFound();
  const r = data as Reflexion;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>
            {TIPO_LABEL[r.tipo] ?? r.tipo}
          </span>
          <h1 className={styles.title}>{r.titulo}</h1>
          <time className={styles.fecha} dateTime={r.fecha}>
            {formatDate(r.fecha)}
          </time>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.content}>{r.contenido}</div>
      </section>
    </article>
  );
}
