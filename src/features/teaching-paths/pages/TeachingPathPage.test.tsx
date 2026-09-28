import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { TEACHING_PATHS_SCHEMA_VERSION, useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { TeachingPathPage } from "./TeachingPathPage";

afterEach(() => {
  cleanup();
  localStorage.clear();
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

describe("TeachingPathPage", () => {
  it("mostra todo o catálogo e pesquisa pelos dados dos materiais", async () => {
    const user = await renderPage();

    for (const title of [vinteTitle, blocklyTitle, sertaoTitle]) {
      expect(screen.getByRole("heading", { name: title, level: 3 })).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", { name: binaryNumbersTitle, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText("31 materiais", { exact: true })).toBeInTheDocument();
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
    await user.type(search, "laço de repetição");

    expect(screen.getByRole("heading", { name: blocklyTitle, level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: vinteTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: sertaoTitle, level: 3 })).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "cyberbullying");
    expect(
      screen.getByRole("heading", { name: "Cyberbullying — Jogo Educativo", level: 3 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: blocklyTitle, level: 3 })).not.toBeInTheDocument();
  });

  it("filtra com tags clicáveis, inclusive materiais de formato misto", async () => {
    const user = await renderPage();
    const fifthGrade = screen.getByRole("button", { name: "5º ano" });

    expect(screen.getByRole("button", { name: "Todos os anos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(fifthGrade);
    expect(fifthGrade).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Todos os anos" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "Material plugado" }));
    expect(screen.queryByRole("heading", { name: vinteTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: blocklyTitle, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: sertaoTitle, level: 3 })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Material plugado" }));
    await user.click(screen.getByRole("button", { name: "Material desplugado" }));
    expect(screen.getByRole("heading", { name: vinteTitle, level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: blocklyTitle, level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: sertaoTitle, level: 3 })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getByText("31 materiais", { exact: true })).toBeInTheDocument();
  });

  it("combina assuntos com os demais filtros e aceita opções ainda sem materiais", async () => {
    const user = await renderPage();
    await user.click(screen.getByRole("button", { name: "Ver opções" }));

    const dialog = screen.getByRole("dialog", { name: "Selecionar assuntos" });
    expect(dialog.querySelectorAll("[aria-pressed]")).toHaveLength(44);
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

    await user.click(screen.getByRole("button", { name: "5º ano" }));
    expect(screen.getByRole("heading", { name: "Interland" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Cyberbullying — Jogo Educativo" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver opções" }));
    expect(within(dialog).getByRole("searchbox", { name: "Buscar palavras-chave" })).toHaveValue("");
    expect(within(dialog).getByRole("button", { name: "Cyberbullying" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(dialog).getByRole("button", { name: "Cyberbullying" }));
    await user.click(within(dialog).getByRole("button", { name: "Componentes do computador" }));
    await user.click(within(dialog).getByRole("button", { name: "Concluir" }));

    expect(screen.getByText("Nenhum material encontrado")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getByText("31 materiais", { exact: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver opções" })).toBeInTheDocument();
  });

  it("leva o cartão ao detalhe e permite selecionar e remover materiais sem reordenação", async () => {
    const user = await renderPage();
    const blocklyCard = getResourceCard(blocklyTitle);

    expect(
      blocklyCard.getByRole("link", { name: `Abrir detalhes de ${blocklyTitle}` }),
    ).toHaveAttribute("href", "/app/materiais/blockly-games");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Nova trilha em criação" })).not.toBeInTheDocument();

    await user.click(
      blocklyCard.getByRole("button", {
        name: `Adicionar ${blocklyTitle} a uma nova trilha`,
      }),
    );
    await user.click(
      getResourceCard(vinteTitle).getByRole("button", {
        name: `Adicionar ${vinteTitle} a uma nova trilha`,
      }),
    );

    const trail = screen.getByRole("region", { name: "Nova trilha em criação" });
    expect(within(trail).getByText("2 materiais selecionados.")).toBeInTheDocument();
    expect(within(trail).getByText(blocklyTitle)).toBeInTheDocument();
    expect(within(trail).getByText(vinteTitle)).toBeInTheDocument();
    expect(within(trail).getByRole("button", { name: "Salvar trilha" })).toBeEnabled();
    expect(
      getResourceCard(blocklyTitle).getByRole("button", {
        name: `${blocklyTitle} já foi adicionado à nova trilha`,
      }),
    ).toBeDisabled();
    expect(
      getResourceCard(blocklyTitle).getByRole("button", {
        name: `Não há trilha existente disponível para adicionar ${blocklyTitle}`,
      }),
    ).toBeDisabled();
    expect(screen.queryByRole("button", { name: /mover .* para cima/i })).not.toBeInTheDocument();

    await user.click(
      within(trail).getByRole("button", { name: `Remover ${blocklyTitle} da trilha` }),
    );
    expect(within(trail).queryByText(blocklyTitle)).not.toBeInTheDocument();
    expect(within(trail).getByText("1 material selecionado.")).toBeInTheDocument();
    await user.click(
      within(trail).getByRole("button", { name: `Remover ${vinteTitle} da trilha` }),
    );
    expect(screen.queryByRole("region", { name: "Nova trilha em criação" })).not.toBeInTheDocument();
    expect(
      getResourceCard(vinteTitle).getByRole("button", {
        name: `Adicionar ${vinteTitle} a uma nova trilha`,
      }),
    ).toBeEnabled();
  });

  it("solicita um nome e salva a trilha em Minhas Trilhas", async () => {
    const user = await renderPage();

    await user.click(
      getResourceCard(binaryNumbersTitle).getByRole("button", {
        name: `Adicionar ${binaryNumbersTitle} a uma nova trilha`,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Salvar trilha" }));

    const dialog = screen.getByRole("dialog", { name: "Salvar trilha" });
    const nameInput = within(dialog).getByRole("textbox", { name: "Nome da trilha" });
    const objectiveInput = within(dialog).getByRole("textbox", { name: "Objetivo da trilha" });
    expect(nameInput).not.toHaveAttribute("placeholder");
    expect(objectiveInput).not.toHaveAttribute("placeholder");
    expect(
      within(dialog).queryByText(
        "Defina a identificação e a intenção pedagógica da sua trilha. Você poderá editar tudo depois.",
      ),
    ).not.toBeInTheDocument();
    expect(within(dialog).queryByText(/materiais? (será|serão) salvos?/i)).not.toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Verde" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Índigo" })).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Usar ícone Lâmpada" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Usar ícone Quebra-cabeça" }),
    ).toBeInTheDocument();

    await user.type(nameInput, "Laços em blocos");
    await user.type(
      objectiveInput,
      "Compreender como construir algoritmos com blocos.",
    );
    await user.click(within(dialog).getByRole("button", { name: "Salvar trilha" }));

    expect(useTeachingPathsStore.getState().paths).toHaveLength(1);
    expect(useTeachingPathsStore.getState().paths[0]).toMatchObject({
      name: "Laços em blocos",
      objective: "Compreender como construir algoritmos com blocos.",
      backgroundColor: "turquoise",
      icon: "book-open-check",
      resourceIds: ["unicamp-desplugada-atividade-1"],
    });
  }, 10_000);
});
