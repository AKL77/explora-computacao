import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ComposedLessonPlan } from "@/domain/lessonPlan";
import type { SavedLessonPlan } from "@/domain/savedLessonPlan";

import {
  LESSON_PLANS_SCHEMA_VERSION,
  LESSON_PLANS_STORAGE_KEY,
  migratePersistedLessonPlansState,
  sanitizePersistedLessonPlansState,
  useLessonPlansStore,
} from "./useLessonPlansStore";

function createPlan(theme = "Cidadania digital"): ComposedLessonPlan {
  return {
    theme,
    grade: 7,
    lessonCount: 1,
    minutesPerLesson: 50,
    totalDurationMinutes: 50,
    skill: {
      code: "EF07CO09",
      officialText: "Reconhecer e debater questões relacionadas ao uso da tecnologia.",
      axis: "Cultura Digital",
      relatedCompetencies: ["Competência 7"],
    },
    objective: "Debater formas responsáveis de participação em ambientes digitais.",
    methodologyProfile: "active",
    sessions: [
      {
        number: 1,
        durationMinutes: 50,
        marginMinutes: 5,
        centralActivity: {
          title: "Atividade principal",
          description: "Lorem ipsum dolor sit amet.",
          durationMinutes: 45,
          resourceUse: {
            resourceId: "recurso-1",
            resourceTitle: "Jogo educativo",
            requestedFunction: "practice",
          },
          materials: [
            {
              id: "catalog-resource:recurso-1",
              label: "Jogo educativo",
              kind: "catalog-resource",
              sourceResourceId: "recurso-1",
              href: "https://example.com/jogo",
            },
          ],
        },
      },
    ],
  };
}

function savedPlan(
  id: string,
  theme: string,
  createdAt: string,
  updatedAt: string,
): SavedLessonPlan {
  return { id, plan: createPlan(theme), createdAt, updatedAt };
}

describe("useLessonPlansStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useLessonPlansStore.setState({
      schemaVersion: LESSON_PLANS_SCHEMA_VERSION,
      plans: [],
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-30T20:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("cria, recupera e persiste um snapshot independente do objeto de entrada", () => {
    const sourcePlan = createPlan();
    const created = useLessonPlansStore.getState().createPlan(sourcePlan);

    sourcePlan.theme = "Tema alterado fora do store";

    expect(created.id).not.toBe("");
    expect(created.createdAt).toBe("2026-08-30T20:00:00.000Z");
    expect(created.updatedAt).toBe(created.createdAt);
    expect(useLessonPlansStore.getState().getPlan(created.id)?.plan.theme).toBe(
      "Cidadania digital",
    );

    const persistedValue = localStorage.getItem(LESSON_PLANS_STORAGE_KEY);
    expect(persistedValue).not.toBeNull();
    expect(JSON.parse(persistedValue ?? "{}")).toMatchObject({
      state: {
        schemaVersion: 1,
        plans: [{ id: created.id, plan: { theme: "Cidadania digital" } }],
      },
      version: 1,
    });
  });

  it("atualiza o snapshot sem alterar identidade e data de criação", () => {
    const created = useLessonPlansStore.getState().createPlan(createPlan());
    vi.setSystemTime(new Date("2026-08-30T21:30:00.000Z"));

    const updated = useLessonPlansStore
      .getState()
      .updatePlan(created.id, createPlan("Segurança na internet"));

    expect(updated).toMatchObject({
      id: created.id,
      createdAt: "2026-08-30T20:00:00.000Z",
      updatedAt: "2026-08-30T21:30:00.000Z",
      plan: { theme: "Segurança na internet" },
    });
    expect(useLessonPlansStore.getState().plans).toHaveLength(1);
  });

  it("não cria um registro ao tentar atualizar um ID inexistente", () => {
    expect(
      useLessonPlansStore
        .getState()
        .updatePlan("plano-inexistente", createPlan()),
    ).toBeNull();
    expect(useLessonPlansStore.getState().plans).toEqual([]);
  });

  it("mantém somente a versão mais recente de IDs duplicados e descarta registros inválidos", () => {
    const older = savedPlan(
      "plano-1",
      "Versão antiga",
      "2026-08-29T10:00:00.000Z",
      "2026-08-29T11:00:00.000Z",
    );
    const newer = savedPlan(
      "plano-1",
      "Versão recente",
      "2026-08-29T10:00:00.000Z",
      "2026-08-30T11:00:00.000Z",
    );

    const sanitized = sanitizePersistedLessonPlansState({
      schemaVersion: 999,
      plans: [
        older,
        { ...savedPlan("inválido", "Inválido", older.createdAt, older.updatedAt), id: "" },
        newer,
      ],
    });

    expect(sanitized).toEqual({
      schemaVersion: 1,
      plans: [newer],
    });
  });

  it("aceita uma estrutura antiga compatível e rejeita schema de uma versão futura", () => {
    const legacyPlan = savedPlan(
      "plano-legado",
      "Plano legado",
      "2026-08-29T10:00:00.000Z",
      "2026-08-29T10:00:00.000Z",
    );

    expect(
      migratePersistedLessonPlansState({ plans: [legacyPlan] }, 0),
    ).toEqual({ schemaVersion: 1, plans: [legacyPlan] });
    expect(
      migratePersistedLessonPlansState({ plans: [legacyPlan] }, 2),
    ).toEqual({ schemaVersion: 1, plans: [] });
  });

  it("limpa todos os planos sem afetar outras chaves locais", () => {
    localStorage.setItem("outra-chave", "preservar");
    useLessonPlansStore.getState().createPlan(createPlan());

    useLessonPlansStore.getState().clearPlans();

    expect(useLessonPlansStore.getState().plans).toEqual([]);
    expect(localStorage.getItem("outra-chave")).toBe("preservar");
  });
});
