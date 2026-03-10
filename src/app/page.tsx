import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Perfil, Introduccion, Asignatura } from "@/types/database";
import styles from "./page.module.css";

async function getPerfil(): Promise<Perfil | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("perfiles")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data as Perfil | null;
}

async function getIntroduccion(): Promise<Introduccion | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("introducciones")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data as Introduccion | null;
}

async function getAsignatura(): Promise<Asignatura | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("asignaturas")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data as Asignatura | null;
}

async function getEvidencias() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("evidencias")
    .select("id, titulo, slug, fecha, semana, contenido")
    .eq("publicada", true)
    .order("fecha", { ascending: false });
  return (data ?? []) as { id: string; titulo: string; slug: string; fecha: string; semana: number; contenido: string }[];
}

async function getEvaluaciones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("evaluaciones")
    .select("id, titulo, slug, fecha, calificacion")
    .order("fecha", { ascending: false });
  return data ?? [];
}

async function getReflexiones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reflexiones")
    .select("id, titulo, slug, tipo, fecha")
    .eq("publicada", true)
    .order("fecha", { ascending: false });
  return data ?? [];
}

async function getCommentCounts(): Promise<{
  evidencia: Record<string, number>;
  evaluacion: Record<string, number>;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comentarios")
    .select("evidencia_id, evaluacion_id");
  const rows = data ?? [];
  const evidencia: Record<string, number> = {};
  const evaluacion: Record<string, number> = {};
  for (const r of rows) {
    if (r.evidencia_id) {
      evidencia[r.evidencia_id] = (evidencia[r.evidencia_id] ?? 0) + 1;
    }
    if (r.evaluacion_id) {
      evaluacion[r.evaluacion_id] = (evaluacion[r.evaluacion_id] ?? 0) + 1;
    }
  }
  return { evidencia, evaluacion };
}

const TIPO_REFLEXION_LABEL: Record<string, string> = {
  PROYECTO: "Sobre mis proyectos",
  EVALUACION: "Sobre mis evaluaciones",
  PORTFOLIO: "Sobre mi portfolio",
  FINAL: "Reflexión final",
};

const TIPO_REFLEXION_ORDER = ["PROYECTO", "EVALUACION", "PORTFOLIO", "FINAL"] as const;

