import { Link } from "react-router-dom";
import styles from "./Brand.module.css";
import { publicAsset } from "@/lib/publicAsset";

interface BrandProps {
  compact?: boolean;
  inverted?: boolean;
  stacked?: boolean;
  to?: string;
}

export function Brand({ compact = false, inverted = false, stacked = false, to = "/" }: BrandProps) {
  const destinationLabel =
    to === "/"
      ? "Explora Computação — página inicial"
      : "Explora Computação — buscar materiais";

  return (
    <Link
      className={`${styles.brand} ${inverted ? styles.inverted : ""} ${stacked ? styles.stacked : ""}`}
      to={to}
      aria-label={destinationLabel}
    >
      <img
        className={styles.mark}
        src={publicAsset("branding/explora-computacao-symbol.svg")}
        alt=""
        width={stacked ? 44 : 48}
        height={stacked ? 44 : 48}
      />
      {!compact && (
        <span className={styles.wordmark}>
          <span>Explora</span> <strong>Computação</strong>
        </span>
      )}
    </Link>
  );
}
