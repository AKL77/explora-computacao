import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import type { Resource } from "@/domain/resource";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { TeachingMaterialBrowser } from "./TeachingMaterialBrowser";
import searchStyles from "../pages/TeachingPathPage.module.css";
import styles from "./TeachingPathMaterialPicker.module.css";

export function TeachingPathMaterialPicker({ resources, existingIds = [], creating, onClose, onConfirm, onSelectionChange }: {
  resources: Resource[];
  existingIds?: readonly string[];
  creating: boolean;
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
  onSelectionChange: (dirty: boolean) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggle = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id];
    setSelectedIds(next);
    onSelectionChange(next.length > 0);
  };

  return <AccessibleDialog open title={creating ? "Criar trilha · Selecionar materiais" : "Adicionar materiais à trilha"} size="wide" onClose={onClose}>
    <div className={styles.content}>
      <div className={styles.browser}>
        <TeachingMaterialBrowser resources={resources} linkToDetails={false} renderActions={({ resource }) => {
          const existing = existingIds.includes(resource.id);
          const selected = selectedIds.includes(resource.id);
          return <button
            className={existing ? searchStyles.existingTrailButton : searchStyles.newTrailButton}
            type="button"
            disabled={existing}
            aria-pressed={selected || existing}
            aria-label={`${existing ? "Já na trilha:" : selected ? "Desmarcar" : "Selecionar"} ${resource.title}`}
            onClick={() => toggle(resource.id)}
          >
            {existing || selected ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
            {existing ? "Já na trilha" : selected ? "Selecionado" : "Selecionar"}
          </button>;
        }} />
      </div>
      <footer className={styles.footer}>
        <div className={styles.selection}>
          <strong role="status" aria-live="polite">{selectedIds.length} {selectedIds.length === 1 ? "material selecionado" : "materiais selecionados"}</strong>
          {selectedIds.length > 0 && <ul aria-label="Materiais selecionados">
            {selectedIds.map((id) => <li key={id}>
              <span>{resources.find((resource) => resource.id === id)?.title}</span>
              <button type="button" aria-label={`Remover ${resources.find((resource) => resource.id === id)?.title} da seleção`} onClick={() => toggle(id)}><X size={14} aria-hidden="true" /></button>
            </li>)}
          </ul>}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="button" disabled={selectedIds.length === 0} onClick={() => onConfirm(selectedIds)}>{creating ? "Continuar" : "Adicionar à trilha"}</button>
        </div>
      </footer>
    </div>
  </AccessibleDialog>;
}
