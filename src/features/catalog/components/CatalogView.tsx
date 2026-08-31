import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  SUPPORTED_GRADES,
  type Grade,
  type SkillReference,
} from "@/domain/curriculum";
import type { Resource } from "@/domain/resource";
import {
  filterResources,
  getAvailableGrades,
  getAvailableSkills,
} from "@/lib/catalogFilters";

import { ResourceCard } from "./ResourceCard";
import styles from "./CatalogView.module.css";

const SEARCH_PARAM = "q";
const GRADES_PARAM = "turmas";
const SKILLS_PARAM = "habilidades";
const validGrades: readonly Grade[] = SUPPORTED_GRADES;
type OpenFilter = "grades" | "skills";

function parseList(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function parseGrades(value: string | null): Grade[] {
  const parsed = parseList(value).map(Number);
  return validGrades.filter((grade) => parsed.includes(grade));
}

function formatGrade(grade: Grade): string {
  return `${grade}º ano`;
}

interface CatalogViewProps {
  title: string;
  description?: string;
  resources: readonly Resource[];
  controlsInitiallyCollapsed?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRemoveResource?: (resourceId: string) => void;
  removeLabel?: string;
}

export function CatalogView({
  title,
  description,
  resources,
  controlsInitiallyCollapsed = false,
  emptyTitle = "Ainda não há recursos aqui",
  emptyMessage = "Volte ao Acervo para descobrir conteúdos e organizá-los.",
  onRemoveResource,
  removeLabel,
}: CatalogViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [announcement, setAnnouncement] = useState("");
  const [openFilter, setOpenFilter] = useState<OpenFilter | null>(null);
  const [areControlsVisible, setAreControlsVisible] = useState(
    !controlsInitiallyCollapsed,
  );
  const query = searchParams.get(SEARCH_PARAM) ?? "";
  const selectedGrades = parseGrades(searchParams.get(GRADES_PARAM));
  const selectedSkills = parseList(searchParams.get(SKILLS_PARAM));
  const availableGrades = useMemo(() => getAvailableGrades(resources), [resources]);
  const availableSkills = useMemo(() => getAvailableSkills(resources), [resources]);
  const filteredResources = useMemo(
    () =>
      filterResources(resources, {
        query,
        grades: selectedGrades,
        skills: selectedSkills,
      }),
    [query, resources, selectedGrades, selectedSkills],
  );

  const updateListParam = (key: string, values: readonly (string | number)[]) => {
    const nextParams = new URLSearchParams(searchParams);
    if (values.length > 0) {
      nextParams.set(key, values.join(","));
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const updateQuery = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(SEARCH_PARAM, value);
    } else {
      nextParams.delete(SEARCH_PARAM);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const toggleGrade = (grade: Grade) => {
    updateListParam(
      GRADES_PARAM,
      selectedGrades.includes(grade)
        ? selectedGrades.filter((item) => item !== grade)
        : [...selectedGrades, grade],
    );
  };

  const toggleSkill = (skill: SkillReference) => {
    updateListParam(
      SKILLS_PARAM,
      selectedSkills.includes(skill.code)
        ? selectedSkills.filter((code) => code !== skill.code)
        : [...selectedSkills, skill.code],
    );
  };

  const handleFilterToggle = (filter: OpenFilter, isOpen: boolean) => {
    setOpenFilter((currentFilter) =>
      isOpen ? filter : currentFilter === filter ? null : currentFilter,
    );
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(SEARCH_PARAM);
    nextParams.delete(GRADES_PARAM);
    nextParams.delete(SKILLS_PARAM);
    setSearchParams(nextParams, { replace: true });
  };

  const hasActiveFilters =
    query.trim().length > 0 || selectedGrades.length > 0 || selectedSkills.length > 0;

  return (
    <section className={styles.page} aria-labelledby="catalog-page-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Informática Explorer</p>
          <h1 id="catalog-page-title" className={styles.pageTitle}>
            {title}
          </h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <p className={styles.resultCount} aria-live="polite" aria-atomic="true">
          {filteredResources.length} {filteredResources.length === 1 ? "recurso" : "recursos"}
        </p>
      </header>

      {controlsInitiallyCollapsed ? (
        <button
          type="button"
          className={styles.controlsToggle}
          aria-expanded={areControlsVisible}
          aria-controls="catalog-controls"
          onClick={() => setAreControlsVisible((isVisible) => !isVisible)}
        >
          <span aria-hidden="true">⌕</span>
          {areControlsVisible ? "Ocultar busca e filtros" : "Buscar e filtrar"}
          {hasActiveFilters ? (
            <span className={styles.activeIndicator}>Filtros ativos</span>
          ) : null}
        </button>
      ) : null}

      <div
        id="catalog-controls"
        className={styles.controls}
        hidden={!areControlsVisible}
        aria-hidden={!areControlsVisible}
      >
        <div className={styles.searchField}>
          <label htmlFor="catalog-search">Buscar no conteúdo desta página</label>
          <div className={styles.searchInputWrap}>
            <input
              id="catalog-search"
              type="search"
              value={query}
              placeholder="Buscar por título, tema ou habilidade"
              onChange={(event) => updateQuery(event.target.value)}
            />
            <span aria-hidden="true">⌕</span>
          </div>
        </div>

        <div className={styles.filterRow} aria-label="Filtros do catálogo">
          <details
            className={styles.filterMenu}
            open={openFilter === "grades"}
            onToggle={(event) =>
              handleFilterToggle("grades", event.currentTarget.open)
            }
          >
            <summary>
              Turma
              {selectedGrades.length > 0 ? (
                <span className={styles.filterCount}>{selectedGrades.length}</span>
              ) : null}
            </summary>
            <fieldset>
              <legend>Selecionar turmas</legend>
              {validGrades.map((grade) => {
                const isAvailable = availableGrades.includes(grade);
                return (
                  <label key={grade} className={!isAvailable ? styles.disabledOption : undefined}>
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(grade)}
                      disabled={!isAvailable}
                      onChange={() => toggleGrade(grade)}
                    />
                    <span>{formatGrade(grade)}</span>
                  </label>
                );
              })}
            </fieldset>
          </details>

          <details
            className={styles.filterMenu}
            open={openFilter === "skills"}
            onToggle={(event) =>
              handleFilterToggle("skills", event.currentTarget.open)
            }
          >
            <summary>
              Habilidade
              {selectedSkills.length > 0 ? (
                <span className={styles.filterCount}>{selectedSkills.length}</span>
              ) : null}
            </summary>
            <fieldset className={styles.skillsList}>
              <legend>Selecionar habilidades</legend>
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <label key={skill.code}>
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill.code)}
                      onChange={() => toggleSkill(skill)}
                    />
                    <span>
                      <strong>{skill.code}</strong>
                      {skill.officialText}
                    </span>
                  </label>
                ))
              ) : (
                <p className={styles.noOptions}>Nenhuma habilidade disponível.</p>
              )}
            </fieldset>
          </details>

          {hasActiveFilters ? (
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              Limpar filtros
            </button>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <div className={styles.activeFilters} aria-label="Filtros ativos">
            {query ? (
              <button type="button" onClick={() => updateQuery("")}>
                Busca: “{query}” <span aria-hidden="true">×</span>
              </button>
            ) : null}
            {selectedGrades.map((grade) => (
              <button type="button" key={grade} onClick={() => toggleGrade(grade)}>
                {formatGrade(grade)} <span aria-hidden="true">×</span>
              </button>
            ))}
            {selectedSkills.map((code) => (
              <button
                type="button"
                key={code}
                onClick={() =>
                  updateListParam(
                    SKILLS_PARAM,
                    selectedSkills.filter((skillCode) => skillCode !== code),
                  )
                }
              >
                {code} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {resources.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            ◇
          </span>
          <h2>{emptyTitle}</h2>
          <p>{emptyMessage}</p>
          <Link to="/app/acervo" className={styles.primaryLink}>
            Explorar o Acervo
          </Link>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            ⌕
          </span>
          <h2>Nenhum recurso encontrado</h2>
          <p>Revise a busca ou remova alguns dos filtros ativos.</p>
          <button type="button" className={styles.primaryButton} onClick={clearFilters}>
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              removeLabel={removeLabel}
              onRemove={
                onRemoveResource
                  ? (resourceId) => {
                      onRemoveResource(resourceId);
                      setAnnouncement(`${resource.title} foi removido desta pasta.`);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <span className={styles.visuallyHidden} aria-live="polite">
        {announcement}
      </span>
    </section>
  );
}
