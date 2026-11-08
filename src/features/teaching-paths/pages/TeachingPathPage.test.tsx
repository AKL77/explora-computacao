import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { MemoryRouter } from "react-router-dom";

import { TEACHING_PATHS_SCHEMA_VERSION, useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { TeachingPathPage } from "./TeachingPathPage";

afterEach(() => {
  cleanup();
  localStorage.clear();
  useClassroomsStore.setState({ classrooms: [], retiredCodes: [] });
  useTeachingPathsStore.setState({ schemaVersion: TEACHING_PATHS_SCHEMA_VERSION, paths: [] });
});

const vinteTitle = "Vinte Palpites — Teoria da Informação";
const blocklyTitle = "Blockly Games";
const sertaoTitle = "Sertão.bit — Livro-jogo de Pensamento Computacional";
const binaryNumbersTitle = "Contando os Pontos — Números Binários";

async function renderPage() {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <TeachingPathPage />
    </MemoryRouter>,
  );
  await screen.findByRole("heading", { name: "Materiais encontrados", level: 2 });
  return user;
}

function getResourceCard(title: string) {
  const heading = screen.getByRole("heading", { name: title, level: 3 });
  const card = heading.closest("article");

  if (!card) throw new Error(`Card não encontrado para ${title}`);
  return within(card);
}

async function toggleYear(user: ReturnType<typeof userEvent.setup>, grade: number) {
  await user.click(screen.getByRole("button", { name: "Ver opções de anos escolares" }));
  const dialog = screen.getByRole("dialog", { name: "Selecionar anos escolares" });
  await user.click(within(dialog).getByRole("button", { name: `${grade}º ano` }));
  await user.click(within(dialog).getByRole("button", { name: "Concluir" }));
}

async function toggleFormat(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByRole("button", { name: "Ver opções de formatos" }));
  const dialog = screen.getByRole("dialog", { name: "Selecionar formatos" });
  await user.click(within(dialog).getByRole("button", { name: label }));
  await user.click(within(dialog).getByRole("button", { name: "Concluir" }));
}

