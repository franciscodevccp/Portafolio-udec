import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EvidenciaForm from "@/components/admin/EvidenciaForm";
import type { Evidencia } from "@/types/database";
import styles from "../../page.module.css";

export default async function AdminEditarEvidenciaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("evidencias")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const evidencia = data as Evidencia;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Editar evidencia</h1>
      <p className={styles.subtitle}>
        Modifica los datos de la evidencia. Los medios ya subidos se mantienen; puedes añadir más.
      </p>
      <EvidenciaForm evidencia={evidencia} />
    </div>
  );
}
