import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";

function routeUrl(path = "") {
  return `${basePath}#${path}`;
}

async function resetDemo(page: import("@playwright/test").Page) {
  await page.goto(basePath);
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

async function enterDemo(page: import("@playwright/test").Page) {
  await page.getByRole("link", { name: "Entrar", exact: true }).first().click();
  await expect(page).toHaveURL(/\/app\/acervo$/);
  await expect(page.getByRole("heading", { name: "Acervo", level: 1 })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await resetDemo(page);
});

test("apresenta a proposta e entra no Acervo", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Explore. Planeje. Ensine.", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: /Vista do campus da UFSM/ })).toBeVisible();

  await page.getByRole("link", { name: "O projeto", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Direcionamento e praticidade" })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));

  await enterDemo(page);
  await expect(page.getByRole("main", { name: "Acervo" })).toBeFocused();
});

test("mantém as opções ainda não implementadas inativas", async ({ page }, testInfo) => {
  await enterDemo(page);
  const catalogUrl = page.url();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }

  for (const label of ["Criar Plano de Aula", "Minhas Turmas"]) {
    const item = page.getByRole("button", { name: label, exact: true });
    await expect(item).toBeVisible();
    await expect(item).toBeDisabled();
    await expect(item).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByRole("link", { name: label, exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(catalogUrl);
  }
});

test("busca, filtra, favorita e organiza o recurso em uma pasta persistente", async ({
  page,
}) => {
  await enterDemo(page);

  const search = page.getByRole("searchbox", {
    name: "Buscar no conteúdo desta página",
  });
  await search.fill("cyber");
  await expect(page).toHaveURL(/q=cyber/);
  await expect(page.getByRole("heading", { name: "Cyberbullying — Jogo Educativo" })).toBeVisible();

  await page.locator("summary").filter({ hasText: "Turma" }).click();
  await page.getByRole("checkbox", { name: "7º ano" }).click();
  await expect(page).toHaveURL(/turmas=7/);

  await page.getByRole("button", { name: "Favoritar Cyberbullying — Jogo Educativo" }).click();
  await expect(
    page.getByRole("button", { name: "Desfavoritar Cyberbullying — Jogo Educativo" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Organizar Cyberbullying.*em uma pasta/ }).click();
  await page.getByRole("textbox", { name: "Nome da pasta" }).fill(
    "Turma sétimo ano — Escola Lívia Menna Barreto",
  );
  await page.getByRole("button", { name: "Criar e adicionar" }).click();
  await expect(page.getByText(/A pasta Turma sétimo ano/)).toBeVisible();
  await page.getByRole("button", { name: "Fechar diálogo" }).click();

  await page.goto(routeUrl("/app/pastas"));
  await expect(page.getByRole("heading", { name: "Favoritos", level: 2 })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Turma sétimo ano — Escola Lívia Menna Barreto",
      level: 2,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Abrir Turma sétimo ano/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Turma sétimo ano — Escola Lívia Menna Barreto",
      level: 1,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Cyberbullying — Jogo Educativo" })).toBeVisible();
});

test("mantém o detalhe responsivo e a navegação móvel operável por teclado", async ({
  page,
}, testInfo) => {
  await enterDemo(page);
  await page.goto(routeUrl("/app/acervo/altinovare-cyberbullying"));
  await expect(
    page.getByRole("heading", { name: "Cyberbullying — Jogo Educativo", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Fornecedor: ALT+INOVARE")).toBeVisible();
  await page.getByRole("tab", { name: "Fonte" }).click();
  await expect(page.getByText("CC BY-NC-ND 3.0 BR")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  if (testInfo.project.name === "mobile") {
    const menuButton = page.getByRole("button", { name: "Abrir menu" });
    await menuButton.click();
    await expect(page.getByRole("link", { name: "Acervo", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menuButton).toBeFocused();
  }
});

test("não apresenta violações automáticas graves de acessibilidade", async ({ page }) => {
  const landingResults = await new AxeBuilder({ page }).analyze();
  expect(landingResults.violations).toEqual([]);

  await enterDemo(page);
  const catalogResults = await new AxeBuilder({ page }).analyze();
  expect(catalogResults.violations).toEqual([]);
});
