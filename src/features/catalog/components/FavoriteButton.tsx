import { useState } from "react";
import { Heart } from "lucide-react";

import { useLibraryStore } from "@/store/useLibraryStore";

import styles from "./ResourceCard.module.css";

interface FavoriteButtonProps {
  resourceId: string;
  resourceTitle: string;
  compact?: boolean;
}

export function FavoriteButton({
  resourceId,
  resourceTitle,
  compact = false,
}: FavoriteButtonProps) {
  const isFavorite = useLibraryStore((state) =>
    state.favoriteResourceIds.includes(resourceId),
  );
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const [announcement, setAnnouncement] = useState("");

  const label = isFavorite ? "Desfavoritar" : "Favoritar";

  return (
    <>
      <button
        type="button"
        className={`${styles.actionButton} ${compact ? styles.compactButton : ""}`}
        aria-pressed={isFavorite}
        aria-label={`${label} ${resourceTitle}`}
        onClick={() => {
          toggleFavorite(resourceId);
          setAnnouncement(
            isFavorite
              ? `${resourceTitle} foi removido dos Favoritos.`
              : `${resourceTitle} foi adicionado aos Favoritos.`,
          );
        }}
      >
        <Heart
          className={styles.favoriteIcon}
          aria-hidden="true"
          size={compact ? 22 : 20}
          fill={isFavorite ? "currentColor" : "none"}
        />
        {compact ? null : <span>{label}</span>}
      </button>
      <span className={styles.visuallyHidden} aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
