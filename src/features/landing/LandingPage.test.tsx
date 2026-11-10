import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSessionStore } from "@/store/useSessionStore";

import { LandingPage } from "./LandingPage";

function renderLanding() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/trilha-de-ensino" element={<h1>Buscar Materiais carregado</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LandingPage", () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({ isAuthenticated: false });
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(cleanup);

  it.each([
    ["cabeçalho", 0],
    ["rodapé", 1],
  ])("entra diretamente em Buscar Materiais pelo link do %s", async (_location, linkIndex) => {
    const user = userEvent.setup();
    renderLanding();

    const signInLinks = screen.getAllByRole("link", { name: "Área do professor" });
    expect(signInLinks).toHaveLength(2);
    expect(signInLinks[linkIndex]).toHaveAttribute("href", "/app/trilha-de-ensino");

    await user.click(signInLinks[linkIndex]);

    expect(screen.getByRole("heading", { name: "Buscar Materiais carregado" })).toBeVisible();
    expect(useSessionStore.getState().isAuthenticated).toBe(true);
  });

  it("mantém os atalhos editoriais na landing sem acionar uma rota do app", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getAllByRole("link", { name: "O projeto" })[0]);

    expect(screen.getByRole("heading", { name: "Materiais e trilhas para o seu planejamento" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Buscar Materiais carregado" })).not.toBeInTheDocument();
  });

  it("apresenta prévias de materiais, trilhas e turmas nas respectivas seções", () => {
    renderLanding();

    const trails = screen.getByRole("region", { name: "Trilhas de ensino" });
    const classrooms = screen.getByRole("region", { name: "Turmas" });

    expect(
      screen.getByRole("img", {
        name: "Prévia da tela Buscar Materiais, com busca, filtros e materiais disponíveis.",
      }),
    ).toHaveAttribute("src", "/images/interface/buscar-materiais.png");
    expect(
      within(trails).getByRole("img", {
        name: "Prévia da tela Trilhas Prontas, com filtros por eixo e percursos disponíveis.",
      }),
    ).toHaveAttribute("src", "/images/interface/trilhas-prontas.png");
    expect(
      within(classrooms).getByRole("img", {
        name: "Prévia de uma turma de demonstração, com código de acesso e materiais da aula.",
      }),
    ).toHaveAttribute("src", "/images/interface/minhas-turmas.png");
  });
});
