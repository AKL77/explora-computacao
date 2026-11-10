import { useState } from "react";
import { Waypoints } from "lucide-react";
import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import { AddToClassroomButton } from "@/features/classrooms/components/AddToClassroomButton";
import { useMaterialSearchNavigation } from "../materialSearchNavigation";
import { AddToTeachingPathDialog } from "../components/AddToTeachingPathDialog";
import { TeachingMaterialBrowser } from "../components/TeachingMaterialBrowser";
import styles from "./TeachingPathPage.module.css";

export function TeachingPathPage() {
  const { resources, status } = useCatalogResources();
  const searchNavigation = useMaterialSearchNavigation(status === "success");
  const [resourceToAdd, setResourceToAdd] = useState<string | null>(null);
  const resource = resources.find((item) => item.id === resourceToAdd) ?? null;

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
        view={{ mode: searchNavigation.view, onChange: searchNavigation.setView }}
        actionsPlacement="inline"
        renderActions={({ resource }) => <>
          <button className={styles.materialActionButton} type="button" onClick={() => setResourceToAdd(resource.id)}>
            <Waypoints size={18} aria-hidden="true" /> Adicionar à trilha
          </button>
          <AddToClassroomButton resource={resource} className={styles.materialActionButton} />
        </>}
      />

      <AddToTeachingPathDialog resource={resource} onClose={() => setResourceToAdd(null)} />
    </WorkspacePage>
  );
}
