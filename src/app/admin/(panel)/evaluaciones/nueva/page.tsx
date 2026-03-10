import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EvaluacionForm from "@/components/admin/EvaluacionForm";
import styles from "./page.module.css";

export default async function AdminEvaluacionesNuevaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Nueva evaluación</h1>
      <p className={styles.subtitle}>
        Antecedentes, criterios, escalas, metodología, calificación y reflexión sobre la evaluación.
      </p>
      <EvaluacionForm />
    </div>
  );
}
