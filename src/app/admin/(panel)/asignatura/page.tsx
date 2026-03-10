import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AsignaturaForm from "@/components/admin/AsignaturaForm";
import styles from "./page.module.css";

export default async function AdminAsignaturaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: rows } = await supabase
    .from("asignaturas")
    .select("*")
    .limit(1);
  const asignatura = rows?.[0] ?? null;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Asignatura</h1>
      <p className={styles.subtitle}>
        Editar programa y planificación.
      </p>
      <AsignaturaForm asignatura={asignatura} />
    </div>
  );
}
