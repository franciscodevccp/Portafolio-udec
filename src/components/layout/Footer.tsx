import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.wrap}>
        <p className={styles.copy}>
          © {year} ePortfolio — FAUG UdeC
        </p>
        <Link href="/admin/login" className={styles.adminLink}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
