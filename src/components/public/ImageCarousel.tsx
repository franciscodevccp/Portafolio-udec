"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ImageCarousel.module.css";

export interface CarouselImage {
  id: string;
  url: string;
  descripcion: string | null;
}

export default function ImageCarousel({ images }: { images: CarouselImage[] }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const slide = el.querySelector(`[data-index="${index}"]`);
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <figure className={styles.single}>
        <Image
          src={images[0].url}
          alt={images[0].descripcion ?? "Imagen de la evidencia"}
          width={1200}
          height={800}
          className={styles.img}
          sizes="(max-width: 760px) 100vw, 760px"
        />
        {images[0].descripcion && (
          <figcaption className={styles.caption}>{images[0].descripcion}</figcaption>
        )}
      </figure>
    );
  }

  const goPrev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className={styles.carousel} role="region" aria-label="Carrusel de imágenes">
      <div className={styles.track} ref={containerRef}>
        {images.map((img, i) => (
          <div
            key={img.id}
            data-index={i}
            className={styles.slide}
            aria-hidden={i !== index}
          >
            <Image
              src={img.url}
              alt={img.descripcion ?? `Imagen ${i + 1} de la evidencia`}
              width={1200}
              height={800}
              className={styles.img}
              sizes="(max-width: 760px) 100vw, 760px"
            />
            {img.descripcion && (
              <figcaption className={styles.caption}>{img.descripcion}</figcaption>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className={styles.btnPrev}
        onClick={goPrev}
        aria-label="Imagen anterior"
      >
        ‹
      </button>
      <button
        type="button"
        className={styles.btnNext}
        onClick={goNext}
        aria-label="Siguiente imagen"
      >
        ›
      </button>
      <div className={styles.dots}>
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? styles.dotActive : styles.dot}
            onClick={() => setIndex(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
