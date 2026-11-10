import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { Link, type LinkProps } from "react-router-dom";
import { SUPPORTED_GRADES, type Grade } from "@/domain/curriculum";
import type { Resource } from "@/domain/resource";
import { getResourceMaterialTypes, type MaterialType } from "@/domain/materialType";
import { getMaterialKeywordIds, materialKeywordGroups, type MaterialKeywordId } from "@/data/materialKeywords";
import { AccessibleDialog } from "@/features/catalog/components/AccessibleDialog";
import { RequiredFamiliarity } from "@/features/catalog/components/RequiredFamiliarity";
import { RESOURCE_PLACEHOLDER, getResourceTypeLabels } from "@/features/catalog/components/resourcePresentation";
import { getTeachingResourceMetadata, type ActivityMode, type PilotTeachingResource, type TeachingApproach } from "../data/pilotTeachingResources";
import { MaterialTypeFilter } from "./MaterialTypeFilter";
import { BnccSkillFilter } from "./BnccSkillFilter";
import { MaterialFilterField } from "./MaterialFilterField";
import { MaterialChoiceFilter } from "./MaterialChoiceFilter";
import { MaterialCoverGrid } from "./MaterialCoverGrid";
import type { MaterialSearchFilters, MaterialSearchView } from "../materialSearchNavigation";
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

function TeachingResourcePreview({ resource, teaching, actions, detailLinkProps }: TeachingResourceView & {
  actions?: ReactNode;
  detailLinkProps?: Pick<LinkProps, "to" | "state" | "onClick">;
}) {
  const familiarity = resource.requiredFamiliarity ? (
    <div className={styles.cardFamiliarity}>
      <span>Preparação necessária</span>
      <RequiredFamiliarity levels={resource.requiredFamiliarity} compact />
    </div>
  ) : null;
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
        <h3 aria-label={resource.title}>{detailLinkProps
          ? <Link className={styles.inlineDetailsLink} {...detailLinkProps} aria-label={`Abrir detalhes de ${resource.title}`}>{resource.title}</Link>
          : resource.title}</h3>
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
        {actions ? <div className={styles.resourceMetaRow}>{familiarity}{actions}</div> : familiarity}
      </div>
    </div>
  </>;
}

