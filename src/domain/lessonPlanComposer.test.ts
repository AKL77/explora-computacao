import { describe, expect, it } from "vitest";

import type {
  ComposedLessonPlan,
  LessonPlanCompositionInput,
  LessonResourceCandidate,
  LessonSession,
} from "@/domain/lessonPlan";
import {
  EVALUATION_PLACEHOLDER_TEXT,
  METHODOLOGY_PLACEHOLDER_TEXT,
} from "@/domain/lessonPlan";
import { composeLessonPlan } from "@/domain/lessonPlanComposer";

function createResource(
  overrides: Partial<LessonResourceCandidate> = {},
): LessonResourceCandidate {
  return {
    id: "recurso-pratico",
    title: "Recurso prático",
    accessUrl: "https://example.com/recurso-pratico",
    estimatedDurationMinutes: 50,
    curriculumAlignments: [{ grade: 7, skillCode: "EF07CO09" }],
    methodologyProfiles: ["expository", "active", "combined"],
    functions: [
      "introduction",
      "exposition",
      "exploration",
      "practice",
      "consolidation",
      "assessment",
    ],
    applicationProposal: {
      title: "Aplicação orientada do recurso",
      description:
        "Apresente a situação proposta pelo recurso e conduza a atividade com a turma.",
      materials: [
        {
          id: "computador",
          label: "Computador ou notebook",
          details: "Um equipamento por grupo.",
        },
      ],
    },
    ...overrides,
  };
}

function createInput(
  overrides: Partial<LessonPlanCompositionInput> = {},
): LessonPlanCompositionInput {
  return {
    theme: "Cyberbullying",
    grade: 7,
    lessonCount: 1,
    skill: {
      code: "EF07CO09",
      officialText: "Reconhecer e debater sobre cyberbullying.",
      axis: "Cultura Digital",
    },
    objective:
      "Reconhecer situações de cyberbullying e discutir formas responsáveis de intervenção.",
    methodologyProfile: "active",
    resources: [createResource()],
    includeEvaluation: false,
    ...overrides,
  };
}

function plannedSessionMinutes(
  plan: ComposedLessonPlan,
  session: LessonSession,
): number {
  const evaluationMinutes =
    plan.evaluation?.sessionNumber === session.number
      ? plan.evaluation.durationMinutes
      : 0;

  return (
    session.centralActivity.durationMinutes +
    session.marginMinutes +
    evaluationMinutes
  );
}

