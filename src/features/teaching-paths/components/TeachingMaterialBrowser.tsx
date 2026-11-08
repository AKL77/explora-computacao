import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SUPPORTED_GRADES, type Grade } from "@/domain/curriculum";
import type { Resource } from "@/domain/resource";
import { getResourceMaterialTypes, type MaterialType } from "@/domain/materialType";
import { getMaterialKeywordIds, materialKeywordGroups, type MaterialKeywordId } from "@/data/materialKeywords";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { RequiredFamiliarity } from "@/features/catalog/components/RequiredFamiliarity";
import { RESOURCE_PLACEHOLDER, getResourceTypeLabels } from "@/features/catalog/components/resourcePresentation";
import { getTeachingResourceMetadata, type ActivityMode, type PilotTeachingResource, type TeachingApproach } from "../data/pilotTeachingResources";
import { MaterialTypeFilter } from "./MaterialTypeFilter";
import styles from "../pages/TeachingPathPage.module.css";

export interface TeachingResourceView {
  resource: Resource;
  teaching: PilotTeachingResource;
}

type ActivityFilter = Exclude<ActivityMode, "mixed">;

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

function TeachingResourcePreview({ resource, teaching }: TeachingResourceView) {
  return <>
    <div className={styles.resourceImage}>
      <img
        src={resource.image?.thumbnailSrc ?? resource.image?.src ?? RESOURCE_PLACEHOLDER}
        alt={resource.image?.alt ?? ""}
      />
    </div>
    <div className={styles.resourceContent}>
      <div className={styles.resourceIntro}>
        <div className={styles.badges}>
          {getResourceTypeLabels(resource).map((label) => <span key={label}>{label}</span>)}
          <span>{activityModeLabels[teaching.activityMode]}</span>
          <span>{teachingApproachLabels[teaching.teachingApproach]}</span>
        </div>
        <h3>{resource.title}</h3>
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
        {resource.requiredFamiliarity ? (
          <div className={styles.cardFamiliarity}>
            <span>Preparação necessária</span>
            <RequiredFamiliarity levels={resource.requiredFamiliarity} compact />
          </div>
        ) : null}
      </div>
    </div>
  </>;
}

