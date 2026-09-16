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
      screen.getByRole("heading", { name: "Explore uma proposta pronta ou construa a sua" }),
    ).toBeInTheDocument();
    expect(screen.getByText("O que são as Trilhas Prontas?")).toBeInTheDocument();
    expect(screen.getByText("Como crio uma trilha de ensino?")).toBeInTheDocument();
    expect(
      screen.queryByText("Orientações rápidas para aproveitar os recursos disponíveis nesta versão."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Meus favoritos e materiais ficam salvos?")).not.toBeInTheDocument();
    expect(screen.queryByText("Os recursos pertencem ao Informática Explorer?")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Não nesta versão. Os materiais disponíveis são selecionados previamente, e o docente pode consultá-los e usá-los para montar suas trilhas.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(7);
  });

  it("oferece atalhos para Buscar Materiais e Trilhas Prontas", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /buscar materiais/i })).toHaveAttribute(
      "href",
      "/app/trilha-de-ensino",
    );
    expect(screen.getByRole("link", { name: /explorar trilhas prontas/i })).toHaveAttribute(
      "href",
      "/app/trilhas-prontas",
    );
  });
});
