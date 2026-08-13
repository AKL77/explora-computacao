import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { ResourceDetailPage } from "./ResourceDetailPage";

afterEach(cleanup);

function renderResourceDetail() {
  render(
    <MemoryRouter initialEntries={["/app/acervo/altinovare-cyberbullying"]}>
      <Routes>
        <Route path="/app/acervo/:slug" element={<ResourceDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ResourceDetailPage", () => {
  it("apresenta a descrição inicialmente e alterna entre as três abas", async () => {
    const user = userEvent.setup();
    renderResourceDetail();

    expect(
      await screen.findByRole("heading", {
        name: "Cyberbullying — Jogo Educativo",
        level: 1,
      }),
    ).toBeVisible();

    const descriptionTab = screen.getByRole("tab", { name: "Descrição" });
    expect(descriptionTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Uma simulação gamificada e interativa",
    );

    const additionalTab = screen.getByRole("tab", {
      name: "Informações adicionais",
    });
    await user.click(additionalTab);

    const additionalPanel = screen.getByRole("tabpanel");
    expect(additionalTab).toHaveAttribute("aria-selected", "true");
    expect(additionalPanel).toHaveTextContent("Objetivo de aprendizagem");
    expect(additionalPanel).toHaveTextContent("50 min");
    expect(additionalPanel).toHaveTextContent("Individual ou em grupos");
    expect(additionalPanel).toHaveTextContent("Computador ou notebook");

    await user.keyboard("{ArrowRight}");

    const sourceTab = screen.getByRole("tab", { name: "Fonte" });
    expect(sourceTab).toHaveFocus();
    expect(sourceTab).toHaveAttribute("aria-selected", "true");
    const sourcePanel = screen.getByRole("tabpanel");
    expect(within(sourcePanel).getByText("ALT+INOVARE")).toBeVisible();
    expect(within(sourcePanel).getByText("CC BY-NC-ND 3.0 BR")).toBeVisible();
  });

  it("remove indicadores e seções de curadoria da apresentação", async () => {
    renderResourceDetail();

    await screen.findByRole("heading", {
      name: "Cyberbullying — Jogo Educativo",
      level: 1,
    });

    expect(screen.queryByText("Curadoria em andamento")).not.toBeInTheDocument();
    expect(screen.queryByText("Nota da curadoria")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Alinhamento pedagógico" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Habilidade e competência")).toBeVisible();
    expect(
      screen.getByText("EF07CO09 — Reconhecer e debater sobre cyberbullying."),
    ).toBeVisible();
  });
});
