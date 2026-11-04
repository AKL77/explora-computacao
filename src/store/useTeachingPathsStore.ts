import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isOnlineMode, onlineMemoryStorage } from "@/lib/backend/config";
import { remoteMutation, type MaybePromise } from "@/lib/backend/workspaceState";
import { teacherWorkspaceRepository } from "@/repositories/TeacherWorkspaceRepository";

import {
  DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
  DEFAULT_TEACHING_PATH_ICON,
  DEFAULT_TEACHING_PATH_OBJECTIVE,
  isTeachingPathBackgroundColor,
  isTeachingPathIcon,
  isSavedTeachingPath,
  normalizeTeachingPathName,
  normalizeTeachingPathObjective,
  type TeachingPathBackgroundColor,
  type TeachingPathIcon,
  type LocalTeachingPathsState,
  type SavedTeachingPath,
  type TeachingPathLessonCount,
} from "@/domain/savedTeachingPath";

export const TEACHING_PATHS_STORAGE_KEY = "explora-computacao:teaching-paths:v1";
export const TEACHING_PATHS_SCHEMA_VERSION = 2 as const;

export interface TeachingPathMetadata {
  readonly lessonCountsByResourceId?: Readonly<Record<string, TeachingPathLessonCount | undefined>>;
  readonly objective?: string;
  readonly backgroundColor?: TeachingPathBackgroundColor;
  readonly icon?: TeachingPathIcon;
}

export interface TeachingPathUpdate {
  readonly name: string;
  readonly objective: string;
  readonly backgroundColor: TeachingPathBackgroundColor;
  readonly icon: TeachingPathIcon;
  readonly resourceIds: readonly string[];
  readonly lessonCountsByResourceId: Readonly<Record<string, TeachingPathLessonCount | undefined>>;
}

export interface TeachingPathsStore extends LocalTeachingPathsState {
  createPath: (
    name: string,
    resourceIds: readonly string[],
    metadata?: TeachingPathMetadata,
  ) => MaybePromise<SavedTeachingPath | null>;
  updatePath: (pathId: string, update: TeachingPathUpdate) => MaybePromise<SavedTeachingPath | null>;
  deletePath: (pathId: string) => MaybePromise<boolean>;
  addResourceToPath: (pathId: string, resourceId: string) => MaybePromise<boolean>;
  removeResourceFromPath: (pathId: string, resourceId: string) => MaybePromise<boolean>;
  moveResourceInPath: (pathId: string, resourceId: string, direction: -1 | 1) => MaybePromise<boolean>;
  setResourceLessonCount: (
    pathId: string,
    resourceId: string,
    lessonCount: TeachingPathLessonCount,
  ) => MaybePromise<boolean>;
  getPath: (pathId: string) => SavedTeachingPath | undefined;
  clearPaths: () => void;
}

const initialTeachingPathsState: LocalTeachingPathsState = {
  schemaVersion: TEACHING_PATHS_SCHEMA_VERSION,
  paths: [],
};

