import { SUPPORTED_GRADES, type Grade } from "@/domain/curriculum";
import {
  CENTRAL_ACTIVITY_DURATION_MINUTES,
  CENTRAL_ACTIVITY_WITH_EVALUATION_DURATION_MINUTES,
  EVALUATION_PLACEHOLDER_TEXT,
  EVALUATION_DURATION_MINUTES,
  LESSON_DURATION_MINUTES,
  LESSON_MARGIN_MINUTES,
  METHODOLOGY_PLACEHOLDER_TEXT,
  type ComposeLessonPlanResult,
  type LessonActivityFunction,
  type LessonCount,
  type LessonMaterial,
  type LessonPlanCompositionField,
  type LessonPlanCompositionInput,
  type LessonPlanCompositionWarning,
  type LessonPlanEvaluation,
  type LessonResourceCandidate,
  type MethodologyProfile,
} from "@/domain/lessonPlan";

const VALID_GRADES: readonly Grade[] = SUPPORTED_GRADES;
const VALID_LESSON_COUNTS: readonly LessonCount[] = [1, 2, 3];
const VALID_METHODOLOGY_PROFILES: readonly MethodologyProfile[] = [
  "expository",
  "active",
  "combined",
];

const FUNCTIONS_BY_PROFILE: Record<
  MethodologyProfile,
  Record<LessonCount, readonly LessonActivityFunction[]>
> = {
  expository: {
    1: ["exposition"],
    2: ["exposition", "consolidation"],
    3: ["introduction", "exposition", "consolidation"],
  },
  active: {
    1: ["practice"],
    2: ["exploration", "practice"],
    3: ["exploration", "practice", "consolidation"],
  },
  combined: {
    1: ["practice"],
    2: ["exposition", "practice"],
    3: ["exposition", "practice", "consolidation"],
  },
};

interface ResourceSelection {
  resource: LessonResourceCandidate;
  requestedFunction: LessonActivityFunction;
  sessionNumber: LessonCount;
}

interface ResourceSelectionResult {
  selections: ResourceSelection[];
  missingFunctions: LessonActivityFunction[];
}

function invalidInput(
  field: LessonPlanCompositionField,
  message: string,
): ComposeLessonPlanResult {
  return {
    ok: false,
    error: { code: "invalid-input", field, message },
  };
}

function normalizedCode(code: string): string {
  return code.trim().toLocaleUpperCase("pt-BR");
}

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

function isSafeAccessUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function hasValidApplication(resource: LessonResourceCandidate): boolean {
  return (
    isNonEmpty(resource.id) &&
    isNonEmpty(resource.title) &&
    isSafeAccessUrl(resource.accessUrl) &&
    Number.isFinite(resource.estimatedDurationMinutes) &&
    resource.estimatedDurationMinutes > 0 &&
    Boolean(resource.applicationProposal) &&
    isNonEmpty(resource.applicationProposal.title) &&
    isNonEmpty(resource.applicationProposal.description)
  );
}

function uniqueResources(
  resources: readonly LessonResourceCandidate[],
): LessonResourceCandidate[] {
  const seenIds = new Set<string>();

  return resources.filter((resource) => {
    const id = resource.id.trim();
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });
}

function compatibleResources(
  input: LessonPlanCompositionInput,
): LessonResourceCandidate[] {
  const skillCode = normalizedCode(input.skill.code);
  const resources = Array.isArray(input.resources) ? input.resources : [];

  return uniqueResources(resources).filter(
    (resource) =>
      hasValidApplication(resource) &&
      resource.curriculumAlignments.some(
        (alignment) =>
          alignment.grade === input.grade &&
          normalizedCode(alignment.skillCode) === skillCode,
      ),
  );
}

function selectResources(
  resources: readonly LessonResourceCandidate[],
  functions: readonly LessonActivityFunction[],
): ResourceSelectionResult {
  if (resources.length === 0) {
    return { selections: [], missingFunctions: [...functions] };
  }

  return {
    selections: functions.map((requestedFunction, index) => ({
      resource: resources[index % resources.length],
      requestedFunction,
      sessionNumber: (index + 1) as LessonCount,
    })),
    missingFunctions: [],
  };
}

function buildMaterials(resource: LessonResourceCandidate): LessonMaterial[] {
  const catalogMaterial: LessonMaterial = {
    id: `catalog-resource:${resource.id}`,
    label: resource.title.trim(),
    kind: "catalog-resource",
    sourceResourceId: resource.id,
    href: resource.accessUrl.trim(),
  };

  const supportMaterials = resource.applicationProposal.materials
    .filter(
      (material) => isNonEmpty(material.id) && isNonEmpty(material.label),
    )
    .map((material): LessonMaterial => {
      const details = material.details?.trim();
      return {
        id: `support:${resource.id}:${material.id.trim()}`,
        label: material.label.trim(),
        kind: "support",
        sourceResourceId: resource.id,
        ...(details ? { details } : {}),
      };
    });

  return [catalogMaterial, ...supportMaterials];
}

