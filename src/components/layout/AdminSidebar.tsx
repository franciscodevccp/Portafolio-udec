"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlinePhotograph,
  HiOutlineClipboardList,
  HiOutlineLightBulb,
  HiOutlineChat,
  HiOutlineExternalLink,
  HiOutlineLogout,
  HiOutlineX,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import styles from "./AdminSidebar.module.css";

const navItems: (
  | { href: string; label: string; icon: IconType }
  | {
      label: string;
      icon: IconType;
      children: { href: string; label: string }[];
    }
)[] = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineChartBar },
  { href: "/admin/perfil", label: "Mi Perfil", icon: HiOutlineUser },
  { href: "/admin/introduccion", label: "Introducción", icon: HiOutlineDocumentText },
  { href: "/admin/asignatura", label: "Asignatura", icon: HiOutlineAcademicCap },
  {
    label: "Evidencias",
    icon: HiOutlinePhotograph,
    children: [
      { href: "/admin/evidencias", label: "Listado" },
      { href: "/admin/evidencias/nueva", label: "+ Nueva evidencia" },
    ],
  },
  {
    label: "Evaluaciones",
    icon: HiOutlineClipboardList,
    children: [
      { href: "/admin/evaluaciones", label: "Listado" },
      { href: "/admin/evaluaciones/nueva", label: "+ Nueva evaluación" },
    ],
  },
  {
    label: "Reflexiones",
    icon: HiOutlineLightBulb,
    children: [
      { href: "/admin/reflexiones", label: "Listado" },
      { href: "/admin/reflexiones/nueva", label: "+ Nueva reflexión" },
    ],
  },
  { href: "/admin/comentarios", label: "Comentarios", icon: HiOutlineChat },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const closeMenu = () => onClose?.();

  return (
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.logo} onClick={closeMenu}>
          ePortfolio · Admin
        </Link>
        {open && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <HiOutlineX className={styles.closeIcon} />
          </button>
        )}
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          if ("children" in item) {
            const Icon = item.icon;
            return (
              <div key={item.label} className={styles.group}>
                <span className={styles.groupTitle}>
                  <Icon className={styles.navIcon} /> {item.label}
                </span>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`${styles.sublink} ${pathname === child.href ? styles.active : ""}`}
                    onClick={closeMenu}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            );
          }
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
              onClick={closeMenu}
            >
              <Icon className={styles.navIcon} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <Link href="/" className={styles.footerLink} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
          <HiOutlineExternalLink className={styles.navIcon} /> Ver sitio público
        </Link>
        <button type="button" onClick={handleSignOut} className={styles.signOut}>
          <HiOutlineLogout className={styles.navIcon} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
