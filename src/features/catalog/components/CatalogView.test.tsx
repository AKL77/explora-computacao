import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { resources as catalogResources } from "@/data/resources.mock";
import type { Resource } from "@/domain/resource";

import { CatalogView } from "./CatalogView";

afterEach(cleanup);

function renderCatalog(
  controlsInitiallyCollapsed = false,
  resources: readonly Resource[] = [],
) {
  return render(
    <MemoryRouter>
      <CatalogView
        title="Recursos de teste"
        resources={resources}
        controlsInitiallyCollapsed={controlsInitiallyCollapsed}
      />
    </MemoryRouter>,
  );
}

describe("CatalogView", () => {
  it("mantém busca e filtros visíveis no Acervo por padrão", () => {
    renderCatalog();

    expect(
      screen.getByRole("searchbox", { name: /buscar no conteúdo desta página/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /buscar e filtrar/i }),
    ).not.toBeInTheDocument();
  });

  it("permite mostrar e ocultar busca e filtros em pastas", async () => {
    const user = userEvent.setup();
    renderCatalog(true);

    const showButton = screen.getByRole("button", { name: /buscar e filtrar/i });
    expect(showButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("searchbox", { name: /buscar no conteúdo desta página/i }),
    ).not.toBeInTheDocument();

    await user.click(showButton);

    const hideButton = screen.getByRole("button", {
      name: /ocultar busca e filtros/i,
    });
    expect(hideButton).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("searchbox", { name: /buscar no conteúdo desta página/i }),
    ).toBeVisible();

    await user.click(hideButton);

    expect(
      screen.queryByRole("searchbox", { name: /buscar no conteúdo desta página/i }),
    ).not.toBeInTheDocument();
  });

  it("mantém somente um menu de filtro aberto por vez", async () => {
    const user = userEvent.setup();
    renderCatalog(false, catalogResources);

    const gradesSummary = screen.getByText("Turma", { selector: "summary" });
    const skillsSummary = screen.getByText("Habilidade", {
      selector: "summary",
    });
    const gradesMenu = gradesSummary.closest("details");
    const skillsMenu = skillsSummary.closest("details");

    await user.click(gradesSummary);
    expect(gradesMenu).toHaveAttribute("open");

    await user.click(skillsSummary);
    await waitFor(() => expect(gradesMenu).not.toHaveAttribute("open"));
    expect(skillsMenu).toHaveAttribute("open");

    await user.click(gradesSummary);
    await waitFor(() => expect(skillsMenu).not.toHaveAttribute("open"));
    expect(gradesMenu).toHaveAttribute("open");
  });

  it("não mostra habilidades ou códigos BNCC nos cards", () => {
    renderCatalog(false, [catalogResources[0]]);

    const card = screen.getByRole("article");
    expect(within(card).getByText("Turma")).toBeVisible();
    expect(within(card).getByText("Eixo")).toBeVisible();
    expect(within(card).queryByText("Habilidades")).not.toBeInTheDocument();
    expect(within(card).queryByText(/EF07CO09/)).not.toBeInTheDocument();
  });

  it("usa miniatura otimizada e lista todas as turmas aplicáveis", () => {
    const colorindo = catalogResources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-2",
    );
    expect(colorindo).toBeDefined();
    renderCatalog(false, [colorindo!]);

    const card = screen.getByRole("article");
    expect(within(card).getByRole("img").getAttribute("src")).toContain(
      "images/cards/thumbnails/unicamp/atividade-02.jpg",
    );
    expect(within(card).getByText("4º, 5º e 6º anos")).toBeVisible();
  });
});
