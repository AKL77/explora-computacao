import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

afterEach(cleanup);

describe("AppShell", () => {
  it("apresenta somente as cinco opções atuais da navegação", () => {
    render(
      <MemoryRouter initialEntries={["/app/trilha-de-ensino"]}>
        <Routes>
          <Route path="/app" element={<AppShell />}>
            <Route path="trilha-de-ensino" element={<h1>Buscar Materiais</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Meu perfil" })).toHaveAttribute(
      "href",
      "/app/perfil",
    );
    expect(screen.getByRole("link", { name: "Buscar Materiais" })).toHaveAttribute(
      "href",
      "/app/trilha-de-ensino",
    );
    expect(screen.getByRole("link", { name: "Trilhas Prontas" })).toHaveAttribute(
      "href",
      "/app/trilhas-prontas",
    );
    expect(screen.getByRole("link", { name: "Minhas Trilhas" })).toHaveAttribute(
      "href",
      "/app/minhas-trilhas",
    );
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute(
      "href",
      "/app/sobre",
    );

    for (const label of ["Acervo", "Meus Materiais", "Minhas Turmas", "Meus Planos de Aula"]) {
      expect(screen.queryByRole("link", { name: label })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: label })).not.toBeInTheDocument();
    }
  });
});