function createPathId(existingIds: ReadonlySet<string>): string {
  let id: string;
  do {
    id =
      typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `trilha-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  } while (existingIds.has(id));

  return id;
}

function compareByMostRecentlyUpdated(
  first: SavedTeachingPath,
  second: SavedTeachingPath,
): number {
  return Date.parse(second.updatedAt) - Date.parse(first.updatedAt);
}

function uniqueResourceIds(resourceIds: readonly string[]): string[] {
  return [...new Set(resourceIds.filter((resourceId) => resourceId.trim().length > 0))];
}

function hasUniqueNonEmptyResourceIds(resourceIds: readonly string[]): boolean {
  return (
    resourceIds.length > 0 &&
    resourceIds.every((resourceId) => resourceId.trim().length > 0) &&
    new Set(resourceIds).size === resourceIds.length
  );
}

function isLessonCount(value: unknown): value is TeachingPathLessonCount | undefined {
  return value === undefined || value === 1 || value === 2 || value === 3;
}

function normalizeLessonCounts(
  resourceIds: readonly string[],
  lessonCountsByResourceId: unknown,
): Record<string, TeachingPathLessonCount> | null {
  if (!lessonCountsByResourceId || typeof lessonCountsByResourceId !== "object") return null;

  const counts = lessonCountsByResourceId as Record<string, unknown>;
  const normalized: Record<string, TeachingPathLessonCount> = {};

  for (const resourceId of resourceIds) {
    if (!Object.hasOwn(counts, resourceId)) continue;
    const lessonCount = counts[resourceId];
    if (!isLessonCount(lessonCount)) return null;
    if (lessonCount !== undefined) normalized[resourceId] = lessonCount;
  }

  return normalized;
}

function getOptionalPathMetadata(path: Record<string, unknown>): TeachingPathMetadata {
  return {
    objective:
      typeof path.objective === "string"
        ? normalizeTeachingPathObjective(path.objective) || DEFAULT_TEACHING_PATH_OBJECTIVE
        : DEFAULT_TEACHING_PATH_OBJECTIVE,
    backgroundColor: isTeachingPathBackgroundColor(path.backgroundColor)
      ? path.backgroundColor
      : DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
    icon: isTeachingPathIcon(path.icon) ? path.icon : DEFAULT_TEACHING_PATH_ICON,
  };
}

function normalizePersistedTeachingPath(value: unknown): SavedTeachingPath | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const path = value as Record<string, unknown>;
  if (!path.lessonCountsByResourceId || typeof path.lessonCountsByResourceId !== "object") {
    return null;
  }

  const resourceIds = path.resourceIds;
  if (
    typeof path.id !== "string" ||
    !path.id.trim() ||
    typeof path.name !== "string" ||
    !normalizeTeachingPathName(path.name) ||
    !Array.isArray(resourceIds) ||
    !resourceIds.every((resourceId): resourceId is string => typeof resourceId === "string") ||
    !hasUniqueNonEmptyResourceIds(resourceIds) ||
    typeof path.createdAt !== "string" ||
    !Number.isFinite(Date.parse(path.createdAt)) ||
    typeof path.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(path.updatedAt)) ||
    Date.parse(path.updatedAt) < Date.parse(path.createdAt)
  ) {
    return null;
  }

  const lessonCountsByResourceId = normalizeLessonCounts(resourceIds, path.lessonCountsByResourceId);
  if (!lessonCountsByResourceId) return null;

  const metadata = getOptionalPathMetadata(path);
  const normalized: SavedTeachingPath = {
    id: path.id.trim(),
    name: normalizeTeachingPathName(path.name),
    objective: metadata.objective ?? DEFAULT_TEACHING_PATH_OBJECTIVE,
    backgroundColor: metadata.backgroundColor ?? DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
    icon: metadata.icon ?? DEFAULT_TEACHING_PATH_ICON,
    resourceIds: [...resourceIds],
    lessonCountsByResourceId,
    createdAt: path.createdAt,
    updatedAt: path.updatedAt,
  };

  return isSavedTeachingPath(normalized) ? normalized : null;
}

export function sanitizePersistedTeachingPathsState(
  persistedState: unknown,
): LocalTeachingPathsState {
  if (!persistedState || typeof persistedState !== "object") {
    return { ...initialTeachingPathsState, paths: [] };
  }

  const candidate = persistedState as Partial<LocalTeachingPathsState>;
  if (!Array.isArray(candidate.paths)) {
    return { ...initialTeachingPathsState, paths: [] };
  }

  const pathsById = new Map<string, SavedTeachingPath>();
  for (const path of candidate.paths) {
    const normalizedPath = normalizePersistedTeachingPath(path);
    if (!normalizedPath) continue;
    const current = pathsById.get(normalizedPath.id);
    if (!current || Date.parse(normalizedPath.updatedAt) > Date.parse(current.updatedAt)) {
      pathsById.set(normalizedPath.id, normalizedPath);
    }
  }

  return {
    schemaVersion: TEACHING_PATHS_SCHEMA_VERSION,
    paths: [...pathsById.values()].sort(compareByMostRecentlyUpdated),
  };
}

export function migratePersistedTeachingPathsState(
  persistedState: unknown,
  storedVersion: number,
): LocalTeachingPathsState {
  if (storedVersion > TEACHING_PATHS_SCHEMA_VERSION) {
    return { ...initialTeachingPathsState, paths: [] };
  }

  return sanitizePersistedTeachingPathsState(persistedState);
}

export const useTeachingPathsStore = create<TeachingPathsStore>()(
  persist((set, get) => {
    const replace = (path: SavedTeachingPath | null) => {
      if (!path) return;
      set((state) => ({ paths: [path, ...state.paths.filter((item) => item.id !== path.id)].sort(compareByMostRecentlyUpdated) }));
    };
    const commit = (path: SavedTeachingPath): MaybePromise<SavedTeachingPath | null> => {
      if (isOnlineMode) return remoteMutation<SavedTeachingPath | null>(() => teacherWorkspaceRepository.savePath(path), replace, null);
      replace(path);
      return path;
    };
    const change = (id: string, transform: (path: SavedTeachingPath) => SavedTeachingPath | null): MaybePromise<boolean> => {
      const current = get().paths.find((path) => path.id === id);
      if (!current) return false;
      const next = transform(current);
      if (!next) return false;
      const result = commit({ ...next, updatedAt: new Date().toISOString() });
      return result instanceof Promise ? result.then(Boolean) : Boolean(result);
    };
    return {
      ...initialTeachingPathsState,
      createPath: (name, resourceIds, metadata) => {
        const normalizedName = normalizeTeachingPathName(name);
        const ids = uniqueResourceIds(resourceIds);
        const objective = metadata?.objective === undefined ? DEFAULT_TEACHING_PATH_OBJECTIVE : normalizeTeachingPathObjective(metadata.objective);
        if (!normalizedName || !ids.length || !objective) return null;
        const counts = normalizeLessonCounts(ids, metadata?.lessonCountsByResourceId ?? {});
        if (!counts) return null;
        const now = new Date().toISOString();
        return commit({
          id: createPathId(new Set(get().paths.map((path) => path.id))), name: normalizedName, objective,
          backgroundColor: isTeachingPathBackgroundColor(metadata?.backgroundColor) ? metadata.backgroundColor : DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
          icon: isTeachingPathIcon(metadata?.icon) ? metadata.icon : DEFAULT_TEACHING_PATH_ICON,
          resourceIds: ids, lessonCountsByResourceId: counts, createdAt: now, updatedAt: now,
        });
      },
      updatePath: (pathId, update) => {
        const current = get().paths.find((path) => path.id === pathId);
        if (!current) return null;
        const name = normalizeTeachingPathName(update.name);
        const objective = normalizeTeachingPathObjective(update.objective);
        const resourceIds = [...update.resourceIds];
        const counts = normalizeLessonCounts(resourceIds, update.lessonCountsByResourceId);
        if (!name || !objective || !isTeachingPathBackgroundColor(update.backgroundColor) || !isTeachingPathIcon(update.icon) || !hasUniqueNonEmptyResourceIds(resourceIds) || !counts) return null;
        return commit({ ...current, name, objective, backgroundColor: update.backgroundColor, icon: update.icon, resourceIds, lessonCountsByResourceId: counts, updatedAt: new Date().toISOString() });
      },
      addResourceToPath: (id, resourceId) => {
        const current = get().paths.find((path) => path.id === id);
        if (current?.resourceIds.includes(resourceId)) return true;
        return change(id, (path) => ({ ...path, resourceIds: [...path.resourceIds, resourceId] }));
      },
      removeResourceFromPath: (id, resourceId) => change(id, (path) => {
        if (path.resourceIds.length === 1 || !path.resourceIds.includes(resourceId)) return null;
        const counts = { ...path.lessonCountsByResourceId };
        delete counts[resourceId];
        return { ...path, resourceIds: path.resourceIds.filter((value) => value !== resourceId), lessonCountsByResourceId: counts };
      }),
      moveResourceInPath: (id, resourceId, direction) => change(id, (path) => {
        const index = path.resourceIds.indexOf(resourceId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= path.resourceIds.length) return null;
        const resourceIds = [...path.resourceIds];
        [resourceIds[index], resourceIds[target]] = [resourceIds[target], resourceIds[index]];
        return { ...path, resourceIds };
      }),
      setResourceLessonCount: (id, resourceId, lessonCount) => change(id, (path) => {
        if (!path.resourceIds.includes(resourceId) || !isLessonCount(lessonCount)) return null;
        return { ...path, lessonCountsByResourceId: { ...path.lessonCountsByResourceId, [resourceId]: lessonCount } };
      }),
      deletePath: (id) => {
        const current = get().paths.find((path) => path.id === id);
        if (!current) return false;
        const remove = (deleted: boolean) => {
          if (deleted) set((state) => ({ paths: state.paths.filter((path) => path.id !== id) }));
        };
        if (isOnlineMode) return remoteMutation(() => teacherWorkspaceRepository.deletePath(current), remove, false);
        remove(true);
        return true;
      },
      getPath: (id) => get().paths.find((path) => path.id === id),
      clearPaths: () => set({ ...initialTeachingPathsState, paths: [] }),
    };
  }, {
    name: TEACHING_PATHS_STORAGE_KEY,
    storage: createJSONStorage(() => isOnlineMode ? onlineMemoryStorage : localStorage),
    version: TEACHING_PATHS_SCHEMA_VERSION,
    partialize: ({ schemaVersion, paths }) => ({ schemaVersion, paths }),
    migrate: migratePersistedTeachingPathsState,
    merge: (persistedState, currentState) => ({ ...currentState, ...sanitizePersistedTeachingPathsState(persistedState) }),
  }),
);
