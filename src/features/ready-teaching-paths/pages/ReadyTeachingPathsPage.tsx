import {
  ArrowRight,
  Braces,
  Check,
  Clock3,
  CopyPlus,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { RESOURCE_PLACEHOLDER, typeLabels } from "@/features/catalog/components/resourcePresentation";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import { pilotTeachingResources } from "@/features/teaching-paths/data/pilotTeachingResources";
import type { Resource } from "@/domain/resource";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import styles from "./ReadyTeachingPathsPage.module.css";

type TrailCategory = "Todas" | "Pensamento Computacional" | "Mundo Digital" | "Cultura Digital";

interface TrailPreview {
  id: string;
  name: string;
  summary: string;
  category: Exclude<TrailCategory, "Todas">;
  grades: string;
  lessons: number;
  icon: ComponentType<{ size?: number; "aria-hidden"?: "true" }>;
}

const categories: readonly TrailCategory[] = [
  "Todas",
  "Pensamento Computacional",
  "Mundo Digital",
  "Cultura Digital",
];

const trailPreviews: readonly TrailPreview[] = [
  {
    id: "algoritmos-decisoes-blocos-desafios",
    name: "Algoritmos: decisões, blocos e desafios",
    summary: "Uma progressão da lógica desplugada à programação visual e à resolução de problemas.",
    category: "Pensamento Computacional",
    grades: "5º ano",
    lessons: 3,
    icon: Braces,
  },
] as const;

const readyPath = {
  name: "Algoritmos: decisões, blocos e desafios",
  objective:
    "Compreender como algoritmos organizam decisões e sequências, avançando de uma experiência desplugada para a programação em blocos e um desafio integrado.",
  resourceIds: [
    "unicamp-desplugada-atividade-5",
    "google-blockly-games",
    "rozelma-sertao-bit",
  ],
  stages: [
    {
      label: "Descobrir",
      title: "Decisões com perguntas de sim ou não",
      description:
        "A turma experimenta uma estratégia desplugada e percebe como cada decisão reduz as possibilidades.",
    },
    {
      label: "Experimentar",
      title: "Algoritmos visuais com blocos",
      description:
        "Os estudantes resolvem desafios progressivos e aplicam sequências, laços e condicionais.",
    },
    {
      label: "Aplicar",
      title: "Desafios em uma narrativa brasileira",
      description:
        "A aprendizagem é consolidada em problemas de decomposição, padrões e construção de algoritmos.",
    },
  ],
} as const;

interface ReadyStage {
  resource: Resource;
  label: string;
  title: string;
  description: string;
}

function getReadyStages(resources: Resource[]): ReadyStage[] {
  const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
  return readyPath.resourceIds.flatMap((resourceId, index) => {
    const resource = resourcesById.get(resourceId);
    const stage = readyPath.stages[index];
    return resource && stage ? [{ resource, ...stage }] : [];
  });
}

function hasSameResources(resourceIds: readonly string[]) {
  return (
    resourceIds.length === readyPath.resourceIds.length &&
    readyPath.resourceIds.every((resourceId, index) => resourceIds[index] === resourceId)
  );
}

function TrailCard({
  trail,
  selected,
  onSelect,
}: {
  trail: TrailPreview;
  selected: boolean;
  onSelect: (trailId: string) => void;
}) {
  const Icon = trail.icon;
  return (
    <article
      className={styles.trailCard}
      data-selected={selected || undefined}
    >
      <span className={styles.trailIcon} aria-hidden="true"><Icon size={23} /></span>
      <div className={styles.trailCardBody}>
        <span className={styles.category}>{trail.category}</span>
        <h3>{trail.name}</h3>
        <p>{trail.summary}</p>
        <div className={styles.cardMetadata}>
          <span>{trail.grades}</span>
          <span><Clock3 size={14} aria-hidden="true" /> {trail.lessons} aulas</span>
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
        aria-controls="trilha-algoritmos"
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
  const stages = useMemo(() => getReadyStages(resources), [resources]);
  const filteredTrails = trailPreviews.filter(
    (trail) => selectedCategory === "Todas" || trail.category === selectedCategory,
  );
  const importedPath = paths.find(
    (path) => path.name === readyPath.name && hasSameResources(path.resourceIds),
  );

  useEffect(() => {
    if (!selectedTrailId) return;
    const detail = document.getElementById("trilha-algoritmos");
    if (detail && typeof detail.scrollIntoView === "function") {
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTrailId]);

  const copyReadyPath = () => {
    if (importedPath) {
      navigate("/app/minhas-trilhas");
      return;
    }

    const path = createPath(readyPath.name, readyPath.resourceIds, {
      objective: readyPath.objective,
      backgroundColor: "amber",
      icon: "sparkles",
    });
    if (!path) return;

    readyPath.resourceIds.forEach((resourceId) => {
      setResourceLessonCount(path.id, resourceId, 1);
    });
    setAnnouncement(`A trilha “${readyPath.name}” foi adicionada a Minhas Trilhas.`);
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

  if (status === "error" || stages.length !== readyPath.resourceIds.length) {
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
        <p>
          Explore percursos organizados por conteúdo, com objetivos claros e materiais em uma
          ordem pedagógica sugerida.
        </p>
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

      {selectedTrailId === "algoritmos-decisoes-blocos-desafios" ? (
        <article className={styles.readyPath} id="trilha-algoritmos" aria-labelledby="ready-path-title">
        <header className={styles.pathHeader}>
          <div className={styles.pathTitleBlock}>
            <span className={styles.featuredLabel}>Disponível agora</span>
            <h2 id="ready-path-title">Algoritmos: decisões, blocos e desafios</h2>
            <p>{readyPath.objective}</p>
            <div className={styles.metadata} aria-label="Informações da trilha">
              <span>5º ano</span>
              <span>Pensamento Computacional</span>
              <span><Clock3 size={15} aria-hidden="true" /> 3 aulas sugeridas</span>
            </div>
          </div>
          <button className={styles.copyButton} type="button" onClick={copyReadyPath}>
            {importedPath ? <Check size={19} aria-hidden="true" /> : <CopyPlus size={19} aria-hidden="true" />}
            {importedPath ? "Ver em Minhas Trilhas" : "Adicionar às Minhas Trilhas"}
          </button>
        </header>

        <section className={styles.pathBody} aria-labelledby="path-steps-title">
          <div className={styles.stepsHeading}>
            <div>
              <p className={styles.eyebrow}>Percurso de aprendizagem</p>
              <h3 id="path-steps-title">Da decisão à construção de algoritmos</h3>
            </div>
            <span>{stages.length} etapas</span>
          </div>

          <ol className={styles.timeline} aria-label="Etapas da trilha pronta">
            {stages.map((stage, index) => {
              const teaching = pilotTeachingResources.find(
                (item) => item.resourceId === stage.resource.id,
              );
              return (
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
                      <span className={styles.resourceType}>{typeLabels[stage.resource.type]}</span>
                      <h4>{stage.title}</h4>
                      <p>{stage.description}</p>
                      <p className={styles.resourceName}>{stage.resource.title}</p>
                      {teaching ? (
                        <p className={styles.stageObjective}>
                          <strong>Objetivo da etapa:</strong> {teaching.objective}
                        </p>
                      ) : null}
                      <Link
                        to={`/app/materiais/${stage.resource.slug}`}
                        state={{ from: "/app/trilhas-prontas" }}
                      >
                        Ver material completo <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
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
