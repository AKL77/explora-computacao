import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { TEACHING_PATHS_SCHEMA_VERSION, useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { ReadyTeachingPathsPage } from "./ReadyTeachingPathsPage";

afterEach(() => {
  cleanup();
  localStorage.clear();
  useTeachingPathsStore.setState({ schemaVersion: TEACHING_PATHS_SCHEMA_VERSION, paths: [] });
});

describe("ReadyTeachingPathsPage", () => {
  it("monta uma trilha funcional e específica para cada eixo", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ReadyTeachingPathsPage />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Trilhas disponíveis" });
    expect(screen.getAllByRole("button", { name: /Ver trilha/ })).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: /Ver trilha Algoritmos: decisões, blocos e desafios/ }));
    expect(
      await screen.findByRole("heading", {
        name: "Algoritmos: decisões, blocos e desafios",
        level: 2,
      }),
    ).toBeVisible();
    expect(screen.getByRole("list", { name: "Etapas da trilha pronta" }).children).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: /Ver material completo/ })).toHaveLength(3);

    await user.click(
      screen.getByRole("button", { name: /Ver trilha Mensagens sem erro: paridade e protocolos/ }),
    );
    expect(
      screen.getByRole("heading", { name: "Mensagens sem erro: paridade e protocolos", level: 2 }),
    ).toBeVisible();
    expect(screen.getByRole("list", { name: "Etapas da trilha pronta" }).children).toHaveLength(2);
    expect(screen.getByText("A Mágica de Virar as Cartas — Detecção e Correção de Erros")).toBeVisible();
    expect(screen.getByText("Tábuas de Pedra — Protocolos de Comunicação na Rede")).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: /Ver trilha Privacidade e armadilhas online/ }),
    );
    expect(
      screen.getByRole("heading", { name: "Privacidade e armadilhas online", level: 2 }),
    ).toBeVisible();
    expect(screen.getByRole("list", { name: "Etapas da trilha pronta" }).children).toHaveLength(2);
    expect(screen.getByText("Aventuras Digitais — Tornando-se um Cidadão Digital")).toBeVisible();
    expect(screen.getByText("Interland")).toBeVisible();
  }, 10_000);

  it("filtra a coleção por temas e permite adicionar uma cópia editável", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ReadyTeachingPathsPage />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Trilhas disponíveis" });
    expect(screen.getAllByRole("button", { name: /Ver trilha/ })).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Mundo Digital" }));

    expect(screen.getAllByRole("button", { name: /Ver trilha/ })).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /Ver trilha Mensagens sem erro: paridade e protocolos/ }),
    ).toBeVisible();
    expect(screen.queryByText("Nenhuma trilha disponível neste eixo por enquanto.")).not.toBeInTheDocument();
    expect(screen.queryByText("Material do acervo")).not.toBeInTheDocument();
    expect(screen.queryByText("Esta primeira versão apresenta uma trilha pronta para você conhecer o formato.")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /Ver trilha Mensagens sem erro: paridade e protocolos/ }),
    );
    await user.click(screen.getByRole("button", { name: "Adicionar às Minhas Trilhas" }));

    const [savedPath] = useTeachingPathsStore.getState().paths;
    expect(savedPath).toMatchObject({
      name: "Mensagens sem erro: paridade e protocolos",
      objective:
        "Compreender como informações são verificadas, organizadas e recuperadas quando ocorrem erros durante uma transmissão.",
      backgroundColor: "indigo",
      icon: "puzzle",
      resourceIds: [
        "unicamp-desplugada-atividade-4",
        "unicamp-desplugada-atividade-13",
      ],
    });
    expect(savedPath.lessonCountsByResourceId).toEqual({
      "unicamp-desplugada-atividade-4": 1,
      "unicamp-desplugada-atividade-13": 1,
    });
    expect(screen.getByRole("button", { name: "Ver em Minhas Trilhas" })).toBeVisible();
  });
});
