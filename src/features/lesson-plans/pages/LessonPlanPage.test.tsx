import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  EVALUATION_PLACEHOLDER_TEXT,
  METHODOLOGY_PLACEHOLDER_TEXT,
} from "@/domain/lessonPlan";
import {
  LESSON_PLANS_SCHEMA_VERSION,
  useLessonPlansStore,
} from "@/store/useLessonPlansStore";

import { LessonPlanPage } from "./LessonPlanPage";

beforeEach(() => {
  localStorage.clear();
  useLessonPlansStore.setState({
    schemaVersion: LESSON_PLANS_SCHEMA_VERSION,
    plans: [],
  });
});

afterEach(cleanup);

function renderPage(initialEntry = "/app/plano-de-aula") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Link to="/app/plano-de-aula">Novo plano</Link>
      <Routes>
        <Route path="/app/plano-de-aula" element={<LessonPlanPage />} />
        <Route path="/app/planos/:planId/editar" element={<LessonPlanPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function waitForCatalog() {
  const grade = screen.getByRole("combobox", { name: "Ano escolar" });
  await waitFor(() => expect(grade).toBeEnabled());
  return grade;
}

async function fillLightbotPlan(
  user: ReturnType<typeof userEvent.setup>,
  theme = "Algoritmos com Lightbot",
) {
  await user.type(screen.getByRole("textbox", { name: "Tema" }), theme);
  await user.selectOptions(await waitForCatalog(), "4");
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Habilidade" }),
    "EF04CO03",
  );

  const resource = screen.getByRole("combobox", { name: "Material disponível" });
  expect(within(resource).getByRole("option", { name: "Lightbot" })).toBeVisible();
  expect(
    within(resource).getByRole("option", { name: "Blockly Games" }),
  ).toBeVisible();
  await user.selectOptions(resource, "lightbot-web");

  expect(
    screen.getByText("Este material não possui objetivo sugerido. Escreva o objetivo do plano."),
  ).toBeVisible();
  await user.type(
    screen.getByRole("textbox", { name: "Objetivo" }),
    "Criar e testar algoritmos com sequências e repetições.",
  );
}

describe("LessonPlanPage", () => {
  it("seleciona novos materiais, monta a visão Em Blocos e salva o plano", async () => {
    const user = userEvent.setup();
    renderPage();
    await fillLightbotPlan(user);

    const evaluation = screen.getByRole("checkbox", { name: /Incluir avaliação/ });
    expect(evaluation).toBeEnabled();
    await user.click(evaluation);
    await user.click(screen.getByRole("button", { name: "Montar plano" }));

    expect(
      await screen.findByRole("heading", { name: "Algoritmos com Lightbot", level: 2 }),
    ).toHaveFocus();
    expect(screen.getByRole("button", { name: "Em Blocos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const blockView = screen.getByLabelText("Visualização em blocos do plano");
    for (const heading of ["Materiais", "BNCC", "Objetivo", "Metodologia", "Avaliação"]) {
      expect(within(blockView).getByRole("heading", { name: heading })).toBeVisible();
    }
    expect(within(blockView).getByText(METHODOLOGY_PLACEHOLDER_TEXT)).toBeVisible();
    expect(within(blockView).getByText(EVALUATION_PLACEHOLDER_TEXT)).toBeVisible();
    expect(within(blockView).getByText(/EF04CO03/)).toBeVisible();
    expect(within(blockView).queryByText("Habilidade")).not.toBeInTheDocument();
    expect(within(blockView).queryByText("Eixo")).not.toBeInTheDocument();
    expect(within(blockView).queryByText("Competência")).not.toBeInTheDocument();
    expect(within(blockView).getByRole("link", { name: /Lightbot/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: /Trocar/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar plano" }));

    expect(useLessonPlansStore.getState().plans).toHaveLength(1);
    expect(useLessonPlansStore.getState().plans[0]?.plan.theme).toBe(
      "Algoritmos com Lightbot",
    );
    expect(
      await screen.findByRole("heading", { name: "Editar Plano de Aula", level: 1 }),
    ).toBeVisible();
  });

  it("identifica com precisão a origem do objetivo sugerido", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(await waitForCatalog(), "7");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Habilidade" }),
      "EF07CO09",
    );

    const resource = screen.getByRole("combobox", { name: "Material disponível" });
    expect(
      within(resource).getByRole("option", { name: "Cyberbullying — Jogo Educativo" }),
    ).toBeVisible();
    expect(
      within(resource).getByRole("option", {
        name: "Cyberbullying — Uma Brincadeira de Mau Gosto",
      }),
    ).toBeVisible();

    await user.selectOptions(resource, "altinovare-cyberbullying");

    expect(screen.getByRole("textbox", { name: "Objetivo" })).not.toHaveValue("");
    expect(
      screen.getByText(
        /objetivo de aprendizagem cadastrado no material “Cyberbullying — Jogo Educativo”/,
      ),
    ).toBeVisible();
  });

  it("usa um único material em uma sequência de três aulas", async () => {
    const user = userEvent.setup();
    renderPage();
    await fillLightbotPlan(user, "Sequências e repetições");

    await user.click(screen.getByRole("radio", { name: /3 aulas/ }));
    await user.click(screen.getByRole("button", { name: "Montar plano" }));
    await user.click(screen.getByRole("button", { name: "Descritivo" }));

    for (const lesson of [1, 2, 3]) {
      expect(screen.getByRole("heading", { name: `Aula ${lesson}` })).toBeVisible();
    }
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("limpa o formulário ao sair da edição para criar um novo plano", async () => {
    const user = userEvent.setup();
    renderPage();
    await fillLightbotPlan(user, "Plano que será salvo");

    await user.click(screen.getByRole("button", { name: "Montar plano" }));
    await user.click(screen.getByRole("button", { name: "Salvar plano" }));
    expect(
      await screen.findByRole("heading", { name: "Editar Plano de Aula", level: 1 }),
    ).toBeVisible();

    await user.click(screen.getByRole("link", { name: "Novo plano" }));

    expect(
      await screen.findByRole("heading", { name: "Criar Plano de Aula", level: 1 }),
    ).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Tema" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Ano escolar" })).toHaveValue("");
    expect(screen.getByRole("heading", { name: "Seu plano aparecerá aqui" })).toBeVisible();
    expect(useLessonPlansStore.getState().plans).toHaveLength(1);
  });
});
