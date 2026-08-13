import type { Grade, SkillReference } from "@/domain/curriculum";
import type { Resource, ResourceType } from "@/domain/resource";

export interface CatalogFilters {
  query?: string;
  grades?: readonly Grade[];
  skills?: readonly string[];
}

const RESOURCE_TYPE_SEARCH_TERMS: Record<ResourceType, string> = {
  game: "jogo",
  video: "vídeo",
  text: "texto",
  simulator: "simulador",
  activity: "atividade",
  tool: "ferramenta",
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/\s+/g, " ");
}

function buildSearchIndex(resource: Resource): string {
  const searchableValues = [
    resource.title,
    resource.summary,
    resource.provider,
    resource.type,
    RESOURCE_TYPE_SEARCH_TERMS[resource.type],
    resource.curriculum.axis,
    resource.curriculum.knowledgeObject,
    ...resource.tags,
    ...resource.curriculum.skills.flatMap((skill) => [
      skill.code,
      skill.officialText,
    ]),
  ];

  return normalizeSearchText(
    searchableValues.filter((value): value is string => Boolean(value)).join(" "),
  );
}

export function matchesResourceSearch(
  resource: Resource,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchIndex = buildSearchIndex(resource);

  return normalizedQuery
    .split(" ")
    .every((searchTerm) => searchIndex.includes(searchTerm));
}

export function searchResources(
  catalog: readonly Resource[],
  query: string,
): Resource[] {
  return catalog.filter((resource) => matchesResourceSearch(resource, query));
}

export function filterResources(
  catalog: readonly Resource[],
  filters: CatalogFilters = {},
): Resource[] {
  const selectedGrades = new Set(filters.grades ?? []);
  const selectedSkills = new Set(
    (filters.skills ?? []).map((code) => code.trim().toLocaleUpperCase("pt-BR")),
  );

  return catalog.filter((resource) => {
    const matchesQuery = matchesResourceSearch(resource, filters.query ?? "");
    const matchesGrade =
      selectedGrades.size === 0 ||
      resource.recommendedGrades.some((grade) => selectedGrades.has(grade));
    const matchesSkill =
      selectedSkills.size === 0 ||
      resource.curriculum.skills.some((skill) =>
        selectedSkills.has(skill.code.trim().toLocaleUpperCase("pt-BR")),
      );

    return matchesQuery && matchesGrade && matchesSkill;
  });
}

export function getAvailableGrades(catalog: readonly Resource[]): Grade[] {
  return Array.from(
    new Set(catalog.flatMap((resource) => resource.recommendedGrades)),
  ).sort((left, right) => left - right);
}

export function getAvailableSkills(
  catalog: readonly Resource[],
): SkillReference[] {
  const skillsByCode = new Map<string, SkillReference>();

  for (const resource of catalog) {
    for (const skill of resource.curriculum.skills) {
      const normalizedCode = skill.code.trim().toLocaleUpperCase("pt-BR");

      if (!skillsByCode.has(normalizedCode)) {
        skillsByCode.set(normalizedCode, { ...skill });
      }
    }
  }

  return Array.from(skillsByCode.values()).sort((left, right) =>
    left.code.localeCompare(right.code, "pt-BR", { sensitivity: "base" }),
  );
}
