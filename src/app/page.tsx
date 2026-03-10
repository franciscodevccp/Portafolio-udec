import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSemanaActual, formatDate } from "@/lib/utils";
import type { Perfil } from "@/types/database";
import styles from "./page.module.css";

async function getPerfil(): Promise<Perfil | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("perfiles")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}

async function getUltimasEvidencias() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("evidencias")
    .select("id, titulo, slug, fecha, semana, contenido")
    .eq("publicada", true)
    .order("fecha", { ascending: false })
    .limit(3);
  return (data ?? []) as { id: string; titulo: string; slug: string; fecha: string; semana: number; contenido: string }[];
}

export default async function Home() {
  const [perfil, evidencias] = await Promise.all([
    getPerfil(),
    getUltimasEvidencias(),
  ]);
  const semanaActual = getSemanaActual();

  const nombre = perfil?.nombre ?? "Estudiante";
  const subtitulo = perfil?.nivel_formacion
    ? `${perfil.nivel_formacion} · UdeC`
    : "Arquitectura FAUG · UdeC";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroAccent} aria-hidden />
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Portfolio de aprendizaje</span>
            <h1 className={styles.heroTitle}>{nombre}</h1>
            <p className={styles.heroSubtitle}>{subtitulo}</p>
            <span className={styles.heroLine} aria-hidden />
            <p className={styles.heroDesc}>
              Evidencias y reflexiones del semestre — FAUG UdeC.
            </p>
          </div>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeLabel}>Semana</span>
            <span className={styles.heroBadgeNum}>{semanaActual}</span>
            <span className={styles.heroBadgeSuffix}>del semestre</span>
          </div>
        </div>
      </section>

      <section className={styles.sections}>
        <div className={styles.sectionsHeader}>
          <span className={styles.sectionsEyebrow}>Secciones</span>
          <h2 className={styles.sectionTitle}>Navegación</h2>
          <span className={styles.sectionLine} aria-hidden />
        </div>
        <nav className={styles.sectionGrid} aria-label="Secciones principales">
          <Link href="/sobre-mi" className={styles.sectionCard}>
            <span className={styles.sectionCardAccent} aria-hidden />
            <span className={styles.sectionCardTitle}>Sobre mí</span>
            <span className={styles.sectionCardDesc}>Identificación del autor</span>
          </Link>
          <Link href="/introduccion" className={styles.sectionCard}>
            <span className={styles.sectionCardAccent} aria-hidden />
            <span className={styles.sectionCardTitle}>Introducción</span>
            <span className={styles.sectionCardDesc}>Sentido y objetivos del portfolio</span>
          </Link>
          <Link href="/asignatura" className={styles.sectionCard}>
            <span className={styles.sectionCardAccent} aria-hidden />
            <span className={styles.sectionCardTitle}>Asignatura</span>
            <span className={styles.sectionCardDesc}>Programa y planificación</span>
          </Link>
          <Link href="/evidencias" className={styles.sectionCard}>
            <span className={styles.sectionCardAccent} aria-hidden />
            <span className={styles.sectionCardTitle}>Evidencias</span>
            <span className={styles.sectionCardDesc}>Entradas semanales</span>
          </Link>
          <Link href="/evaluacion" className={styles.sectionCard}>
            <span className={styles.sectionCardAccent} aria-hidden />
            <span className={styles.sectionCardTitle}>Evaluación</span>
            <span className={styles.sectionCardDesc}>Criterios y calificaciones</span>
          </Link>
          <Link href="/reflexiones" className={styles.sectionCard}>
            <span className={styles.sectionCardAccent} aria-hidden />
            <span className={styles.sectionCardTitle}>Reflexiones</span>
            <span className={styles.sectionCardDesc}>Proceso de aprendizaje</span>
          </Link>
        </nav>
      </section>

      <section className={styles.evidencias}>
        <h2 className={styles.sectionTitle}>Últimas evidencias</h2>
        {evidencias.length === 0 ? (
          <p className={styles.empty}>
            Aún no hay evidencias publicadas. Cuando las agregues desde el panel
            admin, aparecerán aquí.
          </p>
        ) : (
          <ul className={styles.evidenciaGrid}>
            {evidencias.map((e) => (
              <li key={e.id}>
                <Link href={`/evidencias/${e.slug}`} className={styles.evidenciaCard}>
                  <span className={styles.evidenciaSemana}>Semana {e.semana}</span>
                  <h3 className={styles.evidenciaTitle}>{e.titulo}</h3>
                  <time className={styles.evidenciaFecha} dateTime={e.fecha}>
                    {formatDate(e.fecha)}
                  </time>
                  {e.contenido && (
                    <p className={styles.evidenciaExtracto}>
                      {e.contenido.replace(/<[^>]*>/g, "").trim().slice(0, 120)}
                      {e.contenido.replace(/<[^>]*>/g, "").trim().length > 120 ? "…" : ""}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {evidencias.length > 0 && (
          <p className={styles.verMas}>
            <Link href="/evidencias">Ver todas las evidencias →</Link>
          </p>
        )}
      </section>
    </div>
  );
}
