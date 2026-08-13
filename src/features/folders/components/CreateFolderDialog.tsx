import { useState } from "react";

import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";

import { CreateFolderForm } from "./CreateFolderForm";
import styles from "./FolderDialogs.module.css";

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateFolderDialog({ open, onClose }: CreateFolderDialogProps) {
  const [announcement, setAnnouncement] = useState("");

  return (
    <>
      <AccessibleDialog
        open={open}
        title="Criar pasta"
        description="Organize recursos para uma turma, escola, projeto ou sequência de aulas."
        onClose={onClose}
        size="small"
      >
        <CreateFolderForm
          onCreated={(folder) => {
            setAnnouncement(`A pasta ${folder.name} foi criada.`);
            onClose();
          }}
        />
      </AccessibleDialog>
      <span aria-live="polite" className={styles.visuallyHidden}>
        {announcement}
      </span>
    </>
  );
}
