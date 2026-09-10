import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { TEACHING_PATHS_SCHEMA_VERSION, useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { ProfilePage } from "./ProfilePage";

afterEach(() => {
  cleanup();
  localStorage.clear();
  useTeachingPathsStore.setState({ schemaVersion: TEACHING_PATHS_SCHEMA_VERSION, paths: [] });
});

describe("ProfilePage", () => {
  it("apresenta a sessão local e atalhos funcionais", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Meu perfil", level: 1 })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Usuário demo", level: 2 })).toBeVisible();
    expect(screen.getByText("0")).toBeVisible();
    expect(screen.getByRole("link", { name: /Buscar Materiais/ })).toHaveAttribute(
      "href",
      "/app/trilha-de-ensino",
    );
    expect(screen.getByRole("link", { name: /Trilhas Prontas/ })).toHaveAttribute(
      "href",
      "/app/trilhas-prontas",
    );
    expect(screen.getByRole("link", { name: /Minhas Trilhas/ })).toHaveAttribute(
      "href",
      "/app/minhas-trilhas",
    );
  });
});
