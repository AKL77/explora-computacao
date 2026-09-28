import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { ResourceDetailPage } from "./ResourceDetailPage";

afterEach(cleanup);

function renderResourceDetail(slug = "altinovare-cyberbullying") {
  render(
    <MemoryRouter initialEntries={[`/app/materiais/${slug}`]}>
      <Routes>
        <Route path="/app/materiais/:slug" element={<ResourceDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ResourceDetailPage", () => {
  it("apresenta a descrição inicialmente e alterna entre as três abas", async () => {
    const user = userEvent.setup();
    renderResourceDetail();

    expect(
      await screen.findByRole("heading", {
        name: "Cyberbullying — Jogo Educativo",
        level: 1,
      }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute(
      "href",
      "/app/trilha-de-ensino",
    );
    expect(screen.queryByRole("button", { name: /favoritar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /pasta/i })).not.toBeInTheDocument();
    const familiarity = screen.getByRole("region", { name: "Preparação necessária" });
    expect(familiarity).toHaveTextContent("AlunoBásico");
    expect(familiarity).toHaveTextContent("ProfessorBásico");
    expect(within(familiarity).getByRole("link", { name: "Entenda os níveis" }))
      .toHaveAttribute("href", "/app/sobre");

    const descriptionTab = screen.getByRole("tab", { name: "Descrição" });
    expect(descriptionTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Uma simulação gamificada e interativa",
    );

    const additionalTab = screen.getByRole("tab", {
      name: "Informações adicionais",
    });
    await user.click(additionalTab);

    const additionalPanel = screen.getByRole("tabpanel");
    expect(additionalTab).toHaveAttribute("aria-selected", "true");
    expect(additionalPanel).toHaveTextContent("Objetivo de aprendizagem");
    expect(additionalPanel).toHaveTextContent("50 min");
    expect(additionalPanel).toHaveTextContent("Individual ou em grupos");
    expect(additionalPanel).toHaveTextContent("Função pedagógica");
    expect(additionalPanel).toHaveTextContent("Prática");
    expect(additionalPanel).not.toHaveTextContent("Proposta de aplicação");
    expect(additionalPanel).not.toHaveTextContent("Sugestão de avaliação");
    expect(additionalPanel).toHaveTextContent("Computador ou notebook");

    await user.keyboard("{ArrowRight}");

    const sourceTab = screen.getByRole("tab", { name: "Fonte" });
    expect(sourceTab).toHaveFocus();
    expect(sourceTab).toHaveAttribute("aria-selected", "true");
    const sourcePanel = screen.getByRole("tabpanel");
    expect(within(sourcePanel).getByText("ALT+INOVARE")).toBeVisible();
    expect(within(sourcePanel).getByText("CC BY-NC-ND 3.0 BR")).toBeVisible();
  });

  it("apresenta uma habilidade temática e somente os códigos BNCC", async () => {
    renderResourceDetail();

    await screen.findByRole("heading", {
      name: "Cyberbullying — Jogo Educativo",
      level: 1,
    });

    expect(screen.queryByText("Curadoria em andamento")).not.toBeInTheDocument();
    expect(screen.queryByText("Nota da curadoria")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Alinhamento pedagógico" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Habilidade")).toBeVisible();
    expect(screen.getByText("Cyberbullying", { exact: true })).toBeVisible();
    expect(screen.getByText("Competências")).toBeVisible();
    expect(screen.getByText("EF07CO09", { exact: true })).toBeVisible();
    expect(
      screen.queryByText("Reconhecer e debater sobre cyberbullying."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Competência 7/)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Critério do alinhamento curricular"),
    ).not.toBeInTheDocument();
  });

  it("expõe fonte, materiais e limites de um alinhamento curatorial", async () => {
    const user = userEvent.setup();
    renderResourceDetail("unicamp-desplugada-conversas-com-computadores");

    expect(
      await screen.findByRole("heading", {
        name: "Conversas com Computadores — O Teste de Turing",
        level: 1,
      }),
    ).toBeVisible();
    expect(screen.getByText("O Teste de Turing", { exact: true })).toBeVisible();
    expect(screen.getByText("EF05CO10", { exact: true })).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Informações adicionais" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "O alinhamento do 5º ano é condicional",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Folha de perguntas do Teste de Turing",
    );

    await user.click(screen.getByRole("tab", { name: "Fonte" }));
    const sourcePanel = screen.getByRole("tabpanel");
    expect(sourcePanel).not.toHaveTextContent("Alinhamento com a BNCC Computação");
    expect(sourcePanel).not.toHaveTextContent(
      "Correspondência curatorial pendente de validação",
    );
    expect(sourcePanel).not.toHaveTextContent("correspondência parcial");
    expect(sourcePanel).not.toHaveTextContent(
      "Critério do alinhamento curricular",
    );
    expect(
      within(sourcePanel).getByRole("link", {
        name: "Perguntas do Teste de Turing (PDF)",
      }),
    ).toHaveAttribute(
      "href",
      "https://desplugada.ime.unicamp.br/atividade21/perguntas.pdf",
    );
    expect(within(sourcePanel).queryByText(/ZIP/i)).not.toBeInTheDocument();
  });
});
