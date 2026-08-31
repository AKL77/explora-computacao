import { SUPPORTED_GRADES } from "@/domain/curriculum";
import {
  CENTRAL_ACTIVITY_DURATION_MINUTES,
  CENTRAL_ACTIVITY_WITH_EVALUATION_DURATION_MINUTES,
  EVALUATION_DURATION_MINUTES,
  LESSON_DURATION_MINUTES,
  LESSON_MARGIN_MINUTES,
  type ComposedLessonPlan,
  type LessonActivityFunction,
  type LessonMaterial,
  type LessonPlanEvaluation,
  type LessonSession,
  type MethodologyProfile,
} from "@/domain/lessonPlan";

export interface SavedLessonPlan {
  readonly id: string;
  readonly plan: ComposedLessonPlan;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LocalLessonPlansState {
  schemaVersion: 1;
  plans: SavedLessonPlan[];
}

const BNCC_AXES = [
  "Pensamento Computacional",
  "Mundo Digital",
  "Cultura Digital",
] as const;

const METHODOLOGY_PROFILES: readonly MethodologyProfile[] = [
  "expository",
  "active",
  "combined",
];

const ACTIVITY_FUNCTIONS: readonly LessonActivityFunction[] = [
  "introduction",
  "exposition",
  "exploration",
  "practice",
  "consolidation",
  "assessment",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isLessonMaterial(value: unknown): value is LessonMaterial {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.label) &&
    (value.kind === "catalog-resource" || value.kind === "support") &&
    isNonEmptyString(value.sourceResourceId) &&
    isOptionalString(value.details) &&
    (value.href === undefined || isSafeHttpUrl(value.href))
  );
}

function isLessonSession(
  value: unknown,
  expectedNumber: number,
  expectedCentralDuration: number,
): value is LessonSession {
  if (!isRecord(value) || !isRecord(value.centralActivity)) return false;

  const activity = value.centralActivity;
  if (!isRecord(activity.resourceUse) || !Array.isArray(activity.materials)) {
    return false;
  }

  const resourceUse = activity.resourceUse;
  return (
    value.number === expectedNumber &&
    value.durationMinutes === LESSON_DURATION_MINUTES &&
    value.marginMinutes === LESSON_MARGIN_MINUTES &&
    isNonEmptyString(activity.title) &&
    isNonEmptyString(activity.description) &&
    activity.durationMinutes === expectedCentralDuration &&
    isNonEmptyString(resourceUse.resourceId) &&
    isNonEmptyString(resourceUse.resourceTitle) &&
    ACTIVITY_FUNCTIONS.includes(
      resourceUse.requestedFunction as LessonActivityFunction,
    ) &&
    activity.materials.every(isLessonMaterial)
  );
}

function isLessonPlanEvaluation(
  value: unknown,
  lessonCount: number,
): value is LessonPlanEvaluation {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.description) &&
    value.sessionNumber === lessonCount &&
    isNonEmptyString(value.sourceResourceId) &&
    value.durationMinutes === EVALUATION_DURATION_MINUTES
  );
}

export function isComposedLessonPlanSnapshot(
  value: unknown,
): value is ComposedLessonPlan {
  if (!isRecord(value) || !isRecord(value.skill)) return false;

  const lessonCount = value.lessonCount;
  if (lessonCount !== 1 && lessonCount !== 2 && lessonCount !== 3) return false;

  const evaluation = value.evaluation;
  if (
    evaluation !== undefined &&
    !isLessonPlanEvaluation(evaluation, lessonCount)
  ) {
    return false;
  }

  if (!Array.isArray(value.sessions) || value.sessions.length !== lessonCount) {
    return false;
  }

  const skill = value.skill;
  if (
    !isNonEmptyString(skill.code) ||
    !isNonEmptyString(skill.officialText) ||
    (skill.axis !== undefined &&
      !BNCC_AXES.includes(skill.axis as (typeof BNCC_AXES)[number])) ||
    (skill.relatedCompetencies !== undefined &&
      (!Array.isArray(skill.relatedCompetencies) ||
        !skill.relatedCompetencies.every(isNonEmptyString)))
  ) {
    return false;
  }

  return (
    isNonEmptyString(value.theme) &&
    SUPPORTED_GRADES.includes(value.grade as (typeof SUPPORTED_GRADES)[number]) &&
    value.minutesPerLesson === LESSON_DURATION_MINUTES &&
    value.totalDurationMinutes === lessonCount * LESSON_DURATION_MINUTES &&
    isNonEmptyString(value.objective) &&
    METHODOLOGY_PROFILES.includes(
      value.methodologyProfile as MethodologyProfile,
    ) &&
    value.sessions.every((session, index) =>
      isLessonSession(
        session,
        index + 1,
        evaluation !== undefined && index + 1 === lessonCount
          ? CENTRAL_ACTIVITY_WITH_EVALUATION_DURATION_MINUTES
          : CENTRAL_ACTIVITY_DURATION_MINUTES,
      ),
    )
  );
}

export function isSavedLessonPlan(value: unknown): value is SavedLessonPlan {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    isIsoDate(value.createdAt) &&
    isIsoDate(value.updatedAt) &&
    Date.parse(value.updatedAt) >= Date.parse(value.createdAt) &&
    isComposedLessonPlanSnapshot(value.plan)
  );
}
