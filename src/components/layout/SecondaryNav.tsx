"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SecondaryNav.module.css";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/introduccion", label: "Introducción" },
  { href: "/asignatura", label: "Asignatura" },
  { href: "/evidencias", label: "Evidencias" },
  { href: "/evaluacion", label: "Evaluación" },
  { href: "/reflexiones", label: "Reflexiones" },
] as const;

export default function SecondaryNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className={styles.nav} aria-label="Secciones del portfolio">
      <div className={styles.wrap}>
        {LINKS.map(({ href, label }) => {
          const isHome = href === "/";
          const isActive = isHome
            ? pathname === "/"
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? styles.linkActive : styles.link}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