describe("composeLessonPlan", () => {
  it("compõe uma aula de 50 minutos com uma atividade central e cinco minutos de margem", () => {
    const result = composeLessonPlan(createInput());

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.plan).toMatchObject({
      theme: "Cyberbullying",
      grade: 7,
      lessonCount: 1,
      minutesPerLesson: 50,
      totalDurationMinutes: 50,
      methodologyProfile: "active",
    });
    expect(result.plan.sessions).toHaveLength(1);
    expect(result.plan.sessions[0]).toMatchObject({
      number: 1,
      durationMinutes: 50,
      marginMinutes: 5,
      centralActivity: {
        description: METHODOLOGY_PLACEHOLDER_TEXT,
        durationMinutes: 45,
        resourceUse: {
          resourceId: "recurso-pratico",
          requestedFunction: "practice",
        },
      },
    });
    expect(result.plan.sessions[0]).not.toHaveProperty("activities");
    expect(result.plan).not.toHaveProperty("materials");
    expect(result.plan).not.toHaveProperty("evaluation");
  });

  it("mantém os materiais dentro da atividade que usa o recurso", () => {
    const result = composeLessonPlan(createInput());

    if (!result.ok) throw new Error(result.error.message);

    expect(result.plan.sessions[0].centralActivity.materials).toEqual([
      {
        id: "catalog-resource:recurso-pratico",
        label: "Recurso prático",
        kind: "catalog-resource",
        sourceResourceId: "recurso-pratico",
        href: "https://example.com/recurso-pratico",
      },
      {
        id: "support:recurso-pratico:computador",
        label: "Computador ou notebook",
        kind: "support",
        sourceResourceId: "recurso-pratico",
        details: "Um equipamento por grupo.",
      },
    ]);
  });

  it("fecha os 50 minutos da sessão quando não há avaliação", () => {
    const result = composeLessonPlan(createInput({ includeEvaluation: false }));

    if (!result.ok) throw new Error(result.error.message);

    expect(
      result.plan.sessions.map((session) =>
        plannedSessionMinutes(result.plan, session),
      ),
    ).toEqual([50]);
    expect(result.plan.sessions[0].centralActivity.durationMinutes).toBe(45);
  });

  it("permite que um recurso selecionado sustente três aulas", () => {
    const selectedResource = createResource({
      id: "selecionado",
      title: "Recurso selecionado",
      functions: ["practice"],
    });
    const result = composeLessonPlan(
      createInput({
        lessonCount: 3,
        methodologyProfile: "combined",
        resources: [selectedResource],
        includeEvaluation: true,
      }),
    );

    if (!result.ok) throw new Error(result.error.message);

    expect(
      result.plan.sessions.map(
        (session) => session.centralActivity.resourceUse.resourceId,
      ),
    ).toEqual(["selecionado", "selecionado", "selecionado"]);
    expect(
      result.plan.sessions.map(
        (session) => session.centralActivity.resourceUse.requestedFunction,
      ),
    ).toEqual(["exposition", "practice", "assessment"]);
    expect(result.plan.sessions.every((session) => session.durationMinutes === 50)).toBe(
      true,
    );
    expect(result.plan.sessions.every((session) => session.marginMinutes === 5)).toBe(
      true,
    );
    expect(result.plan.evaluation).toEqual({
      description: EVALUATION_PLACEHOLDER_TEXT,
      sessionNumber: 3,
      sourceResourceId: "selecionado",
      durationMinutes: 10,
    });
    expect(result.warnings).toEqual([]);
  });

  it("acomoda a avaliação nos 50 minutos da última sessão", () => {
    const exposition = createResource({
      id: "exposicao",
      functions: ["exposition"],
    });
    const practice = createResource({
      id: "pratica",
      functions: ["practice"],
    });
    const assessment = createResource({
      id: "avaliacao",
      functions: ["assessment"],
    });
    const result = composeLessonPlan(
      createInput({
        lessonCount: 3,
        includeEvaluation: true,
        methodologyProfile: "combined",
        resources: [exposition, practice, assessment],
      }),
    );

    if (!result.ok) throw new Error(result.error.message);

    expect(
      result.plan.sessions.map((session) =>
        plannedSessionMinutes(result.plan, session),
      ),
    ).toEqual([50, 50, 50]);
    expect(
      result.plan.sessions.map(
        (session) => session.centralActivity.durationMinutes,
      ),
    ).toEqual([45, 45, 35]);
    expect(result.plan.evaluation?.durationMinutes).toBe(10);
  });

  it("não exige propostas ou funções diferentes para criar várias aulas", () => {
    const result = composeLessonPlan(
      createInput({
        lessonCount: 3,
        methodologyProfile: "combined",
        resources: [createResource({ functions: ["practice"] })],
      }),
    );

    if (!result.ok) throw new Error(result.error.message);
    expect(result.plan.sessions).toHaveLength(3);
    expect(
      new Set(
        result.plan.sessions.map(
          (session) => session.centralActivity.resourceUse.resourceId,
        ),
      ),
    ).toEqual(new Set(["recurso-pratico"]));
  });

  it("usa a ordem de entrada como desempate estável", () => {
    const first = createResource({ id: "primeiro", title: "Primeiro" });
    const second = createResource({ id: "segundo", title: "Segundo" });
    const input = createInput({ resources: [second, first] });
    const original = structuredClone(input);

    const result = composeLessonPlan(input);

    if (!result.ok) throw new Error(result.error.message);
    expect(result.plan.sessions[0].centralActivity.resourceUse.resourceId).toBe(
      "segundo",
    );
    expect(input).toEqual(original);
  });

  it("distribui vários recursos selecionados na ordem de entrada", () => {
    const versatile = createResource({
      id: "versatil",
      title: "Recurso versátil",
      functions: ["exposition", "practice"],
    });
    const exposition = createResource({
      id: "exposicao",
      title: "Recurso de exposição",
      functions: ["exposition"],
    });
    const result = composeLessonPlan(
      createInput({
        lessonCount: 2,
        methodologyProfile: "combined",
        resources: [versatile, exposition],
      }),
    );

    if (!result.ok) throw new Error(result.error.message);

    expect(
      result.plan.sessions.map(
        (session) => session.centralActivity.resourceUse.resourceId,
      ),
    ).toEqual(["versatil", "exposicao"]);
  });

  it("não usa a função pedagógica antiga para excluir um recurso selecionado", () => {
    const result = composeLessonPlan(
      createInput({
        resources: [createResource({ functions: ["introduction"] })],
      }),
    );

    if (!result.ok) throw new Error(result.error.message);
    expect(result.plan.sessions[0].centralActivity.resourceUse).toMatchObject({
      resourceId: "recurso-pratico",
      requestedFunction: "practice",
    });
  });

  it("aceita um conteúdo cuja duração curada abrange várias aulas", () => {
    const result = composeLessonPlan(
      createInput({
        resources: [createResource({ estimatedDurationMinutes: 100 })],
      }),
    );

    expect(result.ok).toBe(true);
  });

  it("retorna erro seguro quando não há recurso compatível", () => {
    const withoutResources = composeLessonPlan(createInput({ resources: [] }));
    const wrongGrade = composeLessonPlan(
      createInput({
        resources: [
          createResource({
            curriculumAlignments: [{ grade: 8, skillCode: "EF07CO09" }],
          }),
        ],
      }),
    );

    expect(withoutResources).toEqual({
      ok: false,
      error: {
        code: "no-compatible-resource",
        message:
          "Não há recurso compatível com o ano, a habilidade e o perfil metodológico informados.",
      },
    });
    expect(wrongGrade).toMatchObject({
      ok: false,
      error: { code: "no-compatible-resource" },
    });
  });

  it("não cruza a habilidade de uma turma com outra turma do mesmo recurso", () => {
    const result = composeLessonPlan(
      createInput({
        grade: 7,
        skill: {
          code: "EF08CO03",
          officialText: "Utilizar algoritmos clássicos de manipulação sobre listas.",
        },
        resources: [
          createResource({
            curriculumAlignments: [
              { grade: 7, skillCode: "EF07CO04" },
              { grade: 8, skillCode: "EF08CO03" },
            ],
          }),
        ],
      }),
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "no-compatible-resource" },
    });
  });

  it("usa lorem ipsum na avaliação sem depender de sugestão curada", () => {
    const result = composeLessonPlan(
      createInput({
        includeEvaluation: true,
        resources: [createResource()],
      }),
    );

    if (!result.ok) throw new Error(result.error.message);

    expect(result.plan.evaluation).toMatchObject({
      description: EVALUATION_PLACEHOLDER_TEXT,
      sourceResourceId: "recurso-pratico",
      durationMinutes: 10,
    });
    expect(result.warnings).toEqual([]);
  });

  it("valida campos obrigatórios sem lançar exceção", () => {
    expect(composeLessonPlan(createInput({ theme: "   " }))).toEqual({
      ok: false,
      error: {
        code: "invalid-input",
        field: "theme",
        message: "Informe o tema da aula.",
      },
    });
  });
});
