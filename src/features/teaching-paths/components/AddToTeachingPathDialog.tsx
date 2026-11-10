import { useId, useState } from "react";
import { Link } from "react-router-dom";
import type { Resource } from "@/domain/resource";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { trackClarityEvent } from "@/lib/clarity";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import styles from "../pages/TeachingPathPage.module.css";

export function AddToTeachingPathDialog({ resource, onClose }: {
  resource: Resource | null;
  onClose: () => void;
}) {
  const paths = useTeachingPathsStore((state) => state.paths);
  const addResourceToPath = useTeachingPathsStore((state) => state.addResourceToPath);
  const [selectedPathId, setSelectedPathId] = useState("");
  const [adding, setAdding] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const selectId = useId();
  const availablePaths = resource ? paths.filter((path) => !path.resourceIds.includes(resource.id)) : [];
  const selectedPath = availablePaths.find((path) => path.id === selectedPathId);

  const close = () => {
    setSelectedPathId("");
    onClose();
  };

  const add = async () => {
    if (!resource || !selectedPath || adding) return;

    setAdding(true);
    try {
      if (!await addResourceToPath(selectedPath.id, resource.id)) return;
      trackClarityEvent("material_adicionado_trilha");
      setAnnouncement(`${resource.title} foi adicionado à trilha “${selectedPath.name}”.`);
      close();
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true" data-clarity-mask="true">{announcement}</p>
      <AccessibleDialog
        open={resource !== null}
        title="Adicionar à trilha"
        description={resource?.title}
        onClose={() => { if (!adding) close(); }}
        size="small"
      >
        {resource && (availablePaths.length > 0 ? (
          <form className={styles.dialogForm} onSubmit={(event) => { event.preventDefault(); void add(); }}>
            <label htmlFor={selectId}>Escolha uma trilha</label>
            <select id={selectId} value={selectedPathId} onChange={(event) => setSelectedPathId(event.target.value)} disabled={adding} required>
              <option value="" disabled>Selecione uma trilha</option>
              {availablePaths.map((path) => <option key={path.id} value={path.id}>{path.name}</option>)}
            </select>
            <div className={styles.dialogActions}>
              <button type="button" onClick={close} disabled={adding}>Cancelar</button>
              <button type="submit" disabled={!selectedPath || adding}>{adding ? "Adicionando…" : "Adicionar material"}</button>
            </div>
          </form>
        ) : (
          <div className={styles.emptyPathChoice}>
            <p>{paths.length === 0
              ? "Você ainda não tem trilhas. Crie uma em Minhas Trilhas para adicionar materiais."
              : "Este material já está em todas as suas trilhas."}</p>
            <div className={styles.dialogActions}>
              <button type="button" onClick={close}>Fechar</button>
              <Link className={styles.materialActionButton} to="/app/minhas-trilhas">Ir para Minhas Trilhas</Link>
            </div>
          </div>
        ))}
      </AccessibleDialog>
    </>
  );
}
