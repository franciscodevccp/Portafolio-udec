import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSemanaActual } from "@/lib/utils";
import {
  HiOutlinePhotograph,
  HiOutlineLightBulb,
  HiOutlineChat,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
} from "react-icons/hi";
import styles from "./dashboard.module.css";

const EVIDENCIAS_ESPERADAS = 17;

async function getStats() {
  const supabase = await createClient();
  const [evidenciasRes, reflexionesRes, comentariosRes] = await Promise.all([
    supabase.from("evidencias").select("*", { count: "exact", head: true }),
    supabase.from("reflexiones").select("*", { count: "exact", head: true }),
    supabase.from("comentarios").select("id, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  return {
    totalEvidencias: evidenciasRes.count ?? 0,
    totalReflexiones: reflexionesRes.count ?? 0,
    comentariosRecientes: comentariosRes.data ?? [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const semanaActual = getSemanaActual();
  const progresoEvidencias = Math.min(100, Math.round((stats.totalEvidencias / EVIDENCIAS_ESPERADAS) * 100));

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de administración</h1>
        <p className={styles.subtitle}>
          Semana <strong>{semanaActual}</strong> del semestre
        </p>
      </header>

      <section className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardIcon}>
            <HiOutlinePhotograph aria-hidden />
          </span>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Evidencias</h2>
            <p className={styles.cardValue}>
              {stats.totalEvidencias} / {EVIDENCIAS_ESPERADAS}
            </p>
            <div className={styles.progress}>
              <div
                className={styles.progressBar}
                style={{ width: `${progresoEvidencias}%` }}
              />
            </div>
            <Link href="/admin/evidencias/nueva" className={styles.cardLink}>
              + Nueva evidencia
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.cardIcon}>
            <HiOutlineLightBulb aria-hidden />
          </span>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Reflexiones</h2>
            <p className={styles.cardValue}>{stats.totalReflexiones}</p>
            <Link href="/admin/reflexiones/nueva" className={styles.cardLink}>
              + Nueva reflexión
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.cardIcon}>
            <HiOutlineChat aria-hidden />
          </span>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Comentarios recientes</h2>
            <p className={styles.cardValue}>{stats.comentariosRecientes.length}</p>
            <Link href="/admin/comentarios" className={styles.cardLink}>
              Ver comentarios
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Accesos directos</h2>
        <div className={styles.linksGrid}>
          <Link href="/admin/perfil" className={styles.quickLink}>
            <HiOutlineUser className={styles.quickLinkIcon} /> Editar perfil
          </Link>
          <Link href="/admin/introduccion" className={styles.quickLink}>
            <HiOutlineDocumentText className={styles.quickLinkIcon} /> Editar introducción
          </Link>
          <Link href="/admin/asignatura" className={styles.quickLink}>
            <HiOutlineAcademicCap className={styles.quickLinkIcon} /> Editar asignatura
          </Link>
          <Link href="/admin/evidencias" className={styles.quickLink}>
            <HiOutlinePhotograph className={styles.quickLinkIcon} /> Ver evidencias
          </Link>
          <Link href="/admin/evaluaciones" className={styles.quickLink}>
            <HiOutlineClipboardList className={styles.quickLinkIcon} /> Ver evaluaciones
          </Link>
          <Link href="/admin/reflexiones" className={styles.quickLink}>
            <HiOutlineLightBulb className={styles.quickLinkIcon} /> Ver reflexiones
          </Link>
        </div>
      </section>
    </div>
  );
}
