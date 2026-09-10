import { type DragEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  GripVertical,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { RESOURCE_PLACEHOLDER, typeLabels } from "@/features/catalog/components/resourcePresentation";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import {
  TEACHING_PATH_BACKGROUND_COLORS,
  TEACHING_PATH_ICONS,
  type SavedTeachingPath,
  type TeachingPathBackgroundColor,
  type TeachingPathIcon,
} from "@/domain/savedTeachingPath";
import lessonPlanStyles from "@/features/lesson-plans/pages/LessonPlanPage.module.css";
import { LESSON_DURATION_MINUTES, type LessonCount } from "@/domain/lessonPlan";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import {
  TeachingPathIconGlyph,
} from "../components/TeachingPathAppearance";
import {
  teachingPathColorLabels,
  teachingPathIconLabels,
} from "../components/teachingPathAppearanceOptions";
import { getTeachingResourceMetadata, type PilotTeachingResource } from "../data/pilotTeachingResources";
import styles from "./SavedTeachingPathsPage.module.css";

const lessonCounts: readonly LessonCount[] = [1, 2, 3];

const themeClassNames: Record<TeachingPathBackgroundColor, string> = {
  turquoise: "themeTurquoise",
  blue: "themeBlue",
  violet: "themeViolet",
  amber: "themeAmber",
  coral: "themeCoral",
};

const colorOptionClassNames: Record<TeachingPathBackgroundColor, string> = {
  turquoise: "colorTurquoise",
  blue: "colorBlue",
  violet: "colorViolet",
  amber: "colorAmber",
  coral: "colorCoral",
};

interface PathResourceView {
  resourceId: string;
  resource: ReturnType<typeof useCatalogResources>["resources"][number];
  teaching: PilotTeachingResource;
}

interface TeachingPathDraft {
  name: string;
  objective: string;
  backgroundColor: TeachingPathBackgroundColor;
  icon: TeachingPathIcon;
  resourceIds: string[];
  removedResourceIds: string[];
  lessonCountsByResourceId: Record<string, LessonCount | undefined>;
}

interface PathSettingsDraft {
  name: string;
  objective: string;
  backgroundColor: TeachingPathBackgroundColor;
  icon: TeachingPathIcon;
}

function lessonCountLabel(count: LessonCount) {
  return count === 1
    ? "1 aula · 50 min"
    : `${count} aulas · ${count * LESSON_DURATION_MINUTES} min`;
}

function updatedAtLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

function getPathResources(
  resourceIds: readonly string[],
  resources: ReturnType<typeof useCatalogResources>["resources"],
): PathResourceView[] {
  const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
  return resourceIds.flatMap((resourceId) => {
    const resource = resourcesById.get(resourceId);
    return resource
      ? [{ resourceId, resource, teaching: getTeachingResourceMetadata(resource) }]
      : [];
  });
}

function getRelevantAlignments(item: PathResourceView) {
  return item.resource.curriculum.alignments.filter((alignment) =>
    item.teaching.grades.includes(alignment.grade),
  );
}

function createDraft(path: SavedTeachingPath): TeachingPathDraft {
  return {
    name: path.name,
    objective: path.objective,
    backgroundColor: path.backgroundColor,
    icon: path.icon,
    resourceIds: [...path.resourceIds],
    removedResourceIds: [],
    lessonCountsByResourceId: { ...path.lessonCountsByResourceId },
  };
}

function activeResourceIds(draft: TeachingPathDraft): string[] {
  return draft.resourceIds.filter((resourceId) => !draft.removedResourceIds.includes(resourceId));
}

function reorderResourceIds(resourceIds: readonly string[], sourceId: string, targetId: string): string[] {
  const sourceIndex = resourceIds.indexOf(sourceId);
  const targetIndex = resourceIds.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return [...resourceIds];

  const reordered = [...resourceIds];
  reordered.splice(sourceIndex, 1);
  reordered.splice(targetIndex, 0, sourceId);
  return reordered;
}

function hasSameResourceOrder(first: readonly string[], second: readonly string[]) {
  return first.length === second.length && first.every((resourceId, index) => resourceId === second[index]);
}

function hasSameLessonCounts(
  resourceIds: readonly string[],
  first: Readonly<Record<string, LessonCount | undefined>>,
  second: Readonly<Record<string, LessonCount | undefined>>,
) {
  return resourceIds.every((resourceId) => first[resourceId] === second[resourceId]);
}

function isDraftDirty(path: SavedTeachingPath, draft: TeachingPathDraft) {
  const persistedResourceIds = activeResourceIds(draft);
  return (
    path.name !== draft.name ||
    path.objective !== draft.objective ||
    path.backgroundColor !== draft.backgroundColor ||
    path.icon !== draft.icon ||
    !hasSameResourceOrder(path.resourceIds, persistedResourceIds) ||
    !hasSameLessonCounts(persistedResourceIds, path.lessonCountsByResourceId, draft.lessonCountsByResourceId)
  );
}

function getLessonCountsForResources(
  resourceIds: readonly string[],
  lessonCounts: Readonly<Record<string, LessonCount | undefined>>,
) {
  return Object.fromEntries(
    resourceIds.flatMap((resourceId) => {
      const lessonCount = lessonCounts[resourceId];
      return lessonCount === undefined ? [] : [[resourceId, lessonCount]];
    }),
  ) as Record<string, LessonCount>;
}

export function SavedTeachingPathsPage() {
  const { resources, status } = useCatalogResources();
  const paths = useTeachingPathsStore((state) => state.paths);
  const updatePath = useTeachingPathsStore((state) => state.updatePath);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeachingPathDraft | null>(null);
  const [previewResourceId, setPreviewResourceId] = useState<string | null>(null);
  const [draggedResourceId, setDraggedResourceId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<PathSettingsDraft | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const selectedPath = paths.find((path) => path.id === selectedPathId) ?? null;

  const pathResources = useMemo(
    () => (draft ? getPathResources(draft.resourceIds, resources) : []),
    [draft, resources],
  );
  const currentResourceIds = draft ? activeResourceIds(draft) : [];
  const activePathResources = pathResources.filter((item) => currentResourceIds.includes(item.resourceId));
  const preview = pathResources.find((item) => item.resourceId === previewResourceId) ?? null;
  const allLessonCountsDefined =
    draft !== null &&
    currentResourceIds.every((resourceId) => draft.lessonCountsByResourceId[resourceId] !== undefined);
  const totalLessonCount = draft
    ? currentResourceIds.reduce(
        (total, resourceId) => total + (draft.lessonCountsByResourceId[resourceId] ?? 0),
        0,
      )
    : 0;
  const remainingDurations = draft
    ? currentResourceIds.filter((resourceId) => draft.lessonCountsByResourceId[resourceId] === undefined)
        .length
    : 0;
  const curriculumCodes = Array.from(
    new Set(
      activePathResources.flatMap((item) =>
        getRelevantAlignments(item).map((alignment) => alignment.skill.code),
      ),
    ),
  );
  const hasUnsavedChanges = selectedPath !== null && draft !== null && isDraftDirty(selectedPath, draft);

  const updateDraft = (updater: (current: TeachingPathDraft) => TeachingPathDraft) => {
    setDraft((current) => (current ? updater(current) : current));
  };

  const markForRemoval = (resourceId: string, title: string) => {
    if (!draft) return;

    const activeIds = activeResourceIds(draft);
    if (activeIds.length === 1) {
      setAnnouncement("Uma trilha precisa manter ao menos um material.");
      return;
    }

    updateDraft((current) => ({
      ...current,
      removedResourceIds: [...current.removedResourceIds, resourceId],
    }));
    setAnnouncement(`${title} será removido somente quando você salvar as alterações.`);
  };

  const restoreMarkedResource = (resourceId: string, title: string) => {
    updateDraft((current) => ({
      ...current,
      removedResourceIds: current.removedResourceIds.filter((id) => id !== resourceId),
    }));
    setAnnouncement(`A remoção de ${title} foi desfeita.`);
  };

  const handleDragStart = (event: DragEvent<HTMLLIElement>, resourceId: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", resourceId);
    setDraggedResourceId(resourceId);
  };

  const handleDrop = (event: DragEvent<HTMLLIElement>, targetResourceId: string) => {
    event.preventDefault();
    const sourceResourceId = draggedResourceId ?? event.dataTransfer.getData("text/plain");
    if (!draft || !sourceResourceId || sourceResourceId === targetResourceId) return;
    if (
      draft.removedResourceIds.includes(sourceResourceId) ||
      draft.removedResourceIds.includes(targetResourceId)
    ) {
      return;
    }

    updateDraft((current) => ({
      ...current,
      resourceIds: reorderResourceIds(current.resourceIds, sourceResourceId, targetResourceId),
    }));
    setAnnouncement("A ordem da trilha foi atualizada no rascunho. Salve as alterações para confirmar.");
    setDraggedResourceId(null);
    setDropTargetId(null);
  };

  const handleSaveChanges = () => {
    if (!selectedPath || !draft) return;

    const resourceIds = activeResourceIds(draft);
    const saved = updatePath(selectedPath.id, {
      name: draft.name,
      objective: draft.objective,
      backgroundColor: draft.backgroundColor,
      icon: draft.icon,
      resourceIds,
      lessonCountsByResourceId: getLessonCountsForResources(
        resourceIds,
        draft.lessonCountsByResourceId,
      ),
    });

    setAnnouncement(
      saved
        ? `As alterações da trilha “${saved.name}” foram salvas.`
        : "Não foi possível salvar as alterações da trilha.",
    );

    if (saved) {
      // Recarrega o rascunho a partir da versão persistida para que itens
      // confirmados como removidos deixem de aparecer na sequência.
      setDraft(createDraft(saved));
      setPreviewResourceId((currentResourceId) =>
        currentResourceId && !saved.resourceIds.includes(currentResourceId)
          ? null
          : currentResourceId,
      );
    }
  };

  const handleDiscardChanges = () => {
    if (!selectedPath) return;
    setDraft(createDraft(selectedPath));
    setAnnouncement("As alterações não salvas foram descartadas.");
  };

  const openSettings = () => {
    if (!draft) return;
    setSettingsDraft({
      name: draft.name,
      objective: draft.objective,
      backgroundColor: draft.backgroundColor,
      icon: draft.icon,
    });
    setIsSettingsDialogOpen(true);
  };

  const applySettings = () => {
    if (!settingsDraft) return;
    updateDraft((current) => ({ ...current, ...settingsDraft }));
    setSettingsDraft(null);
    setIsSettingsDialogOpen(false);
    setAnnouncement("As informações da trilha foram atualizadas no rascunho.");
  };

  if (status === "loading") {
    return <CatalogStatus busy title="Preparando suas trilhas" message="Estamos reunindo os materiais salvos." />;
  }

  if (status === "error") {
    return <CatalogStatus title="Não foi possível carregar suas trilhas" message="Tente abrir esta página novamente." />;
  }

  if (!selectedPath || !draft) {
    return (
      <section className={styles.page} aria-labelledby="saved-paths-title">
        <header className={styles.listHeader}>
          <div>
            <p className={styles.eyebrow}>Planejamento por materiais</p>
            <h1 id="saved-paths-title">Minhas Trilhas</h1>
            <p>Abra uma sequência para ajustar as etapas, a duração e o tempo total.</p>
          </div>
          <Link className={styles.createLink} to="/app/trilha-de-ensino">
            <Plus aria-hidden="true" size={19} />
            Criar trilha
          </Link>
        </header>

        {paths.length === 0 ? (
          <div className={styles.emptyState}>
            <ListChecks aria-hidden="true" size={40} strokeWidth={1.6} />
            <h2>Nenhuma trilha salva</h2>
            <p>Selecione materiais em Buscar Materiais e salve uma sequência com objetivo próprio.</p>
            <Link to="/app/trilha-de-ensino">Criar minha primeira trilha</Link>
          </div>
        ) : (
          <div className={styles.pathList}>
            {paths.map((path) => {
              const resourceCount = path.resourceIds.length;
              const definedDurations = path.resourceIds.filter(
                (resourceId) => path.lessonCountsByResourceId[resourceId] !== undefined,
              ).length;
              return (
                <button
                  className={`${styles.pathCard} ${styles[themeClassNames[path.backgroundColor]]}`}
                  type="button"
                  key={path.id}
                  onClick={() => {
                    setSelectedPathId(path.id);
                    setDraft(createDraft(path));
                    setPreviewResourceId(null);
                    setDraggedResourceId(null);
                    setDropTargetId(null);
                    setIsSettingsDialogOpen(false);
                    setSettingsDraft(null);
                  }}
                >
                  <span className={styles.pathCardIcon} aria-hidden="true">
                    <TeachingPathIconGlyph icon={path.icon} size={22} />
                  </span>
                  <span className={styles.pathCardContent}>
                    <span className={styles.cardLabel}>Trilha de ensino</span>
                    <strong>{path.name}</strong>
                    <span>{path.objective}</span>
                    <small>
                      {resourceCount} {resourceCount === 1 ? "material" : "materiais"} · {definedDurations}/{resourceCount} durações definidas · atualizada em {updatedAtLabel(path.updatedAt)}
                    </small>
                  </span>
                  <span className={styles.openPath}>Abrir trilha</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      className={`${styles.page} ${styles[themeClassNames[draft.backgroundColor]]}`}
      aria-labelledby="path-title"
    >
      <header className={styles.pathHeader}>
        <button
          className={styles.backButton}
          type="button"
          onClick={() => {
            setSelectedPathId(null);
            setDraft(null);
            setPreviewResourceId(null);
            setIsSettingsDialogOpen(false);
            setSettingsDraft(null);
          }}
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Minhas Trilhas
        </button>
        <div className={styles.pathTitleArea}>
          <p className={styles.eyebrow}>Trilha de ensino</p>
          <h1 id="path-title">{draft.name}</h1>
          <p className={styles.pathObjective}>{draft.objective}</p>
          <div className={styles.pathMetadata} aria-label="Informações da trilha">
            <span>{currentResourceIds.length} {currentResourceIds.length === 1 ? "material" : "materiais"}</span>
            {allLessonCountsDefined ? (
              <span>
                <Clock3 aria-hidden="true" size={15} />
                {totalLessonCount} {totalLessonCount === 1 ? "aula sugerida" : "aulas sugeridas"}
              </span>
            ) : (
              <span>Definir duração das etapas</span>
            )}
          </div>
          {allLessonCountsDefined ? (
            <p className={styles.totalTime}>
              <Clock3 aria-hidden="true" size={18} />
              Tempo total: {totalLessonCount} {totalLessonCount === 1 ? "aula" : "aulas"} · {totalLessonCount * LESSON_DURATION_MINUTES} minutos
            </p>
          ) : (
            <p className={styles.durationPrompt}>
              Defina a duração de {remainingDurations} {remainingDurations === 1 ? "material" : "materiais"} para ver o tempo total.
            </p>
          )}
          {hasUnsavedChanges ? <p className={styles.unsavedNotice}>Alterações não salvas</p> : null}
        </div>
        <div className={styles.pathHeaderActions}>
          <button className={styles.editPathButton} type="button" onClick={openSettings}>
            <Pencil aria-hidden="true" size={17} />
            Editar trilha
          </button>
          {hasUnsavedChanges ? (
            <button className={styles.discardButton} type="button" onClick={handleDiscardChanges}>
              <Undo2 aria-hidden="true" size={17} />
              Descartar
            </button>
          ) : null}
          <button className={styles.saveChangesButton} type="button" disabled={!hasUnsavedChanges} onClick={handleSaveChanges}>
            <Save aria-hidden="true" size={17} />
            Salvar alterações
          </button>
        </div>
      </header>

      <div className={styles.sequenceHeader}>
        <div>
          <p className={styles.eyebrow}>Percurso de aprendizagem</p>
          <strong>Da seleção à aplicação em sala de aula</strong>
          <p>Arraste uma etapa pelo marcador para reorganizar a trilha.</p>
        </div>
        {allLessonCountsDefined ? (
          <span className={styles.totalDuration}>
            <Clock3 aria-hidden="true" size={17} />
            {totalLessonCount * LESSON_DURATION_MINUTES} min no total
          </span>
        ) : null}
      </div>

      <ol className={styles.learningPath} aria-label="Etapas da trilha">
        {pathResources.map((item, index) => {
          const lessonCount = draft.lessonCountsByResourceId[item.resourceId];
          const isPendingRemoval = draft.removedResourceIds.includes(item.resourceId);
          const isDragging = draggedResourceId === item.resourceId;
          const isDropTarget = dropTargetId === item.resourceId && !isDragging;
          return (
            <li
              className={`${styles.pathStep} ${isPendingRemoval ? styles.pendingRemoval : ""} ${isDragging ? styles.dragging : ""} ${isDropTarget ? styles.dropTarget : ""}`}
              key={item.resourceId}
              draggable={!isPendingRemoval}
              onDragStart={(event) => handleDragStart(event, item.resourceId)}
              onDragOver={(event) => {
                if (!isPendingRemoval) {
                  event.preventDefault();
                  setDropTargetId(item.resourceId);
                }
              }}
              onDrop={(event) => handleDrop(event, item.resourceId)}
              onDragEnd={() => {
                setDraggedResourceId(null);
                setDropTargetId(null);
              }}
            >
              <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
              <article className={styles.stepCard}>
                <button
                  className={styles.stepButton}
                  type="button"
                  aria-label={`Abrir planejamento de ${item.resource.title}`}
                  onClick={() => setPreviewResourceId(item.resourceId)}
                >
                  <span className={styles.stepNode} aria-hidden="true">
                    <img
                      src={item.resource.image?.thumbnailSrc ?? item.resource.image?.src ?? RESOURCE_PLACEHOLDER}
                      alt=""
                    />
                    <span className={styles.stageLabel}>Etapa {index + 1}</span>
                    <span className={styles.dragHandle}>
                      <GripVertical size={18} />
                    </span>
                  </span>
                  <span className={styles.stepText}>
                    <span>{typeLabels[item.resource.type]}</span>
                    <strong>{item.resource.title}</strong>
                    <small>{item.teaching.studentActivity}</small>
                    <em>
                      <strong>Objetivo da etapa:</strong> {item.teaching.objective}
                    </em>
                    {isPendingRemoval ? <em>Será removido ao salvar as alterações.</em> : null}
                  </span>
                </button>
                <div className={styles.stepActions}>
                  <span className={lessonCount ? styles.durationSet : styles.durationUnset}>
                    {lessonCount ? lessonCountLabel(lessonCount) : "Duração não definida"}
                  </span>
                  {isPendingRemoval ? (
                    <button
                      className={styles.restoreButton}
                      type="button"
                      aria-label={`Desfazer remoção de ${item.resource.title}`}
                      onClick={() => restoreMarkedResource(item.resourceId, item.resource.title)}
                    >
                      <Undo2 aria-hidden="true" size={16} />
                      Desfazer
                    </button>
                  ) : (
                    <button
                      className={`${styles.iconButton} ${styles.removeButton}`}
                      type="button"
                      aria-label={`Marcar ${item.resource.title} para remoção`}
                      title="O material será removido apenas quando você salvar as alterações."
                      onClick={() => markForRemoval(item.resourceId, item.resource.title)}
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  )}
                </div>
              </article>
              <div className={styles.pathConnector} aria-hidden="true">
                <span className={styles.connectorRoute} />
              </div>
            </li>
          );
        })}

        <li className={styles.finalStep}>
          <span className={styles.finalIcon} aria-hidden="true">
            <TeachingPathIconGlyph icon={draft.icon} size={38} strokeWidth={2.1} />
          </span>
          <div>
            <h2>{draft.name}</h2>
            <p className={styles.finalObjective}>{draft.objective}</p>
            {curriculumCodes.length > 0 ? (
              <div className={styles.curriculumSummary}>
                <strong>Competências da BNCC relacionados</strong>
                <span>{curriculumCodes.join(" · ")}</span>
              </div>
            ) : null}
          </div>
        </li>
      </ol>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>

      <AccessibleDialog
        open={preview !== null}
        title={preview?.resource.title ?? "Material da trilha"}
        onClose={() => setPreviewResourceId(null)}
        size="large"
        hideHeader
      >
        {preview ? (
          <article
            className={`${lessonPlanStyles.blockPlan} ${lessonPlanStyles.compactBlockPlan}`}
            aria-label="Planejamento em blocos da etapa"
          >
            <header className={lessonPlanStyles.blockPlanHeading}>
              <span className={lessonPlanStyles.geometricShapeOne} aria-hidden="true" />
              <span className={lessonPlanStyles.geometricShapeTwo} aria-hidden="true" />
              <span className={lessonPlanStyles.geometricShapeThree} aria-hidden="true" />
              <div>
                <h3>{preview.resource.title}</h3>
                <span>
                  {getRelevantAlignments(preview)[0]?.grade ?? preview.teaching.grades[0]}º ano · {draft.lessonCountsByResourceId[preview.resourceId]
                    ? lessonCountLabel(draft.lessonCountsByResourceId[preview.resourceId]!)
                    : "duração não definida"}
                </span>
              </div>
            </header>
            <div className={lessonPlanStyles.blockGrid}>
              <section className={`${lessonPlanStyles.planBlock} ${lessonPlanStyles.bnccBlock}`}>
                <h3>Competências da BNCC</h3>
                <p className={lessonPlanStyles.bnccReference}>
                  {getRelevantAlignments(preview).map((alignment, index) => (
                    <span key={`${alignment.grade}-${alignment.skill.code}`}>
                      {index > 0 ? <br /> : null}
                      <strong>{alignment.skill.code}</strong> — {alignment.skill.officialText}
                    </span>
                  ))}
                </p>
              </section>
              <section className={`${lessonPlanStyles.planBlock} ${lessonPlanStyles.objectiveBlock}`}>
                <h3>Objetivo</h3>
                <p>{preview.teaching.objective}</p>
              </section>
              <section className={`${lessonPlanStyles.planBlock} ${lessonPlanStyles.materialsBlock}`}>
                <h3>Materiais</h3>
                <ul className={lessonPlanStyles.materialList}>
                  {preview.teaching.materials.map((material) => <li key={material}>{material}</li>)}
                </ul>
              </section>
              <section className={`${lessonPlanStyles.planBlock} ${lessonPlanStyles.methodologyBlock}`}>
                <h3>Metodologia</h3>
                <p>{preview.teaching.studentActivity}</p>
              </section>
              <section className={`${lessonPlanStyles.planBlock} ${lessonPlanStyles.evaluationBlock}`}>
                <h3>Duração</h3>
                <fieldset className={styles.durationField}>
                  <legend className="sr-only">Duração da etapa</legend>
                  <div className={lessonPlanStyles.durationOptions}>
                    {lessonCounts.map((count) => {
                      const checked = draft.lessonCountsByResourceId[preview.resourceId] === count;
                      return (
                        <label className={lessonPlanStyles.durationOption} key={count}>
                          <input
                            type="radio"
                            name={`path-duration-${preview.resourceId}`}
                            checked={checked}
                            onChange={() => {
                              updateDraft((current) => ({
                                ...current,
                                lessonCountsByResourceId: {
                                  ...current.lessonCountsByResourceId,
                                  [preview.resourceId]: count,
                                },
                              }));
                              setAnnouncement(`${preview.resource.title}: ${lessonCountLabel(count)} definida no rascunho.`);
                            }}
                          />
                          <strong>{count} {count === 1 ? "aula" : "aulas"}</strong>
                          <small>{count * LESSON_DURATION_MINUTES} min</small>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </section>
            </div>
            <footer className={lessonPlanStyles.blockPlanFooter} aria-hidden="true">
              <span />
              <span />
              <span />
            </footer>
            <Link
              className={styles.catalogLink}
              to={`/app/materiais/${preview.resource.slug}`}
              state={{ from: "/app/minhas-trilhas" }}
            >
              Ver material completo
            </Link>
          </article>
        ) : null}
      </AccessibleDialog>

      <AccessibleDialog
        open={isSettingsDialogOpen}
        title="Editar trilha"
        description="Altere o nome, o objetivo, a cor de fundo ou o ícone. Depois, salve as alterações da trilha."
        onClose={() => {
          setIsSettingsDialogOpen(false);
          setSettingsDraft(null);
        }}
        size="medium"
      >
        {settingsDraft ? (
          <form
            className={styles.settingsForm}
            onSubmit={(event) => {
              event.preventDefault();
              applySettings();
            }}
          >
            <label htmlFor="edit-teaching-path-name">Nome da trilha</label>
            <input
              id="edit-teaching-path-name"
              value={settingsDraft.name}
              onChange={(event) => setSettingsDraft((current) => current ? { ...current, name: event.target.value } : current)}
              required
            />
            <label htmlFor="edit-teaching-path-objective">Objetivo da trilha</label>
            <textarea
              id="edit-teaching-path-objective"
              value={settingsDraft.objective}
              onChange={(event) => setSettingsDraft((current) => current ? { ...current, objective: event.target.value } : current)}
              maxLength={500}
              required
            />
            <fieldset className={styles.appearanceFieldset}>
              <legend>Cor de fundo</legend>
              <div className={styles.colorOptions}>
                {TEACHING_PATH_BACKGROUND_COLORS.map((color) => (
                  <button
                    className={`${styles.colorOption} ${styles[colorOptionClassNames[color]]}`}
                    type="button"
                    key={color}
                    aria-pressed={settingsDraft.backgroundColor === color}
                    onClick={() => setSettingsDraft((current) => current ? { ...current, backgroundColor: color } : current)}
                  >
                    <span aria-hidden="true" />
                    {teachingPathColorLabels[color]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className={styles.appearanceFieldset}>
              <legend>Ícone da trilha</legend>
              <div className={styles.iconOptions}>
                {TEACHING_PATH_ICONS.map((icon) => (
                  <button
                    className={styles.iconOption}
                    type="button"
                    key={icon}
                    aria-pressed={settingsDraft.icon === icon}
                    aria-label={`Usar ícone ${teachingPathIconLabels[icon]}`}
                    title={teachingPathIconLabels[icon]}
                    onClick={() => setSettingsDraft((current) => current ? { ...current, icon } : current)}
                  >
                    <TeachingPathIconGlyph icon={icon} size={20} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className={styles.dialogActions}>
              <button type="button" onClick={() => {
                setIsSettingsDialogOpen(false);
                setSettingsDraft(null);
              }}>Cancelar</button>
              <button type="submit" disabled={!settingsDraft.name.trim() || !settingsDraft.objective.trim()}>Aplicar ao rascunho</button>
            </div>
          </form>
        ) : null}
      </AccessibleDialog>
    </section>
  );
}