describe("TeachingPathPage", () => {
  it("mostra todo o catálogo e pesquisa pelos dados dos materiais", async () => {
    const user = await renderPage();

    for (const title of [vinteTitle, blocklyTitle, sertaoTitle]) {
      expect(screen.getByRole("heading", { name: title, level: 3 })).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", { name: binaryNumbersTitle, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText("48 materiais", { exact: true })).toBeInTheDocument();
    expect(getResourceCard(blocklyTitle).getByText("Preparação necessária"))
      .toBeInTheDocument();
    expect(getResourceCard(blocklyTitle).getByText("Intermediário"))
      .toHaveClass("sr-only");
    expect(getResourceCard(blocklyTitle).getByText("Professor").parentElement)
      .toHaveAttribute("title", "Professor: Intermediário");
    expect(screen.queryByText("Árvores Geradoras Mínimas", { exact: true })).not.toBeInTheDocument();

    const search = screen.getByRole("searchbox", {
      name: "Pesquisar área, assunto ou habilidade",
    });
    expect(search).toHaveAttribute("placeholder", "Pesquise um assunto");
    expect(
      screen.queryByText(
        "Pesquise e selecione os materiais que contribuem para o seu objetivo de ensino.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Selecione materiais para começar.")).not.toBeInTheDocument();
    await user.click(search);
    await user.paste("laço de repetição");

    expect(screen.getByRole("heading", { name: blocklyTitle, level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: vinteTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: sertaoTitle, level: 3 })).not.toBeInTheDocument();

    await user.clear(search);
    await user.paste("cyberbullying");
    expect(
      screen.getByRole("heading", { name: "Cyberbullying — Jogo Educativo", level: 3 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: blocklyTitle, level: 3 })).not.toBeInTheDocument();
  }, 10_000);

  it("filtra por ano e formato em janelas, inclusive materiais de formato misto", async () => {
    const user = await renderPage();
    const years = screen.getByRole("button", { name: "Ver opções de anos escolares" });

    expect(years).toHaveTextContent("Todos");
    await toggleYear(user, 5);
    expect(years).toHaveTextContent("5º ano");

    await toggleFormat(user, "Material plugado");
    expect(screen.queryByRole("heading", { name: vinteTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: blocklyTitle, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: sertaoTitle, level: 3 })).toBeInTheDocument();

    await toggleFormat(user, "Material plugado");
    await toggleFormat(user, "Material desplugado");
    expect(screen.getByRole("heading", { name: vinteTitle, level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: blocklyTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: sertaoTitle, level: 3 })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getByText("48 materiais", { exact: true })).toBeInTheDocument();
  }, 10_000);

  it("encontra Blockly e Vinte Palpites pelos mesmos anos indicados nas fichas", async () => {
    const user = await renderPage();

    for (const grade of [4, 5, 8, 6]) {
      await toggleYear(user, grade);

      if (grade === 4 || grade === 5) {
        expect(screen.getByRole("heading", { name: blocklyTitle, level: 3 })).toBeInTheDocument();
      } else {
        expect(screen.queryByRole("heading", { name: blocklyTitle, level: 3 })).not.toBeInTheDocument();
      }
      if (grade === 4 || grade === 5 || grade === 8) {
        expect(screen.getByRole("heading", { name: vinteTitle, level: 3 })).toBeInTheDocument();
      } else {
        expect(screen.queryByRole("heading", { name: vinteTitle, level: 3 })).not.toBeInTheDocument();
      }

      await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    }
  }, 10_000);

  it("seleciona tipos agrupados por abordagem, com união e sem duplicar materiais", async () => {
    const user = await renderPage();
    const trigger = screen.getByRole("button", { name: "Ver opções de tipos de material" });
    const expositoryTitle = "Como funciona a Internet? — Playlist do NIC.br";
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Selecionar tipos de material" });
    expect(within(dialog).getByRole("heading", { name: "Abordagem ativa" })).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "Abordagem expositiva" })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "Abordagem ativa" })).not.toBeInTheDocument();
    expect(dialog.querySelectorAll("[aria-pressed]")).toHaveLength(5);
    await user.click(within(dialog).getByRole("button", { name: "Jogos" }));
    await user.click(within(dialog).getByRole("button", { name: "Atividades e exercícios" }));
    await user.click(within(dialog).getByRole("button", { name: "Vídeos" }));
    await user.click(within(dialog).getByRole("button", { name: "Concluir" }));
    expect(screen.getAllByRole("heading", { name: sertaoTitle, level: 3 })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: blocklyTitle, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: expositoryTitle, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: binaryNumbersTitle, level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Internet com Responsa — Só para Adolescentes", level: 3 })).not.toBeInTheDocument();
    expect(getResourceCard(sertaoTitle).getByText("Atividade", { exact: true })).toBeInTheDocument();
    expect(getResourceCard(sertaoTitle).getByText("Jogo", { exact: true })).toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    expect(within(dialog).getByRole("button", { name: "Jogos" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(dialog).getByRole("button", { name: "Limpar tipos" }));
    await user.click(within(dialog).getByRole("button", { name: "Vídeos" }));
    await user.click(within(dialog).getByRole("button", { name: "Concluir" }));
    expect(screen.queryByRole("heading", { name: blocklyTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: expositoryTitle, level: 3 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.queryByText("Todos os tipos")).not.toBeInTheDocument();
    expect(screen.getByText("48 materiais", { exact: true })).toBeInTheDocument();
  }, 10_000);

  it("combina tipos de material com formato, ano, assunto e pesquisa", async () => {
    const user = await renderPage();
    await user.click(screen.getByRole("button", { name: "Ver opções de tipos de material" }));
    const types = screen.getByRole("dialog", { name: "Selecionar tipos de material" });
    await user.click(within(types).getByRole("button", { name: "Jogos" }));
    await user.click(within(types).getByRole("button", { name: "Concluir" }));
    await toggleFormat(user, "Material plugado");
    expect(screen.queryByRole("heading", { name: vinteTitle })).not.toBeInTheDocument();
    await toggleYear(user, 5);
    await user.click(screen.getByRole("button", { name: "Ver opções de assuntos" }));
    const subjects = screen.getByRole("dialog", { name: "Selecionar assuntos" });
    await user.click(within(subjects).getByRole("button", { name: "Cyberbullying" }));
    await user.click(within(subjects).getByRole("button", { name: "Concluir" }));
    expect(screen.getByText("1 material", { exact: true })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Interland" })).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" }), "blockly");
    expect(screen.getByText("Nenhum material encontrado")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getByText("48 materiais", { exact: true })).toBeInTheDocument();
  }, 10_000);

  it("combina assuntos com os demais filtros e aceita opções ainda sem materiais", async () => {
    const user = await renderPage();
    await user.click(screen.getByRole("button", { name: "Ver opções de assuntos" }));

    const dialog = screen.getByRole("dialog", { name: "Selecionar assuntos" });
    expect(dialog.querySelectorAll("[aria-pressed]")).toHaveLength(45);
    const keywordSearch = within(dialog).getByRole("searchbox", { name: "Buscar palavras-chave" });
    await user.type(keywordSearch, "arvores");
    expect(within(dialog).getByRole("button", { name: "Grafos e árvores" })).toBeInTheDocument();
    expect(dialog.querySelectorAll("[aria-pressed]")).toHaveLength(1);
    await user.clear(keywordSearch);
    await user.click(within(dialog).getByRole("button", { name: "Cyberbullying" }));
    expect(within(dialog).getByRole("button", { name: "Cyberbullying" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(dialog).getByRole("button", { name: "Concluir" }));

    expect(screen.getByText("1 assunto selecionado")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cyberbullying — Jogo Educativo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Interland" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: blocklyTitle })).not.toBeInTheDocument();

    await toggleYear(user, 5);
    expect(screen.getByRole("heading", { name: "Interland" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Cyberbullying — Jogo Educativo" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver opções de assuntos" }));
    expect(within(dialog).getByRole("searchbox", { name: "Buscar palavras-chave" })).toHaveValue("");
    expect(within(dialog).getByRole("button", { name: "Cyberbullying" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(dialog).getByRole("button", { name: "Cyberbullying" }));
    await user.click(within(dialog).getByRole("button", { name: "Componentes do computador" }));
    await user.click(within(dialog).getByRole("button", { name: "Concluir" }));

    expect(screen.getByText("Nenhum material encontrado")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getByText("48 materiais", { exact: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver opções de assuntos" })).toBeInTheDocument();
  }, 10_000);

  it("oferece apenas adicionar à trilha existente ou à turma e orienta quando não há trilhas", async () => {
    const user = await renderPage();
    const card = getResourceCard(blocklyTitle);
    expect(card.getByRole("link", { name: `Abrir detalhes de ${blocklyTitle}` })).toHaveAttribute("href", "/app/materiais/blockly-games");
    expect(card.getByRole("button", { name: "Adicionar à trilha" })).toBeEnabled();
    expect(card.getByRole("button", { name: "Adicionar à turma" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: /nova trilha|salvar trilha|criar trilha/i })).not.toBeInTheDocument();
    await user.click(card.getByRole("button", { name: "Adicionar à trilha" }));
    const dialog = screen.getByRole("dialog", { name: "Adicionar à trilha" });
    expect(within(dialog).getByText(/Você ainda não tem trilhas/)).toBeVisible();
    expect(within(dialog).getByRole("link", { name: "Ir para Minhas Trilhas" })).toHaveAttribute("href", "/app/minhas-trilhas");
    expect(within(dialog).queryByRole("textbox", { name: "Nome da trilha" })).not.toBeInTheDocument();
    expect(useTeachingPathsStore.getState().paths).toHaveLength(0);
  }, 10_000);

  it("adiciona à trilha escolhida sem criar outra nem duplicar materiais", async () => {
    const target = await useTeachingPathsStore.getState().createPath("Trilha de algoritmos", ["unicamp-desplugada-atividade-1"], { objective: "Explorar algoritmos." });
    await useTeachingPathsStore.getState().createPath("Trilha já completa", ["google-blockly-games"], { objective: "Experimentar blocos." });
    const user = await renderPage();
    await user.click(getResourceCard(blocklyTitle).getByRole("button", { name: "Adicionar à trilha" }));
    const dialog = screen.getByRole("dialog", { name: "Adicionar à trilha" });
    let select = within(dialog).getByRole("combobox", { name: "Escolha uma trilha" });
    expect(select).toHaveValue("");
    expect(within(dialog).getByRole("button", { name: "Adicionar material" })).toBeDisabled();
    expect(within(dialog).getAllByRole("option")).toHaveLength(2);
    expect(within(dialog).getByRole("option", { name: "Trilha de algoritmos" })).toBeInTheDocument();
    await user.selectOptions(select, target!.id);
    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));
    await user.click(getResourceCard(blocklyTitle).getByRole("button", { name: "Adicionar à trilha" }));
    select = within(dialog).getByRole("combobox", { name: "Escolha uma trilha" });
    expect(select).toHaveValue("");
    expect(within(dialog).getByRole("button", { name: "Adicionar material" })).toBeDisabled();
    await user.selectOptions(select, target!.id);
    await user.click(within(dialog).getByRole("button", { name: "Adicionar material" }));
    expect(useTeachingPathsStore.getState().paths).toHaveLength(2);
    expect(useTeachingPathsStore.getState().paths.find(path => path.id === target!.id)).toMatchObject({
      name: "Trilha de algoritmos", objective: "Explorar algoritmos.", resourceIds: ["unicamp-desplugada-atividade-1", "google-blockly-games"],
    });
    await user.click(getResourceCard(blocklyTitle).getByRole("button", { name: "Adicionar à trilha" }));
    expect(screen.getByText("Este material já está em todas as suas trilhas.")).toBeVisible();
    expect(within(screen.getByRole("dialog")).queryByRole("button", { name: "Adicionar material" })).not.toBeInTheDocument();
  }, 10_000);

  it("adiciona diretamente a uma turma ativa e impede a repetição", async () => {
    const input = { name: "5º A", grade: 5 as const, school: "", schoolYear: 2026, color: "blue" as const };
    const active = await useClassroomsStore.getState().createClassroom(input);
    const archived = await useClassroomsStore.getState().createClassroom({ ...input, name: "Turma arquivada" });
    await useClassroomsStore.getState().archiveClassroom(archived!.id);
    const user = await renderPage();
    await user.click(getResourceCard(blocklyTitle).getByRole("button", { name: "Adicionar à turma" }));
    const dialog = screen.getByRole("dialog", { name: "Adicionar à turma" });
    expect(within(dialog).queryByText("Turma arquivada")).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("radio", { name: /5º A/ }));
    await user.click(within(dialog).getByRole("button", { name: "Adicionar material" }));
    expect(useClassroomsStore.getState().classrooms.find(item => item.id === active!.id)?.materials)
      .toEqual([{ resourceId: "google-blockly-games", visible: true, instruction: "" }]);
    await user.click(getResourceCard(blocklyTitle).getByRole("button", { name: "Adicionar à turma" }));
    expect(within(screen.getByRole("dialog", { name: "Adicionar à turma" })).getByRole("radio", { name: /5º A/ })).toBeDisabled();
    expect(useTeachingPathsStore.getState().paths).toHaveLength(0);
  }, 10_000);
});
