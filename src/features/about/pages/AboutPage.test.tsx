import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AboutPage } from "./AboutPage";

afterEach(cleanup);

describe("AboutPage", () => {
  it("explica o propósito, a organização de materiais e as dúvidas frequentes", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Sobre o Informática Explorer" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Como utilizar")).not.toBeInTheDocument();
    expect(screen.queryByText("Encontre recursos")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Guarde o que faz sentido para o seu contexto" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Como funcionam os favoritos?")).toBeInTheDocument();
    expect(screen.getByText("Como crio um plano de aula?")).toBeInTheDocument();
    expect(screen.queryByText("Meus favoritos e materiais ficam salvos?")).not.toBeInTheDocument();
    expect(screen.queryByText("Os recursos pertencem ao Informática Explorer?")).not.toBeInTheDocument();
    expect(screen.getByText("Não. Os usuários podem consultar, favoritar e organizar os materiais disponíveis.")).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(7);
  });

  it("oferece atalhos para o Acervo e Meus Materiais", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /explorar o acervo/i })).toHaveAttribute(
      "href",
      "/app/acervo",
    );
    expect(screen.getByRole("link", { name: /acessar meus materiais/i })).toHaveAttribute(
      "href",
      "/app/pastas",
    );
  });
});
