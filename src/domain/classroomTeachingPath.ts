import {
  isSavedTeachingPath,
  isTeachingPathBackgroundColor,
  isTeachingPathIcon,
  type SavedTeachingPath,
  type TeachingPathBackgroundColor,
  type TeachingPathIcon,
  type TeachingPathLessonCount,
} from "./savedTeachingPath";

export interface StudentTeachingPath {
  id: string;
  name: string;
  backgroundColor: TeachingPathBackgroundColor;
  icon: TeachingPathIcon;
  resourceIds: readonly string[];
  visible: boolean;
}

export interface ClassroomTeachingPath extends StudentTeachingPath {
  objective: string;
  lessonCountsByResourceId: Readonly<Record<string, TeachingPathLessonCount | undefined>>;
  sourceUpdatedAt: string;
  sourceRevision?: number;
  sharedAt: string;
}

export type ClassroomPathAction = "share" | "update" | "visibility" | "remove" | "move";

export function isStudentTeachingPath(value: unknown): value is StudentTeachingPath {
  if (!value || typeof value !== "object") return false;
  const path = value as Record<string, unknown>;
  return typeof path.id === "string" && path.id.trim().length > 0 &&
    typeof path.name === "string" && path.name.trim().length > 0 && path.name.length <= 160 &&
    typeof path.visible === "boolean" &&
    isTeachingPathBackgroundColor(path.backgroundColor) && isTeachingPathIcon(path.icon) &&
    Array.isArray(path.resourceIds) && path.resourceIds.length >= 1 && path.resourceIds.length <= 100 &&
    path.resourceIds.every((id) => typeof id === "string" && id.trim().length > 0) &&
    new Set(path.resourceIds).size === path.resourceIds.length;
}

export function isClassroomTeachingPath(value: unknown): value is ClassroomTeachingPath {
  if (!isStudentTeachingPath(value)) return false;
  const path = value as unknown as Record<string, unknown>;
  return typeof path.sourceUpdatedAt === "string" && Number.isFinite(Date.parse(path.sourceUpdatedAt)) &&
    typeof path.sharedAt === "string" && Number.isFinite(Date.parse(path.sharedAt)) &&
    (path.sourceRevision === undefined || (Number.isInteger(path.sourceRevision) && Number(path.sourceRevision) > 0)) &&
    isSavedTeachingPath({ ...path, createdAt: path.sourceUpdatedAt, updatedAt: path.sourceUpdatedAt });
}

export function snapshotTeachingPath(path: SavedTeachingPath, previous?: ClassroomTeachingPath): ClassroomTeachingPath {
  return {
    id: path.id, name: path.name, objective: path.objective,
    backgroundColor: path.backgroundColor, icon: path.icon,
    resourceIds: [...path.resourceIds], lessonCountsByResourceId: { ...path.lessonCountsByResourceId },
    sourceUpdatedAt: path.updatedAt, ...(path.revision === undefined ? {} : { sourceRevision: path.revision }),
    sharedAt: previous?.sharedAt ?? new Date().toISOString(), visible: previous?.visible ?? true,
  };
}

export function classroomPathNeedsUpdate(snapshot: ClassroomTeachingPath, source: SavedTeachingPath): boolean {
  return snapshot.name !== source.name || snapshot.objective !== source.objective ||
    snapshot.backgroundColor !== source.backgroundColor || snapshot.icon !== source.icon ||
    snapshot.resourceIds.length !== source.resourceIds.length ||
    snapshot.resourceIds.some((id, index) => id !== source.resourceIds[index] ||
      snapshot.lessonCountsByResourceId[id] !== source.lessonCountsByResourceId[id]);
}
