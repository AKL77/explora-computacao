import { expect, type Page } from "@playwright/test";

export async function openWorkspacePage(page: Page, label: string) {
  await expect(page.locator("main#main-content")).toBeVisible();
  const menu = page.getByRole("button", { name: "Abrir menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("navigation", { name: "Navegação principal", exact: true })
    .getByRole("link", { name: label, exact: true }).click();
}

export async function createTeachingPath(page: Page, name: string, objective: string, titles: string[]) {
  await openWorkspacePage(page, "Minhas Trilhas");
  await page.getByRole("button", { name: "Criar trilha", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Criar trilha · Selecionar materiais", exact: true });
  for (const title of titles) {
    await picker.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" }).fill(title);
    await picker.getByRole("button", { name: `Selecionar ${title}`, exact: true }).click();
  }
  await picker.getByRole("button", { name: "Continuar", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "Criar trilha", exact: true });
  await settings.getByRole("textbox", { name: "Nome da trilha" }).fill(name);
  await settings.getByRole("textbox", { name: "Objetivo da trilha" }).fill(objective);
  await settings.getByRole("button", { name: "Criar trilha", exact: true }).click();
  await expect(page.getByRole("heading", { name, level: 2, exact: true })).toBeVisible();
}
