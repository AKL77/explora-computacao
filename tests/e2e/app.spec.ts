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

async function expectOpenFilterAboveCardActions(
  page: import("@playwright/test").Page,
) {
  const hitTest = await page.evaluate(() => {
    const fieldset = document.querySelector<HTMLFieldSetElement>(
      "details[open] fieldset",
    );
    const cardAction = document.querySelector<HTMLButtonElement>(
      "article button[aria-label^='Favoritar ']",
    );

    if (!fieldset || !cardAction) {
      return { overlaps: false, filterOwnsHit: false };
    }

    const filterRect = fieldset.getBoundingClientRect();
    const actionRect = cardAction.getBoundingClientRect();
    const left = Math.max(filterRect.left, actionRect.left);
    const right = Math.min(filterRect.right, actionRect.right);
    const top = Math.max(filterRect.top, actionRect.top);
    const bottom = Math.min(filterRect.bottom, actionRect.bottom);

    if (left >= right || top >= bottom) {
      return { overlaps: false, filterOwnsHit: false };
    }

    const topElement = document.elementFromPoint(
      left + (right - left) / 2,
      top + (bottom - top) / 2,
    );

    return {
      overlaps: true,
      filterOwnsHit: Boolean(topElement && fieldset.contains(topElement)),
    };
  });

  expect(hitTest.overlaps).toBe(true);
  expect(hitTest.filterOwnsHit).toBe(true);
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

test("mantém perfil, turmas e planos inativos na navegação", async ({ page }, testInfo) => {
  await enterDemo(page);
  const catalogUrl = page.url();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }

  for (const label of ["Meu perfil", "Minhas Turmas", "Meus Planos de Aula"]) {
    const item = page.getByRole("button", { name: label, exact: true });
    await expect(item).toBeVisible();
    await expect(item).toBeDisabled();
    await expect(item).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByRole("link", { name: label, exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(catalogUrl);
  }

  await expect(
    page.getByRole("link", { name: "Criar Trilha de Ensino", exact: true }),
  ).toHaveAttribute("href", /\/app\/trilha-de-ensino$/);
  await expect(
    page.getByRole("link", { name: "Minhas Trilhas", exact: true }),
  ).toHaveAttribute("href", /\/app\/minhas-trilhas$/);
  await expect(
    page.getByRole("link", { name: "Criar Plano de Aula", exact: true }),
  ).toHaveCount(0);
});

test("busca materiais com tags e seleciona uma trilha", async ({
  page,
}, testInfo) => {
  await enterDemo(page);

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }
  await page.getByRole("link", { name: "Criar Trilha de Ensino", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Criar Trilha de Ensino", level: 1 }),
  ).toBeVisible();

  await expect(page.getByText("3 materiais", { exact: true }).first()).toBeVisible();

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
  await expect(
    blocklyCard.getByRole("link", { name: "Abrir Blockly Games no Acervo" }),
  ).toHaveAttribute("href", /\/app\/acervo\/blockly-games$/);
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

  const trail = page.getByRole("region", { name: "Nova trilha em criação" });
  await expect(trail.getByText("2 materiais selecionados.")).toBeVisible();
  await expect(trail.getByText("Blockly Games")).toBeVisible();
  await expect(trail.getByText("Vinte Palpites — Teoria da Informação")).toBeVisible();
  await expect(trail.getByRole("button", { name: "Salvar trilha" })).toBeEnabled();
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

test("cria, salva, pesquisa, edita e baixa um plano", async ({ page }) => {
  await enterDemo(page);

  await page.goto(routeUrl("/app/plano-de-aula"));
  await expect(
    page.getByRole("heading", { name: "Criar Plano de Aula", level: 1 }),
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Tema" }).fill(
    "Algoritmos com Lightbot",
  );
  await page.getByRole("combobox", { name: "Ano escolar" }).selectOption("4");
  await page.getByRole("combobox", { name: "Habilidade" }).selectOption("EF04CO03");
  await expect(page.getByRole("option", { name: "Lightbot" })).toHaveCount(1);
  await expect(page.getByRole("option", { name: "Blockly Games" })).toHaveCount(1);
  await page
    .getByRole("combobox", { name: "Material do Acervo" })
    .selectOption("lightbot-web");
  await expect(page.getByText(/Este material não possui objetivo sugerido/)).toBeVisible();
  await page
    .getByRole("textbox", { name: "Objetivo" })
    .fill("Criar e testar algoritmos com sequências e repetições.");
  await page.getByRole("radio", { name: /3 aulas/ }).check();
  await page.getByRole("checkbox", { name: /Incluir avaliação/ }).check();
  await page.getByRole("button", { name: "Montar plano" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Algoritmos com Lightbot",
      level: 2,
    }),
  ).toBeFocused();
  await expect(
    page.getByText("4º ano · 3 aulas · 150 minutos", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Em Blocos" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const blockPlan = page.getByLabel("Visualização em blocos do plano");
  for (const heading of ["Materiais", "BNCC", "Objetivo", "Metodologia", "Avaliação"]) {
    await expect(blockPlan.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(blockPlan.getByText(/EF04CO03/)).toBeVisible();
  await expect(blockPlan.getByText("Habilidade", { exact: true })).toHaveCount(0);
  await expect(blockPlan.getByText("Eixo", { exact: true })).toHaveCount(0);
  await expect(blockPlan.getByText("Competência", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Lorem ipsum dolor sit amet/).first()).toBeVisible();
  await expect(page.getByText("Objeto de conhecimento", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText("35 min de atividade + 10 min de avaliação + 5 min de margem"),
  ).toHaveCount(0);
  await expect(blockPlan.getByRole("link", { name: /Lightbot/ })).toHaveAttribute(
    "href",
    "https://www.lightbot.lu/#/welcome",
  );
  await expect(page.getByRole("button", { name: /Trocar/ })).toHaveCount(0);

  const blockPlanResults = await new AxeBuilder({ page }).analyze();
  expect(blockPlanResults.violations).toEqual([]);

  await page.getByRole("button", { name: "Descritivo" }).click();
  await expect(
    page.getByRole("heading", { name: "Desenvolvimento das aulas" }),
  ).toBeVisible();
  for (const lesson of [1, 2, 3]) {
    await expect(page.getByRole("heading", { name: `Aula ${lesson}` })).toBeVisible();
  }
  const composedPlanResults = await new AxeBuilder({ page }).analyze();
  expect(composedPlanResults.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "Em Blocos" }).click();
  await page.getByRole("button", { name: "Salvar plano" }).click();
  await expect(page).toHaveURL(/\/app\/planos\/[^/]+\/editar$/);
  await expect(
    page.getByRole("heading", { name: "Editar Plano de Aula", level: 1 }),
  ).toBeVisible();

  await page.goto(routeUrl("/app/planos"));
  await page.reload();
  await page
    .getByRole("searchbox", { name: "Pesquisar planos pelo nome" })
    .fill("algoritmos");
  await expect(
    page.getByRole("heading", { name: "Algoritmos com Lightbot", level: 2 }),
  ).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar PDF de Algoritmos com Lightbot" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("plano-de-aula-algoritmos-com-lightbot.pdf");

  await page.getByRole("link", { name: "Editar plano" }).click();
  await page.getByRole("textbox", { name: "Tema" }).fill("Algoritmos revisados");
  await expect(page.getByRole("button", { name: "Atualizar plano" })).toBeEnabled();
  await page.getByRole("button", { name: "Atualizar plano" }).click();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status")).toContainText("Alterações salvas");

  await page.goto(routeUrl("/app/plano-de-aula"));
  await expect(
    page.getByRole("heading", { name: "Criar Plano de Aula", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tema" })).toHaveValue("");
  await expect(page.getByRole("heading", { name: "Seu plano aparecerá aqui" })).toBeVisible();

  await page.goto(routeUrl("/app/planos"));
  await page
    .getByRole("searchbox", { name: "Pesquisar planos pelo nome" })
    .fill("revisados");
  await expect(
    page.getByRole("heading", { name: "Algoritmos revisados", level: 2 }),
  ).toBeVisible();
});

test("busca, filtra, favorita e organiza o recurso em uma pasta persistente", async ({
  page,
}, testInfo) => {
  await enterDemo(page);

  const search = page.getByRole("searchbox", {
    name: "Buscar no conteúdo desta página",
  });
  await search.fill("cyber");
  await expect(page).toHaveURL(/q=cyber/);
  await expect(page.getByRole("heading", { name: "Cyberbullying — Jogo Educativo" })).toBeVisible();

  const card = page.getByRole("article").filter({
    has: page.getByRole("heading", {
      name: "Cyberbullying — Jogo Educativo",
      exact: true,
    }),
  });
  await expect(card.getByText("Turma", { exact: true })).toBeVisible();
  await expect(card.getByText("Eixo", { exact: true })).toBeVisible();
  await expect(card.getByText("Habilidades", { exact: true })).toHaveCount(0);
  await expect(card.getByText(/EF07CO09/)).toHaveCount(0);

  const gradeSummary = page.locator("summary").filter({ hasText: "Turma" });
  const skillSummary = page.locator("summary").filter({ hasText: "Habilidade" });
  const gradeMenu = page.locator("details").filter({ has: gradeSummary });
  const skillMenu = page.locator("details").filter({ has: skillSummary });

  await gradeSummary.click();
  await expect(gradeMenu).toHaveAttribute("open", "");
  if (testInfo.project.name !== "mobile") {
    await expectOpenFilterAboveCardActions(page);
  }
  await skillSummary.click();
  await expect(gradeMenu).not.toHaveAttribute("open", "");
  await expect(skillMenu).toHaveAttribute("open", "");
  if (testInfo.project.name !== "mobile") {
    await expectOpenFilterAboveCardActions(page);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await gradeSummary.click();
  await expect(skillMenu).not.toHaveAttribute("open", "");
  await page.getByRole("checkbox", { name: "7º ano" }).click();
  await expect(page).toHaveURL(/turmas=7/);
  await gradeSummary.click();
  await expect(gradeMenu).not.toHaveAttribute("open", "");

  await page.getByRole("button", { name: "Favoritar Cyberbullying — Jogo Educativo" }).click();
  await expect(
    page.getByRole("button", { name: "Desfavoritar Cyberbullying — Jogo Educativo" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page
    .getByRole("button", {
      name: "Organizar Cyberbullying — Jogo Educativo em uma pasta",
      exact: true,
    })
    .click();
  await expect(page.locator("dialog")).toHaveCount(1);
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
    await expect(page.getByRole("link", { name: "Acervo", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menuButton).toBeFocused();
  }
});

test("apresenta Lightbot e Blockly Games com os metadados verificados", async ({
  page,
}) => {
  await enterDemo(page);
  await expect(page.getByText("31 recursos", { exact: true })).toBeVisible();

  const search = page.getByRole("searchbox", {
    name: "Buscar no conteúdo desta página",
  });
  await search.fill("Lightbot");
  await page.getByRole("link", { name: "Ver detalhes de Lightbot" }).click();
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

  await page.goto(routeUrl("/app/acervo?q=blockly"));
  await page.getByRole("link", { name: "Ver detalhes de Blockly Games" }).click();
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

  const search = page.getByRole("searchbox", {
    name: "Buscar no conteúdo desta página",
  });
  await search.fill("Lua & Bit-Bit");
  await page
    .getByRole("link", {
      name: "Ver detalhes de Lua & Bit-Bit — Programando com Variáveis",
    })
    .click();
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

  await page.goto(routeUrl("/app/acervo?q=interland"));
  await page.getByRole("link", { name: "Ver detalhes de Interland" }).click();
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

  await page.goto(routeUrl("/app/plano-de-aula"));
  await expect(
    page.getByRole("heading", { name: "Criar Plano de Aula", level: 1 }),
  ).toBeVisible();
  const lessonPlanResults = await new AxeBuilder({ page }).analyze();
  expect(lessonPlanResults.violations).toEqual([]);
});
