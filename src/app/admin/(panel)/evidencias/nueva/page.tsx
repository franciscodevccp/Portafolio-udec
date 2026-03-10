import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSemanaActual } from "@/lib/utils";
import EvidenciaForm from "@/components/admin/EvidenciaForm";
import styles from "./page.module.css";

export default async function AdminEvidenciasNuevaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const semanaActual = getSemanaActual();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Nueva evidencia</h1>
      <p className={styles.subtitle}>
        Completa los datos de la evidencia. El slug se generará automáticamente a partir del título.
      </p>
      <EvidenciaForm defaultSemana={semanaActual} />
    </div>
  );
}