export default async function Home() {
  const [perfil, introduccion, asignatura, evidencias, evaluaciones, reflexiones, commentCounts] = await Promise.all([
    getPerfil(),
    getIntroduccion(),
    getAsignatura(),
    getEvidencias(),
    getEvaluaciones(),
    getReflexiones(),
    getCommentCounts(),
  ]);

  const nombre = perfil?.nombre ?? "Estudiante";
  const subtitulo = perfil?.nivel_formacion
    ? `${perfil.nivel_formacion} · UdeC`
    : "Arquitectura FAUG · UdeC";

  const reflexionesPorTipo = TIPO_REFLEXION_ORDER.map((tipo) => ({
    tipo,
    label: TIPO_REFLEXION_LABEL[tipo],
    items: reflexiones.filter((r) => r.tipo === tipo),
  }));

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} id="inicio">
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
        </div>
      </section>

      {/* Sobre mí — todo en la misma página */}
      <section className={styles.blogBlock} id="sobre-mi">
        <h2 className={styles.blogBlockTitle}>Sobre mí</h2>
        <p className={styles.blogBlockDesc}>Identificación del autor</p>
        {!perfil ? (
          <p className={styles.empty}>Aún no hay datos de perfil.</p>
        ) : (
          <div className={styles.blogContent}>
            <header className={styles.blogHeader}>
              {perfil.foto_url && (
                <div className={styles.fotoWrap}>
                  <Image
                    src={perfil.foto_url}
                    alt={perfil.nombre}
                    width={140}
                    height={140}
                    className={styles.foto}
                  />
                </div>
              )}
              <div className={styles.blogHeaderText}>
                <h3 className={styles.blogName}>{perfil.nombre}</h3>
                {perfil.nivel_formacion && <p className={styles.blogMeta}>{perfil.nivel_formacion}</p>}
                {perfil.edad != null && <p className={styles.blogMeta}>Edad: {perfil.edad} años</p>}
              </div>
            </header>
            {[perfil.intereses, perfil.gustos, perfil.datos_relevantes].some(Boolean) && (
              <div className={styles.blogSections}>
                {perfil.intereses && (
                  <div className={styles.blogSection}>
                    <h4 className={styles.blogSectionTitle}>Intereses</h4>
                    <div className={styles.blogText}>{perfil.intereses}</div>
                  </div>
                )}
                {perfil.gustos && (
                  <div className={styles.blogSection}>
                    <h4 className={styles.blogSectionTitle}>Gustos</h4>
                    <div className={styles.blogText}>{perfil.gustos}</div>
                  </div>
                )}
                {perfil.datos_relevantes && (
                  <div className={styles.blogSection}>
                    <h4 className={styles.blogSectionTitle}>Otros datos relevantes</h4>
                    <div className={styles.blogText}>{perfil.datos_relevantes}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Introducción */}
      <section className={styles.blogBlock} id="introduccion">
        <h2 className={styles.blogBlockTitle}>Introducción</h2>
        <p className={styles.blogBlockDesc}>Sentido y objetivos del portfolio</p>
        {!introduccion ? (
          <p className={styles.empty}>Aún no hay introducción.</p>
        ) : (
          <div className={styles.blogContent}>
            <div className={styles.blogSection}>
              <h4 className={styles.blogSectionTitle}>Sentido del portfolio</h4>
              <div className={styles.blogText}>{introduccion.sentido_portfolio}</div>
            </div>
            <div className={styles.blogSection}>
              <h4 className={styles.blogSectionTitle}>Objetivos del eportfolio</h4>
              <div className={styles.blogText}>{introduccion.objetivos}</div>
            </div>
            {introduccion.experiencias_previas && (
              <div className={styles.blogSection}>
                <h4 className={styles.blogSectionTitle}>Experiencias previas de aprendizaje</h4>
                <div className={styles.blogText}>{introduccion.experiencias_previas}</div>
              </div>
            )}
            {introduccion.expectativas && (
              <div className={styles.blogSection}>
                <h4 className={styles.blogSectionTitle}>Expectativas</h4>
                <div className={styles.blogText}>{introduccion.expectativas}</div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Asignatura */}
      <section className={styles.blogBlock} id="asignatura">
        <h2 className={styles.blogBlockTitle}>Asignatura</h2>
        <p className={styles.blogBlockDesc}>Programa y planificación</p>
        {!asignatura ? (
          <p className={styles.empty}>Aún no hay información de la asignatura.</p>
        ) : (
          <div className={styles.blogContent}>
            {asignatura.archivo_url && (
              <p className={styles.docLinkWrap}>
                <a
                  href={asignatura.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docLink}
                >
                  Descargar programa (PDF)
                </a>
              </p>
            )}
            {asignatura.programa && (
              <div className={styles.blogSection}>
                <h4 className={styles.blogSectionTitle}>Programa</h4>
                <div className={styles.blogText}>{asignatura.programa}</div>
              </div>
            )}
            {asignatura.planificacion && (
              <div className={styles.blogSection}>
                <h4 className={styles.blogSectionTitle}>Planificación</h4>
                <div className={styles.blogText}>{asignatura.planificacion}</div>
              </div>
            )}
            {asignatura.normas && (
              <div className={styles.blogSection}>
                <h4 className={styles.blogSectionTitle}>Normas para su desarrollo</h4>
                <div className={styles.blogText}>{asignatura.normas}</div>
              </div>
            )}
            {asignatura.otros && (
              <div className={styles.blogSection}>
                <h4 className={styles.blogSectionTitle}>Otros</h4>
                <div className={styles.blogText}>{asignatura.otros}</div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Evidencias — listado en la misma página con carrusel si hay muchas */}
      <section className={styles.blogBlock} id="evidencias">
        <h2 className={styles.blogBlockTitle}>Evidencias</h2>
        <p className={styles.blogBlockDesc}>Entradas semanales del portfolio</p>
        {evidencias.length === 0 ? (
          <p className={styles.empty}>Aún no hay evidencias publicadas.</p>
        ) : (
          <div className={styles.carouselWrap} role="region" aria-label="Carrusel de evidencias">
            <ul className={styles.evidenciaGridCarousel}>
              {evidencias.map((e) => {
                const numComentarios = commentCounts.evidencia[e.id] ?? 0;
                return (
                  <li key={e.id}>
                    <Link href={`/evidencias/${e.slug}`} className={styles.evidenciaCard}>
                      <span className={styles.evidenciaSemana}>Semana {e.semana}</span>
                      <h3 className={styles.evidenciaTitle}>{e.titulo}</h3>
                      {e.contenido && (
                        <p className={styles.evidenciaExtracto}>
                          {e.contenido.replace(/<[^>]*>/g, "").trim().slice(0, 120)}
                          {e.contenido.replace(/<[^>]*>/g, "").trim().length > 120 ? "…" : ""}
                        </p>
                      )}
                      <time className={styles.evidenciaFecha} dateTime={e.fecha}>
                        {formatDate(e.fecha)}
                      </time>
                      {numComentarios > 0 && (
                        <span className={styles.evidenciaComentarios}>
                          {numComentarios} comentario{numComentarios !== 1 ? "s" : ""}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Evaluación */}
      <section className={styles.blogBlock} id="evaluacion">
        <h2 className={styles.blogBlockTitle}>Evaluación</h2>
        <p className={styles.blogBlockDesc}>Criterios, escalas y calificaciones</p>
        {evaluaciones.length === 0 ? (
          <p className={styles.empty}>Aún no hay evaluaciones publicadas.</p>
        ) : (
          <div className={styles.carouselWrap} role="region" aria-label="Carrusel de evaluaciones">
            <ul className={styles.evidenciaGridCarousel}>
              {evaluaciones.map((e) => {
                const numComentarios = commentCounts.evaluacion[e.id] ?? 0;
                return (
                  <li key={e.id}>
                    <Link href={`/evaluacion/${e.slug}`} className={styles.evidenciaCard}>
                      <span className={styles.evidenciaSemana}>
                        {e.calificacion != null ? `Calificación: ${e.calificacion}` : "Evaluación"}
                      </span>
                      <h3 className={styles.evidenciaTitle}>{e.titulo}</h3>
                      <time className={styles.evidenciaFecha} dateTime={e.fecha}>
                        {formatDate(e.fecha)}
                      </time>
                      {numComentarios > 0 && (
                        <span className={styles.evidenciaComentarios}>
                          {numComentarios} comentario{numComentarios !== 1 ? "s" : ""}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Reflexiones */}
      <section className={styles.blogBlock} id="reflexiones">
        <h2 className={styles.blogBlockTitle}>Reflexiones</h2>
        <p className={styles.blogBlockDesc}>Proceso de aprendizaje</p>
        {reflexiones.length === 0 ? (
          <p className={styles.empty}>Aún no hay reflexiones publicadas.</p>
        ) : (
          <div className={styles.reflexionesSections}>
            {reflexionesPorTipo.map(
              ({ tipo, label, items }) =>
                items.length > 0 && (
                  <div key={tipo} className={styles.reflexionesGroup}>
                    <h4 className={styles.reflexionesGroupTitle}>{label}</h4>
                    <ul className={styles.reflexionesList}>
                      {items.map((r) => (
                        <li key={r.id}>
                          <Link href={`/reflexiones/${r.slug}`} className={styles.reflexionCard}>
                            <span className={styles.reflexionCardTitle}>{r.titulo}</span>
                            <time className={styles.reflexionCardDate} dateTime={r.fecha}>
                              {formatDate(r.fecha)}
                            </time>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
