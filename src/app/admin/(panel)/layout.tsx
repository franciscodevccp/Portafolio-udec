import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanelShell from "@/components/layout/AdminPanelShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminPanelShell>{children}</AdminPanelShell>;
}
