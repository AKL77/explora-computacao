import { useId, useState } from "react";

import {
  materialTypeGroups,
  materialTypeOptions,
  type MaterialType,
} from "@/domain/materialType";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { MaterialFilterField } from "./MaterialFilterField";
import styles from "../pages/TeachingPathPage.module.css";

interface MaterialTypeFilterProps {
  selected: readonly MaterialType[];
  onChange: (types: MaterialType[]) => void;
}

export function MaterialTypeFilter({ selected, onChange }: MaterialTypeFilterProps) {
  const [open, setOpen] = useState(false);
  const groupId = useId();
  const selectedLabels = selected.map((type) => materialTypeOptions.find((option) => option.id === type)!.label);

  return (
    <div className={styles.tagGroup}>
      <MaterialFilterField
        label="Tipo de material"
        ariaLabel="Ver opções de tipos de material"
        value={selected.length === 0 ? "Todos" : selected.length === 1 ? selectedLabels[0] : `${selected.length} tipos`}
        description={selectedLabels.join(", ") || "Todos"}
        active={selected.length > 0}
        onClick={() => setOpen(true)}
      />
      <AccessibleDialog
        open={open}
        title="Selecionar tipos de material"
        onClose={() => setOpen(false)}
      >
        {open && <div className={styles.typeDialogContent}>
          <div className={styles.keywordGroups}>
            {materialTypeGroups.map((group, index) => (
              <section
                className={styles.keywordGroup}
                key={group.label}
                aria-labelledby={`${groupId}-${index}`}
              >
                <h3 className={styles.keywordGroupTitle} id={`${groupId}-${index}`}>{group.label}</h3>
                <div className={styles.keywordOptions}>
                  {group.types.map((type) => (
                    <button
                      className={`${styles.filterTag} ${styles.keywordOption}`}
                      key={type}
                      type="button"
                      aria-pressed={selected.includes(type)}
                      onClick={() => onChange(selected.includes(type)
                        ? selected.filter((value) => value !== type)
                        : [...selected, type])}
                    >
                      {materialTypeOptions.find((option) => option.id === type)!.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className={styles.keywordDialogActions}>
            <button type="button" disabled={selected.length === 0} onClick={() => onChange([])}>
              Limpar tipos
            </button>
            <button type="button" onClick={() => setOpen(false)}>Concluir</button>
          </div>
        </div>}
      </AccessibleDialog>
    </div>
  );
}
