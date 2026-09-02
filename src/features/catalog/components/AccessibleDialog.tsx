import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";

import styles from "./AccessibleDialog.module.css";

interface AccessibleDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  size?: "small" | "medium" | "large";
  hideHeader?: boolean;
}

export function AccessibleDialog({
  open,
  title,
  description,
  children,
  onClose,
  size = "medium",
  hideHeader = false,
}: AccessibleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      openerRef.current = document.activeElement as HTMLElement | null;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }

      const firstFocusable = dialog.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      firstFocusable?.focus();
    }

    if (!open && dialog.open) {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
      openerRef.current?.focus();
    }
  }, [open]);

  useEffect(
    () => () => {
      openerRef.current?.focus();
    },
    [],
  );

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${styles[size]}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        {hideHeader ? (
          <div className={styles.headerlessClose}>
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Fechar diálogo"
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ) : (
          <header className={styles.header}>
            <div>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Fechar diálogo"
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
        )}
        {children}
      </div>
    </dialog>
  );
}
