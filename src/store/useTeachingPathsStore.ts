import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  ) => SavedTeachingPath | null;
  updatePath: (pathId: string, update: TeachingPathUpdate) => SavedTeachingPath | null;
  addResourceToPath: (pathId: string, resourceId: string) => boolean;
  removeResourceFromPath: (pathId: string, resourceId: string) => boolean;
  moveResourceInPath: (pathId: string, resourceId: string, direction: -1 | 1) => boolean;
  setResourceLessonCount: (
    pathId: string,
    resourceId: string,
    lessonCount: TeachingPathLessonCount,
  ) => boolean;
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
  persist(
    (set, get) => ({
      ...initialTeachingPathsState,
      createPath: (name, resourceIds, metadata) => {
        const normalizedName = normalizeTeachingPathName(name);
        const normalizedResourceIds = uniqueResourceIds(resourceIds);
        const normalizedObjective =
          metadata?.objective === undefined
            ? DEFAULT_TEACHING_PATH_OBJECTIVE
            : normalizeTeachingPathObjective(metadata.objective);
        if (!normalizedName || normalizedResourceIds.length === 0 || !normalizedObjective) return null;

        const backgroundColor = isTeachingPathBackgroundColor(metadata?.backgroundColor)
          ? metadata.backgroundColor
          : DEFAULT_TEACHING_PATH_BACKGROUND_COLOR;
        const icon = isTeachingPathIcon(metadata?.icon) ? metadata.icon : DEFAULT_TEACHING_PATH_ICON;

        const now = new Date().toISOString();
        const path: SavedTeachingPath = {
          id: createPathId(new Set(get().paths.map((item) => item.id))),
          name: normalizedName,
          objective: normalizedObjective,
          backgroundColor,
          icon,
          resourceIds: normalizedResourceIds,
          lessonCountsByResourceId: {},
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ paths: [path, ...state.paths] }));
        return path;
      },
      updatePath: (pathId, update) => {
        const currentPath = get().paths.find((item) => item.id === pathId);
        if (!currentPath) return null;

        const name = normalizeTeachingPathName(update.name);
        const objective = normalizeTeachingPathObjective(update.objective);
        const resourceIds = [...update.resourceIds];
        if (
          !name ||
          !objective ||
          !isTeachingPathBackgroundColor(update.backgroundColor) ||
          !isTeachingPathIcon(update.icon) ||
          !hasUniqueNonEmptyResourceIds(resourceIds)
        ) {
          return null;
        }

        const lessonCountsByResourceId = normalizeLessonCounts(
          resourceIds,
          update.lessonCountsByResourceId,
        );
        if (!lessonCountsByResourceId) return null;

        const updatedPath: SavedTeachingPath = {
          ...currentPath,
          name,
          objective,
          backgroundColor: update.backgroundColor,
          icon: update.icon,
          resourceIds,
          lessonCountsByResourceId,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          paths: state.paths
            .map((item) => (item.id === pathId ? updatedPath : item))
            .sort(compareByMostRecentlyUpdated),
        }));
        return updatedPath;
      },
      addResourceToPath: (pathId, resourceId) => {
        const path = get().paths.find((item) => item.id === pathId);
        if (!path || path.resourceIds.includes(resourceId)) return Boolean(path);

        const updatedAt = new Date().toISOString();
        set((state) => ({
          paths: state.paths
            .map((item) =>
              item.id === pathId
                ? { ...item, resourceIds: [...item.resourceIds, resourceId], updatedAt }
                : item,
            )
            .sort(compareByMostRecentlyUpdated),
        }));
        return true;
      },
      removeResourceFromPath: (pathId, resourceId) => {
        const path = get().paths.find((item) => item.id === pathId);
        if (!path || !path.resourceIds.includes(resourceId) || path.resourceIds.length === 1) {
          return false;
        }

        const updatedAt = new Date().toISOString();
        set((state) => ({
          paths: state.paths
            .map((item) => {
              if (item.id !== pathId) return item;
              const lessonCountsByResourceId = { ...item.lessonCountsByResourceId };
              delete lessonCountsByResourceId[resourceId];
              return {
                ...item,
                resourceIds: item.resourceIds.filter((id) => id !== resourceId),
                lessonCountsByResourceId,
                updatedAt,
              };
            })
            .sort(compareByMostRecentlyUpdated),
        }));
        return true;
      },
      moveResourceInPath: (pathId, resourceId, direction) => {
        const path = get().paths.find((item) => item.id === pathId);
        if (!path) return false;

        const index = path.resourceIds.indexOf(resourceId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= path.resourceIds.length) return false;

        const updatedAt = new Date().toISOString();
        set((state) => ({
          paths: state.paths
            .map((item) => {
              if (item.id !== pathId) return item;
              const resourceIds = [...item.resourceIds];
              [resourceIds[index], resourceIds[nextIndex]] = [
                resourceIds[nextIndex],
                resourceIds[index],
              ];
              return { ...item, resourceIds, updatedAt };
            })
            .sort(compareByMostRecentlyUpdated),
        }));
        return true;
      },
      setResourceLessonCount: (pathId, resourceId, lessonCount) => {
        const path = get().paths.find((item) => item.id === pathId);
        if (!path || !path.resourceIds.includes(resourceId)) return false;

        const updatedAt = new Date().toISOString();
        set((state) => ({
          paths: state.paths
            .map((item) =>
              item.id === pathId
                ? {
                    ...item,
                    lessonCountsByResourceId: {
                      ...item.lessonCountsByResourceId,
                      [resourceId]: lessonCount,
                    },
                    updatedAt,
                  }
                : item,
            )
            .sort(compareByMostRecentlyUpdated),
        }));
        return true;
      },
      getPath: (pathId) => get().paths.find((item) => item.id === pathId),
      clearPaths: () => set({ ...initialTeachingPathsState, paths: [] }),
    }),
    {
      name: TEACHING_PATHS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: TEACHING_PATHS_SCHEMA_VERSION,
      partialize: ({ schemaVersion, paths }) => ({ schemaVersion, paths }),
      migrate: migratePersistedTeachingPathsState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedTeachingPathsState(persistedState),
      }),
    },
  ),
);
