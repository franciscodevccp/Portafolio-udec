import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReflexionForm from "@/components/admin/ReflexionForm";
import styles from "./page.module.css";

export default async function AdminReflexionesNuevaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Nueva reflexión</h1>
      <p className={styles.subtitle}>
        Reflexiones sobre proyectos, evaluaciones, portfolio o reflexión final.
      </p>
      <ReflexionForm />
    </div>
  );
}
