import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ComposedLessonPlan } from "@/domain/lessonPlan";
import {
  LESSON_PLANS_SCHEMA_VERSION,
  useLessonPlansStore,
} from "@/store/useLessonPlansStore";

import { SavedLessonPlansPage } from "./SavedLessonPlansPage";

function createPlan(theme: string): ComposedLessonPlan {
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

beforeEach(() => {
  localStorage.clear();
  useLessonPlansStore.setState({
    schemaVersion: LESSON_PLANS_SCHEMA_VERSION,
    plans: [],
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderPage() {
  render(
    <MemoryRouter>
      <SavedLessonPlansPage />
    </MemoryRouter>,
  );
}

describe("SavedLessonPlansPage", () => {
  it("diferencia a lista vazia e oferece a criação do primeiro plano", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Nenhum plano salvo" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Criar meu primeiro plano" })).toHaveAttribute(
      "href",
      "/app/plano-de-aula",
    );
  });

  it("pesquisa pelo tema ignorando acentos e abre a edição", async () => {
    const user = userEvent.setup();
    const ethics = useLessonPlansStore
      .getState()
      .createPlan(createPlan("Ética e cidadania digital"));
    useLessonPlansStore
      .getState()
      .createPlan(createPlan("Algoritmos e repetições"));
    renderPage();

    await user.type(
      screen.getByRole("searchbox", { name: "Pesquisar planos pelo nome" }),
      "etica",
    );

    expect(screen.getByRole("heading", { name: "Ética e cidadania digital" })).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Algoritmos e repetições" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("1 plano encontrado")).toHaveAttribute(
      "role",
      "status",
    );
    expect(screen.getByRole("link", { name: "Editar plano" })).toHaveAttribute(
      "href",
      `/app/planos/${ethics.id}/editar`,
    );
  });

  it("disponibiliza o download do plano salvo", async () => {
    const user = userEvent.setup();
    useLessonPlansStore
      .getState()
      .createPlan(createPlan("Cidadania digital"));

    const createObjectURL = vi.fn(() => "blob:plano");
    const revokeObjectURL = vi.fn();
    class TestURL extends globalThis.URL {}
    Object.assign(TestURL, { createObjectURL, revokeObjectURL });
    vi.stubGlobal("URL", TestURL);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    renderPage();

    await user.click(
      screen.getByRole("button", { name: "Baixar PDF de Cidadania digital" }),
    );

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(screen.getByText(/Download do plano “Cidadania digital” iniciado/)).toBeVisible();
  });
});
