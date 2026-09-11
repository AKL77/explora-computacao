import type { LessonCount } from "@/domain/lessonPlan";

export const TEACHING_PATH_BACKGROUND_COLORS = [
  "turquoise",
  "blue",
  "green",
  "indigo",
  "violet",
  "amber",
  "coral",
] as const;

export type TeachingPathBackgroundColor = (typeof TEACHING_PATH_BACKGROUND_COLORS)[number];

export const TEACHING_PATH_ICONS = [
  "book-open-check",
  "route",
  "target",
  "sparkles",
  "flag",
  "lightbulb",
  "puzzle",
] as const;

export type TeachingPathIcon = (typeof TEACHING_PATH_ICONS)[number];

export const DEFAULT_TEACHING_PATH_OBJECTIVE =
  "Definir o objetivo de aprendizagem desta trilha." as const;
export const DEFAULT_TEACHING_PATH_BACKGROUND_COLOR = "turquoise" as const;
export const DEFAULT_TEACHING_PATH_ICON = "book-open-check" as const;

export interface SavedTeachingPath {
  readonly id: string;
  readonly name: string;
  readonly objective: string;
  readonly backgroundColor: TeachingPathBackgroundColor;
  readonly icon: TeachingPathIcon;
  readonly resourceIds: readonly string[];
  readonly lessonCountsByResourceId: Readonly<Record<string, LessonCount | undefined>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LocalTeachingPathsState {
  schemaVersion: 2;
  paths: SavedTeachingPath[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isLessonCount(value: unknown): value is LessonCount | undefined {
  return value === undefined || value === 1 || value === 2 || value === 3;
}

export function normalizeTeachingPathName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeTeachingPathObjective(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isTeachingPathBackgroundColor(value: unknown): value is TeachingPathBackgroundColor {
  return (
    typeof value === "string" &&
    (TEACHING_PATH_BACKGROUND_COLORS as readonly string[]).includes(value)
  );
}

export function isTeachingPathIcon(value: unknown): value is TeachingPathIcon {
  return typeof value === "string" && (TEACHING_PATH_ICONS as readonly string[]).includes(value);
}

export function isSavedTeachingPath(value: unknown): value is SavedTeachingPath {
  if (!isRecord(value) || !isRecord(value.lessonCountsByResourceId)) return false;

  const resourceIds = value.resourceIds;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.objective) &&
    isTeachingPathBackgroundColor(value.backgroundColor) &&
    isTeachingPathIcon(value.icon) &&
    Array.isArray(resourceIds) &&
    resourceIds.length > 0 &&
    resourceIds.every(isNonEmptyString) &&
    new Set(resourceIds).size === resourceIds.length &&
    Object.entries(value.lessonCountsByResourceId).every(
      ([resourceId, lessonCount]) =>
        isNonEmptyString(resourceId) &&
        resourceIds.includes(resourceId) &&
        isLessonCount(lessonCount),
    ) &&
    isIsoDate(value.createdAt) &&
    isIsoDate(value.updatedAt) &&
    Date.parse(value.updatedAt) >= Date.parse(value.createdAt)
  );
}
