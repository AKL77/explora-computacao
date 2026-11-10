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
      screen.getByRole("heading", { name: "Sobre o Explora Computação" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Como utilizar")).not.toBeInTheDocument();
    expect(screen.queryByText("Encontre recursos")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Explore uma proposta pronta ou construa a sua" }),
    ).toBeInTheDocument();
    expect(screen.getByText("O que são as Trilhas Prontas?")).toBeInTheDocument();
    expect(screen.getByText("Como crio uma trilha de ensino?")).toBeInTheDocument();
    expect(screen.getByText("O que significam os níveis Básico, Intermediário e Avançado?"))
      .toBeInTheDocument();
    expect(screen.getByText(/avaliada separadamente para aluno e professor/))
      .toBeInTheDocument();
    expect(
      screen.queryByText("Orientações rápidas para aproveitar os recursos disponíveis nesta versão."),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Meus favoritos e materiais ficam salvos?")).not.toBeInTheDocument();
    expect(screen.queryByText("Os recursos pertencem ao Explora Computação?")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Não nesta versão. Os materiais disponíveis são selecionados previamente. Você pode consultá-los, combiná-los em trilhas e compartilhá-los com suas turmas, mas ainda não há cadastro de materiais próprios.",
      ),
    ).toBeInTheDocument();
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
