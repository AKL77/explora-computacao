import { cleanup, render, screen } from "@testing-library/react";
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

    const signInLinks = screen.getAllByRole("link", { name: "Entrar" });
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

    expect(screen.getByRole("heading", { name: "Direcionamento e praticidade" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Buscar Materiais carregado" })).not.toBeInTheDocument();
  });

  it("apresenta prévias reais de Buscar Materiais e Trilhas Prontas", () => {
    renderLanding();

    expect(
      screen.getByRole("img", {
        name: "Prévia da tela Buscar Materiais, com busca, filtros e materiais disponíveis.",
      }),
    ).toHaveAttribute("src", "/images/interface/buscar-materiais.png");
    expect(
      screen.getByRole("img", {
        name: "Prévia da tela Trilhas Prontas, com o percurso Algoritmos: decisões, blocos e desafios.",
      }),
    ).toHaveAttribute("src", "/images/interface/trilhas-prontas.png");
  });
});
