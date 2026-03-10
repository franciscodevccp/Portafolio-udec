"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import SecondaryNav from "./SecondaryNav";
import Footer from "./Footer";
import styles from "./PublicLayout.module.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  const isHome = pathname === "/";

  return (
    <div className={styles.wrapper}>
      <Navbar />
      {!isHome && <SecondaryNav />}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
