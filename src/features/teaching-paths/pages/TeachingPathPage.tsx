import { useMemo, useState } from "react";
import { Check, ListChecks, Plus, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import {
  RESOURCE_PLACEHOLDER,
  typeLabels,
} from "@/features/catalog/components/resourcePresentation";
import { useCatalogResources } from "@/features/catalog/hooks/useCatalog";
import { SUPPORTED_GRADES, type Grade } from "@/domain/curriculum";
import {
  DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
  DEFAULT_TEACHING_PATH_ICON,
  TEACHING_PATH_BACKGROUND_COLORS,
  TEACHING_PATH_ICONS,
  type TeachingPathBackgroundColor,
  type TeachingPathIcon,
} from "@/domain/savedTeachingPath";
import type { Resource } from "@/domain/resource";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import {
  TeachingPathIconGlyph,
} from "../components/TeachingPathAppearance";
import {
  teachingPathColorLabels,
  teachingPathIconLabels,
} from "../components/teachingPathAppearanceOptions";
import {
  getTeachingResourceMetadata,
  type ActivityMode,
  type PilotTeachingResource,
  type TeachingApproach,
} from "../data/pilotTeachingResources";
import styles from "./TeachingPathPage.module.css";

interface TeachingResourceView {
  resource: Resource;
  teaching: PilotTeachingResource;
}

type ActivityFilter = Exclude<ActivityMode, "mixed">;
type ApproachFilter = Extract<TeachingApproach, "active" | "expository">;

const activityModeLabels: Record<ActivityMode, string> = {
  plugged: "Material plugado",
  unplugged: "Material desplugado",
  mixed: "Material plugado e desplugado",
};

const teachingApproachLabels: Record<TeachingApproach, string> = {
  active: "Abordagem ativa",
  combined: "Abordagem combinada",
  expository: "Abordagem expositiva",
};

const colorOptionClassNames: Record<TeachingPathBackgroundColor, string> = {
  turquoise: "colorTurquoise",
  blue: "colorBlue",
  violet: "colorViolet",
  amber: "colorAmber",
  coral: "colorCoral",
};

function normalizeSearchTerm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function matchesSearch({ resource, teaching }: TeachingResourceView, query: string) {
  const normalizedQuery = normalizeSearchTerm(query);
  if (!normalizedQuery) return true;

  const searchableContent = normalizeSearchTerm(
    [resource.title, resource.topic, ...teaching.searchAliases].join(" "),
  );

  return searchableContent.includes(normalizedQuery);
}

function getTeachingResources(resources: Resource[]): TeachingResourceView[] {
  return resources.map((resource) => ({
    resource,
    teaching: getTeachingResourceMetadata(resource),
  }));
}

function toggleFilter<T extends string | number>(values: readonly T[], value: T) {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

export function TeachingPathPage() {
  const { resources, status } = useCatalogResources();
  const navigate = useNavigate();
  const savedPaths = useTeachingPathsStore((state) => state.paths);
  const createPath = useTeachingPathsStore((state) => state.createPath);
  const addResourceToPath = useTeachingPathsStore((state) => state.addResourceToPath);
  const [query, setQuery] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);
  const [selectedActivityModes, setSelectedActivityModes] = useState<ActivityFilter[]>([]);
  const [selectedApproaches, setSelectedApproaches] = useState<ApproachFilter[]>([]);
  const [trailIds, setTrailIds] = useState<string[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [pathName, setPathName] = useState("");
  const [pathObjective, setPathObjective] = useState("");
  const [pathBackgroundColor, setPathBackgroundColor] = useState<TeachingPathBackgroundColor>(
    DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
  );
  const [pathIcon, setPathIcon] = useState<TeachingPathIcon>(DEFAULT_TEACHING_PATH_ICON);
  const [resourceToAddToExisting, setResourceToAddToExisting] = useState<string | null>(null);
  const [existingPathId, setExistingPathId] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const teachingResources = useMemo(() => getTeachingResources(resources), [resources]);
  const teachingById = useMemo(
    () => new Map(teachingResources.map((item) => [item.resource.id, item])),
    [teachingResources],
  );

  const filteredResources = useMemo(
    () =>
      teachingResources.filter((item) => {
        const matchesGrade =
          selectedGrades.length === 0 ||
          item.teaching.grades.some((grade) => selectedGrades.includes(grade));
        const matchesActivityMode =
          selectedActivityModes.length === 0 ||
          item.teaching.activityMode === "mixed" ||
          selectedActivityModes.includes(item.teaching.activityMode);
        const matchesApproach =
          selectedApproaches.length === 0 ||
          (item.teaching.teachingApproach !== "combined" &&
            selectedApproaches.includes(item.teaching.teachingApproach));

        return (
          matchesGrade &&
          matchesActivityMode &&
          matchesApproach &&
          matchesSearch(item, query)
        );
      }),
    [teachingResources, query, selectedActivityModes, selectedApproaches, selectedGrades],
  );

  const trail = trailIds.flatMap((id) => {
    const item = teachingById.get(id);
    return item ? [item] : [];
  });
  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedGrades.length > 0 ||
    selectedActivityModes.length > 0 ||
    selectedApproaches.length > 0;

  const addToTrail = (item: TeachingResourceView) => {
    if (trailIds.includes(item.resource.id)) return;

    setTrailIds((current) => [...current, item.resource.id]);
    setAnnouncement(`${item.resource.title} foi adicionado à trilha em criação.`);
  };

  const removeFromTrail = (item: TeachingResourceView) => {
    setTrailIds((current) => current.filter((id) => id !== item.resource.id));
    setAnnouncement(`${item.resource.title} foi removido da trilha em criação.`);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedGrades([]);
    setSelectedActivityModes([]);
    setSelectedApproaches([]);
  };

  const savePath = () => {
    const path = createPath(pathName, trailIds, {
      objective: pathObjective,
      backgroundColor: pathBackgroundColor,
      icon: pathIcon,
    });
    if (!path) return;

    setAnnouncement(`A trilha “${path.name}” foi salva em Minhas Trilhas.`);
    setTrailIds([]);
    setPathName("");
    setPathObjective("");
    setPathBackgroundColor(DEFAULT_TEACHING_PATH_BACKGROUND_COLOR);
    setPathIcon(DEFAULT_TEACHING_PATH_ICON);
    setIsSaveDialogOpen(false);
    navigate("/app/minhas-trilhas");
  };

  const openExistingPathDialog = (resourceId: string) => {
    const availablePaths = savedPaths.filter((path) => !path.resourceIds.includes(resourceId));
    if (availablePaths.length === 0) return;

    setResourceToAddToExisting(resourceId);
    setExistingPathId(availablePaths[0].id);
  };

  const addToExistingPath = () => {
    if (!resourceToAddToExisting || !existingPathId) return;
    const resource = teachingById.get(resourceToAddToExisting)?.resource;
    const path = savedPaths.find((item) => item.id === existingPathId);
    if (!resource || !path || !addResourceToPath(path.id, resource.id)) return;

    setAnnouncement(`${resource.title} foi adicionado à trilha “${path.name}”.`);
    setResourceToAddToExisting(null);
    setExistingPathId("");
  };

  if (status === "loading") {
    return (
      <CatalogStatus
        busy
        title="Preparando os materiais"
        message="Estamos organizando os recursos para a criação da trilha."
      />
    );
  }

  if (status === "error") {
    return (
      <CatalogStatus
        title="Não foi possível carregar os materiais"
        message="Tente abrir esta página novamente. Sua trilha ainda não foi iniciada."
      />
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Planejamento por materiais</p>
        <h1>Buscar Materiais</h1>
        <p>
          Pesquise e selecione os materiais que contribuem
          para o seu objetivo de ensino.
        </p>
      </header>

      <section className={styles.searchSurface} aria-labelledby="discovery-title">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden="true">
            <Search size={21} />
          </span>
          <div>
            <p>Encontre materiais</p>
            <h2 id="discovery-title">Por onde você quer começar?</h2>
          </div>
        </div>

        <label className="sr-only" htmlFor="teaching-path-query">
          Pesquisar área, assunto ou habilidade
        </label>
        <div className={styles.searchInput}>
          <Search size={20} aria-hidden="true" />
          <input
            id="teaching-path-query"
            type="search"
            placeholder="Pesquise um assunto, como laço de repetição"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className={styles.tagGroups} aria-label="Filtros da busca">
          <div className={styles.tagGroup}>
            <span className={styles.tagLabel}>Ano escolar</span>
            <div className={styles.tagList}>
              <button
                className={styles.filterTag}
                type="button"
                aria-pressed={selectedGrades.length === 0}
                onClick={() => setSelectedGrades([])}
              >
                Todos os anos
              </button>
              {SUPPORTED_GRADES.map((grade) => (
                <button
                  className={styles.filterTag}
                  type="button"
                  aria-pressed={selectedGrades.includes(grade)}
                  key={grade}
                  onClick={() => setSelectedGrades((current) => toggleFilter(current, grade))}
                >
                  {grade}º ano
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tagGroup}>
            <span className={styles.tagLabel}>Formato</span>
            <div className={styles.tagList}>
              {([
                ["plugged", "Material plugado"],
                ["unplugged", "Material desplugado"],
              ] as const).map(([value, label]) => (
                <button
                  className={styles.filterTag}
                  type="button"
                  aria-pressed={selectedActivityModes.includes(value)}
                  key={value}
                  onClick={() =>
                    setSelectedActivityModes((current) => toggleFilter(current, value))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tagGroup}>
            <span className={styles.tagLabel}>Abordagem</span>
            <div className={styles.tagList}>
              {([
                ["active", "Abordagem ativa"],
                ["expository", "Abordagem expositiva"],
              ] as const).map(([value, label]) => (
                <button
                  className={styles.filterTag}
                  type="button"
                  aria-pressed={selectedApproaches.includes(value)}
                  key={value}
                  onClick={() =>
                    setSelectedApproaches((current) => toggleFilter(current, value))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasActiveFilters ? (
          <button className={styles.clearFilters} type="button" onClick={clearFilters}>
            <X size={16} aria-hidden="true" />
            Limpar filtros
          </button>
        ) : null}
      </section>

      <section className={styles.trailSummary} aria-labelledby="trail-title">
        <div className={styles.trailHeading}>
          <span className={styles.trailIcon} aria-hidden="true">
            <ListChecks size={20} />
          </span>
          <div>
            <h2 id="trail-title">Nova trilha em criação</h2>
            <p>
              {trail.length === 0
                ? "Selecione materiais para começar."
                : `${trail.length} ${trail.length === 1 ? "material selecionado" : "materiais selecionados"}.`}
            </p>
          </div>
          <button
            className={styles.saveButton}
            type="button"
            disabled={trail.length === 0}
            title={trail.length === 0 ? "Selecione ao menos um material para salvar." : undefined}
            onClick={() => setIsSaveDialogOpen(true)}
          >
            Salvar trilha
          </button>
        </div>

        {trail.length > 0 ? (
          <ul className={styles.selectedMaterials} aria-label="Materiais selecionados">
            {trail.map((item) => (
              <li key={item.resource.id}>
                <span>{item.resource.title}</span>
                <button
                  type="button"
                  aria-label={`Remover ${item.resource.title} da trilha`}
                  title={`Remover ${item.resource.title}`}
                  onClick={() => removeFromTrail(item)}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className={styles.trailNote}>
          Ao salvar, você poderá definir a duração de cada material e reorganizar a sequência em
          Minhas Trilhas.
        </p>
      </section>

      <section className={styles.results} aria-labelledby="results-title">
        <div className={styles.resultsHeader}>
          <div>
            <p>Materiais disponíveis</p>
            <h2 id="results-title">Materiais encontrados</h2>
          </div>
          <span aria-live="polite">
            {filteredResources.length} {filteredResources.length === 1 ? "material" : "materiais"}
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className={styles.emptyResults} role="status">
            <Search size={28} aria-hidden="true" />
            <strong>Nenhum material encontrado</strong>
            <p>Tente outro termo ou retire alguma tag de filtro.</p>
          </div>
        ) : (
          <div className={styles.resultList} aria-label="Resultados da busca">
            {filteredResources.map((item) => {
              const { resource, teaching } = item;
              const isAdded = trailIds.includes(resource.id);
              const availableExistingPaths = savedPaths.filter(
                (path) => !path.resourceIds.includes(resource.id),
              );

              return (
                <article className={styles.resourceCard} key={resource.id}>
                  <Link
                    className={styles.resourcePreview}
                    to={`/app/materiais/${resource.slug}`}
                    state={{ from: "/app/trilha-de-ensino" }}
                    aria-label={`Abrir detalhes de ${resource.title}`}
                  >
                    <div className={styles.resourceImage}>
                      <img
                        src={resource.image?.thumbnailSrc ?? resource.image?.src ?? RESOURCE_PLACEHOLDER}
                        alt={resource.image?.alt ?? ""}
                      />
                    </div>
                    <div className={styles.resourceContent}>
                      <div className={styles.resourceIntro}>
                      <div className={styles.badges}>
                        <span>{typeLabels[resource.type]}</span>
                        <span>{activityModeLabels[teaching.activityMode]}</span>
                        <span>{teachingApproachLabels[teaching.teachingApproach]}</span>
                      </div>
                      <h3>{resource.title}</h3>
                      <p className={styles.topic}>{resource.topic}</p>
                        <p className={styles.objective}>
                          <strong>Objetivo</strong>
                          {teaching.objective}
                        </p>
                      </div>
                      <div className={styles.resourceDetails}>
                        <p className={styles.previewDetail}>
                          <strong>O que farão e como</strong>
                          {teaching.studentActivity}
                        </p>
                        <p className={styles.materials}>
                          <strong>Materiais</strong>
                          {teaching.materials.join(" · ")}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className={styles.cardAction}>
                    <span className={styles.actionLabel}>Adicionar a</span>
                    <button
                      className={styles.newTrailButton}
                      type="button"
                      disabled={isAdded}
                      aria-label={
                        isAdded
                          ? `${resource.title} já foi adicionado à nova trilha`
                          : `Adicionar ${resource.title} a uma nova trilha`
                      }
                      onClick={() => addToTrail(item)}
                    >
                      {isAdded ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                      {isAdded ? "Na nova trilha" : "Nova trilha"}
                    </button>
                    <button
                      className={styles.existingTrailButton}
                      type="button"
                      disabled={availableExistingPaths.length === 0}
                      aria-label={
                        availableExistingPaths.length === 0
                          ? `Não há trilha existente disponível para adicionar ${resource.title}`
                          : `Adicionar ${resource.title} a uma trilha existente`
                      }
                      title={
                        availableExistingPaths.length === 0
                          ? "Salve uma trilha para usar esta opção."
                          : undefined
                      }
                      onClick={() => openExistingPathDialog(resource.id)}
                    >
                      Trilha existente
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <AccessibleDialog
        open={isSaveDialogOpen}
        title="Salvar trilha"
        description="Defina a identificação e a intenção pedagógica da sua trilha. Você poderá editar tudo depois."
        onClose={() => setIsSaveDialogOpen(false)}
        size="small"
      >
        <form
          className={styles.dialogForm}
          onSubmit={(event) => {
            event.preventDefault();
            savePath();
          }}
        >
          <label htmlFor="teaching-path-name">Nome da trilha</label>
          <input
            id="teaching-path-name"
            value={pathName}
            onChange={(event) => setPathName(event.target.value)}
            placeholder="Ex.: Algoritmos com jogos e desafios"
            autoFocus
          />
          <label htmlFor="teaching-path-objective">Objetivo da trilha</label>
          <textarea
            id="teaching-path-objective"
            value={pathObjective}
            onChange={(event) => setPathObjective(event.target.value)}
            placeholder="Ex.: Desenvolver a compreensão de algoritmos com jogos e desafios."
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
                  aria-pressed={pathBackgroundColor === color}
                  onClick={() => setPathBackgroundColor(color)}
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
                  aria-pressed={pathIcon === icon}
                  aria-label={`Usar ícone ${teachingPathIconLabels[icon]}`}
                  title={teachingPathIconLabels[icon]}
                  onClick={() => setPathIcon(icon)}
                >
                  <TeachingPathIconGlyph icon={icon} size={20} aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          <p>{trail.length} {trail.length === 1 ? "material será salvo." : "materiais serão salvos."}</p>
          <div className={styles.dialogActions}>
            <button type="button" onClick={() => setIsSaveDialogOpen(false)}>Cancelar</button>
            <button type="submit" disabled={pathName.trim().length === 0 || pathObjective.trim().length === 0}>Salvar trilha</button>
          </div>
        </form>
      </AccessibleDialog>

      <AccessibleDialog
        open={resourceToAddToExisting !== null}
        title="Adicionar a uma trilha existente"
        description="Escolha a trilha que receberá este material."
        onClose={() => {
          setResourceToAddToExisting(null);
          setExistingPathId("");
        }}
        size="small"
      >
        <form
          className={styles.dialogForm}
          onSubmit={(event) => {
            event.preventDefault();
            addToExistingPath();
          }}
        >
          <label htmlFor="existing-teaching-path">Trilha existente</label>
          <select
            id="existing-teaching-path"
            value={existingPathId}
            onChange={(event) => setExistingPathId(event.target.value)}
          >
            {savedPaths
              .filter((path) => !path.resourceIds.includes(resourceToAddToExisting ?? ""))
              .map((path) => (
                <option key={path.id} value={path.id}>{path.name}</option>
              ))}
          </select>
          <div className={styles.dialogActions}>
            <button
              type="button"
              onClick={() => {
                setResourceToAddToExisting(null);
                setExistingPathId("");
              }}
            >
              Cancelar
            </button>
            <button type="submit" disabled={!existingPathId}>Adicionar material</button>
          </div>
        </form>
      </AccessibleDialog>
    </div>
  );
}
