import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const storageKey = "explora-computacao:teaching-paths:v1";

async function readPath(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").state?.paths[0], storageKey);
}

async function createPath(page: Page) {
  await page.goto(basePath);
  await page.getByRole("link", { name: "Área do professor", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Buscar Materiais", level: 1 })).toBeVisible();
  const menu = page.getByRole("button", { name: "Abrir menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("link", { name: "Minhas Trilhas", exact: true }).click();
  await page.getByRole("button", { name: "Criar trilha", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Criar trilha · Selecionar materiais", exact: true });
  await expect(picker).toBeVisible();
  await expect(page).toHaveURL(/minhas-trilhas$/);
  await picker.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" }).fill("Blockly");
  await expect(picker.getByText("O que farão e como", { exact: true })).toBeVisible();
  await picker.getByRole("button", { name: "Selecionar Blockly Games", exact: true }).click();
  await picker.getByRole("button", { name: "Continuar", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "Criar trilha", exact: true });
  await settings.getByRole("textbox", { name: "Nome da trilha" }).fill("Trilha local de programação");
  await settings.getByRole("textbox", { name: "Objetivo da trilha" }).fill("Explorar algoritmos e programação.");
  await settings.getByRole("button", { name: "Criar trilha", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Trilha local de programação", level: 1 })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto(basePath);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("explora:analytics-consent:v1", "denied");
  });
  await page.reload();
});

test("cria e amplia uma trilha sem sair de Minhas Trilhas", async ({ page }, testInfo) => {
  await createPath(page);
  await expect(page.getByText("Percurso de aprendizagem", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Da seleção à aplicação em sala de aula", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Arraste uma etapa pelo marcador para reorganizar a trilha.")).toBeVisible();

  await page.getByRole("button", { name: "Adicionar materiais", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Adicionar materiais à trilha", exact: true });
  await picker.getByRole("searchbox").fill("Blockly");
  await expect(picker.getByRole("button", { name: "Já na trilha: Blockly Games" })).toBeDisabled();
  await picker.getByRole("searchbox").fill("Lightbot");
  await picker.getByRole("button", { name: "Selecionar Lightbot", exact: true }).click();
  await picker.getByRole("searchbox").fill("Interland");
  await picker.getByRole("button", { name: "Selecionar Interland", exact: true }).click();
  await expect(picker.getByRole("status")).toHaveText("2 materiais selecionados");
  await page.screenshot({ path: testInfo.outputPath("selecao-materiais.png") });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await picker.getByRole("button", { name: "Adicionar à trilha", exact: true }).click();
  expect((await readPath(page)).resourceIds).toEqual(["google-blockly-games"]);
  await expect(page.getByRole("button", { name: "Abrir proposta de atividade de Lightbot" })).toBeVisible();
  await page.getByRole("button", { name: "Salvar alterações", exact: true }).click();
  expect((await readPath(page)).resourceIds).toEqual(["google-blockly-games", "lightbot-web", "google-interland"]);
  await page.getByRole("button", { name: "Minhas Trilhas", exact: true }).click();
  await expect(page.getByText("Trilha de ensino", { exact: true })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("minhas-trilhas.png"), fullPage: true });
  await page.reload();
  await page.getByRole("button", { name: /Trilha local de programação/ }).click();
  await page.getByRole("button", { name: "Abrir proposta de atividade de Lightbot" }).click();
  const proposal = page.getByRole("dialog", { name: "Lightbot", exact: true });
  const link = proposal.getByRole("link", { name: /Ver material completo/ });
  await expect(link.getByRole("heading", { name: "Ver material completo" })).toBeVisible();
  await link.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("proposta-material-completo.png") });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await link.click();
  await expect(page.getByRole("heading", { name: "Lightbot", level: 1 })).toBeVisible();
});

test("protege rascunhos ao fechar a edição, voltar, navegar e recarregar", async ({ page }) => {
  await createPath(page);
  await page.getByRole("button", { name: "Editar trilha", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "Editar trilha", exact: true });
  await expect(settings.getByText(/Altere o nome, o objetivo/)).toHaveCount(0);
  await settings.getByRole("textbox", { name: "Nome da trilha" }).fill("Nome em edição");
  await page.keyboard.press("Escape");
  const guard = page.getByRole("dialog", { name: "Sair sem salvar?", exact: true });
  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Continuar editando" }).click();
  await expect(settings.getByRole("textbox", { name: "Nome da trilha" })).toHaveValue("Nome em edição");
  await settings.getByRole("button", { name: "Aplicar ao rascunho" }).click();
  await expect(guard).not.toBeVisible();
  await page.getByRole("button", { name: "Minhas Trilhas", exact: true }).click();
  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Continuar editando" }).click();
  await page.goBack();
  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Continuar editando" }).click();
  await expect(page).toHaveURL(/minhas-trilhas$/);

  let beforeUnload = false;
  page.once("dialog", async (dialog) => {
    beforeUnload = dialog.type() === "beforeunload";
    await dialog.dismiss();
  });
  await page.reload({ timeout: 3000 }).catch(() => undefined);
  expect(beforeUnload).toBe(true);
  await expect(page.getByRole("heading", { name: "Nome em edição", level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await page.getByRole("button", { name: "Minhas Trilhas", exact: true }).click();
  await expect(guard).not.toBeVisible();
  await page.getByRole("button", { name: /Nome em edição/ }).click();

  await page.getByRole("button", { name: "Abrir proposta de atividade de Blockly Games" }).click();
  const proposal = page.getByRole("dialog", { name: "Blockly Games", exact: true });
  await proposal.getByRole("radio", { name: /2 aulas/ }).check();
  await proposal.getByRole("link", { name: /Ver material completo/ }).click();
  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Continuar editando" }).click();
  await expect(proposal.getByRole("radio", { name: /2 aulas/ })).toBeChecked();
  await proposal.getByRole("link", { name: /Ver material completo/ }).click();
  await guard.getByRole("button", { name: "Sair sem salvar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Blockly Games", level: 1 })).toBeVisible();
  expect((await readPath(page)).lessonCountsByResourceId).toEqual({});
});

test("preserva etapas restauradas e pede confirmação ao cancelar a seleção ou sair da conta", async ({ page }) => {
  await createPath(page);
  await page.getByRole("button", { name: "Abrir proposta de atividade de Blockly Games" }).click();
  const proposal = page.getByRole("dialog", { name: "Blockly Games", exact: true });
  await proposal.getByRole("radio", { name: /2 aulas/ }).check();
  await proposal.getByRole("button", { name: "Fechar diálogo" }).click();
  await page.getByRole("button", { name: "Adicionar materiais", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Adicionar materiais à trilha", exact: true });
  await picker.getByRole("searchbox").fill("Lightbot");
  await picker.getByRole("button", { name: "Selecionar Lightbot", exact: true }).click();
  await picker.getByRole("button", { name: "Adicionar à trilha" }).click();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await page.getByRole("button", { name: "Marcar Blockly Games para remoção" }).click();
  await page.getByRole("button", { name: "Adicionar materiais", exact: true }).click();
  await picker.getByRole("searchbox").fill("Blockly");
  await picker.getByRole("button", { name: "Selecionar Blockly Games", exact: true }).click();
  await picker.getByRole("button", { name: "Adicionar à trilha" }).click();
  await expect(page.getByRole("button", { name: "Salvar alterações" })).toBeDisabled();
  expect((await readPath(page)).resourceIds).toEqual(["google-blockly-games", "lightbot-web"]);
  expect((await readPath(page)).lessonCountsByResourceId).toEqual({ "google-blockly-games": 2 });

  await page.getByRole("button", { name: "Adicionar materiais", exact: true }).click();
  await picker.getByRole("searchbox").fill("Interland");
  await picker.getByRole("button", { name: "Selecionar Interland", exact: true }).click();
  await picker.getByRole("button", { name: "Cancelar", exact: true }).click();
  const guard = page.getByRole("dialog", { name: "Sair sem salvar?", exact: true });
  await guard.getByRole("button", { name: "Continuar editando" }).click();
  await expect(picker.getByRole("button", { name: "Desmarcar Interland", exact: true })).toHaveAttribute("aria-pressed", "true");
  await picker.getByRole("button", { name: "Adicionar à trilha" }).click();

  const menu = page.getByRole("button", { name: "Abrir menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("button", { name: "Minha conta", exact: true }).click();
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Continuar editando" }).click();
  await expect(page.getByRole("button", { name: "Salvar alterações" })).toBeEnabled();
  await page.getByRole("button", { name: "Minha conta", exact: true }).click();
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await guard.getByRole("button", { name: "Sair sem salvar", exact: true }).click();
  await expect(page.getByRole("link", { name: "Área do professor", exact: true }).first()).toBeVisible();
  expect((await readPath(page)).resourceIds).toEqual(["google-blockly-games", "lightbot-web"]);
});
