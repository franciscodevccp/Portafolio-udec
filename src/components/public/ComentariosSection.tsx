"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import type { Comentario } from "@/types/database";
import ComentarioForm from "./ComentarioForm";
import styles from "./ComentariosSection.module.css";

interface Props {
  evaluacionId?: string;
  evidenciaId?: string;
  comentarios: Comentario[];
}

export default function ComentariosSection({
  evaluacionId,
  evidenciaId,
  comentarios,
}: Props) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const useCarousel = comentarios.length >= 2;

  const scrollCarousel = (direction: "prev" | "next") => {
    const el = carouselRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: direction === "prev" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className={styles.section} aria-label="Comentarios">
      <h2 className={styles.title}>Comentarios</h2>

      {comentarios.length > 0 && (
        <>
          {useCarousel ? (
            <div className={styles.carouselWrap}>
              <button
                type="button"
                className={styles.carouselBtn}
                onClick={() => scrollCarousel("prev")}
                aria-label="Comentarios anteriores"
              >
                ‹
              </button>
              <div
                ref={carouselRef}
                className={styles.carousel}
                role="list"
                aria-label="Lista de comentarios"
              >
                {comentarios.map((c) => (
                  <article
                    key={c.id}
                    className={styles.carouselItem}
                    role="listitem"
                  >
                    <div className={styles.itemHeader}>
                      <span className={styles.autor}>{c.autor}</span>
                      {c.es_profesor && (
                        <span className={styles.badge}>Profesor/a</span>
                      )}
                      <time className={styles.time} dateTime={c.created_at}>
                        {timeAgo(c.created_at)}
                      </time>
                    </div>
                    <p className={styles.contenido}>{c.contenido}</p>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className={styles.carouselBtn}
                onClick={() => scrollCarousel("next")}
                aria-label="Siguientes comentarios"
              >
                ›
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {comentarios.map((c) => (
                <li key={c.id} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <span className={styles.autor}>{c.autor}</span>
                    {c.es_profesor && (
                      <span className={styles.badge}>Profesor/a</span>
                    )}
                    <time className={styles.time} dateTime={c.created_at}>
                      {timeAgo(c.created_at)}
                    </time>
                  </div>
                  <p className={styles.contenido}>{c.contenido}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ComentarioForm
        evaluacionId={evaluacionId}
        evidenciaId={evidenciaId}
        onSuccess={() => router.refresh()}
      />
    </section>
  );
}
