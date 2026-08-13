import { type FormEvent, useId, useState } from "react";

import {
  type FolderNameError,
  type UserFolder,
  useLibraryStore,
} from "@/store/useLibraryStore";

import styles from "./FolderDialogs.module.css";

const errorMessages: Record<FolderNameError, string> = {
  required: "Informe um nome para a pasta.",
  "too-long": "Use no máximo 80 caracteres.",
  duplicate: "Já existe uma pasta com esse nome.",
};

interface CreateFolderFormProps {
  initialResourceId?: string;
  submitLabel?: string;
  onCreated: (folder: UserFolder) => void;
}

export function CreateFolderForm({
  initialResourceId,
  submitLabel = "Criar pasta",
  onCreated,
}: CreateFolderFormProps) {
  const createFolder = useLibraryStore((state) => state.createFolder);
  const [name, setName] = useState("");
  const [error, setError] = useState<FolderNameError | null>(null);
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = createFolder(name, initialResourceId);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setName("");
    setError(null);
    onCreated(result.folder);
  };

  return (
    <form className={styles.createForm} onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId}>Nome da pasta</label>
      <input
        id={inputId}
        name="folder-name"
        value={name}
        maxLength={80}
        aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`}
        aria-invalid={error ? "true" : undefined}
        autoComplete="off"
        placeholder="Ex.: Turma sétimo ano — Escola Lívia Menna Barreto"
        onChange={(event) => {
          setName(event.target.value);
          if (error) {
            setError(null);
          }
        }}
      />
      <p id={helpId} className={styles.helpText}>
        Entre 1 e 80 caracteres. Acentos e espaços repetidos não criam nomes diferentes.
      </p>
      {error ? (
        <p id={errorId} className={styles.errorText} role="alert">
          {errorMessages[error]}
        </p>
      ) : null}
      <button type="submit" className={styles.primaryButton}>
        {submitLabel}
      </button>
    </form>
  );
}
