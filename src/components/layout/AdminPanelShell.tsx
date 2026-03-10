"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import styles from "./AdminPanelShell.module.css";

export default function AdminPanelShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`${styles.wrap} ${menuOpen ? styles.menuOpen : ""}`}>
      <button
        type="button"
        className={styles.hamburger}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Abrir menú de navegación"
        aria-expanded={menuOpen}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Cerrar menú"
        />
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
