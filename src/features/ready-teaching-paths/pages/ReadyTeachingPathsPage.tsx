import {
  ArrowRight,
  Check,
  Clock3,
  CopyPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trackClarityEvent } from "@/lib/clarity";

import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { formatRecommendedGrades, RESOURCE_PLACEHOLDER, typeLabels } from "@/features/catalog/components/resourcePresentation";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import type { Resource } from "@/domain/resource";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { categories, getReadyPathLessonCount, readyPaths, type ReadyPath, type TrailCategory } from "../data/readyTeachingPaths";
import styles from "./ReadyTeachingPathsPage.module.css";

type ReadyStage = ReadyPath["stages"][number] & { resource: Resource };

function getReadyStages(resources: Resource[], readyPath: ReadyPath): ReadyStage[] {
  const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
  return readyPath.stages.flatMap((stage) => {
    const resource = resourcesById.get(stage.resourceId);
    return resource && stage ? [{ resource, ...stage }] : [];
  });
}

function getReadyPathResourceIds(readyPath: ReadyPath) {
  return readyPath.stages.map((stage) => stage.resourceId);
}

function hasSameResources(readyPath: ReadyPath, resourceIds: readonly string[]) {
  const readyResourceIds = getReadyPathResourceIds(readyPath);
  return (
    resourceIds.length === readyResourceIds.length &&
    readyResourceIds.every((resourceId, index) => resourceIds[index] === resourceId)
  );
}

function TrailCard({
  trail,
  selected,
  onSelect,
}: {
  trail: ReadyPath;
  selected: boolean;
  onSelect: (trailId: string) => void;
}) {
  const Icon = trail.icon;
  return (
    <article
      className={styles.trailCard}
      data-category={trail.category}
      data-selected={selected || undefined}
    >
      <span className={styles.trailIcon} aria-hidden="true"><Icon size={23} /></span>
      <div className={styles.trailCardBody}>
        <span className={styles.category}>{trail.category}</span>
        <h3>{trail.name}</h3>
        <p>{trail.summary}</p>
        <div className={styles.cardMetadata}>
          <span>{formatRecommendedGrades([...trail.grades])}</span>
          <span><Clock3 size={14} aria-hidden="true" /> {getReadyPathLessonCount(trail)} aulas</span>
        </div>
      </div>
      <span className={styles.cardAction}>
        Ver trilha <ArrowRight size={16} aria-hidden="true" />
      </span>
      <button
        className={styles.cardOverlay}
        type="button"
        aria-label={`Ver trilha ${trail.name}`}
        aria-expanded={selected}
        aria-controls="trilha-pronta-detalhe"
        onClick={() => onSelect(trail.id)}
      />
    </article>
  );
}

