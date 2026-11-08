import { useState } from "react";
import { Waypoints } from "lucide-react";
import { Link } from "react-router-dom";
import { trackClarityEvent } from "@/lib/clarity";
import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import { AddToClassroomButton } from "@/features/classrooms/components/AddToClassroomButton";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { useMaterialSearchNavigation } from "../materialSearchNavigation";
import { TeachingMaterialBrowser } from "../components/TeachingMaterialBrowser";
import styles from "./TeachingPathPage.module.css";

export function TeachingPathPage() {
  const { resources, status } = useCatalogResources();
  const searchNavigation = useMaterialSearchNavigation(status === "success");
  const savedPaths = useTeachingPathsStore((state) => state.paths);
  const addResourceToPath = useTeachingPathsStore((state) => state.addResourceToPath);
  const [resourceToAdd, setResourceToAdd] = useState<string | null>(null);
  const [existingPathId, setExistingPathId] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const resource = resources.find((item) => item.id === resourceToAdd);
  const availablePaths = savedPaths.filter((path) => !path.resourceIds.includes(resourceToAdd ?? ""));

  const closePathDialog = () => {
    setResourceToAdd(null);
    setExistingPathId("");
  };

  const openPathDialog = (resourceId: string) => {
    setResourceToAdd(resourceId);
    setExistingPathId("");
  };

  const addToExistingPath = async () => {
    const path = availablePaths.find((item) => item.id === existingPathId);
    if (!resource || !path || !await addResourceToPath(path.id, resource.id)) return;
    trackClarityEvent("material_adicionado_trilha");
    setAnnouncement(`${resource.title} foi adicionado à trilha “${path.name}”.`);
    closePathDialog();
  };

  if (status === "loading") {
    return <CatalogStatus busy title="Preparando os materiais" message="Estamos organizando os recursos para a busca." />;
  }

  if (status === "error") {
    return <CatalogStatus title="Não foi possível carregar os materiais" message="Tente abrir esta página novamente." />;
  }

  return (
    <WorkspacePage title="Buscar Materiais" eyebrow="Planejamento por materiais" contentClassName={styles.page}>
      <TeachingMaterialBrowser
        resources={resources}
        initialFilters={searchNavigation.initialFilters}
        onFiltersChange={searchNavigation.rememberFilters}
        onOpenDetails={searchNavigation.rememberPosition}
        searchEntryKey={searchNavigation.entryKey}
        actionsPlacement="inline"
        renderActions={({ resource }) => <>
          <button className={styles.materialActionButton} type="button" onClick={() => openPathDialog(resource.id)}>
            <Waypoints size={18} aria-hidden="true" /> Adicionar à trilha
          </button>
          <AddToClassroomButton resource={resource} className={styles.materialActionButton} />
        </>}
      />

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true" data-clarity-mask="true">{announcement}</p>

      <AccessibleDialog
        open={resourceToAdd !== null}
        title="Adicionar à trilha"
        description={resource?.title}
        onClose={closePathDialog}
        size="small"
      >
        {resourceToAdd !== null && (availablePaths.length > 0 ? (
          <form className={styles.dialogForm} onSubmit={(event) => { event.preventDefault(); void addToExistingPath(); }}>
            <label htmlFor="existing-teaching-path">Escolha uma trilha</label>
            <select id="existing-teaching-path" value={existingPathId} onChange={(event) => setExistingPathId(event.target.value)} required>
              <option value="" disabled>Selecione uma trilha</option>
              {availablePaths.map((path) => <option key={path.id} value={path.id}>{path.name}</option>)}
            </select>
            <div className={styles.dialogActions}>
              <button type="button" onClick={closePathDialog}>Cancelar</button>
              <button type="submit" disabled={!existingPathId}>Adicionar material</button>
            </div>
          </form>
        ) : (
          <div className={styles.emptyPathChoice}>
            <p>{savedPaths.length === 0
              ? "Você ainda não tem trilhas. Crie uma em Minhas Trilhas para adicionar materiais."
              : "Este material já está em todas as suas trilhas."}</p>
            <div className={styles.dialogActions}>
              <button type="button" onClick={closePathDialog}>Fechar</button>
              <Link className={styles.materialActionButton} to="/app/minhas-trilhas">Ir para Minhas Trilhas</Link>
            </div>
          </div>
        ))}
      </AccessibleDialog>
    </WorkspacePage>
  );
}
