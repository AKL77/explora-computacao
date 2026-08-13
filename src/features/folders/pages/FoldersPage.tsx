import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import {
  FAVORITES_FOLDER_ID,
  useLibraryStore,
} from "@/store/useLibraryStore";

import { CreateFolderDialog } from "../components/CreateFolderDialog";
import styles from "./Folders.module.css";

function formatCount(count: number): string {
  return `${count} ${count === 1 ? "recurso" : "recursos"}`;
}

export function FoldersPage() {
  const { resources, status } = useCatalogResources();
  const folders = useLibraryStore((state) => state.folders);
  const favoriteResourceIds = useLibraryStore((state) => state.favoriteResourceIds);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const catalogIds = useMemo(
    () => new Set(resources.map((resource) => resource.id)),
    [resources],
  );
  const favoriteCount = favoriteResourceIds.filter((id) => catalogIds.has(id)).length;

  if (status === "loading") {
    return (
      <CatalogStatus
        title="Carregando pastas"
        message="Estamos preparando a sua biblioteca local."
        busy
      />
    );
  }

  if (status === "error") {
    return (
      <CatalogStatus
        title="Não foi possível carregar as pastas"
        message="Recarregue a página para tentar novamente."
      />
    );
  }

  return (
    <section className={styles.page} aria-labelledby="folders-page-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Sua biblioteca</p>
          <h1 id="folders-page-title">Meus Materiais</h1>
          <p>
            Reúna referências por turma, escola, projeto ou sequência de aulas.
          </p>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setCreateDialogOpen(true)}
        >
          Criar pasta
        </button>
      </header>

      <div className={styles.folderGrid}>
        <article className={`${styles.folderCard} ${styles.favoriteCard}`}>
          <div className={styles.folderIcon} aria-hidden="true">
            ♥
          </div>
          <div>
            <span className={styles.systemBadge}>Pasta fixa</span>
            <h2>Favoritos</h2>
            <p>{formatCount(favoriteCount)}</p>
          </div>
          <Link
            to={`/app/pastas/${FAVORITES_FOLDER_ID}`}
            className={styles.cardLink}
            aria-label={`Abrir Favoritos, ${formatCount(favoriteCount)}`}
          >
            Abrir pasta
          </Link>
        </article>

        {folders.map((folder) => {
          const resourceCount = folder.resourceIds.filter((id) => catalogIds.has(id)).length;
          return (
            <article key={folder.id} className={styles.folderCard}>
              <div className={styles.folderIcon} aria-hidden="true">
                ▱
              </div>
              <div>
                <h2>{folder.name}</h2>
                <p>{formatCount(resourceCount)}</p>
              </div>
              <Link
                to={`/app/pastas/${folder.id}`}
                className={styles.cardLink}
                aria-label={`Abrir ${folder.name}, ${formatCount(resourceCount)}`}
              >
                Abrir pasta
              </Link>
            </article>
          );
        })}

        {folders.length === 0 ? (
          <button
            type="button"
            className={styles.newFolderCard}
            onClick={() => setCreateDialogOpen(true)}
          >
            <span aria-hidden="true">＋</span>
            <strong>Crie sua primeira pasta</strong>
            <small>Ex.: Turma sétimo ano — Escola Lívia Menna Barreto</small>
          </button>
        ) : null}
      </div>

      <CreateFolderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </section>
  );
}
