import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { CatalogView } from "./CatalogView";

afterEach(cleanup);

function renderCatalog(controlsInitiallyCollapsed = false) {
  return render(
    <MemoryRouter>
      <CatalogView
        title="Recursos de teste"
        resources={[]}
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
});
