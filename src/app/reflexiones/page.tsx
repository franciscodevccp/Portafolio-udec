import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const TIPO_LABEL: Record<string, string> = {
  PROYECTO: "Sobre mis proyectos",
  EVALUACION: "Sobre mis evaluaciones",
  PORTFOLIO: "Sobre mi portfolio",
  FINAL: "Reflexión final",
};

const TIPO_ORDER = ["PROYECTO", "EVALUACION", "PORTFOLIO", "FINAL"] as const;

export default async function ReflexionesPublicPage() {
  const supabase = await createClient();
  const { data: reflexiones } = await supabase
    .from("reflexiones")
    .select("id, titulo, slug, tipo, fecha")
    .eq("publicada", true)
    .order("fecha", { ascending: false });

  const list = reflexiones ?? [];
  const byTipo = TIPO_ORDER.map((tipo) => ({
    tipo,
    label: TIPO_LABEL[tipo],
    items: list.filter((r) => r.tipo === tipo),
  }));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reflexiones</h1>
      <p className={styles.subtitle}>
        Reflexiones sobre mi proceso de aprendizaje (proyectos, evaluaciones, portfolio y final).
      </p>

      {list.length === 0 ? (
        <div className={styles.empty}>
          Aún no hay reflexiones publicadas.
        </div>
      ) : (
        <div className={styles.sections}>
          {byTipo.map(
            ({ tipo, label, items }) =>
              items.length > 0 && (
                <section key={tipo} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{label}</h2>
                  <ul className={styles.list}>
                    {items.map((r) => (
                      <li key={r.id}>
                        <Link href={`/reflexiones/${r.slug}`} className={styles.card}>
                          <span className={styles.cardTitle}>{r.titulo}</span>
                          <time className={styles.cardDate} dateTime={r.fecha}>
                            {formatDate(r.fecha)}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )
          )}
        </div>
      )}
    </div>
  );
}
