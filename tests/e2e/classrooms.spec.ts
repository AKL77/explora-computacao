import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const route = (path: string) => `${basePath}#${path}`;

test.beforeEach(async ({ page }) => {
  await page.goto(basePath);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("explora:analytics-consent:v1", "denied"); });
  await page.reload();
});

async function enterTeacher(page: Page) {
  await page.getByRole("link", { name: "Área do professor", exact: true }).first().click();
  await page.goto(route("/app/minhas-turmas"));
}

async function createClassroom(page: Page, name = "6º B") {
  await page.getByRole("button", { name: "Criar turma", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Criar turma", exact: true });
  await form.getByRole("textbox", { name: "Nome da turma", exact: true }).fill(name);
  await form.getByRole("combobox", { name: "Ano/série", exact: true }).selectOption("6");
  await form.getByLabel("Escola (opcional)", { exact: true }).fill("Escola Exemplo");
  await expect(form.getByText(/turno/i)).toHaveCount(0);
  await form.getByRole("button", { name: "Criar turma", exact: true }).click();
  await expect(page.getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
}

async function getCode(page: Page, screenshotPath?: string) {
  await page.getByRole("button", { name: "Mostrar código", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: /^Código de/ });
  const code = (await dialog.getByLabel("Código da turma", { exact: true }).textContent())!.replace(/\s/g, "");
  expect(code).toMatch(/^\d{6}$/);
  await expect(dialog.getByLabel("Endereço de acesso dos alunos")).toHaveValue(/#\/alunos$/);
  if (screenshotPath) await page.screenshot({ path: screenshotPath });
  await dialog.getByRole("button", { name: "Fechar diálogo" }).click();
  return code;
}

async function studentEnter(page: Page, code: string) {
  await page.goto(route("/alunos"));
  await page.getByRole("textbox", { name: "Código da turma", exact: true }).fill(code);
  await page.getByRole("button", { name: "Acessar turma", exact: true }).click();
}

test("professor publica e organiza materiais; aluno acessa sem login e acompanha a visibilidade", async ({ page, context }, testInfo) => {
  await enterTeacher(page);
  await createClassroom(page);
  const classroomUrl = page.url();
  const code = await getCode(page, testInfo.outputPath("codigo-turma.png"));
  await page.getByRole("button", { name: "Adicionar material", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Adicionar materiais", exact: true });
  await picker.getByRole("checkbox", { name: /^Interland/ }).check();
  await picker.getByRole("checkbox", { name: /^Compute It/ }).check();
  await picker.getByRole("button", { name: "Adicionar 2 materiais", exact: true }).click();
  await expect(page.getByRole("switch")).toHaveCount(2);
  await expect(page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Mover Compute It para cima", exact: true }).click();
  await page.getByRole("button", { name: "Editar orientação de Interland", exact: true }).click();
  await page.getByRole("textbox", { name: "Orientação (opcional)" }).fill("Em duplas, explorem os desafios.");
  await page.getByRole("button", { name: "Salvar orientação", exact: true }).click();
  await expect(page.getByText("Em duplas, explorem os desafios.", { exact: true })).toBeVisible();
  await expect(page.getByRole("listitem").first()).toContainText("Compute It");
  await page.reload();
  await expect(page.getByRole("heading", { name: "6º B", exact: true })).toBeVisible();
  expect(await getCode(page)).toBe(code);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("minhas-turmas-professor.png"), fullPage: true });

  const student = await context.newPage();
  await studentEnter(student, code);
  await expect(student.getByRole("heading", { name: "6º B", exact: true })).toBeVisible();
  await expect(student.getByRole("link", { name: /Minhas Turmas/ })).toHaveCount(0);
  await expect(student.getByRole("link", { name: /Interland/ })).toHaveAttribute("href", "https://beinternetawesome.withgoogle.com/pt-br_br/interland");
  await expect(student.getByRole("link", { name: /Interland/ })).toHaveAttribute("target", "_blank");
  await expect(student.getByRole("listitem").first()).toContainText("Compute It");
  await expect(student.getByText("Em duplas, explorem os desafios.", { exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page: student }).analyze()).violations).toEqual([]);
  await student.screenshot({ path: testInfo.outputPath("turma-aluno.png"), fullPage: true });
  expect(await student.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true }).click();
  await expect(student.getByRole("link", { name: /Interland/ })).toHaveCount(0);
  await page.getByRole("switch", { name: "Visível para alunos: Compute It", exact: true }).click();
  await expect(student.getByRole("heading", { name: "Os materiais vão aparecer aqui", exact: true })).toBeVisible();
  await student.reload();
  await expect(student.getByRole("textbox", { name: "Código da turma", exact: true })).toHaveValue("");
  await expect(student.getByRole("heading", { name: "6º B", exact: true })).toHaveCount(0);
  await studentEnter(student, code);
  await student.getByRole("button", { name: "Trocar turma", exact: true }).click();
  await expect(student.getByRole("textbox", { name: "Código da turma", exact: true })).toHaveValue("");
  await studentEnter(student, code);

  await page.goto(classroomUrl);
  await page.getByRole("button", { name: "Arquivar", exact: true }).click();
  await page.getByRole("dialog", { name: "Arquivar turma?", exact: true }).getByRole("button", { name: "Arquivar turma", exact: true }).click();
  await expect(page.getByRole("button", { name: "Desarquivar turma", exact: true })).toBeVisible();
  await expect(student.getByRole("heading", { name: "Turma indisponível", exact: true })).toBeVisible();
  await studentEnter(student, code);
  await expect(student.getByRole("alert")).toContainText("Turma indisponível");
  await page.goto(route("/app/minhas-turmas"));
  const archivedTab = page.getByRole("tab", { name: "Arquivadas (1)", exact: true });
  await archivedTab.click();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Ativas (0)", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(archivedTab).toHaveAttribute("aria-selected", "true");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo({ top: 0, behavior: "instant" }); });
  await page.screenshot({ path: testInfo.outputPath("minhas-turmas-lista.png"), fullPage: true, animations: "disabled" });
  await page.getByRole("link", { name: /6º B/ }).click();
  await expect(page.getByRole("button", { name: "Editar turma", exact: true })).toHaveCount(0);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo({ top: 0, behavior: "instant" }); });
  await page.screenshot({ path: testInfo.outputPath("turma-arquivada.png"), fullPage: true, animations: "disabled" });
  const restore = page.getByRole("button", { name: "Desarquivar turma", exact: true });
  await restore.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Editar turma", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Arquivar", exact: true })).toBeFocused();
  await expect(page.getByRole("switch")).toHaveCount(2);
  await expect(page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true })).toHaveAttribute("aria-checked", "false");
  await expect(page.getByText("Em duplas, explorem os desafios.", { exact: true })).toBeVisible();
  expect(await getCode(page)).toBe(code);
  await page.reload();
  await expect(page.getByRole("button", { name: "Desarquivar turma", exact: true })).toHaveCount(0);
  await studentEnter(student, code);
  await expect(student.getByRole("heading", { name: "6º B", exact: true })).toBeVisible();
  await expect(student.getByRole("link", { name: /Interland/ })).toHaveCount(0);
  await page.getByRole("switch", { name: "Visível para alunos: Compute It", exact: true }).click();
  await expect(student.getByRole("link", { name: /Compute It/ })).toBeVisible();
  await page.goto(route("/app/minhas-turmas"));
  await expect(page.getByRole("tab", { name: "Ativas (1)", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: "Arquivadas (0)", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /6º B/ }).click();
  await page.getByRole("button", { name: "Excluir turma", exact: true }).click();
  await page.getByRole("dialog", { name: "Excluir turma?", exact: true }).getByRole("button", { name: "Excluir turma", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Minhas Turmas", exact: true, level: 1 })).toBeVisible();
  await page.goto(classroomUrl);
  await expect(page.getByRole("heading", { name: "Turma não encontrada", exact: true })).toBeVisible();
});

test("adiciona pela ficha do material, permite criar a primeira turma e evita duplicar ou republicar", async ({ page }) => {
  await enterTeacher(page);
  await page.goto(route("/app/materiais/interland"));
  await page.getByRole("button", { name: "Adicionar à turma", exact: true }).click();
  await page.getByRole("dialog", { name: "Adicionar à turma", exact: true }).getByRole("button", { name: "Criar turma", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Criar turma", exact: true });
  await form.getByLabel("Nome da turma", { exact: true }).fill("6º A");
  await form.getByRole("combobox", { name: "Ano/série", exact: true }).selectOption("6");
  await form.getByRole("button", { name: "Criar turma", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("O material já está visível");
  await page.goto(route("/app/minhas-turmas"));
  await page.getByRole("link", { name: /6º A/ }).click();
  const classroomUrl = page.url();
  await expect(page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true }).click();
  const code = await getCode(page);
  await page.goto(route("/app/materiais/interland"));
  await page.getByRole("button", { name: "Adicionar à turma", exact: true }).click();
  const pickClass = page.getByRole("dialog", { name: "Adicionar à turma", exact: true });
  await expect(pickClass.getByRole("radio", { name: /6º A/ })).toBeDisabled();
  await expect(pickClass.getByRole("button", { name: "Adicionar material", exact: true })).toBeDisabled();
  await pickClass.getByRole("button", { name: "Cancelar", exact: true }).click();
  await page.goto(route("/app/materiais/compute-it"));
  await page.getByRole("button", { name: "Adicionar à turma", exact: true }).click();
  await page.getByRole("radio", { name: /6º A/ }).check();
  await page.getByRole("dialog", { name: "Adicionar à turma", exact: true }).getByRole("button", { name: "Adicionar material", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Material adicionado à turma 6º A");
  await studentEnter(page, code);
  await expect(page.getByRole("link", { name: /Compute It/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Interland/ })).toHaveCount(0);
  await page.goto(classroomUrl);
  const remove = page.getByRole("button", { name: "Remover Compute It da turma", exact: true });
  await remove.click();
  const confirmation = page.getByRole("dialog", { name: "Remover material da turma?", exact: true });
  await expect(confirmation).toContainText("Compute It");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await confirmation.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(remove).toBeFocused();
  await remove.click();
  await confirmation.getByRole("button", { name: "Remover material", exact: true }).click();
  await expect(confirmation).toHaveCount(0);
  await expect(remove).toHaveCount(0);
  await studentEnter(page, code);
  await expect(page.getByRole("link", { name: /Compute It/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Interland/ })).toHaveCount(0);
});

test("entrada pública pede código mesmo com sessão docente e não autentica alunos", async ({ page }, testInfo) => {
  await page.getByRole("link", { name: "Acessar turma", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Acessar turma", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Acessar turma", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("6 números");
  await page.getByRole("textbox", { name: "Código da turma", exact: true }).fill("000000");
  await page.getByRole("button", { name: "Acessar turma", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Turma indisponível");
  const session = await page.evaluate(() => localStorage.getItem("explora-computacao:session:v1"));
  expect(session === null || !JSON.parse(session).state.isAuthenticated).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("acessar-turma.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.goto(route("/app/minhas-turmas"));
  await expect(page.getByRole("heading", { name: "Explore. Planeje. Ensine.", exact: true })).toBeVisible();
  await enterTeacher(page);
  await page.goto(route("/alunos"));
  await expect(page.getByRole("heading", { name: "Acessar turma", exact: true })).toBeVisible();
});
