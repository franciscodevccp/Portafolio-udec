import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav} role="navigation">
      <div className={styles.wrap}>
        <Link href="/" className={styles.logo}>
          ePortfolio
        </Link>
      </div>
    </nav>
  );
}
