import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import styles from "./page.module.css";

function formatDate(date: Date | string): string {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
}

function formatMonthYear(date: Date | string): string {
  return format(new Date(date), "MMMM yyyy", { locale: es });
}

export default async function ArchivoPage() {
  const supabase = await createClient();
  const { data: evidencias } = await supabase
    .from("evidencias")
    .select("id, titulo, slug, fecha, semana")
    .eq("publicada", true)
    .order("fecha", { ascending: false });

  const list = evidencias ?? [];

  // Agrupar por mes (año-mes para orden)
  const byMonth = list.reduce<{ key: string; label: string; items: typeof list }[]>(
    (acc, ev) => {
      const d = new Date(ev.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = formatMonthYear(ev.fecha);
      const existing = acc.find((g) => g.key === key);
      if (existing) {
        existing.items.push(ev);
      } else {
        acc.push({ key, label, items: [ev] });
      }
      return acc;
    },
    []
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Archivo del blog</h1>
        <p className={styles.subtitle}>
          Entradas ordenadas por fecha. Cada evidencia muestra su fecha de publicación (requisito del taller).
        </p>
      </header>

      {list.length === 0 ? (
        <div className={styles.empty}>
          Aún no hay entradas publicadas. Las evidencias que publiques aparecerán aquí agrupadas por mes.
        </div>
      ) : (
        <div className={styles.archive}>
          {byMonth.map(({ key, label, items }) => (
            <section key={key} className={styles.monthBlock}>
              <h2 className={styles.monthTitle}>{label}</h2>
              <ul className={styles.entryList}>
                {items.map((e) => (
                  <li key={e.id}>
                    <Link href={`/evidencias/${e.slug}`} className={styles.entryLink}>
                      <time className={styles.entryDate} dateTime={e.fecha}>
                        {formatDate(e.fecha)}
                      </time>
                      <span className={styles.entryTitle}>{e.titulo}</span>
                      <span className={styles.entrySemana}>Semana {e.semana}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
