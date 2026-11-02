import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSessionStore } from "@/store/useSessionStore";
import { AccountMenu } from "./AccountMenu";

afterEach(() => { cleanup(); useSessionStore.setState({ user: null }); });

function setup() {
  useSessionStore.setState({ user: { id: "teacher", name: "Professora Ana", email: "ana@example.com" } });
  const onSignOut = vi.fn();
  const onNavigate = vi.fn();
  render(<MemoryRouter><button>Fora da conta</button><AccountMenu onSignOut={onSignOut} onNavigate={onNavigate} /></MemoryRouter>);
  return { user: userEvent.setup(), onSignOut, onNavigate };
}

describe("Minha conta", () => {
  it("apresenta a identificação do Google e fecha com Escape, restaurando o foco", async () => {
    const { user } = setup();
    const trigger = screen.getByRole("button", { name: "Minha conta" });
    await user.click(trigger);
    const panel = screen.getByRole("dialog", { name: "Minha conta" });
    expect(panel).toHaveFocus();
    expect(within(panel).getByText("Conectada com Google")).toBeVisible();
    expect(within(panel).getByText("Professora Ana")).toBeVisible();
    expect(within(panel).getByText("ana@example.com")).toBeVisible();
    expect(panel.closest('[data-clarity-mask="true"]')).not.toBeNull();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("fecha ao clicar ou mover o foco para fora", async () => {
    const { user } = setup();
    const trigger = screen.getByRole("button", { name: "Minha conta" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Fora da conta" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(trigger);
    await user.tab(); // Fechar
    await user.tab(); // Privacidade
    await user.tab(); // Sair
    await user.tab(); // Fora do painel
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("encaminha para as preferências existentes e permite sair", async () => {
    const { user, onNavigate, onSignOut } = setup();
    await user.click(screen.getByRole("button", { name: "Minha conta" }));
    const privacy = screen.getByRole("link", { name: "Privacidade e preferências" });
    expect(privacy).toHaveAttribute("href", "/privacidade");
    await user.click(privacy);
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Minha conta" }));
    await user.click(screen.getByRole("button", { name: "Sair" }));
    expect(onSignOut).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
