import slugifyLib from "slugify";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: "es" });
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
}

/** Fecha de hoy en zona local (YYYY-MM-DD) para inputs tipo date */
export function todayLocal(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** ISO o Date a YYYY-MM-DD para input date */
export function toDateInputValue(date: Date | string): string {
  return format(new Date(date), "yyyy-MM-dd");
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

/** Semana actual del semestre (fecha de inicio por defecto: 9 mar 2026) */
export function getSemanaActual(
  fechaInicio: Date = new Date("2026-03-09")
): number {
  const hoy = new Date();
  const diff = hoy.getTime() - fechaInicio.getTime();
  return Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}
