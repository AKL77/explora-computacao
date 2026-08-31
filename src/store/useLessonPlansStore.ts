import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  isSavedLessonPlan,
  type LocalLessonPlansState,
  type SavedLessonPlan,
} from "@/domain/savedLessonPlan";
import type { ComposedLessonPlan } from "@/domain/lessonPlan";

export const LESSON_PLANS_STORAGE_KEY =
  "informatica-explorer:lesson-plans:v1";
export const LESSON_PLANS_SCHEMA_VERSION = 1 as const;

export interface LessonPlansStore extends LocalLessonPlansState {
  createPlan: (plan: ComposedLessonPlan) => SavedLessonPlan;
  updatePlan: (
    planId: string,
    plan: ComposedLessonPlan,
  ) => SavedLessonPlan | null;
  getPlan: (planId: string) => SavedLessonPlan | undefined;
  clearPlans: () => void;
}

const initialLessonPlansState: LocalLessonPlansState = {
  schemaVersion: LESSON_PLANS_SCHEMA_VERSION,
  plans: [],
};

function clonePlan(plan: ComposedLessonPlan): ComposedLessonPlan {
  return structuredClone(plan);
}

function createPlanId(existingIds: ReadonlySet<string>): string {
  let id: string;

  do {
    id =
      typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `plano-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  } while (existingIds.has(id));

  return id;
}

function compareByMostRecentlyUpdated(
  first: SavedLessonPlan,
  second: SavedLessonPlan,
): number {
  return Date.parse(second.updatedAt) - Date.parse(first.updatedAt);
}

export function sanitizePersistedLessonPlansState(
  persistedState: unknown,
): LocalLessonPlansState {
  if (!persistedState || typeof persistedState !== "object") {
    return { ...initialLessonPlansState, plans: [] };
  }

  const candidate = persistedState as Partial<LocalLessonPlansState>;
  if (!Array.isArray(candidate.plans)) {
    return { ...initialLessonPlansState, plans: [] };
  }

  const plansById = new Map<string, SavedLessonPlan>();
  for (const plan of candidate.plans) {
    if (!isSavedLessonPlan(plan)) continue;

    const current = plansById.get(plan.id);
    if (
      !current ||
      Date.parse(plan.updatedAt) > Date.parse(current.updatedAt)
    ) {
      plansById.set(plan.id, plan);
    }
  }

  return {
    schemaVersion: LESSON_PLANS_SCHEMA_VERSION,
    plans: [...plansById.values()].sort(compareByMostRecentlyUpdated),
  };
}

export function migratePersistedLessonPlansState(
  persistedState: unknown,
  storedVersion: number,
): LocalLessonPlansState {
  if (storedVersion > LESSON_PLANS_SCHEMA_VERSION) {
    return { ...initialLessonPlansState, plans: [] };
  }

  return sanitizePersistedLessonPlansState(persistedState);
}

export const useLessonPlansStore = create<LessonPlansStore>()(
  persist(
    (set, get) => ({
      ...initialLessonPlansState,
      createPlan: (plan) => {
        const now = new Date().toISOString();
        const savedPlan: SavedLessonPlan = {
          id: createPlanId(new Set(get().plans.map((item) => item.id))),
          plan: clonePlan(plan),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ plans: [savedPlan, ...state.plans] }));
        return savedPlan;
      },
      updatePlan: (planId, plan) => {
        const existingPlan = get().plans.find((item) => item.id === planId);
        if (!existingPlan) return null;

        const updatedPlan: SavedLessonPlan = {
          ...existingPlan,
          plan: clonePlan(plan),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          plans: state.plans
            .map((item) => (item.id === planId ? updatedPlan : item))
            .sort(compareByMostRecentlyUpdated),
        }));
        return updatedPlan;
      },
      getPlan: (planId) => get().plans.find((item) => item.id === planId),
      clearPlans: () => set({ ...initialLessonPlansState, plans: [] }),
    }),
    {
      name: LESSON_PLANS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: LESSON_PLANS_SCHEMA_VERSION,
      partialize: ({ schemaVersion, plans }) => ({ schemaVersion, plans }),
      migrate: migratePersistedLessonPlansState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedLessonPlansState(persistedState),
      }),
    },
  ),
);
