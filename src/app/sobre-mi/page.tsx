import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "@/types/database";
import Image from "next/image";
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

export default async function SobreMiPage() {
  const perfil = await getPerfil();

  if (!perfil) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Sobre mí</h1>
        <p className={styles.empty}>
          Aún no hay datos de perfil. El autor puede completarlos desde el panel de administración.
        </p>
      </div>
    );
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        {perfil.foto_url && (
          <div className={styles.fotoWrap}>
            <Image
              src={perfil.foto_url}
              alt={perfil.nombre}
              width={180}
              height={180}
              className={styles.foto}
            />
          </div>
        )}
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>Sobre mí</span>
          <h1 className={styles.title}>{perfil.nombre}</h1>
          {perfil.nivel_formacion && (
            <p className={styles.subtitle}>{perfil.nivel_formacion}</p>
          )}
          {perfil.edad != null && (
            <p className={styles.meta}>Edad: {perfil.edad} años</p>
          )}
        </div>
      </header>

      <div className={styles.sections}>
        {perfil.intereses && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Intereses</h2>
            <div className={styles.content}>{perfil.intereses}</div>
          </section>
        )}
        {perfil.gustos && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Gustos</h2>
            <div className={styles.content}>{perfil.gustos}</div>
          </section>
        )}
        {perfil.datos_relevantes && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Otros datos relevantes</h2>
            <div className={styles.content}>{perfil.datos_relevantes}</div>
          </section>
        )}
      </div>
    </article>
  );
}