function buildEvaluation(
  selections: readonly ResourceSelection[],
  lessonCount: LessonCount,
): LessonPlanEvaluation | undefined {
  const finalSelection = selections.at(-1);
  if (!finalSelection) return undefined;

  return {
    description: EVALUATION_PLACEHOLDER_TEXT,
    sessionNumber: lessonCount,
    sourceResourceId: finalSelection.resource.id,
    durationMinutes: EVALUATION_DURATION_MINUTES,
  };
}

export function composeLessonPlan(
  input: LessonPlanCompositionInput,
): ComposeLessonPlanResult {
  const theme = input.theme.trim();
  if (!theme) return invalidInput("theme", "Informe o tema da aula.");

  if (!VALID_GRADES.includes(input.grade)) {
    return invalidInput("grade", "Informe um ano escolar entre o 4º e o 9º ano.");
  }

  if (!VALID_LESSON_COUNTS.includes(input.lessonCount)) {
    return invalidInput("lessonCount", "Escolha entre uma, duas ou três aulas.");
  }

  const skillCode = input.skill.code.trim();
  const skillText = input.skill.officialText.trim();
  if (!skillCode || !skillText) {
    return invalidInput("skill", "Informe o código e o texto da habilidade.");
  }

  const objective = input.objective.trim();
  if (!objective) {
    return invalidInput("objective", "Informe o objetivo de aprendizagem.");
  }

  if (!VALID_METHODOLOGY_PROFILES.includes(input.methodologyProfile)) {
    return invalidInput(
      "methodologyProfile",
      "Escolha um perfil metodológico válido.",
    );
  }

  const resources = compatibleResources(input);
  if (resources.length === 0) {
    return {
      ok: false,
      error: {
        code: "no-compatible-resource",
        message:
          "Não há recurso compatível com o ano, a habilidade e o perfil metodológico informados.",
      },
    };
  }

  const requestedFunctions = [
    ...FUNCTIONS_BY_PROFILE[input.methodologyProfile][input.lessonCount],
  ];
  if (input.includeEvaluation && input.lessonCount === 3) {
    requestedFunctions[requestedFunctions.length - 1] = "assessment";
  }

  const selectionResult = selectResources(resources, requestedFunctions);
  if (selectionResult.missingFunctions.length > 0) {
    return {
      ok: false,
      error: {
        code: "insufficient-resource-coverage",
        message:
          "O Acervo ainda não possui propostas diferentes e compatíveis para todas as aulas solicitadas.",
        missingFunctions: selectionResult.missingFunctions,
      },
    };
  }

  const selections = selectionResult.selections;
  const warnings: LessonPlanCompositionWarning[] = [];

  const evaluation = input.includeEvaluation
    ? buildEvaluation(selections, input.lessonCount)
    : undefined;

  const sessions = selections.map((selection) => ({
    number: selection.sessionNumber,
    durationMinutes: LESSON_DURATION_MINUTES,
    marginMinutes: LESSON_MARGIN_MINUTES,
    centralActivity: {
      title: selection.resource.applicationProposal.title.trim(),
      description: METHODOLOGY_PLACEHOLDER_TEXT,
      durationMinutes:
        evaluation?.sessionNumber === selection.sessionNumber
          ? CENTRAL_ACTIVITY_WITH_EVALUATION_DURATION_MINUTES
          : CENTRAL_ACTIVITY_DURATION_MINUTES,
      resourceUse: {
        resourceId: selection.resource.id,
        resourceTitle: selection.resource.title.trim(),
        requestedFunction: selection.requestedFunction,
      },
      materials: buildMaterials(selection.resource),
    },
  }));

  return {
    ok: true,
    plan: {
      theme,
      grade: input.grade,
      lessonCount: input.lessonCount,
      minutesPerLesson: LESSON_DURATION_MINUTES,
      totalDurationMinutes: input.lessonCount * LESSON_DURATION_MINUTES,
      skill: {
        code: skillCode,
        officialText: skillText,
        ...(input.skill.axis ? { axis: input.skill.axis } : {}),
        ...(input.skill.relatedCompetencies
          ? { relatedCompetencies: [...input.skill.relatedCompetencies] }
          : {}),
      },
      objective,
      methodologyProfile: input.methodologyProfile,
      sessions,
      ...(evaluation ? { evaluation } : {}),
    },
    warnings,
  };
}
