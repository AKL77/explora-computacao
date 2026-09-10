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
  it("monta uma trilha com três materiais reais do acervo", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ReadyTeachingPathsPage />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Trilhas disponíveis" });
    await user.click(screen.getByRole("button", { name: /Ver trilha Algoritmos: decisões, blocos e desafios/ }));
    expect(
      await screen.findByRole("heading", {
        name: "Algoritmos: decisões, blocos e desafios",
        level: 2,
      }),
    ).toBeVisible();
    expect(screen.getByRole("list", { name: "Etapas da trilha pronta" }).children).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: /Ver material completo/ })).toHaveLength(3);
  });

  it("filtra a coleção por temas e permite adicionar uma cópia editável", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ReadyTeachingPathsPage />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Trilhas disponíveis" });
    expect(screen.getAllByRole("button", { name: /Ver trilha/ })).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Mundo Digital" }));

    expect(screen.getByText("Nenhuma trilha disponível neste eixo por enquanto.")).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Algoritmos: decisões, blocos e desafios" })).not.toBeInTheDocument();
    expect(screen.queryByText("Material do acervo")).not.toBeInTheDocument();
    expect(screen.queryByText("Esta primeira versão apresenta uma trilha pronta para você conhecer o formato.")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Todas" }));
    await user.click(screen.getByRole("button", { name: /Ver trilha Algoritmos: decisões, blocos e desafios/ }));
    await user.click(screen.getByRole("button", { name: "Adicionar às Minhas Trilhas" }));

    const [savedPath] = useTeachingPathsStore.getState().paths;
    expect(savedPath.name).toBe("Algoritmos: decisões, blocos e desafios");
    expect(savedPath.resourceIds).toHaveLength(3);
    expect(savedPath.lessonCountsByResourceId).toEqual({
      "unicamp-desplugada-atividade-5": 1,
      "google-blockly-games": 1,
      "rozelma-sertao-bit": 1,
    });
    expect(screen.getByRole("button", { name: "Ver em Minhas Trilhas" })).toBeVisible();
  });
});
