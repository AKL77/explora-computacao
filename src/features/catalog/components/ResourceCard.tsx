import { Link, useLocation } from "react-router-dom";

import type { Resource } from "@/domain/resource";
import { AddToFolderButton } from "@/features/folders/components/AddToFolderDialog";

import { FavoriteButton } from "./FavoriteButton";
import { RESOURCE_PLACEHOLDER } from "./resourcePresentation";
import styles from "./ResourceCard.module.css";

function formatGrades(grades: Resource["recommendedGrades"]): string {
  return grades.map((grade) => `${grade}º ano`).join(", ");
}

interface ResourceCardProps {
  resource: Resource;
  onRemove?: (resourceId: string) => void;
  removeLabel?: string;
}

export function ResourceCard({
  resource,
  onRemove,
  removeLabel = "Remover desta pasta",
}: ResourceCardProps) {
  const location = useLocation();
  const primarySkill = resource.curriculum.skills[0];

  return (
    <article className={styles.card}>
      <Link
        to={`/app/acervo/${resource.slug}`}
        state={{ from: `${location.pathname}${location.search}` }}
        className={styles.cardLink}
        aria-label={`Ver detalhes de ${resource.title}`}
      >
        <div className={styles.imageWrap}>
          <img
            src={resource.image?.src ?? RESOURCE_PLACEHOLDER}
            alt={resource.image?.alt ?? ""}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.body}>
          <h2 className={styles.title}>{resource.title}</h2>
          <dl className={styles.metadata}>
            <div>
              <dt>Turma</dt>
              <dd>{formatGrades(resource.recommendedGrades)}</dd>
            </div>
            <div>
              <dt>Eixo</dt>
              <dd>{resource.curriculum.axis}</dd>
            </div>
            <div>
              <dt>Habilidade</dt>
              <dd>
                {primarySkill
                  ? primarySkill.officialText
                  : "Em validação"}
              </dd>
            </div>
          </dl>
        </div>
      </Link>

      <div className={styles.actions}>
        <FavoriteButton
          resourceId={resource.id}
          resourceTitle={resource.title}
          compact
        />
        <AddToFolderButton resource={resource} compact />
      </div>
      {onRemove ? (
        <div className={styles.removeActionRow}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.removeButton}`}
            onClick={() => onRemove(resource.id)}
          >
            {removeLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}
