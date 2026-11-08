import { useId, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown, ChevronUp, Eye, EyeOff, RefreshCw, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { Resource } from "@/domain/resource";
import type { StudentTeachingPath } from "@/domain/classroomTeachingPath";
import { TeachingPathIconGlyph } from "@/features/teaching-paths/components/TeachingPathAppearance";
import styles from "../Classrooms.module.css";

export function SharedTeachingPathCard({ path, resources, teacher = false, classroomUrl, controls }: {
  path: StudentTeachingPath;
  resources: readonly Resource[];
  teacher?: boolean;
  classroomUrl?: string;
  controls?: {
    canMoveUp: boolean;
    canMoveDown: boolean;
    outdated: boolean;
    onVisibility: () => void;
    onRemove: () => void;
    onMove: (direction: -1 | 1) => void;
    onUpdate: () => void;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const stepsId = useId();
  const Heading = teacher ? "h3" : "h2";
  const byId = new Map(resources.map((resource) => [resource.id, resource]));
  return <article className={`${styles.sharedPath} ${!path.visible ? styles.hiddenRow : ""}`} data-color={path.backgroundColor} aria-label={`Trilha ${path.name}`}>
    <div className={styles.sharedPathHeader}>
      <span className={styles.sharedPathIcon}><TeachingPathIconGlyph icon={path.icon} size={25} aria-hidden="true" /></span>
      <div className={styles.materialInfo}><span className={styles.pathLabel}>Trilha</span><Heading>{path.name}</Heading><small>{path.resourceIds.length} {path.resourceIds.length === 1 ? "etapa" : "etapas"}</small></div>
    </div>
    <div className={styles.sharedPathActions}>
      <button className={styles.secondary} type="button" aria-expanded={expanded} aria-controls={stepsId} onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Recolher etapas" : "Ver etapas"}{expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>
      {controls && <>
        <button className={styles.visibility} type="button" role="switch" aria-checked={path.visible} aria-label={`Visível para alunos: trilha ${path.name}`} onClick={controls.onVisibility}>{path.visible ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}{path.visible ? "Visível" : "Oculta"}</button>
        <button className={styles.iconButton} type="button" disabled={!controls.canMoveUp} aria-label={`Mover trilha ${path.name} para cima`} onClick={() => controls.onMove(-1)}><ArrowUp size={17} aria-hidden="true" /></button>
        <button className={styles.iconButton} type="button" disabled={!controls.canMoveDown} aria-label={`Mover trilha ${path.name} para baixo`} onClick={() => controls.onMove(1)}><ArrowDown size={17} aria-hidden="true" /></button>
        <button className={styles.iconButton} type="button" aria-label={`Remover trilha ${path.name} da turma`} onClick={controls.onRemove}><X size={17} aria-hidden="true" /></button>
      </>}
    </div>
    {controls?.outdated && <div className={styles.pathUpdate}><span>A trilha original foi atualizada.</span><button className={styles.secondary} type="button" onClick={controls.onUpdate}><RefreshCw size={16} aria-hidden="true" /> Atualizar cópia</button></div>}
    <ol className={styles.sharedPathSteps} id={stepsId} hidden={!expanded} aria-label={`Etapas de ${path.name}`}>
      {path.resourceIds.map((resourceId, index) => {
        const resource = byId.get(resourceId);
        return <li key={resourceId}>
          <span className={styles.pathStepNumber} aria-hidden="true">{index + 1}</span>
          {resource ? teacher ? <Link to={`/app/materiais/${resource.slug}`} state={{ from: classroomUrl }}>{resource.title}<ArrowUpRight size={17} aria-hidden="true" /></Link> : <a href={resource.canonicalUrl ?? resource.sourceUrl} target="_blank" rel="noopener noreferrer">{resource.title}<ArrowUpRight size={19} aria-hidden="true" /></a> : <span>Material indisponível</span>}
        </li>;
      })}
    </ol>
  </article>;
}
