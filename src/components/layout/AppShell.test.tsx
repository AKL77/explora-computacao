import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

afterEach(cleanup);

describe("AppShell", () => {
  it("apresenta as funcionalidades futuras como itens inativos", () => {
    render(
      <MemoryRouter initialEntries={["/app/acervo"]}>
        <Routes>
          <Route path="/app" element={<AppShell />}>
            <Route path="acervo" element={<h1>Acervo</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    for (const label of ["Meu perfil", "Minhas Turmas", "Meus Planos de Aula"]) {
      const item = screen.getByRole("button", { name: label });
      expect(item).toBeDisabled();
      expect(item).toHaveAttribute("aria-disabled", "true");
      expect(screen.queryByRole("link", { name: label })).not.toBeInTheDocument();
    }

    expect(screen.getByRole("link", { name: "Acervo" })).toHaveAttribute(
      "href",
      "/app/acervo",
    );
    expect(screen.getByRole("link", { name: "Criar Trilha de Ensino" })).toHaveAttribute(
      "href",
      "/app/trilha-de-ensino",
    );
    expect(screen.getByRole("link", { name: "Minhas Trilhas" })).toHaveAttribute(
      "href",
      "/app/minhas-trilhas",
    );
    expect(screen.queryByRole("link", { name: "Criar Plano de Aula" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Meus Planos de Aula" })).not.toBeInTheDocument();
  });
});
