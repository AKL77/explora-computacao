import type { BnccAxis, Grade } from "@/domain/curriculum";
import type {
  LessonActivityFunction,
  LessonResourceCandidate,
  MethodologyProfile,
  ResourceApplicationMaterial,
} from "@/domain/lessonPlan";
import { METHODOLOGY_PLACEHOLDER_TEXT } from "@/domain/lessonPlan";
import type { PedagogicalFunction, Resource } from "@/domain/resource";

export interface PlanSkillOption {
  code: string;
  officialText: string;
  axis: BnccAxis;
  relatedCompetencies: readonly string[];
  resources: readonly Resource[];
}

const ALL_METHODOLOGY_PROFILES: readonly MethodologyProfile[] = [
  "expository",
  "active",
  "combined",
];

const lessonFunctionByPedagogicalFunction: Record<
  PedagogicalFunction,
  LessonActivityFunction
> = {
  introduction: "introduction",
  exposition: "exposition",
  exploration: "exploration",
  practice: "practice",
  consolidation: "consolidation",
  assessment: "assessment",
};

function normalizedCode(code: string): string {
  return code.trim().toLocaleUpperCase("pt-BR");
}

function getEstimatedDurationMinutes(resource: Resource): number | undefined {
  const duration = resource.pedagogy.estimatedDuration;
  const minuteMatch = duration?.match(
    /(\d+)\s*(?:min|minuto|minutos)/i,
  );
  if (minuteMatch) {
    const minutes = Number(minuteMatch[1]);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : undefined;
  }

  const lessonMatch = duration?.match(/(\d+)\s*aulas?/i);
  if (lessonMatch) {
    const lessons = Number(lessonMatch[1]);
    return Number.isFinite(lessons) && lessons > 0 ? lessons * 50 : undefined;
  }

  return undefined;
}

function getSafeAccessUrl(resource: Resource): string | undefined {
  for (const value of [resource.canonicalUrl, resource.sourceUrl]) {
    if (!value) continue;

    try {
      const url = new URL(value);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.toString();
      }
    } catch {
      // Tenta a próxima URL curada disponível.
    }
  }

  return undefined;
}

function createSupportMaterials(resource: Resource): ResourceApplicationMaterial[] {
  const materials: ResourceApplicationMaterial[] = [];
  const seenLabels = new Set<string>();

  const addMaterial = (id: string, value: string) => {
    const label = value.trim();
    const normalizedLabel = label.toLocaleLowerCase("pt-BR");
    if (!label || seenLabels.has(normalizedLabel)) return;

    seenLabels.add(normalizedLabel);
    materials.push({ id, label });
  };

  for (const [index, material] of (resource.pedagogy.materials ?? []).entries()) {
    addMaterial(`material:${index + 1}`, material);
  }

  for (const device of resource.requirements.devices ?? []) {
    addMaterial(`device:${device.trim().toLocaleLowerCase("pt-BR")}`, device);
  }

  if (resource.requirements.internet) {
    addMaterial("internet", "Conexão com a internet");
  }

  if (resource.requirements.accountRequired) {
    addMaterial("account", "Conta de acesso ao recurso");
  }

  return materials;
}

export function getPlanSkillOptions(
  resources: readonly Resource[],
  grade: Grade,
): PlanSkillOption[] {
  const optionsByCode = new Map<string, PlanSkillOption>();

  for (const resource of resources) {
    const gradeAlignments = resource.curriculum.alignments.filter(
      (alignment) => alignment.grade === grade,
    );
    if (gradeAlignments.length === 0 || !getSafeAccessUrl(resource)) continue;

    for (const alignment of gradeAlignments) {
      const { skill } = alignment;
      const code = normalizedCode(skill.code);
      const current = optionsByCode.get(code);
      const relatedCompetencies = alignment.competencies.map(
        (competency) =>
          `Competência ${competency.number} — ${competency.officialText}`,
      );

      if (current) {
        optionsByCode.set(code, {
          ...current,
          relatedCompetencies: Array.from(
            new Set([...current.relatedCompetencies, ...relatedCompetencies]),
          ),
          resources: [...current.resources, resource],
        });
        continue;
      }

      optionsByCode.set(code, {
        code,
        officialText: skill.officialText,
        axis: alignment.axis,
        relatedCompetencies,
        resources: [resource],
      });
    }
  }

  return Array.from(optionsByCode.values()).sort((left, right) =>
    left.code.localeCompare(right.code, "pt-BR", { sensitivity: "base" }),
  );
}

export function toLessonResourceCandidate(
  resource: Resource,
): LessonResourceCandidate | null {
  const applicationFunction = resource.pedagogy.pedagogicalFunction;
  const accessUrl = getSafeAccessUrl(resource);
  if (!accessUrl) return null;
  const estimatedDurationMinutes = getEstimatedDurationMinutes(resource) ?? 50;
  const applicationDescription =
    resource.pedagogy.applicationProposal?.trim() ||
    METHODOLOGY_PLACEHOLDER_TEXT;

  const functions: readonly LessonActivityFunction[] = [
    applicationFunction
      ? lessonFunctionByPedagogicalFunction[applicationFunction]
      : "practice",
  ];

  return {
    id: resource.id,
    title: resource.title,
    accessUrl,
    estimatedDurationMinutes,
    curriculumAlignments: resource.curriculum.alignments.map((alignment) => ({
      grade: alignment.grade,
      skillCode: alignment.skill.code,
    })),
    methodologyProfiles: ALL_METHODOLOGY_PROFILES,
    functions,
    applicationProposal: {
      title: `Aplicação de ${resource.title}`,
      description: applicationDescription,
      materials: createSupportMaterials(resource),
    },
  };
}