export function TeachingMaterialBrowser({ resources, renderActions, children, linkToDetails = true }: {
  resources: Resource[];
  renderActions: (item: TeachingResourceView) => ReactNode;
  children?: ReactNode;
  linkToDetails?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);
  const [selectedActivityModes, setSelectedActivityModes] = useState<ActivityFilter[]>([]);
  const [selectedMaterialTypes, setSelectedMaterialTypes] = useState<MaterialType[]>([]);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<MaterialKeywordId[]>([]);
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);
  const [keywordQuery, setKeywordQuery] = useState("");
  const teachingResources = useMemo(() => getTeachingResources(resources), [resources]);
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
        const matchesMaterialType =
          selectedMaterialTypes.length === 0 ||
          getResourceMaterialTypes(item.resource).some((type) => selectedMaterialTypes.includes(type));
        const matchesKeyword =
          selectedKeywordIds.length === 0 ||
          selectedKeywordIds.some((id) => getMaterialKeywordIds(item.resource.id).includes(id));

        return (
          matchesGrade &&
          matchesActivityMode &&
          matchesMaterialType &&
          matchesKeyword &&
          matchesSearch(item, query)
        );
      }),
    [teachingResources, query, selectedActivityModes, selectedMaterialTypes, selectedGrades, selectedKeywordIds],
  );

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedGrades.length > 0 ||
    selectedActivityModes.length > 0 ||
    selectedMaterialTypes.length > 0 ||
    selectedKeywordIds.length > 0;
  const normalizedKeywordQuery = normalizeSearchTerm(keywordQuery);
  const visibleKeywordGroups = materialKeywordGroups
    .map((group) => ({
      axis: group.axis,
      options: group.options.filter((option) =>
        normalizeSearchTerm(option.label).includes(normalizedKeywordQuery),
      ),
    }))
    .filter((group) => group.options.length > 0);

  const clearFilters = () => {
    setQuery("");
    setSelectedGrades([]);
    setSelectedActivityModes([]);
    setSelectedMaterialTypes([]);
    setSelectedKeywordIds([]);
  };

  return <>
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
            placeholder="Pesquise um assunto"
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
            <span className={styles.tagLabel}>Assuntos</span>
            <button
              className={`${styles.filterTag} ${styles.keywordTrigger} ${selectedKeywordIds.length > 0 ? styles.keywordTriggerActive : ""}`}
              type="button"
              aria-label="Ver opções de assuntos"
              aria-haspopup="dialog"
              onClick={() => {
                setKeywordQuery("");
                setIsKeywordDialogOpen(true);
              }}
            >
              Ver opções
            </button>
            <span className="sr-only" aria-live="polite">
              {selectedKeywordIds.length === 0
                ? "Nenhum assunto selecionado"
                : `${selectedKeywordIds.length} ${selectedKeywordIds.length === 1 ? "assunto selecionado" : "assuntos selecionados"}`}
            </span>
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

          <MaterialTypeFilter selected={selectedMaterialTypes} onChange={setSelectedMaterialTypes} />
        </div>

        {hasActiveFilters ? (
          <button className={styles.clearFilters} type="button" onClick={clearFilters}>
            <X size={16} aria-hidden="true" />
            Limpar filtros
          </button>
        ) : null}
      </section>

      {children}
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

              return (
                <article className={styles.resourceCard} key={resource.id}>
                  {linkToDetails ? (
                    <Link className={styles.resourcePreview} to={`/app/materiais/${resource.slug}`} state={{ from: "/app/trilha-de-ensino" }} aria-label={`Abrir detalhes de ${resource.title}`}>
                      <TeachingResourcePreview resource={resource} teaching={teaching} />
                    </Link>
                  ) : (
                    <div className={styles.resourcePreview}><TeachingResourcePreview resource={resource} teaching={teaching} /></div>
                  )}
                  <div className={styles.cardAction}>{renderActions(item)}</div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <AccessibleDialog
        open={isKeywordDialogOpen}
        title="Selecionar assuntos"
        onClose={() => setIsKeywordDialogOpen(false)}
        size="wide"
      >
        <div className={styles.keywordDialogContent}>
          <div className={styles.keywordSearchControl}>
            <label className={styles.keywordSearchLabel} htmlFor="material-keyword-query">
              Buscar palavras-chave
            </label>
            <div className={styles.keywordSearch}>
              <Search size={18} aria-hidden="true" />
              <input
                id="material-keyword-query"
                type="search"
                placeholder="Digite um assunto"
                value={keywordQuery}
                onChange={(event) => setKeywordQuery(event.target.value)}
              />
            </div>
          </div>
          <div className={styles.keywordGroups}>
            {visibleKeywordGroups.map((group, index) => (
              <section
                className={styles.keywordGroup}
                aria-labelledby={`material-keyword-axis-${index}`}
                key={group.axis}
              >
                <h3 className={styles.keywordGroupTitle} id={`material-keyword-axis-${index}`}>
                  {group.axis}
                </h3>
                <div className={styles.keywordOptions}>
                  {group.options.map((option) => (
                    <button
                      className={`${styles.filterTag} ${styles.keywordOption}`}
                      type="button"
                      aria-pressed={selectedKeywordIds.includes(option.id)}
                      key={option.id}
                      onClick={() => setSelectedKeywordIds((current) => toggleFilter(current, option.id))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
            {visibleKeywordGroups.length === 0 ? (
              <p className={styles.keywordEmpty}>Nenhum assunto corresponde à busca.</p>
            ) : null}
          </div>
          <div className={styles.keywordDialogActions}>
            <button
              type="button"
              onClick={() => setSelectedKeywordIds([])}
              disabled={selectedKeywordIds.length === 0}
            >
              Limpar assuntos
            </button>
            <button type="button" onClick={() => setIsKeywordDialogOpen(false)}>
              Concluir
            </button>
          </div>
        </div>
      </AccessibleDialog>

  </>;
}
