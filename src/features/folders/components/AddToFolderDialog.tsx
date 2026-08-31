import { type FormEvent, useState } from "react";
import { EllipsisVertical } from "lucide-react";

import type { Resource } from "@/domain/resource";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { useLibraryStore } from "@/store/useLibraryStore";

import { CreateFolderForm } from "./CreateFolderForm";
import styles from "./FolderDialogs.module.css";

interface AddToFolderButtonProps {
  resource: Resource;
  compact?: boolean;
}

export function AddToFolderButton({
  resource,
  compact = false,
}: AddToFolderButtonProps) {
  const folders = useLibraryStore((state) => state.folders);
  const setResourceFolderMembership = useLibraryStore(
    (state) => state.setResourceFolderMembership,
  );
  const [open, setOpen] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");

  const handleOpen = () => {
    setSelectedFolderIds(
      folders
        .filter((folder) => folder.resourceIds.includes(resource.id))
        .map((folder) => folder.id),
    );
    setOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResourceFolderMembership(resource.id, selectedFolderIds);
    setAnnouncement(`As pastas de ${resource.title} foram atualizadas.`);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.secondaryButton} ${compact ? styles.compactButton : ""}`}
        aria-label={compact ? `Organizar ${resource.title} em uma pasta` : undefined}
        onClick={handleOpen}
      >
        {compact ? <EllipsisVertical aria-hidden="true" size={22} /> : "Adicionar à pasta"}
      </button>

      {open ? (
        <AccessibleDialog
          open
          title="Adicionar à pasta"
          description={`Escolha onde organizar “${resource.title}”. Adicionar a uma pasta não altera os Favoritos.`}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <fieldset className={styles.folderList}>
              <legend>Pastas disponíveis</legend>
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <label key={folder.id}>
                    <input
                      type="checkbox"
                      checked={selectedFolderIds.includes(folder.id)}
                      onChange={(event) => {
                        setSelectedFolderIds((current) =>
                          event.target.checked
                            ? [...new Set([...current, folder.id])]
                            : current.filter((folderId) => folderId !== folder.id),
                        );
                      }}
                    />
                    <span>
                      <strong>{folder.name}</strong>
                      <small>
                        {folder.resourceIds.length}{" "}
                        {folder.resourceIds.length === 1 ? "recurso" : "recursos"}
                      </small>
                    </span>
                  </label>
                ))
              ) : (
                <p className={styles.emptyMessage}>
                  Você ainda não criou uma pasta. Crie a primeira abaixo.
                </p>
              )}
            </fieldset>

            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.primaryButton}>
                Salvar organização
              </button>
            </div>
          </form>

          <div className={styles.createSection}>
            <h3>Criar nova pasta</h3>
            <CreateFolderForm
              initialResourceId={resource.id}
              submitLabel="Criar e adicionar"
              onCreated={(folder) => {
                setSelectedFolderIds((current) => [
                  ...new Set([...current, folder.id]),
                ]);
                setAnnouncement(
                  `A pasta ${folder.name} foi criada e o recurso foi adicionado.`,
                );
              }}
            />
          </div>
        </AccessibleDialog>
      ) : null}

      {announcement ? (
        <span className={styles.visuallyHidden} aria-live="polite">
          {announcement}
        </span>
      ) : null}
    </>
  );
}
