"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { eliminarEvidencia, togglePublicadaEvidencia } from "./actions";
import styles from "./page.module.css";

interface Props {
  id: string;
  publicada: boolean;
}

export default function EvidenciaRowActions({ id, publicada }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const { error } = await togglePublicadaEvidencia(id, !publicada);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(publicada ? "Evidencia despublicada" : "Evidencia publicada");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar esta evidencia? No se puede deshacer.")) return;
    setLoading(true);
    const { error } = await eliminarEvidencia(id);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Evidencia eliminada");
    router.refresh();
  }

  return (
    <td className={styles.td}>
      <div className={styles.actions}>
        <Link
          href={`/admin/evidencias/editar/${id}`}
          className={styles.actionBtnEditar}
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className={styles.actionBtn}
          title={publicada ? "Despublicar" : "Publicar"}
        >
          {publicada ? "Despublicar" : "Publicar"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className={styles.actionBtnDanger}
        >
          Eliminar
        </button>
      </div>
    </td>
  );
}
