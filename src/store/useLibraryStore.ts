import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserFolder } from "@/domain/folder";

export const LIBRARY_STORAGE_KEY = "informatica-explorer:library:v1";
export const FAVORITES_FOLDER_ID = "favoritos";
export const LIBRARY_SCHEMA_VERSION = 1 as const;

export type FolderNameError = "required" | "too-long" | "duplicate";

export type CreateFolderResult =
  | { ok: true; folder: UserFolder }
  | { ok: false; error: FolderNameError };

interface LibraryStore {
  schemaVersion: typeof LIBRARY_SCHEMA_VERSION;
  favoriteResourceIds: string[];
  folders: UserFolder[];
  toggleFavorite: (resourceId: string) => void;
  setFavorite: (resourceId: string, favorite: boolean) => void;
  createFolder: (name: string, initialResourceId?: string) => CreateFolderResult;
  addResourceToFolder: (folderId: string, resourceId: string) => boolean;
  removeResourceFromFolder: (folderId: string, resourceId: string) => boolean;
  setResourceFolderMembership: (resourceId: string, folderIds: string[]) => void;
  clearLibrary: () => void;
}

const initialLibraryState = {
  schemaVersion: LIBRARY_SCHEMA_VERSION,
  favoriteResourceIds: [] as string[],
  folders: [] as UserFolder[],
};

export function normalizeFolderDisplayName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeFolderComparisonName(name: string): string {
  return normalizeFolderDisplayName(name)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

export function validateFolderName(
  name: string,
  folders: Pick<UserFolder, "name">[],
): FolderNameError | null {
  const normalizedName = normalizeFolderDisplayName(name);

  if (normalizedName.length === 0) {
    return "required";
  }

  if (normalizedName.length > 80) {
    return "too-long";
  }

  const comparisonName = normalizeFolderComparisonName(normalizedName);
  if (
    comparisonName === normalizeFolderComparisonName("Favoritos") ||
    folders.some(
      (folder) => normalizeFolderComparisonName(folder.name) === comparisonName,
    )
  ) {
    return "duplicate";
  }

  return null;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function createFolderId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `pasta-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isUserFolder(value: unknown): value is UserFolder {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<UserFolder>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    Array.isArray(candidate.resourceIds) &&
    candidate.resourceIds.every((resourceId) => typeof resourceId === "string") &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function sanitizePersistedState(persistedState: unknown) {
  if (!persistedState || typeof persistedState !== "object") {
    return initialLibraryState;
  }

  const candidate = persistedState as Partial<LibraryStore>;
  return {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    favoriteResourceIds: Array.isArray(candidate.favoriteResourceIds)
      ? unique(
          candidate.favoriteResourceIds.filter(
            (resourceId): resourceId is string => typeof resourceId === "string",
          ),
        )
      : [],
    folders: Array.isArray(candidate.folders)
      ? candidate.folders.filter(isUserFolder).map((folder) => ({
          ...folder,
          name: normalizeFolderDisplayName(folder.name),
          resourceIds: unique(folder.resourceIds),
        }))
      : [],
  };
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      ...initialLibraryState,
      toggleFavorite: (resourceId) => {
        const isFavorite = get().favoriteResourceIds.includes(resourceId);
        get().setFavorite(resourceId, !isFavorite);
      },
      setFavorite: (resourceId, favorite) =>
        set((state) => ({
          favoriteResourceIds: favorite
            ? unique([...state.favoriteResourceIds, resourceId])
            : state.favoriteResourceIds.filter((id) => id !== resourceId),
        })),
      createFolder: (name, initialResourceId) => {
        const error = validateFolderName(name, get().folders);
        if (error) {
          return { ok: false, error };
        }

        const now = new Date().toISOString();
        const folder: UserFolder = {
          id: createFolderId(),
          name: normalizeFolderDisplayName(name),
          resourceIds: initialResourceId ? [initialResourceId] : [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ folders: [...state.folders, folder] }));
        return { ok: true, folder };
      },
      addResourceToFolder: (folderId, resourceId) => {
        const folder = get().folders.find((item) => item.id === folderId);
        if (!folder) {
          return false;
        }

        if (folder.resourceIds.includes(resourceId)) {
          return true;
        }

        const updatedAt = new Date().toISOString();
        set((state) => ({
          folders: state.folders.map((item) =>
            item.id === folderId
              ? {
                  ...item,
                  resourceIds: [...item.resourceIds, resourceId],
                  updatedAt,
                }
              : item,
          ),
        }));
        return true;
      },
      removeResourceFromFolder: (folderId, resourceId) => {
        const folder = get().folders.find((item) => item.id === folderId);
        if (!folder) {
          return false;
        }

        const updatedAt = new Date().toISOString();
        set((state) => ({
          folders: state.folders.map((item) =>
            item.id === folderId
              ? {
                  ...item,
                  resourceIds: item.resourceIds.filter((id) => id !== resourceId),
                  updatedAt,
                }
              : item,
          ),
        }));
        return true;
      },
      setResourceFolderMembership: (resourceId, folderIds) => {
        const selectedFolderIds = new Set(folderIds);
        const updatedAt = new Date().toISOString();

        set((state) => ({
          folders: state.folders.map((folder) => {
            const shouldContain = selectedFolderIds.has(folder.id);
            const contains = folder.resourceIds.includes(resourceId);

            if (shouldContain === contains) {
              return folder;
            }

            return {
              ...folder,
              resourceIds: shouldContain
                ? [...folder.resourceIds, resourceId]
                : folder.resourceIds.filter((id) => id !== resourceId),
              updatedAt,
            };
          }),
        }));
      },
      clearLibrary: () => set(initialLibraryState),
    }),
    {
      name: LIBRARY_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: LIBRARY_SCHEMA_VERSION,
      partialize: ({ schemaVersion, favoriteResourceIds, folders }) => ({
        schemaVersion,
        favoriteResourceIds,
        folders,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedState(persistedState),
      }),
    },
  ),
);

export type { UserFolder };
