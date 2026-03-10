"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  parse,
} from "date-fns";
import { es } from "date-fns/locale";
import styles from "./DatePicker.module.css";

const WEEKDAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

function toDate(str: string): Date | null {
  if (!str) return null;
  const d = parse(str, "yyyy-MM-dd", new Date());
  return isNaN(d.getTime()) ? null : d;
}

function toValue(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export default function DatePicker({
  value,
  onChange,
  id = "datepicker",
  disabled = false,
  placeholder = "Elegir fecha",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    value ? toDate(value) ?? new Date() : new Date()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value ? toDate(value) : null;
  const today = new Date();

  useEffect(() => {
    if (value && toDate(value)) {
      setViewMonth(toDate(value)!);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  function handleSelect(date: Date) {
    onChange(toValue(date));
    setOpen(false);
  }

  function handleHoy() {
    const hoy = new Date();
    onChange(toValue(hoy));
    setViewMonth(hoy);
    setOpen(false);
  }

  function handleBorrar() {
    onChange("");
    setOpen(false);
  }

  const displayText = value
    ? (() => {
        const parsed = toDate(value);
        return parsed ? format(parsed, "dd-MM-yyyy") : value;
      })()
    : "";

  return (
    <div className={styles.wrap} ref={containerRef}>
      <div className={styles.inputWrap}>
        <input
          type="text"
          id={id}
          value={displayText}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          onClick={() => !disabled && setOpen((o) => !o)}
          onFocus={() => !disabled && setOpen(true)}
        />
        <button
          type="button"
          className={styles.trigger}
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          tabIndex={-1}
          aria-label="Abrir calendario"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span className={styles.monthYear}>
              {format(viewMonth, "MMMM yyyy", { locale: es })}
            </span>
            <div className={styles.nav}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => setViewMonth((m) => subMonths(m, 1))}
                aria-label="Mes anterior"
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                aria-label="Mes siguiente"
              >
                ↓
              </button>
            </div>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((wd) => (
              <span key={wd} className={styles.weekday}>
                {wd}
              </span>
            ))}
          </div>

          <div className={styles.grid}>
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const isTodayDate = isToday(day);
              return (
                <button
                  key={day.getTime()}
                  type="button"
                  className={`${styles.day} ${!inMonth ? styles.dayOther : ""} ${isSelected ? styles.daySelected : ""} ${isTodayDate ? styles.dayToday : ""}`}
                  onClick={() => handleSelect(day)}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.footerBtn} onClick={handleBorrar}>
              Borrar
            </button>
            <button type="button" className={styles.footerBtn} onClick={handleHoy}>
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
