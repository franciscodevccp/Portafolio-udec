import { createClient } from "@/lib/supabase/server";
import type { Introduccion } from "@/types/database";
import styles from "./page.module.css";

async function getIntroduccion(): Promise<Introduccion | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("introducciones")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data as Introduccion | null;
}

export default async function IntroduccionPage() {
  const intro = await getIntroduccion();

  if (!intro) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Introducción</h1>
        <p className={styles.empty}>
          Aún no hay introducción. El autor puede completarla desde el panel de administración.
        </p>
      </div>
    );
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>Introducción</span>
          <h1 className={styles.title}>Introducción</h1>
          <p className={styles.subtitle}>Sentido y objetivos del portfolio</p>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sentido del portfolio</h2>
        <div className={styles.content}>{intro.sentido_portfolio}</div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Objetivos del eportfolio</h2>
        <div className={styles.content}>{intro.objetivos}</div>
      </section>

      {intro.experiencias_previas && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experiencias previas de aprendizaje</h2>
          <div className={styles.content}>{intro.experiencias_previas}</div>
        </section>
      )}

      {intro.expectativas && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Expectativas</h2>
          <div className={styles.content}>{intro.expectativas}</div>
        </section>
      )}
    </article>
  );
}
