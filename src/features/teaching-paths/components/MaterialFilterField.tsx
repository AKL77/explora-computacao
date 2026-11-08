import { useId } from "react";
import { ChevronDown } from "lucide-react";
import styles from "../pages/TeachingPathPage.module.css";

export function MaterialFilterField({ label, ariaLabel, value, description = value, active, onClick }: {
  label: string;
  ariaLabel: string;
  value: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}) {
  const descriptionId = useId();
  return <>
    <span className={styles.tagLabel}>{label}</span>
    <button
      className={`${styles.filterFieldButton} ${active ? styles.filterFieldActive : ""}`}
      type="button"
      aria-label={ariaLabel}
      aria-describedby={descriptionId}
      aria-haspopup="dialog"
      title={description}
      onClick={onClick}
    >
      <span>{value}</span><ChevronDown size={17} aria-hidden="true" />
    </button>
    <span id={descriptionId} className="sr-only">{description}</span>
  </>;
}
