import styles from "./CatalogStatus.module.css";

interface CatalogStatusProps {
  title: string;
  message: string;
  busy?: boolean;
}

export function CatalogStatus({ title, message, busy = false }: CatalogStatusProps) {
  return (
    <section className={styles.panel} aria-labelledby="catalog-status-title" aria-busy={busy}>
      <span className={styles.icon} aria-hidden="true">{busy ? "…" : "!"}</span>
      <h1 id="catalog-status-title">{title}</h1>
      <p role={busy ? "status" : "alert"}>{message}</p>
    </section>
  );
}
