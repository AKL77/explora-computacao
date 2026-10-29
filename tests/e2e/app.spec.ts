import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";

function routeUrl(path = "") {
  return `${basePath}#${path}`;
}

async function resetDemo(page: import("@playwright/test").Page) {
  await page.goto(basePath);
  await page.evaluate(() => window.localStorage.clear());
  await page.evaluate(() => window.localStorage.setItem("explora:analytics-consent:v1", "denied"));
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
  await expect(dialog.locator("[aria-pressed]")).toHaveCount(45);
  await dialog.getByRole("searchbox", { name: "Buscar palavras-chave" }).fill("cyber");
  await expect(dialog.locator("[aria-pressed]")).toHaveCount(1);
  await expect(page.getByText("48 materiais", { exact: true }).first()).toBeVisible();
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
  await expect(page.getByText("48 materiais", { exact: true }).first()).toBeVisible();
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

test("copia uma trilha nova e preserva etapas com mais de uma aula", async ({ page }) => {
  await enterDemo(page);
  await page.goto(routeUrl("/app/trilhas-prontas"));
  await expect(page.getByRole("button", { name: /Ver trilha/ })).toHaveCount(9);
  await page.getByRole("button", { name: "Cultura Digital", exact: true }).click();
  await expect(page.getByRole("button", { name: /Ver trilha/ })).toHaveCount(3);
  await page.getByRole("button", { name: "Ver trilha Cyberbullying: reconhecer e agir", exact: true }).click();
  await expect(page.getByText("4 aulas sugeridas", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Etapas da trilha pronta" }).locator("li")).toHaveCount(2);
  await expect(page.getByText("Atividade · 3 aulas", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Adicionar às Minhas Trilhas", exact: true }).click();
  await page.getByRole("button", { name: "Ver em Minhas Trilhas", exact: true }).click();
  await page.getByRole("button", { name: /Cyberbullying: reconhecer e agir/ }).click();
  await expect(page.getByText("4 aulas sugeridas", { exact: true })).toBeVisible();
  await expect(page.getByText("200 min no total", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Abrir proposta de atividade de Cyberbullying — Uma Brincadeira de Mau Gosto", exact: true }).click();
  const proposal = page.getByRole("dialog", { name: "Cyberbullying — Uma Brincadeira de Mau Gosto", exact: true });
  await expect(proposal.getByRole("radio", { name: /3 aulas.*150 min/ })).toBeChecked();
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

  await expect(page.getByText("48 materiais", { exact: true }).first()).toBeVisible();

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

test("apresenta os sete novos materiais com fontes, licenças e durações corretas", async ({ page }, testInfo) => {
  await enterDemo(page);
  const additions = [
    ["computacional-bugs", "Bugs", "CC BY-NC-SA 4.0"],
    ["tetris-repeticao", "Tetris — Repetição", "CC BY-NC-SA 4.0"],
    ["automatos-da-monica", "Autômatos da Mônica — Versão 2026", "Não informada"],
    ["portas-logicas", "Portas Lógicas", "CC BY-NC-SA 4.0"],
    ["ia-para-os-oceanos", "IA para os Oceanos", "CC BY-NC-SA 4.0 (plano docente); licença do jogo não verificada"],
    ["microbit-cracha", "Crachá — micro:bit", "CC BY-SA 4.0"],
    ["internet-com-responsa-adolescentes", "Internet com Responsa — Só para Adolescentes", "CC BY-ND (versão não indicada no PDF)"],
  ];
  for (const [slug, title, license] of additions) {
    await page.goto(routeUrl(`/app/materiais/${slug}`));
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    await expect(page.getByRole("region", { name: "Preparação necessária" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Acessar recurso" })).toHaveAttribute("href", /^https:/);
    await page.getByRole("tab", { name: "Informações adicionais" }).click();
    const additional = page.getByRole("tabpanel");
    const duration = additional.locator("div").filter({ has: page.getByText("Duração", { exact: true }) }).last();
    await expect(duration).toContainText(slug === "ia-para-os-oceanos" ? "45 min" : "Não informado");
    await page.getByRole("tab", { name: "Fonte", exact: true }).click();
    await expect(page.getByRole("tabpanel").getByText(license, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.goto(routeUrl("/app/materiais/portas-logicas"));
  await expect(page.getByRole("img", { name: /Desafios com lâmpadas/ })).toBeVisible();
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path: testInfo.outputPath("novo-material.png"), fullPage: true });
});

test("filtra novos assuntos e conserva os novos materiais nas propostas de uma trilha salva", async ({ page }, testInfo) => {
  await enterDemo(page);
  await page.getByRole("button", { name: "Ver opções" }).click();
  const dialog = page.getByRole("dialog", { name: "Selecionar assuntos" });
  await dialog.getByRole("button", { name: "Inteligência artificial", exact: true }).click();
  await dialog.getByRole("button", { name: "Concluir" }).click();
  await expect(page.getByRole("heading", { name: "IA para os Oceanos", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Internet com Responsa — Só para Adolescentes", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blockly Games", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Limpar filtros" }).click();

  const search = page.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" });
  await search.fill("microbit");
  await expect(page.getByRole("heading", { name: "Crachá — micro:bit", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Material desplugado", exact: true }).click();
  await expect(page.getByText("Nenhum material encontrado")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();

  await page.getByRole("button", { name: "Adicionar Bugs a uma nova trilha", exact: true }).click();
  await page.getByRole("button", { name: "Adicionar IA para os Oceanos a uma nova trilha", exact: true }).click();
  await page.getByRole("region", { name: "Nova trilha em criação" }).getByRole("button", { name: "Salvar trilha" }).click();
  const saveDialog = page.getByRole("dialog", { name: "Salvar trilha" });
  await saveDialog.getByRole("textbox", { name: "Nome da trilha" }).fill("Novos materiais — teste local");
  await saveDialog.getByRole("textbox", { name: "Objetivo da trilha" }).fill("Explorar algoritmos e dados de treinamento.");
  await saveDialog.getByRole("button", { name: "Salvar trilha" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Novos materiais — teste local/ }).click();
  await page.getByRole("button", { name: "Abrir proposta de atividade de IA para os Oceanos", exact: true }).click();
  const proposal = page.getByRole("article", { name: "Proposta de atividade da etapa" });
  await expect(proposal).toContainText("4º, 5º, 6º, 7º, 8º e 9º anos");
  await expect(proposal.getByText("6º ano ·", { exact: true })).toBeVisible();
  await expect(proposal.getByText("9º ano ·", { exact: true })).toBeVisible();
  await expect(proposal).toContainText("Treinar e testar um modelo");
  const materialLink = proposal.getByRole("link", { name: /Ver material completo/ });
  await expect(materialLink).toHaveAttribute("href", /\/app\/materiais\/ia-para-os-oceanos$/);
  await page.screenshot({ path: testInfo.outputPath("nova-trilha.png") });
  await materialLink.click();
  await expect(page.getByRole("heading", { name: "IA para os Oceanos", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Acessar recurso" })).toHaveAttribute("href", /studio\.code\.org\/courses\/oceans/);
});

test("integra os cinco materiais aprovados às fichas e à trilha local", async ({ page }, testInfo) => {
  await enterDemo(page);
  const additions = [
    ["evolucao-da-computacao", "Evolução da Computação"],
    ["guardiao-cibernetico", "Guardião Cibernético — Proteja os seus dados"],
    ["as-fake-news-conexao-escola", "As fake news — Conexão Escola"],
    ["splashcode", "SplashCode"],
    ["seguranca-online-tabuleiro", "Segurança Online — Jogo de Tabuleiro"],
  ];
  for (const [slug, title] of additions) {
    await page.goto(routeUrl(`/app/materiais/${slug}`));
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    await expect(page.getByRole("region", { name: "Preparação necessária" })).toBeVisible();
    await page.getByRole("tab", { name: "Informações adicionais" }).click();
    await expect(page.getByRole("tabpanel")).toContainText("Não informado");
    await page.getByRole("tab", { name: "Fonte", exact: true }).click();
    await expect(page.getByRole("tabpanel").getByRole("link").first()).toHaveAttribute("href", /^https:/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    if (slug === "guardiao-cibernetico") {
      await expect(page.getByRole("link", { name: "Fascículo complementar — Proteção de Dados", exact: true })).toHaveAttribute("href", /fasciculo-protecao-de-dados-egc\.pdf$/);
      await expect(page.getByRole("link", { name: "Slides com notas para o apresentador (PDF)", exact: true })).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath("guardiao-complementares.png"), fullPage: true });
    }
  }
  await page.goto(routeUrl("/app/trilha-de-ensino"));
  await page.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" }).fill("SplashCode");
  await expect(page.getByText("1 material", { exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toContainText("Material desplugado");
  await page.getByRole("button", { name: "Adicionar SplashCode a uma nova trilha", exact: true }).click();
  await page.getByRole("region", { name: "Nova trilha em criação" }).getByRole("button", { name: "Salvar trilha" }).click();
  const dialog = page.getByRole("dialog", { name: "Salvar trilha" });
  await dialog.getByRole("textbox", { name: "Nome da trilha" }).fill("Materiais aprovados");
  await dialog.getByRole("textbox", { name: "Objetivo da trilha" }).fill("Planejar percursos com cartas de programação.");
  await dialog.getByRole("button", { name: "Salvar trilha" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Materiais aprovados/ }).click();
  await page.getByRole("button", { name: "Abrir proposta de atividade de SplashCode", exact: true }).click();
  const proposal = page.getByRole("article", { name: "Proposta de atividade da etapa" });
  await expect(proposal).toContainText("Jogo impresso e montado");
  await expect(proposal).toContainText("Tampas de garrafa");
  await expect(proposal).toContainText("EF06CO02");
  await expect(proposal.getByRole("link", { name: /Ver material completo/ })).toHaveAttribute("href", /\/app\/materiais\/splashcode$/);
});

test("preserva o português do Compute It na ficha e no acesso pela trilha", async ({ page }, testInfo) => {
  await enterDemo(page);
  await page.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" }).fill("Compute It");
  await expect(page.getByText("1 material", { exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toContainText("Material plugado");
  await page.getByRole("link", { name: "Abrir detalhes de Compute It", exact: true }).click();
  await expect(page.getByRole("link", { name: "Acessar recurso", exact: true })).toHaveAttribute("href", "https://compute-it.toxicode.fr/?lang=pt");
  await page.getByRole("tab", { name: "Informações adicionais" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("comandos em português, independentemente do idioma do navegador");
  await page.getByRole("tab", { name: "Fonte", exact: true }).click();
  await expect(page.getByRole("link", { name: "Jogo com comandos em português — acesso direto", exact: true })).toHaveAttribute("href", "https://compute-it.toxicode.fr/?lang=pt");
  await page.screenshot({ path: testInfo.outputPath("compute-it-portugues.png"), fullPage: true });
  await page.getByRole("link", { name: "Voltar", exact: true }).click();
  await page.getByRole("button", { name: "Adicionar Compute It a uma nova trilha", exact: true }).click();
  await page.getByRole("region", { name: "Nova trilha em criação" }).getByRole("button", { name: "Salvar trilha" }).click();
  const dialog = page.getByRole("dialog", { name: "Salvar trilha" });
  await dialog.getByRole("textbox", { name: "Nome da trilha" }).fill("Interpretando programas");
  await dialog.getByRole("textbox", { name: "Objetivo da trilha" }).fill("Simular programas com comandos em português.");
  await dialog.getByRole("button", { name: "Salvar trilha" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Interpretando programas/ }).click();
  await page.getByRole("button", { name: "Abrir proposta de atividade de Compute It", exact: true }).click();
  const proposal = page.getByRole("article", { name: "Proposta de atividade da etapa" });
  await expect(proposal).toContainText("executam os comandos em português");
  await proposal.getByRole("link", { name: /Ver material completo/ }).click();
  await expect(page.getByRole("heading", { name: "Compute It", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Acessar recurso", exact: true })).toHaveAttribute("href", "https://compute-it.toxicode.fr/?lang=pt");
});

test("integra os expositivos às fichas e à trilha com a playlist e seus complementos", async ({ page }, testInfo) => {
  await enterDemo(page);
  const search = page.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" });
  const titles = [
    "Tecnologia e vida humana — Conexão Escola",
    "Os computadores eram pessoas! — Manual do Mundo",
    "Como funciona a memória do computador? — Manual do Mundo",
    "Como funciona a Internet? — Playlist do NIC.br",
  ];
  for (const title of titles) {
    await search.fill(title);
    await expect(page.getByText("1 material", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: `Adicionar ${title} a uma nova trilha`, exact: true }).click();
  }
  await page.getByRole("region", { name: "Nova trilha em criação" }).getByRole("button", { name: "Salvar trilha" }).click();
  const dialog = page.getByRole("dialog", { name: "Salvar trilha" });
  await dialog.getByRole("textbox", { name: "Nome da trilha" }).fill("Computadores e Internet — exposição");
  await dialog.getByRole("textbox", { name: "Objetivo da trilha" }).fill("Relacionar tecnologias, armazenamento e comunicação em rede.");
  await dialog.getByRole("button", { name: "Salvar trilha" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Computadores e Internet — exposição/ }).click();
  const proposal = page.getByRole("article", { name: "Proposta de atividade da etapa" });
  await page.getByRole("button", { name: `Abrir proposta de atividade de ${titles[3]}`, exact: true }).click();
  await expect(proposal).toContainText("episódios escolhidos pelo professor");
  await proposal.getByRole("link", { name: /Ver material completo/ }).click();
  await expect(page.getByRole("link", { name: "Acessar recurso", exact: true })).toHaveAttribute("href", "https://www.youtube.com/playlist?list=PLQq8-9yVHyOYMFAc9v7Yb_cqmNMksEdrk");
  await page.getByRole("tab", { name: "Informações adicionais" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Playlist: 26 min 35 s; duração da aula não informada");
  await page.getByRole("tab", { name: "Fonte", exact: true }).click();
  await expect(page.getByRole("link", { name: /^Parte [1-4] —/ })).toHaveCount(4);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path: testInfo.outputPath("playlist-nicbr.png"), fullPage: true });

  await page.goto(routeUrl("/app/materiais/tecnologia-e-vida-humana"));
  await page.getByRole("tab", { name: "Informações adicionais" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("não é necessário imprimir");
  await page.getByRole("tab", { name: "Fonte", exact: true }).click();
  await expect(page.getByRole("link", { name: "Slides para baixar — PowerPoint (PPTX)", exact: true })).toHaveAttribute("href", /1NQKqK9-AizswnleyTr05Uo_tPdOF4ca3/);
  await expect(page.getByRole("link", { name: /^Atividade para imprimir/ })).toBeVisible();
});

test("retira Pegue o Porco da busca e trata o endereço antigo como material não encontrado", async ({ page }) => {
  await enterDemo(page);
  await expect(page.getByText("48 materiais", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pegue o Porco", exact: true })).toHaveCount(0);
  for (const query of ["Pegue o Porco", "Computação e Eu"]) {
    await page.getByRole("searchbox", { name: "Pesquisar área, assunto ou habilidade" }).fill(query);
    await expect(page.getByText("Nenhum material encontrado")).toBeVisible();
  }
  await page.goto(routeUrl("/app/materiais/pegue-o-porco-computacao-e-eu"));
  await expect(page.getByRole("heading", { name: "Recurso não encontrado" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar para Buscar Materiais" }).click();
  await expect(page.getByText("48 materiais", { exact: true }).first()).toBeVisible();
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
  await expect(page.getByText("Habilidade", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Assunto", { exact: true })).toBeVisible();
  await expect(page.getByText("Cyberbullying", { exact: true })).toBeVisible();
  await expect(page.getByText("Competências", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Habilidades da BNCC", { exact: true })).toBeVisible();
  await expect(page.getByText("EF07CO09", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Reconhecer e debater sobre cyberbullying.", { exact: true }),
  ).toHaveCount(0);
  await page.getByText("Habilidades da BNCC", { exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("habilidades-bncc.png"), fullPage: true });
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
  await expect(page.getByText("Habilidades da BNCC", { exact: true })).toBeVisible();
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
  await expect(page.getByText("Habilidades da BNCC", { exact: true })).toBeVisible();
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
  await expect(page.getByText("Habilidades da BNCC", { exact: true })).toBeVisible();
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
  await expect(page.getByText("Habilidades da BNCC", { exact: true })).toBeVisible();
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
