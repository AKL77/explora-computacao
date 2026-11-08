import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const route = (path: string) => `${basePath}#${path}`;
const pathId = "33333333-3333-4333-8333-333333333333";

test.beforeEach(async ({ page }) => {
  await page.goto(basePath);
  await page.evaluate(({ pathId }) => {
    localStorage.clear();
    localStorage.setItem("explora:analytics-consent:v1", "denied");
    localStorage.setItem("explora-computacao:session:v1", JSON.stringify({ version: 1, state: { isAuthenticated: true } }));
    const source = { id: pathId, name: "Algoritmos em ação", objective: "Comparar algoritmos.", icon: "puzzle", backgroundColor: "amber", resourceIds: ["lightbot-web", "google-blockly-games"], lessonCountsByResourceId: { "lightbot-web": 1, "google-blockly-games": 2 }, createdAt: "2026-11-08T12:00:00Z", updatedAt: "2026-11-08T12:00:00Z" };
    localStorage.setItem("explora-computacao:teaching-paths:v1", JSON.stringify({ version: 2, state: { schemaVersion: 2, paths: [source] } }));
    const classroom = { id: "11111111-1111-4111-8111-111111111111", name: "6º B", grade: 6, school: "Escola Exemplo", schoolYear: 2026, color: "blue", code: "123456", archived: false, materials: [{ resourceId: "google-interland", visible: true, instruction: "" }], createdAt: "2026-11-08T12:00:00Z" };
    localStorage.setItem("explora-computacao:classrooms:v1", JSON.stringify({ version: 1, state: { classrooms: [classroom], retiredCodes: [] } }));
  }, { pathId });
  await page.reload();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route("/app/minhas-turmas/11111111-1111-4111-8111-111111111111"));
  await expect(page.getByRole("heading", { name: "6º B", level: 1 })).toBeVisible();
});

async function enterStudent(page: Page) {
  await page.goto(route("/alunos"));
  await page.getByRole("textbox", { name: "Código da turma", exact: true }).fill("123456");
  await page.getByRole("button", { name: "Acessar turma", exact: true }).click();
  await expect(page.getByRole("heading", { name: "6º B", exact: true })).toBeVisible();
}

