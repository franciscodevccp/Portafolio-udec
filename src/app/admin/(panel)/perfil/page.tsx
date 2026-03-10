import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PerfilForm from "@/components/admin/PerfilForm";
import type { Perfil } from "@/types/database";
import styles from "./page.module.css";

export default async function AdminPerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Mi Perfil</h1>
      <p className={styles.subtitle}>
        Editar datos de “Sobre mí”.
      </p>
      <PerfilForm perfil={(perfil as Perfil | null) ?? null} />
    </div>
  );
}