export function ReadyTeachingPathsPage() {
  const { resources, status } = useCatalogResources();
  const navigate = useNavigate();
  const paths = useTeachingPathsStore((state) => state.paths);
  const createPath = useTeachingPathsStore((state) => state.createPath);
  const setResourceLessonCount = useTeachingPathsStore((state) => state.setResourceLessonCount);
  const [selectedCategory, setSelectedCategory] = useState<TrailCategory>("Todas");
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const selectedReadyPath = readyPaths.find((trail) => trail.id === selectedTrailId) ?? null;
  const selectedLessonCount = selectedReadyPath ? getReadyPathLessonCount(selectedReadyPath) : 0;
  const stages = useMemo(
    () => (selectedReadyPath ? getReadyStages(resources, selectedReadyPath) : []),
    [resources, selectedReadyPath],
  );
  const filteredTrails = readyPaths.filter(
    (trail) => selectedCategory === "Todas" || trail.category === selectedCategory,
  );
  const importedPath = selectedReadyPath
    ? paths.find(
        (path) =>
          path.name === selectedReadyPath.name && hasSameResources(selectedReadyPath, path.resourceIds),
      )
    : undefined;
  const hasUnavailableMaterial = readyPaths.some(
    (readyPath) => getReadyStages(resources, readyPath).length !== readyPath.stages.length,
  );

  useEffect(() => {
    if (!selectedTrailId) return;
    const detail = document.getElementById("trilha-pronta-detalhe");
    if (detail && typeof detail.scrollIntoView === "function") {
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTrailId]);

  const copyReadyPath = () => {
    if (!selectedReadyPath) return;

    if (importedPath) {
      navigate("/app/minhas-trilhas");
      return;
    }

    const resourceIds = getReadyPathResourceIds(selectedReadyPath);
    const path = createPath(selectedReadyPath.name, resourceIds, {
      objective: selectedReadyPath.objective,
      backgroundColor: selectedReadyPath.backgroundColor,
      icon: selectedReadyPath.savedIcon,
    });
    if (!path) return;

    selectedReadyPath.stages.forEach((stage) => {
      setResourceLessonCount(path.id, stage.resourceId, stage.lessonCount ?? 1);
    });
    trackClarityEvent("trilha_pronta_adicionada");
    setAnnouncement(`A trilha “${selectedReadyPath.name}” foi adicionada a Minhas Trilhas.`);
  };

  if (status === "loading") {
    return (
      <CatalogStatus
        busy
        title="Preparando as Trilhas Prontas"
        message="Estamos reunindo os materiais e as sequências de aprendizagem."
      />
    );
  }

  if (status === "error" || hasUnavailableMaterial) {
    return (
      <CatalogStatus
        title="Não foi possível carregar as trilhas"
        message="Um ou mais materiais não estão disponíveis neste momento."
      />
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Sequências selecionadas</p>
        <h1>Trilhas Prontas</h1>
      </header>

      <section className={styles.discovery} aria-labelledby="discovery-title">
        <div>
          <p className={styles.eyebrow}>Explore a coleção</p>
          <h2 id="discovery-title">Que tema você quer trabalhar?</h2>
        </div>
        <div className={styles.categoryFilters} aria-label="Filtrar trilhas por tema">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={selectedCategory === category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedTrailId(null);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.collectionSection} aria-labelledby="available-trails-title">
        <div className={styles.sectionHeading}>
          <h2 id="available-trails-title">Trilhas disponíveis</h2>
          <span>{filteredTrails.length} {filteredTrails.length === 1 ? "trilha" : "trilhas"}</span>
        </div>
        {filteredTrails.length > 0 ? (
          <div className={styles.trailGrid}>
            {filteredTrails.map((trail) => (
              <TrailCard
                trail={trail}
                selected={selectedTrailId === trail.id}
                onSelect={setSelectedTrailId}
                key={trail.id}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            <p>Nenhuma trilha disponível neste eixo por enquanto.</p>
          </div>
        )}
      </section>

      {selectedReadyPath ? (
        <article
          className={styles.readyPath}
          id="trilha-pronta-detalhe"
          aria-labelledby="ready-path-title"
          data-category={selectedReadyPath.category}
        >
          <header className={styles.pathHeader}>
            <div className={styles.pathTitleBlock}>
              <span className={styles.featuredLabel}>Disponível agora</span>
              <h2 id="ready-path-title">{selectedReadyPath.name}</h2>
              <p>{selectedReadyPath.objective}</p>
              <div className={styles.metadata} aria-label="Informações da trilha">
                <span>{formatRecommendedGrades([...selectedReadyPath.grades])}</span>
                <span>{selectedReadyPath.category}</span>
                <span>
                  <Clock3 size={15} aria-hidden="true" /> {selectedLessonCount}{" "}
                  {selectedLessonCount === 1 ? "aula sugerida" : "aulas sugeridas"}
                </span>
              </div>
            </div>
            <button className={styles.copyButton} type="button" onClick={copyReadyPath}>
              {importedPath ? (
                <Check size={19} aria-hidden="true" />
              ) : (
                <CopyPlus size={19} aria-hidden="true" />
              )}
              {importedPath ? "Ver em Minhas Trilhas" : "Adicionar às Minhas Trilhas"}
            </button>
          </header>

          <section className={styles.pathBody} aria-labelledby="path-steps-title">
            <div className={styles.stepsHeading}>
              <div>
                <p className={styles.eyebrow}>Percurso de aprendizagem</p>
                <h3 id="path-steps-title">{selectedReadyPath.journeyTitle}</h3>
              </div>
              <span>
                {stages.length} {stages.length === 1 ? "etapa" : "etapas"}
              </span>
            </div>

            <ol className={styles.timeline} aria-label="Etapas da trilha pronta">
              {stages.map((stage, index) => (
                <li key={stage.resource.id}>
                  <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                  <div className={styles.stageCard}>
                    <div className={styles.imageWrap}>
                      <img
                        src={stage.resource.image?.thumbnailSrc ?? stage.resource.image?.src ?? RESOURCE_PLACEHOLDER}
                        alt={stage.resource.image?.alt ?? ""}
                      />
                      <span>{stage.label}</span>
                    </div>
                    <div className={styles.stageContent}>
                      <span className={styles.resourceType}>
                        {typeLabels[stage.resource.type]} · {stage.lessonCount ?? 1}{" "}
                        {stage.lessonCount === undefined || stage.lessonCount === 1 ? "aula" : "aulas"}
                      </span>
                      <h4>{stage.title}</h4>
                      <p>{stage.description}</p>
                      <p className={styles.resourceName}>{stage.resource.title}</p>
                      <p className={styles.stageObjective}>
                        <strong>Objetivo da etapa:</strong> {stage.objective}
                      </p>
                      <Link
                        to={`/app/materiais/${stage.resource.slug}`}
                        state={{ from: "/app/trilhas-prontas" }}
                      >
                        Ver material completo <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </article>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
