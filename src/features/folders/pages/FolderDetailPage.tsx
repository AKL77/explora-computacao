import { Link, useParams } from "react-router-dom";

import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import {
  FAVORITES_FOLDER_ID,
  useLibraryStore,
} from "@/store/useLibraryStore";

import styles from "./Folders.module.css";

export function FolderDetailPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const { resources, status } = useCatalogResources();
  const folders = useLibraryStore((state) => state.folders);
  const favoriteResourceIds = useLibraryStore((state) => state.favoriteResourceIds);
  const setFavorite = useLibraryStore((state) => state.setFavorite);
  const removeResourceFromFolder = useLibraryStore(
    (state) => state.removeResourceFromFolder,
  );

  const isFavorites = folderId === FAVORITES_FOLDER_ID;
  const folder = isFavorites ? undefined : folders.find((item) => item.id === folderId);

  if (status === "loading") {
    return (
      <CatalogStatus
        title="Carregando pasta"
        message="Estamos preparando os recursos organizados aqui."
        busy
      />
    );
  }

  if (status === "error") {
    return (
      <CatalogStatus
        title="Não foi possível carregar a pasta"
        message="Recarregue a página para tentar novamente."
      />
    );
  }

  if (!isFavorites && !folder) {
    return (
      <section className={styles.notFound} aria-labelledby="folder-not-found-title">
        <span aria-hidden="true">◇</span>
        <h1 id="folder-not-found-title">Pasta não encontrada</h1>
        <p>Ela pode ter sido removida ou o endereço está incompleto.</p>
        <Link to="/app/pastas" className={styles.primaryLink}>
          Voltar para Meus Materiais
        </Link>
      </section>
    );
  }

  const resourceIds = isFavorites ? favoriteResourceIds : (folder?.resourceIds ?? []);
  const folderResources = resources.filter((resource) => resourceIds.includes(resource.id));
  const title = isFavorites ? "Favoritos" : (folder?.name ?? "Pasta");

  return (
    <>
      <div className={styles.backRow}>
        <Link to="/app/pastas">← Meus Materiais</Link>
      </div>
      <CatalogView
        title={title}
        controlsInitiallyCollapsed
        description={
          isFavorites
            ? "Os recursos que você marcou como favoritos ficam reunidos automaticamente aqui."
            : "Busque e filtre somente entre os recursos organizados nesta pasta."
        }
        resources={folderResources}
        emptyTitle={isFavorites ? "Nenhum favorito ainda" : "Esta pasta está vazia"}
        emptyMessage={
          isFavorites
            ? "Use o coração nos cartões de materiais para guardar recursos aqui."
            : "Abra Buscar Materiais e adicione recursos para começar sua coleção."
        }
        removeLabel={isFavorites ? "Remover dos Favoritos" : "Remover desta pasta"}
        onRemoveResource={(resourceId) => {
          if (isFavorites) {
            setFavorite(resourceId, false);
          } else if (folder) {
            removeResourceFromFolder(folder.id, resourceId);
          }
        }}
      />
    </>
  );
}