test("compartilha uma cópia, mantém etapas em ordem e controla sua visibilidade para os alunos", async ({ page, context }, testInfo) => {
  await page.getByRole("button", { name: "Compartilhar trilha", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Compartilhar trilha", exact: true });
  await picker.getByRole("radio", { name: /Algoritmos em ação/ }).check();
  await picker.getByRole("button", { name: "Compartilhar trilha", exact: true }).click();
  const card = page.getByRole("article", { name: "Trilha Algoritmos em ação", exact: true });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Ver etapas", exact: true }).click();
  await expect(card.getByRole("listitem").nth(0)).toContainText("Lightbot");
  await expect(card.getByRole("listitem").nth(1)).toContainText("Blockly Games");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("trilha-compartilhada-professor.png"), fullPage: true, animations: "disabled" });
  await page.getByRole("button", { name: "Compartilhar trilha", exact: true }).click();
  await expect(picker.getByRole("radio", { name: /Algoritmos em ação/ })).toBeDisabled();
  await picker.getByRole("button", { name: "Cancelar", exact: true }).click();

  const student = await context.newPage();
  await student.emulateMedia({ reducedMotion: "reduce" });
  await enterStudent(student);
  const publicCard = student.getByRole("article", { name: "Trilha Algoritmos em ação", exact: true });
  await expect(publicCard).toBeVisible();
  await publicCard.getByRole("button", { name: "Ver etapas", exact: true }).click();
  await expect(publicCard.getByRole("link").nth(0)).toHaveAttribute("href", "https://www.lightbot.lu/#/welcome");
  await expect(publicCard.getByRole("link").nth(1)).toHaveAttribute("href", "https://blockly.games/?lang=pt-br");
  await expect(publicCard.getByRole("link").nth(0)).toHaveAttribute("target", "_blank");
  await expect(publicCard.getByRole("switch")).toHaveCount(0);
  await expect(student.getByRole("link", { name: /Interland/ })).toBeVisible();
  expect((await new AxeBuilder({ page: student }).analyze()).violations).toEqual([]);
  expect(await student.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await student.screenshot({ path: testInfo.outputPath("trilha-compartilhada-aluno.png"), fullPage: true, animations: "disabled" });

  const visibility = card.getByRole("switch", { name: "Visível para alunos: trilha Algoritmos em ação", exact: true });
  await visibility.click();
  await expect(publicCard).toHaveCount(0);
  await visibility.click();
  await expect(publicCard).toBeVisible();
  await student.reload();
  await expect(student.getByRole("textbox", { name: "Código da turma", exact: true })).toHaveValue("");
  await enterStudent(student);
  await expect(publicCard).toBeVisible();

  await page.goto(route("/app/minhas-trilhas"));
  await page.getByRole("button", { name: /Algoritmos em ação/ }).click();
  await page.getByRole("button", { name: "Editar trilha", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "Editar trilha", exact: true });
  await settings.getByRole("textbox", { name: "Nome da trilha", exact: true }).fill("Algoritmos revisados");
  await settings.getByRole("button", { name: "Aplicar ao rascunho", exact: true }).click();
  await expect(page.getByRole("button", { name: "Compartilhar com turma", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Salvar alterações", exact: true }).click();
  await expect(publicCard).toBeVisible();
  await page.goto(route("/app/minhas-turmas/11111111-1111-4111-8111-111111111111"));
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Atualizar cópia", exact: true }).click();
  await expect(student.getByRole("article", { name: "Trilha Algoritmos revisados", exact: true })).toBeVisible();
});

test("compartilha por Minhas Trilhas e preserva a cópia após excluir a original e reabrir a turma", async ({ page, context }) => {
  await page.goto(route("/app/minhas-trilhas"));
  await page.getByRole("button", { name: /Algoritmos em ação/ }).click();
  await page.getByRole("button", { name: "Compartilhar com turma", exact: true }).click();
  const share = page.getByRole("dialog", { name: "Compartilhar com turma", exact: true });
  await share.getByRole("radio", { name: /6º B/ }).check();
  await share.getByRole("button", { name: "Compartilhar trilha", exact: true }).click();
  await expect(share).not.toBeVisible();
  await page.getByRole("button", { name: "Excluir trilha", exact: true }).click();
  await page.getByRole("dialog", { name: "Excluir trilha", exact: true }).getByRole("button", { name: "Excluir trilha", exact: true }).click();
  await page.goto(route("/app/minhas-turmas/11111111-1111-4111-8111-111111111111"));
  const card = page.getByRole("article", { name: "Trilha Algoritmos em ação", exact: true });
  await expect(card).toBeVisible();
  await expect(card.getByRole("button", { name: "Atualizar cópia", exact: true })).toHaveCount(0);
  const student = await context.newPage();
  await enterStudent(student);
  await page.getByRole("button", { name: "Arquivar", exact: true }).click();
  await page.getByRole("dialog", { name: "Arquivar turma?", exact: true }).getByRole("button", { name: "Arquivar turma", exact: true }).click();
  await expect(student.getByRole("heading", { name: "Turma indisponível", exact: true })).toBeVisible();
  await expect(card.getByRole("switch")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "Desarquivar turma", exact: true }).click();
  await enterStudent(student);
  await expect(student.getByRole("article", { name: "Trilha Algoritmos em ação", exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Remover trilha Algoritmos em ação da turma", exact: true }).click();
  const removal = page.getByRole("dialog", { name: "Remover trilha da turma?", exact: true });
  await expect(student.getByRole("article", { name: "Trilha Algoritmos em ação", exact: true })).toBeVisible();
  await removal.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Remover trilha Algoritmos em ação da turma", exact: true }).click();
  await removal.getByRole("button", { name: "Remover trilha", exact: true }).click();
  await expect(student.getByRole("article", { name: "Trilha Algoritmos em ação", exact: true })).toHaveCount(0);
  await expect(student.getByRole("link", { name: /Interland/ })).toBeVisible();
});
