"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Completa email y contraseña");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos"
        : error.message);
      return;
    }
    toast.success("Sesión iniciada");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mascotTopLeft} aria-hidden>
        <Image
          src="/img/snupi3.png"
          alt=""
          width={120}
          height={120}
          className={styles.mascotImgTop}
        />
      </div>
      <div className={styles.mascotTopRight} aria-hidden>
        <Image
          src="/img/charlie.png"
          alt=""
          width={120}
          height={120}
          className={styles.mascotImgTop}
        />
      </div>
      <div className={styles.mascotLeft} aria-hidden>
        <Image
          src="/img/snopi2.png"
          alt=""
          width={160}
          height={160}
          className={styles.mascotImg}
        />
      </div>
      <div className={styles.mascotRight} aria-hidden>
        <Image
          src="/img/snupi1.png"
          alt=""
          width={160}
          height={160}
          className={styles.mascotImg}
        />
      </div>
      <div className={styles.card}>
        <Link href="/" className={styles.back}>
          ← Volver al inicio
        </Link>
        <div className={styles.accent} aria-hidden />
        <div className={styles.inner}>
          <h1 className={styles.title}>Hola, entra a tu espacio</h1>
          <p className={styles.subtitle}>Cuéntanos quién eres para seguir</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="tu@udec.cl"
              required
              disabled={loading}
            />
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={loading}
            />
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