export function TeachingMaterialBrowser({ resources, renderActions, children, linkToDetails = true, initialFilters, onFiltersChange, onOpenDetails, searchEntryKey, actionsPlacement = "side", view }: {
  resources: Resource[];
  renderActions: (item: TeachingResourceView) => ReactNode;
  children?: ReactNode;
  linkToDetails?: boolean;
  initialFilters?: MaterialSearchFilters;
  onFiltersChange?: (filters: MaterialSearchFilters) => void;
  onOpenDetails?: () => void;
  searchEntryKey?: string;
  actionsPlacement?: "side" | "inline";
  view?: { mode: MaterialSearchView; onChange: (mode: MaterialSearchView) => void };
}) {
  const [query, setQuery] = useState(initialFilters?.query ?? "");
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>(initialFilters?.selectedGrades ?? []);
  const [selectedActivityModes, setSelectedActivityModes] = useState<ActivityFilter[]>(initialFilters?.selectedActivityModes ?? []);
  const [selectedMaterialTypes, setSelectedMaterialTypes] = useState<MaterialType[]>(initialFilters?.selectedMaterialTypes ?? []);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<MaterialKeywordId[]>(initialFilters?.selectedKeywordIds ?? []);
  const [selectedSkillCodes, setSelectedSkillCodes] = useState<string[]>(initialFilters?.selectedSkillCodes ?? []);
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);
  const [keywordQuery, setKeywordQuery] = useState("");
  useEffect(() => {
    onFiltersChange?.({ query, selectedGrades, selectedActivityModes, selectedMaterialTypes, selectedKeywordIds, selectedSkillCodes });
  }, [onFiltersChange, query, selectedGrades, selectedActivityModes, selectedMaterialTypes, selectedKeywordIds, selectedSkillCodes]);
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
        const matchesSkill = selectedSkillCodes.length === 0 || item.resource.curriculum.alignments.some((alignment) =>
          selectedSkillCodes.includes(alignment.skill.code)
          && (selectedGrades.length === 0 || selectedGrades.includes(alignment.grade)));

        return (
          matchesGrade &&
          matchesActivityMode &&
          matchesMaterialType &&
          matchesKeyword &&
          matchesSkill &&
          matchesSearch(item, query)
        );
      }),
    [teachingResources, query, selectedActivityModes, selectedMaterialTypes, selectedGrades, selectedKeywordIds, selectedSkillCodes],
  );

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedGrades.length > 0 ||
    selectedActivityModes.length > 0 ||
    selectedMaterialTypes.length > 0 ||
    selectedKeywordIds.length > 0 ||
    selectedSkillCodes.length > 0;
  const normalizedKeywordQuery = normalizeSearchTerm(keywordQuery);
  const selectedKeywordLabels = materialKeywordGroups.flatMap((group) => group.options
    .filter((option) => selectedKeywordIds.includes(option.id)).map((option) => option.label));
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
    setSelectedSkillCodes([]);
  };

  const getDetailLinkProps = (resource: Resource) => ({
    to: `/app/materiais/${resource.slug}`,
    state: { from: "/app/trilha-de-ensino", searchEntryKey },
    onClick: onOpenDetails,
  });

  return <>
      <section className={styles.searchSurface} aria-label="Buscar e filtrar materiais">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden="true"><Search size={21} /></span>
          <div>
            <p>Encontre materiais</p>
            <h2>Por onde você quer começar?</h2>
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
          <MaterialChoiceFilter<Grade>
            label="Ano escolar" ariaLabel="Ver opções de anos escolares" title="Selecionar anos escolares"
            countLabel="anos" clearLabel="Limpar anos" selected={selectedGrades} onChange={setSelectedGrades}
            options={SUPPORTED_GRADES.map((grade) => ({ value: grade, label: `${grade}º ano` }))}
          />
          <div className={styles.tagGroup}>
            <MaterialFilterField
              label="Assuntos" ariaLabel="Ver opções de assuntos"
              value={selectedKeywordIds.length === 0 ? "Todos" : selectedKeywordIds.length === 1 ? selectedKeywordLabels[0] : `${selectedKeywordIds.length} assuntos`}
              description={selectedKeywordLabels.join(", ") || "Todos"}
              active={selectedKeywordIds.length > 0}
              onClick={() => {
                setKeywordQuery("");
                setIsKeywordDialogOpen(true);
              }}
            />
            <span className="sr-only" aria-live="polite">
              {selectedKeywordIds.length === 0
                ? "Nenhum assunto selecionado"
                : `${selectedKeywordIds.length} ${selectedKeywordIds.length === 1 ? "assunto selecionado" : "assuntos selecionados"}`}
            </span>
          </div>

          <BnccSkillFilter resources={resources} selected={selectedSkillCodes} onChange={setSelectedSkillCodes} />
          <MaterialTypeFilter selected={selectedMaterialTypes} onChange={setSelectedMaterialTypes} />
          <MaterialChoiceFilter<ActivityFilter>
            label="Formato" ariaLabel="Ver opções de formatos" title="Selecionar formatos"
            countLabel="formatos" clearLabel="Limpar formatos" selected={selectedActivityModes} onChange={setSelectedActivityModes}
            options={[
              { value: "plugged", label: "Material plugado", summaryLabel: "Plugado" },
              { value: "unplugged", label: "Material desplugado", summaryLabel: "Desplugado" },
            ]}
          />
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
          <div className={styles.resultsTools}>
            <span className={styles.resultCount} aria-live="polite">
              {filteredResources.length} {filteredResources.length === 1 ? "material" : "materiais"}
            </span>
            {view && (
              <div className={styles.viewOptions} role="group" aria-label="Visualização dos materiais">
                <button type="button" aria-label="Lista" aria-pressed={view.mode === "list"} onClick={() => view.onChange("list")}>
                  <List size={18} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Capas" aria-pressed={view.mode === "covers"} onClick={() => view.onChange("covers")}>
                  <LayoutGrid size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className={styles.emptyResults} role="status">
            <Search size={28} aria-hidden="true" />
            <strong>Nenhum material encontrado</strong>
            <p>Tente outro termo ou retire alguma tag de filtro.</p>
          </div>
        ) : view?.mode === "covers" ? (
          <MaterialCoverGrid resources={filteredResources.map((item) => item.resource)} getDetailLinkProps={getDetailLinkProps} />
        ) : (
          <div className={styles.resultList} aria-label="Resultados da busca">
            {filteredResources.map((item) => {
              const { resource, teaching } = item;

              return (
                <article className={`${styles.resourceCard} ${actionsPlacement === "inline" ? styles.resourceCardInline : ""}`} key={resource.id}>
                  {actionsPlacement === "inline" ? (
                    <div className={styles.resourcePreview}>
                      <TeachingResourcePreview resource={resource} teaching={teaching}
                        detailLinkProps={linkToDetails ? getDetailLinkProps(resource) : undefined}
                        actions={<div className={styles.inlineActions}>{renderActions(item)}</div>} />
                    </div>
                  ) : linkToDetails ? (
                    <Link className={styles.resourcePreview} {...getDetailLinkProps(resource)} aria-label={`Abrir detalhes de ${resource.title}`}>
                      <TeachingResourcePreview resource={resource} teaching={teaching} />
                    </Link>
                  ) : (
                    <div className={styles.resourcePreview}><TeachingResourcePreview resource={resource} teaching={teaching} /></div>
                  )}
                  {actionsPlacement === "side" && <div className={styles.cardAction}>{renderActions(item)}</div>}
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
        {isKeywordDialogOpen && <div className={styles.keywordDialogContent}>
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
        </div>}
      </AccessibleDialog>

  </>;
}
