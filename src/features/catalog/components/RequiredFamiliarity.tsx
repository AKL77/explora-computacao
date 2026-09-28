import type { FamiliarityLevel, RequiredFamiliarity as Familiarity } from "@/domain/resource";

import styles from "./RequiredFamiliarity.module.css";

const labels: Record<FamiliarityLevel, string> = {
  basic: "Básico",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

const counts: Record<FamiliarityLevel, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
};

interface Props {
  levels: Familiarity;
  compact?: boolean;
}

export function RequiredFamiliarity({ levels, compact = false }: Props) {
  return (
    <div className={`${styles.indicators} ${compact ? styles.compact : ""}`}>
      {([
        ["Aluno", levels.student],
        ["Professor", levels.teacher],
      ] as const).map(([audience, level]) => (
        <div
          className={styles.indicator}
          key={audience}
          title={compact ? `${audience}: ${labels[level]}` : undefined}
        >
          <span className={styles.audience}>{audience}</span>
          <strong className={compact ? "sr-only" : styles.level}>{labels[level]}</strong>
          <span className={styles.bars} aria-hidden="true">
            {[1, 2, 3].map((bar) => (
              <span className={bar <= counts[level] ? styles.filled : ""} key={bar} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
