import { useState } from "react";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { MaterialFilterField } from "./MaterialFilterField";
import styles from "../pages/TeachingPathPage.module.css";

export function MaterialChoiceFilter<T extends string | number>({ label, ariaLabel, title, countLabel, clearLabel, options, selected, onChange }: {
  label: string;
  ariaLabel: string;
  title: string;
  countLabel: string;
  clearLabel: string;
  options: readonly { value: T; label: string; summaryLabel?: string }[];
  selected: readonly T[];
  onChange: (values: T[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const chosen = options.filter((option) => selected.includes(option.value));
  const value = chosen.length === 0 ? "Todos" : chosen.length === 1
    ? chosen[0].summaryLabel ?? chosen[0].label : `${chosen.length} ${countLabel}`;

  return <div className={styles.tagGroup}>
    <MaterialFilterField label={label} ariaLabel={ariaLabel} value={value} description={chosen.length ? chosen.map((option) => option.label).join(", ") : "Todos"} active={chosen.length > 0} onClick={() => setOpen(true)} />
    <AccessibleDialog open={open} title={title} onClose={() => setOpen(false)} size="small">
      {open && <div className={styles.choiceFilterDialog}>
        <div className={styles.keywordOptions} role="group" aria-label={label}>
          {options.map((option) => <button
            className={`${styles.filterTag} ${styles.keywordOption}`}
            key={option.value}
            type="button"
            aria-pressed={selected.includes(option.value)}
            onClick={() => onChange(selected.includes(option.value) ? selected.filter((value) => value !== option.value) : [...selected, option.value])}
          >{option.label}</button>)}
        </div>
        <div className={styles.keywordDialogActions}>
          <button type="button" disabled={chosen.length === 0} onClick={() => onChange([])}>{clearLabel}</button>
          <button type="button" onClick={() => setOpen(false)}>Concluir</button>
        </div>
      </div>}
    </AccessibleDialog>
  </div>;
}
