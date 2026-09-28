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
  await expect(page).toHaveURL(/\/app\/trilha-de-ensino$/);
  await expect(page.getByRole("heading", { name: "Buscar Materiais", level: 1 })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await resetDemo(page);
});

test("seleciona assuntos no diálogo e combina a busca com ano escolar", async ({ page }) => {
  await enterDemo(page);

  await page.getByRole("button", { name: "Ver opções" }).click();
  const dialog = page.getByRole("dialog", { name: "Selecionar assuntos" });
  await expect(dialog).toBeVisible();
  const scrollState = await dialog.evaluate((element) => ({
    dialogScrollable: element.scrollHeight > element.clientHeight + 2,
    nestedScrollers: [...element.querySelectorAll("*")].filter((child) => {
      const overflow = getComputedStyle(child).overflowY;
      return (overflow === "auto" || overflow === "scroll") && child.scrollHeight > child.clientHeight + 2;
    }).length,
  }));
  expect(scrollState).toEqual({ dialogScrollable: false, nestedScrollers: 1 });
  expect((await dialog.boundingBox())?.width).toBeGreaterThan((page.viewportSize()?.width ?? 0) * 0.9);
  await expect(dialog.locator("[aria-pressed]")).toHaveCount(44);
  await dialog.getByRole("searchbox", { name: "Buscar palavras-chave" }).fill("cyber");
  await expect(dialog.locator("[aria-pressed]")).toHaveCount(1);
  await expect(page.getByText("31 materiais", { exact: true }).first()).toBeVisible();
  await dialog.getByRole("button", { name: "Cyberbullying" }).click();
  await expect(dialog.getByRole("button", { name: "Cyberbullying" })).toHaveAttribute("aria-pressed", "true");
  await dialog.getByRole("button", { name: "Concluir" }).click();

  await expect(page.getByText("1 assunto selecionado")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Interland" })).toBeVisible();
  await page.getByRole("button", { name: "5º ano" }).click();
  await expect(page.getByText("1 material", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Ver opções" }).click();
  await expect(dialog.getByRole("searchbox", { name: "Buscar palavras-chave" })).toHaveValue("");
  await dialog.getByRole("button", { name: "Cyberbullying" }).click();
  await dialog.getByRole("button", { name: "Componentes do computador" }).click();
  await dialog.getByRole("button", { name: "Concluir" }).click();
  await expect(page.getByText("Nenhum material encontrado")).toBeVisible();

  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByText("31 materiais", { exact: true }).first()).toBeVisible();
});

test("apresenta a proposta e entra em Buscar Materiais", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Explore. Planeje. Ensine.", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: /Vista do campus da UFSM/ })).toBeVisible();

  await page.getByRole("link", { name: "O projeto", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Direcionamento e praticidade" })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));

  await enterDemo(page);
  await expect(page.getByRole("main", { name: "Buscar Materiais" })).toBeFocused();
});

test("apresenta somente as opções atuais na navegação", async ({ page }, testInfo) => {
  await enterDemo(page);

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }

  for (const label of ["Meu perfil", "Buscar Materiais", "Trilhas Prontas", "Minhas Trilhas", "Sobre"]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  for (const label of ["Acervo", "Meus Materiais", "Minhas Turmas", "Meus Planos de Aula"]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toHaveCount(0);
  }

  await expect(
    page.getByRole("link", { name: "Buscar Materiais", exact: true }),
  ).toHaveAttribute("href", /\/app\/trilha-de-ensino$/);
  await expect(
    page.getByRole("link", { name: "Minhas Trilhas", exact: true }),
  ).toHaveAttribute("href", /\/app\/minhas-trilhas$/);
  await expect(
    page.getByRole("link", { name: "Criar Plano de Aula", exact: true }),
  ).toHaveCount(0);
});

test("abre o perfil e adiciona uma Trilha Pronta às trilhas pessoais", async ({ page }, testInfo) => {
  await enterDemo(page);

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }
  await page.getByRole("link", { name: "Meu perfil", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Meu perfil", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Usuário demo", level: 2 })).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }
  await page.getByRole("link", { name: "Trilhas Prontas", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Trilhas disponíveis" })).toBeVisible();
  const readyTrailCard = page.getByRole("button", { name: /Ver trilha Algoritmos: decisões, blocos e desafios/ });
  await expect(readyTrailCard).toBeVisible();
  await readyTrailCard.click();
  await expect(
    page.getByRole("heading", { name: "Algoritmos: decisões, blocos e desafios", level: 2 }),
  ).toBeVisible();
  await expect(page.getByRole("list", { name: "Etapas da trilha pronta" }).locator("li")).toHaveCount(3);

  await page.getByRole("button", { name: "Mundo Digital" }).click();
  await expect(
    page.getByRole("button", { name: /Ver trilha Mensagens sem erro: paridade e protocolos/ }),
  ).toBeVisible();
  await expect(page.getByText("Nenhuma trilha disponível neste eixo por enquanto.")).toHaveCount(0);
  await expect(page.getByText("Material do acervo")).toHaveCount(0);

  await page.getByRole("button", { name: "Todas" }).click();
  await page.getByRole("button", { name: /Ver trilha Algoritmos: decisões, blocos e desafios/ }).click();
  await page.getByRole("button", { name: "Adicionar às Minhas Trilhas" }).click();
  await page.getByRole("button", { name: "Ver em Minhas Trilhas" }).click();
  await expect(page.getByRole("heading", { name: "Minhas Trilhas", level: 1 })).toBeVisible();
  const importedPath = page.getByRole("button", { name: /Algoritmos: decisões, blocos e desafios/ });
  await expect(importedPath).toBeVisible();
  await importedPath.click();

  const pathSteps = page
    .getByRole("list", { name: "Etapas da trilha" })
    .getByRole("button", { name: /Abrir proposta de atividade de/ });
  await expect(pathSteps).toHaveCount(3);

  const firstStepBox = await pathSteps.nth(0).boundingBox();
  const secondStepBox = await pathSteps.nth(1).boundingBox();
  if (!firstStepBox || !secondStepBox) throw new Error("Etapas da trilha não foram renderizadas");
  expect(secondStepBox.y).toBeGreaterThan(firstStepBox.y + firstStepBox.height);
});

test("busca materiais com tags e seleciona uma trilha", async ({
  page,
}, testInfo) => {
  await enterDemo(page);

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }
  await page.getByRole("link", { name: "Buscar Materiais", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Buscar Materiais", level: 1 }),
  ).toBeVisible();

  await expect(page.getByText("31 materiais", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "Material plugado" }).click();
  await expect(
    page.getByRole("heading", { name: "Blockly Games", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Sertão.bit — Livro-jogo de Pensamento Computacional",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Vinte Palpites — Teoria da Informação",
      exact: true,
    }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Limpar filtros" }).click();

  const blocklyCard = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Blockly Games", exact: true }),
  });
  const trail = page.getByRole("region", { name: "Nova trilha em criação" });
  await expect(trail).toHaveCount(0);
  await expect(
    blocklyCard.getByRole("link", { name: "Abrir detalhes de Blockly Games" }),
  ).toHaveAttribute("href", /\/app\/materiais\/blockly-games$/);
  await blocklyCard
    .getByRole("button", { name: "Adicionar Blockly Games a uma nova trilha" })
    .click();
  await expect(trail).toBeVisible();
  await trail.getByRole("button", { name: "Remover Blockly Games da trilha" }).click();
  await expect(trail).toHaveCount(0);
  await blocklyCard
    .getByRole("button", { name: "Adicionar Blockly Games a uma nova trilha" })
    .click();

  const vinteCard = page.getByRole("article").filter({
    has: page.getByRole("heading", {
      name: "Vinte Palpites — Teoria da Informação",
      exact: true,
    }),
  });
  await vinteCard
    .getByRole("button", {
      name: "Adicionar Vinte Palpites — Teoria da Informação a uma nova trilha",
    })
    .click();

  await expect(trail.getByText("2 materiais selecionados.")).toBeVisible();
  await expect(trail.getByText("Blockly Games")).toBeVisible();
  await expect(trail.getByText("Vinte Palpites — Teoria da Informação")).toBeVisible();
  await expect(trail.getByRole("button", { name: "Salvar trilha" })).toBeEnabled();
  await expect(trail.getByRole("button", { name: "Salvar trilha" })).toHaveCSS(
    "cursor",
    "pointer",
  );
  await expect(page.getByRole("button", { name: /mover .* para cima/i })).toHaveCount(0);

  await trail.getByRole("button", { name: "Salvar trilha" }).click();
  const saveDialog = page.getByRole("dialog", { name: "Salvar trilha" });
  await saveDialog.getByRole("textbox", { name: "Nome da trilha" }).fill("Algoritmos no 5º ano");
  await saveDialog
    .getByRole("textbox", { name: "Objetivo da trilha" })
    .fill("Explorar algoritmos com desafios e jogos.");
  await saveDialog.getByRole("button", { name: "Salvar trilha" }).click();
  await expect(page.getByRole("heading", { name: "Minhas Trilhas", level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /Algoritmos no 5º ano/i })).toBeVisible();

  const accessibilityResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityResults.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test("redireciona os endereços antigos para os fluxos atuais", async ({ page }) => {
  await enterDemo(page);

  await page.goto(routeUrl("/app/acervo"));
  await expect(page).toHaveURL(/\/app\/trilha-de-ensino$/);
  await expect(page.getByRole("heading", { name: "Buscar Materiais", level: 1 })).toBeVisible();

  await page.goto(routeUrl("/app/pastas/favoritos"));
  await expect(page).toHaveURL(/\/app\/trilha-de-ensino$/);

  await page.goto(routeUrl("/app/plano-de-aula"));
  await expect(page).toHaveURL(/\/app\/trilha-de-ensino$/);

  await page.goto(routeUrl("/app/planos"));
  await expect(page).toHaveURL(/\/app\/minhas-trilhas$/);
});

test("mantém o detalhe responsivo e a navegação móvel operável por teclado", async ({
  page,
}, testInfo) => {
  await enterDemo(page);
  await page.goto(routeUrl("/app/materiais/altinovare-cyberbullying"));
  await expect(
    page.getByRole("heading", { name: "Cyberbullying — Jogo Educativo", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Fornecedor: ALT+INOVARE")).toBeVisible();
  await expect(page.getByText("Habilidade", { exact: true })).toBeVisible();
  await expect(page.getByText("Cyberbullying", { exact: true })).toBeVisible();
  await expect(page.getByText("Competências", { exact: true })).toBeVisible();
  await expect(page.getByText("EF07CO09", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Reconhecer e debater sobre cyberbullying.", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "Fonte" }).click();
  await expect(page.getByText("CC BY-NC-ND 3.0 BR")).toBeVisible();
  await expect(
    page.getByText("Alinhamento com a BNCC Computação", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Critério do alinhamento curricular", { exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  if (testInfo.project.name === "mobile") {
    const menuButton = page.getByRole("button", { name: "Abrir menu" });
    await menuButton.click();
    await expect(page.getByRole("link", { name: "Meu perfil", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menuButton).toBeFocused();
  }
});

test("apresenta Lightbot e Blockly Games com os metadados verificados", async ({
  page,
}) => {
  await enterDemo(page);
  await page.goto(routeUrl("/app/materiais/lightbot"));
  await expect(page.getByRole("heading", { name: "Lightbot", level: 1 })).toBeVisible();
  await expect(page.getByText("4º e 5º anos", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Sequências e repetições em algoritmos", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("EF04CO03, EF05CO04", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Acessar recurso" })).toHaveAttribute(
    "href",
    "https://www.lightbot.lu/#/welcome",
  );
  await page.getByRole("tab", { name: "Fonte" }).click();
  await expect(page.getByText("Não informada", { exact: true })).toBeVisible();

  await page.goto(routeUrl("/app/materiais/blockly-games"));
  await expect(
    page.getByRole("heading", { name: "Blockly Games", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Programação em blocos", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Acessar recurso" })).toHaveAttribute(
    "href",
    "https://blockly.games/?lang=pt-br",
  );
  await page.getByRole("tab", { name: "Fonte" }).click();
  await expect(
    page.getByText("Apache-2.0 (código-fonte)", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Informações para educadores",
      exact: true,
    }),
  ).toHaveAttribute("href", "https://blockly.games/about?lang=pt-br");
});

test("apresenta a coleção de Rozelma e o Interland com os dados verificados", async ({
  page,
}) => {
  await enterDemo(page);
  await page.goto(routeUrl("/app/materiais/lua-bit-bit-programando-com-variaveis"));
  await expect(
    page.getByRole("heading", {
      name: "Lua & Bit-Bit — Programando com Variáveis",
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText("6º ano", { exact: true })).toBeVisible();
  await expect(page.getByText("Generalização e variáveis", { exact: true })).toBeVisible();
  await expect(page.getByText("EF06CO06", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Fonte" }).click();
  await expect(page.getByText("CC BY-NC 4.0", { exact: true })).toBeVisible();

  await page.goto(routeUrl("/app/materiais/interland"));
  await expect(
    page.getByRole("heading", { name: "Interland", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("4º, 5º e 6º anos", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Segurança e cidadania digital", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("EF04CO07, EF04CO08, EF05CO08, EF06CO09", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Acessar recurso" })).toHaveAttribute(
    "href",
    "https://beinternetawesome.withgoogle.com/pt-br_br/interland",
  );
  await page.getByRole("tab", { name: "Fonte" }).click();
  await expect(page.getByText("Não informada", { exact: true })).toBeVisible();
});

test("não apresenta violações automáticas graves de acessibilidade", async ({ page }) => {
  const landingResults = await new AxeBuilder({ page }).analyze();
  expect(landingResults.violations).toEqual([]);

  await enterDemo(page);
  const catalogResults = await new AxeBuilder({ page }).analyze();
  expect(catalogResults.violations).toEqual([]);

  await page.goto(routeUrl("/app/trilhas-prontas"));
  await expect(page.getByRole("heading", { name: "Trilhas Prontas", level: 1 })).toBeVisible();
  const readyTrailsResults = await new AxeBuilder({ page }).analyze();
  expect(readyTrailsResults.violations).toEqual([]);
});
