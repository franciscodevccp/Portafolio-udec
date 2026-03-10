"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  disabled?: boolean;
  "aria-label"?: string;
}

export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  disabled = false,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? "";

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    const i = options.findIndex((o) => o.value === value);
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (i >= 0) {
        onChange(options[i].value);
        setOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown" && i < options.length - 1) {
      e.preventDefault();
      onChange(options[i + 1].value);
      return;
    }
    if (e.key === "ArrowUp" && i > 0) {
      e.preventDefault();
      onChange(options[i - 1].value);
      return;
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.wrap} ${open ? styles.wrapOpen : ""} ${disabled ? styles.wrapDisabled : ""}`}
    >
      <button
        type="button"
        id={id}
        className={styles.trigger}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : id ? `${id}-label` : undefined}
      >
        <span className={styles.triggerLabel}>{displayLabel}</span>
        <span className={styles.chevron} aria-hidden>▼</span>
      </button>
      {open && (
        <ul
          className={styles.list}
          role="listbox"
          aria-activedescendant={value ? `${id ?? "select"}-opt-${value}` : undefined}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              id={`${id ?? "select"}-opt-${opt.value}`}
              role="option"
              aria-selected={opt.value === value}
              className={`${styles.option} ${opt.value === value ? styles.optionSelected : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
