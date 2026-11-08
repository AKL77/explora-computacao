import type { ReactNode } from "react";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { isOnlineMode } from "@/lib/backend/config";
import { useWorkspaceState } from "@/lib/backend/workspaceState";
import { reloadWorkspace } from "@/lib/backend/useBackendSession";
import styles from "@/features/classrooms/Classrooms.module.css";

export function WorkspaceContent({ children }: { children: ReactNode }) {
  const { status, pending, error } = useWorkspaceState();
  if (!isOnlineMode) return children;
  return <>
    {status === "loading" || status === "idle" ? <CatalogStatus busy title="Carregando seu espaço" message="Estamos buscando suas turmas e trilhas." /> : status === "error" ? <div className={styles.empty}><h1>Não foi possível carregar seu espaço</h1><p role="alert">{error}</p><button className={styles.primary} type="button" onClick={() => void reloadWorkspace()}>Tentar novamente</button></div> : <>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <fieldset disabled={pending > 0} aria-busy={pending > 0} style={{ minWidth: 0, margin: 0, padding: 0, border: 0 }}>
        <legend className="sr-only">Conteúdo do professor</legend>{children}
      </fieldset>
    </>}
  </>;
}
