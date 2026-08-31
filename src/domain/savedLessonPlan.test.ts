import { describe, expect, it } from "vitest";

import type { ComposedLessonPlan } from "@/domain/lessonPlan";

import {
  isComposedLessonPlanSnapshot,
  isSavedLessonPlan,
} from "./savedLessonPlan";

function createPlan(): ComposedLessonPlan {
  return {
    theme: "Cidadania digital",
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

describe("savedLessonPlan", () => {
  it("reconhece um snapshot canônico completo", () => {
    const plan = createPlan();

    expect(isComposedLessonPlanSnapshot(plan)).toBe(true);
    expect(
      isSavedLessonPlan({
        id: "plano-1",
        plan,
        createdAt: "2026-08-30T20:00:00.000Z",
        updatedAt: "2026-08-30T20:05:00.000Z",
      }),
    ).toBe(true);
  });

  it("rejeita snapshots com estrutura temporal incoerente", () => {
    expect(
      isComposedLessonPlanSnapshot({
        ...createPlan(),
        totalDurationMinutes: 100,
      }),
    ).toBe(false);
  });

  it("aceita a avaliação canônica dentro do tempo da última aula", () => {
    const plan = createPlan();
    const planWithEvaluation: ComposedLessonPlan = {
      ...plan,
      sessions: [
        {
          ...plan.sessions[0]!,
          centralActivity: {
            ...plan.sessions[0]!.centralActivity,
            durationMinutes: 35,
          },
        },
      ],
      evaluation: {
        description: "Lorem ipsum dolor sit amet.",
        sessionNumber: 1,
        sourceResourceId: "recurso-1",
        durationMinutes: 10,
      },
    };

    expect(isComposedLessonPlanSnapshot(planWithEvaluation)).toBe(true);
  });

  it("rejeita links inseguros antes de hidratar um plano", () => {
    const plan = createPlan();
    const unsafePlan = {
      ...plan,
      sessions: [
        {
          ...plan.sessions[0],
          centralActivity: {
            ...plan.sessions[0]?.centralActivity,
            materials: [
              {
                id: "material-1",
                label: "Material",
                kind: "catalog-resource",
                sourceResourceId: "recurso-1",
                href: "javascript:alert(1)",
              },
            ],
          },
        },
      ],
    };

    expect(isComposedLessonPlanSnapshot(unsafePlan)).toBe(false);
  });

  it("rejeita registros cuja atualização antecede a criação", () => {
    expect(
      isSavedLessonPlan({
        id: "plano-1",
        plan: createPlan(),
        createdAt: "2026-08-30T20:00:00.000Z",
        updatedAt: "2026-08-29T20:00:00.000Z",
      }),
    ).toBe(false);
  });
});
