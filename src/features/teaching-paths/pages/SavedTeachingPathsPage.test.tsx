import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TEACHING_PATHS_SCHEMA_VERSION, useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { SavedTeachingPathsPage } from "./SavedTeachingPathsPage";

beforeEach(() => {
  localStorage.clear();
  useTeachingPathsStore.setState({ schemaVersion: TEACHING_PATHS_SCHEMA_VERSION, paths: [] });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderPage() {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SavedTeachingPathsPage />
    </MemoryRouter>,
  );
  return user;
}

describe("SavedTeachingPathsPage", () => {
  it("edita a trilha em rascunho, confirma a duração e apresenta a síntese final", async () => {
    const saved = useTeachingPathsStore
      .getState()
      .createPath("Programação com blocos", ["google-blockly-games"], {
        objective: "Construir uma base de programação em blocos.",
      });
    expect(saved).not.toBeNull();

    const user = renderPage();
    await user.click(await screen.findByRole("button", { name: /Programação com blocos/i }));

    expect(screen.getByRole("heading", { name: "Programação com blocos", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Construir uma base de programação em blocos.")).toBeInTheDocument();
    expect(screen.queryByText("Resultado da trilha")).not.toBeInTheDocument();
    expect(screen.getByText("Competências da BNCC relacionados")).toBeInTheDocument();
    expect(screen.getByText(/EF05CO04/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abrir planejamento de Blockly Games" }));
    const dialog = screen.getByRole("dialog", { name: "Blockly Games" });
    expect(
      within(dialog).queryByText(
        "A duração desta etapa será gravada quando você salvar as alterações da trilha.",
      ),
    ).not.toBeInTheDocument();
    expect(within(dialog).queryByText("Planejamento da etapa")).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: "Blockly Games", level: 3 }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: "Competências da BNCC", level: 3 }),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByRole("radio", { name: /2 aulas.*100 min/i }));
    await user.click(within(dialog).getByRole("button", { name: "Fechar diálogo" }));

    expect(screen.getByText("Tempo total: 2 aulas · 100 minutos")).toBeInTheDocument();
    expect(useTeachingPathsStore.getState().getPath(saved?.id ?? "")?.lessonCountsByResourceId).toEqual({});
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    expect(
      useTeachingPathsStore.getState().getPath(saved?.id ?? "")?.lessonCountsByResourceId,
    ).toEqual({ "google-blockly-games": 2 });
  });

  it("marca remoção, permite desfazer e só altera a trilha depois de salvar", async () => {
    const saved = useTeachingPathsStore
      .getState()
      .createPath("Sequência de testes", ["google-blockly-games", "unicamp-desplugada-atividade-5"], {
        objective: "Explorar programação e informação.",
      });
    const user = renderPage();
    await user.click(await screen.findByRole("button", { name: /Sequência de testes/i }));

    await user.click(screen.getByRole("button", { name: "Marcar Blockly Games para remoção" }));
    expect(screen.getByText("Será removido ao salvar as alterações.")).toBeInTheDocument();
    expect(useTeachingPathsStore.getState().getPath(saved?.id ?? "")?.resourceIds).toEqual([
      "google-blockly-games",
      "unicamp-desplugada-atividade-5",
    ]);

    await user.click(screen.getByRole("button", { name: "Desfazer remoção de Blockly Games" }));
    expect(screen.queryByText("Será removido ao salvar as alterações.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Marcar Blockly Games para remoção" }));
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    expect(useTeachingPathsStore.getState().getPath(saved?.id ?? "")?.resourceIds).toEqual([
      "unicamp-desplugada-atividade-5",
    ]);
    expect(
      screen.queryByRole("button", { name: "Abrir planejamento de Blockly Games" }),
    ).not.toBeInTheDocument();
  });

  it("reordena por arrastar e soltar e salva a nova ordem", async () => {
    const saved = useTeachingPathsStore
      .getState()
      .createPath("Ordem dos materiais", ["google-blockly-games", "unicamp-desplugada-atividade-5"], {
        objective: "Experimentar a sequência de materiais.",
      });
    const user = renderPage();
    await user.click(await screen.findByRole("button", { name: /Ordem dos materiais/i }));

    const source = screen.getByRole("button", { name: "Abrir planejamento de Blockly Games" }).closest("li");
    const target = screen.getByRole("button", { name: /Abrir planejamento de Vinte Palpites/i }).closest("li");
    if (!source || !target) throw new Error("Etapas não encontradas");
    const dataTransfer = {
      effectAllowed: "",
      setData: () => undefined,
      getData: () => "google-blockly-games",
    };

    fireEvent.dragStart(source, { dataTransfer });
    fireEvent.dragOver(target, { dataTransfer });
    fireEvent.drop(target, { dataTransfer });

    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    expect(useTeachingPathsStore.getState().getPath(saved?.id ?? "")?.resourceIds).toEqual([
      "unicamp-desplugada-atividade-5",
      "google-blockly-games",
    ]);
  });

  it("edita objetivo, cor e ícone no rascunho antes de salvar", async () => {
    const saved = useTeachingPathsStore
      .getState()
      .createPath("Trilha inicial", ["google-blockly-games"], {
        objective: "Objetivo inicial.",
      });
    const user = renderPage();
    await user.click(await screen.findByRole("button", { name: /Trilha inicial/i }));
    await user.click(screen.getByRole("button", { name: "Editar trilha" }));

    const dialog = screen.getByRole("dialog", { name: "Editar trilha" });
    const objective = within(dialog).getByRole("textbox", { name: "Objetivo da trilha" });
    await user.clear(objective);
    await user.type(objective, "Objetivo revisado pela professora.");
    await user.click(within(dialog).getByRole("button", { name: "Azul" }));
    await user.click(within(dialog).getByRole("button", { name: "Usar ícone Alvo" }));
    await user.click(within(dialog).getByRole("button", { name: "Aplicar ao rascunho" }));

    expect(screen.getByText("Objetivo revisado pela professora.")).toBeInTheDocument();
    expect(useTeachingPathsStore.getState().getPath(saved?.id ?? "")?.backgroundColor).toBe("turquoise");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    expect(useTeachingPathsStore.getState().getPath(saved?.id ?? "")).toMatchObject({
      objective: "Objetivo revisado pela professora.",
      backgroundColor: "blue",
      icon: "target",
    });
  });
});
