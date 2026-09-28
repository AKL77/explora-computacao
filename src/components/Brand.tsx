import { Link } from "react-router-dom";
import styles from "./Brand.module.css";
import { publicAsset } from "@/lib/publicAsset";

interface BrandProps {
  compact?: boolean;
  inverted?: boolean;
  to?: string;
}

export function Brand({ compact = false, inverted = false, to = "/" }: BrandProps) {
  const destinationLabel =
    to === "/"
      ? "Explora Computação — página inicial"
      : "Explora Computação — buscar materiais";

  return (
    <Link
      className={`${styles.brand} ${inverted ? styles.inverted : ""}`}
      to={to}
      aria-label={destinationLabel}
    >
      <img
        className={styles.mark}
        src={publicAsset("branding/explora-computacao-symbol.svg")}
        alt=""
        width="48"
        height="48"
      />
      {!compact && (
        <span className={styles.wordmark}>
          Explora <strong>Computação</strong>
        </span>
      )}
    </Link>
  );
}
