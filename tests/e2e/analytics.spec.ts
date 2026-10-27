import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const production = process.env.PLAYWRIGHT_USE_PREVIEW === "true";
const consentKey = "explora:analytics-consent:v1";

async function mockClarity(page: Page) {
  const requests: string[] = [];
  await page.route(/^https:\/\/(?:[^/]+\.)?clarity\.ms\//, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      contentType: "application/javascript",
      body: `
        const queued = window.clarity?.q || [];
        window.__clarityCalls = [];
        window.clarity = (...args) => window.__clarityCalls.push(args);
        queued.forEach(args => window.clarity(...args));
      `,
    });
  });
  return requests;
}

async function calls(page: Page) {
  return page.evaluate(() => (window as Window & { __clarityCalls?: unknown[][] }).__clarityCalls ?? []);
}

test("sem aceitação, não instala nem solicita o Clarity; recusa persiste sem impedir uso", async ({ page }) => {
  const requests = await mockClarity(page);
  await page.goto(basePath);
  if (!production) {
    await expect(page.getByRole("button", { name: "Aceitar análise" })).toHaveCount(0);
    expect(requests).toHaveLength(0);
    return;
  }
  await expect(page.getByRole("region", { name: "Ajude a melhorar o Explora" })).toBeVisible();
  await expect(page.locator("#microsoft-clarity")).toHaveCount(0);
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "Recusar análise" }).click();
  await page.getByRole("link", { name: "Entrar", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Buscar Materiais", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buscar Materiais", exact: true })).toBeVisible();
  await expect(page.locator("#microsoft-clarity")).toHaveCount(0);
  expect(requests).toHaveLength(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), consentKey)).toBe("denied");
});

test("aceita sem login, marca as áreas com # e revoga encerrando a instalação", async ({ page }) => {
  test.skip(!production, "O rastreador é habilitado apenas no build de produção.");
  const requests = await mockClarity(page);
  await page.goto(basePath);
  await page.getByRole("button", { name: "Aceitar análise" }).click();
  await expect.poll(() => calls(page)).toContainEqual([
    "consentv2", { analytics_Storage: "granted", ad_Storage: "denied" },
  ]);
  expect(requests).toEqual(["https://www.clarity.ms/tag/z4honwtjtg"]);
  await expect.poll(() => calls(page)).toContainEqual(["event", "pagina_inicio"]);
  await page.getByRole("link", { name: "Entrar", exact: true }).first().click();
  await expect.poll(() => calls(page)).toContainEqual(["set", "pagina", "buscar_materiais"]);
  expect(requests).toHaveLength(1);

  await page.goto(`${basePath}#/privacidade`);
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Análise de uso permitida neste navegador.");
  await expect.poll(() => requests.length).toBe(2);
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: "Recusar análise" }).click(),
  ]);
  await expect(page.getByRole("status")).toHaveText("Análise de uso recusada neste navegador.");
  await expect(page.locator("#microsoft-clarity")).toHaveCount(0);
  expect(requests).toHaveLength(2);
  await page.getByRole("link", { name: "Voltar ao início" }).click();
  await expect(page.getByRole("heading", { name: "Explore. Planeje. Ensine." })).toBeVisible();
  expect(await page.title()).toBe("Explora Computação");
  expect(requests).toHaveLength(2);
});

test("mascara textos pessoais das trilhas e envia somente o tipo de ação", async ({ page }) => {
  test.skip(!production, "O rastreador é habilitado apenas no build de produção.");
  await mockClarity(page);
  await page.goto(basePath);
  await page.getByRole("button", { name: "Aceitar análise" }).click();
  await page.getByRole("link", { name: "Entrar", exact: true }).first().click();
  await page.getByRole("button", { name: "Adicionar Bugs a uma nova trilha", exact: true }).click();
  await page.getByRole("region", { name: "Nova trilha em criação" }).getByRole("button", { name: "Salvar trilha" }).click();
  const dialog = page.getByRole("dialog", { name: "Salvar trilha" });
  const privateName = "Nome privado de teste";
  const privateObjective = "Objetivo privado de teste";
  await dialog.getByRole("textbox", { name: "Nome da trilha" }).fill(privateName);
  await dialog.getByRole("textbox", { name: "Objetivo da trilha" }).fill(privateObjective);
  await dialog.getByRole("button", { name: "Salvar trilha" }).click();
  await expect(page.getByText(privateName, { exact: true })).toHaveAttribute("data-clarity-mask", "true");
  await expect(page.getByText(privateObjective, { exact: true })).toHaveAttribute("data-clarity-mask", "true");
  await page.getByRole("button", { name: new RegExp(privateName) }).click();
  await expect(page.getByRole("heading", { name: privateName })).toHaveAttribute("data-clarity-mask", "true");
  await expect(page.getByText(privateObjective, { exact: true })).toHaveAttribute("data-clarity-mask", "true");
  await expect.poll(() => calls(page)).toContainEqual(["event", "trilha_criada"]);
  const sent = JSON.stringify(await calls(page));
  expect(sent).not.toContain(privateName);
  expect(sent).not.toContain(privateObjective);
});

test("revogação em outra aba encerra o rastreador também na aba aberta", async ({ page, context }) => {
  test.skip(!production, "O rastreador é habilitado apenas no build de produção.");
  await mockClarity(page);
  await page.goto(basePath);
  await page.getByRole("button", { name: "Aceitar análise" }).click();
  await expect.poll(() => calls(page)).toContainEqual(["event", "pagina_inicio"]);
  const other = await context.newPage();
  const otherRequests = await mockClarity(other);
  await other.goto(`${basePath}#/privacidade`);
  await expect.poll(() => calls(other)).toContainEqual(["event", "pagina_privacidade"]);
  await page.goto(`${basePath}#/privacidade`);
  await Promise.all([
    other.waitForEvent("load"),
    page.waitForEvent("load"),
    page.getByRole("button", { name: "Recusar análise" }).click(),
  ]);
  await expect(other.getByRole("status")).toHaveText("Análise de uso recusada neste navegador.");
  await expect(other.locator("#microsoft-clarity")).toHaveCount(0);
  expect(otherRequests).toHaveLength(1);
  await other.close();
});

test("preferências são públicas, acessíveis e sem rolagem horizontal", async ({ page }, testInfo) => {
  await mockClarity(page);
  await page.goto(basePath);
  if (production) {
    await expect(page.getByRole("region", { name: "Ajude a melhorar o Explora" })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("consentimento.png"), fullPage: false });
  }
  await page.goto(`${basePath}#/privacidade`);
  await expect(page.getByRole("heading", { name: "Privacidade e preferências" })).toBeVisible();
  await expect(page.locator("#microsoft-clarity")).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("privacidade.png"), fullPage: true });
});
