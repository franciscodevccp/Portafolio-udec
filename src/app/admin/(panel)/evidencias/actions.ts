"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function eliminarEvidencia(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase.from("evidencias").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/evidencias");
  return { error: null };
}

export async function togglePublicadaEvidencia(id: string, publicada: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("evidencias")
    .update({ publicada })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/evidencias");
  return { error: null };
}
