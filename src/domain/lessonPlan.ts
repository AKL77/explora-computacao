import type { BnccAxis, Grade } from "@/domain/curriculum";

export const LESSON_DURATION_MINUTES = 50 as const;
export const LESSON_MARGIN_MINUTES = 5 as const;
export const CENTRAL_ACTIVITY_DURATION_MINUTES = 45 as const;
export const CENTRAL_ACTIVITY_WITH_EVALUATION_DURATION_MINUTES = 35 as const;
export const EVALUATION_DURATION_MINUTES = 10 as const;
export const METHODOLOGY_PLACEHOLDER_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." as const;
export const EVALUATION_PLACEHOLDER_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." as const;

export type LessonCount = 1 | 2 | 3;

export type MethodologyProfile = "expository" | "active" | "combined";

export type LessonActivityFunction =
  | "introduction"
  | "exposition"
  | "exploration"
  | "practice"
  | "consolidation"
  | "assessment";

export interface LessonPlanSkill {
  code: string;
  officialText: string;
  axis?: BnccAxis;
  relatedCompetencies?: readonly string[];
}

export interface ResourceApplicationMaterial {
  id: string;
  label: string;
  details?: string;
}

export interface ResourceApplicationProposal {
  title: string;
  description: string;
  materials: readonly ResourceApplicationMaterial[];
}

/**
 * Contrato mínimo entre o Acervo e o compositor. A UI ou um repositório pode
 * adaptar um Resource para este formato sem acoplar o plano ao modelo do
 * catálogo.
 */
export interface LessonResourceCandidate {
  id: string;
  title: string;
  accessUrl: string;
  estimatedDurationMinutes: number;
  curriculumAlignments: ReadonlyArray<{
    grade: Grade;
    skillCode: string;
  }>;
  methodologyProfiles: readonly MethodologyProfile[];
  functions: readonly LessonActivityFunction[];
  applicationProposal: ResourceApplicationProposal;
}

export interface LessonPlanCompositionInput {
  theme: string;
  grade: Grade;
  lessonCount: LessonCount;
  skill: LessonPlanSkill;
  objective: string;
  methodologyProfile: MethodologyProfile;
  resources: readonly LessonResourceCandidate[];
  includeEvaluation: boolean;
}

export type LessonMaterialKind = "catalog-resource" | "support";

export interface LessonMaterial {
  id: string;
  label: string;
  kind: LessonMaterialKind;
  sourceResourceId: string;
  details?: string;
  href?: string;
}

export interface LessonResourceUse {
  resourceId: string;
  resourceTitle: string;
  requestedFunction: LessonActivityFunction;
}

export interface LessonCentralActivity {
  title: string;
  description: string;
  durationMinutes:
    | typeof CENTRAL_ACTIVITY_DURATION_MINUTES
    | typeof CENTRAL_ACTIVITY_WITH_EVALUATION_DURATION_MINUTES;
  resourceUse: LessonResourceUse;
  materials: readonly LessonMaterial[];
}

export interface LessonSession {
  number: LessonCount;
  durationMinutes: typeof LESSON_DURATION_MINUTES;
  marginMinutes: typeof LESSON_MARGIN_MINUTES;
  centralActivity: LessonCentralActivity;
}

export interface LessonPlanEvaluation {
  description: string;
  sessionNumber: LessonCount;
  sourceResourceId: string;
  durationMinutes: typeof EVALUATION_DURATION_MINUTES;
}

export interface ComposedLessonPlan {
  theme: string;
  grade: Grade;
  lessonCount: LessonCount;
  minutesPerLesson: typeof LESSON_DURATION_MINUTES;
  totalDurationMinutes: number;
  skill: LessonPlanSkill;
  objective: string;
  methodologyProfile: MethodologyProfile;
  sessions: readonly LessonSession[];
  evaluation?: LessonPlanEvaluation;
}

export type LessonPlanCompositionWarning = {
  code: "evaluation-unavailable";
};

export type LessonPlanCompositionField =
  | "theme"
  | "grade"
  | "lessonCount"
  | "skill"
  | "objective"
  | "methodologyProfile";

export type LessonPlanCompositionError =
  | {
      code: "invalid-input";
      field: LessonPlanCompositionField;
      message: string;
    }
  | {
      code: "no-compatible-resource";
      message: string;
    }
  | {
      code: "insufficient-resource-coverage";
      message: string;
      missingFunctions: readonly LessonActivityFunction[];
    };

export type ComposeLessonPlanResult =
  | {
      ok: true;
      plan: ComposedLessonPlan;
      warnings: readonly LessonPlanCompositionWarning[];
    }
  | {
      ok: false;
      error: LessonPlanCompositionError;
    };
