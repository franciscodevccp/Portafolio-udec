import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import IntroduccionForm from "@/components/admin/IntroduccionForm";
import styles from "./page.module.css";

export default async function AdminIntroduccionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: rows } = await supabase
    .from("introducciones")
    .select("*")
    .limit(1);
  const introduccion = rows?.[0] ?? null;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Introducción</h1>
      <p className={styles.subtitle}>
        Editar sentido y objetivos del portfolio.
      </p>
      <IntroduccionForm introduccion={introduccion ?? null} />
    </div>
  );
}
