import { expect, test, type BrowserContext } from "@playwright/test";
import type { Classroom } from "../../src/domain/classroom";

const authKey = "explora:teacher-auth:v1";
async function teacherSession(context: BrowserContext) {
  await context.addInitScript(({ authKey }) => {
    const user = { id: "00000000-0000-4000-8000-000000000001", email: "professor@example.com", aud: "authenticated", role: "authenticated", app_metadata: { provider: "google" }, user_metadata: { full_name: "Professor de Teste" }, created_at: new Date().toISOString() };
    const payload = btoa(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600 }));
    if (!sessionStorage.getItem("fixture-initialized")) {
      sessionStorage.setItem(authKey, JSON.stringify({ access_token: `e30.${payload}.signature`, refresh_token: "fake-refresh", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user }));
      sessionStorage.setItem("fixture-initialized", "true");
    }
    localStorage.setItem("explora:analytics-consent:v1", "denied");
    // Não há importação automática de dados da demonstração.
    localStorage.setItem("explora-computacao:classrooms:v1", JSON.stringify({ version: 1, state: { classrooms: [{ name: "Turma local antiga" }] } }));
  }, { authKey });
}

test("salva online e compartilha com outro computador sem autenticar o aluno", async ({ page, context, browser }, testInfo) => {
  await teacherSession(context);
  let classroom: Classroom | null = null;
  await context.route("https://backend-test.supabase.co/**", async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    if (name === "teacher_workspace") return route.fulfill({ json: { classrooms: classroom ? [classroom] : [], paths: [] } });
    if (name === "save_classroom") {
      const { p_data } = route.request().postDataJSON();
      classroom = { ...p_data, id: "11111111-1111-4111-8111-111111111111", code: "123456", revision: (classroom?.revision ?? 0) + 1, createdAt: "2026-11-02T12:00:00Z" };
      return route.fulfill({ json: classroom });
    }
    if (name === "logout") return route.fulfill({ status: 204 });
    throw new Error(`Consulta inesperada: ${name}`);
  });
  await page.goto("/#/app/minhas-turmas");
  await expect(page.getByRole("heading", { name: "Minhas Turmas", exact: true })).toBeVisible();
  await expect(page.getByText("Turma local antiga")).toHaveCount(0);
  await page.getByRole("button", { name: "Criar turma", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Criar turma", exact: true });
  await form.getByLabel("Nome da turma", { exact: true }).fill("6º Online");
  await form.getByRole("combobox", { name: "Ano/série", exact: true }).selectOption("6");
  await form.getByRole("button", { name: "Criar turma", exact: true }).click();
  await expect(page.getByRole("heading", { name: "6º Online", exact: true })).toBeVisible();
  const classUrl = page.url();
  await page.getByRole("button", { name: "Adicionar material", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "Adicionar materiais", exact: true });
  await picker.getByRole("checkbox", { name: /^Interland/ }).check();
  await picker.getByRole("button", { name: "Adicionar 1 material", exact: true }).click();
  await expect(page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.reload();
  await expect(page.getByRole("heading", { name: "6º Online", exact: true })).toBeVisible();

  const students = await browser.newContext({ baseURL: "http://127.0.0.1:4175/" });
  let publicRequests = 0;
  await students.route("https://backend-test.supabase.co/**", async (route) => {
    expect(route.request().url()).toContain("/functions/v1/student-classroom");
    expect(route.request().headers().authorization).toBeUndefined();
    publicRequests++;
    return route.fulfill({ json: { ...classroom!, materials: classroom!.materials.filter((item) => item.visible) } });
  });
  const student = await students.newPage();
  await student.goto("/#/alunos");
  await student.getByLabel("Código da turma", { exact: true }).fill("123456");
  await student.getByRole("button", { name: "Acessar turma", exact: true }).click();
  await expect(student.getByRole("heading", { name: "6º Online", exact: true })).toBeVisible();
  await expect(student.getByRole("link", { name: /Interland/ })).toHaveAttribute("href", "https://beinternetawesome.withgoogle.com/pt-br_br/interland");
  await page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true }).click();
  await expect(page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true })).toHaveAttribute("aria-checked", "false");
  await student.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(student.getByRole("heading", { name: "Os materiais vão aparecer aqui", exact: true })).toBeVisible();
  expect(publicRequests).toBeGreaterThanOrEqual(2);
  expect(await student.evaluate((key) => sessionStorage.getItem(key), authKey)).toBeNull();
  await student.reload();
  await expect(student.getByLabel("Código da turma", { exact: true })).toHaveValue("");
  await students.close();

  await page.goto(classUrl);
  if (await page.getByRole("button", { name: "Abrir menu" }).isVisible()) await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("button", { name: "Minha conta", exact: true }).click();
  const account = page.getByRole("dialog", { name: "Minha conta", exact: true });
  await expect(account.getByText("Professor de Teste", { exact: true })).toBeVisible();
  await expect(account.getByText("professor@example.com", { exact: true })).toBeVisible();
  await expect(account.getByText("Conectada com Google", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("minha-conta-google.png") });
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(page.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
  expect(await page.evaluate((key) => sessionStorage.getItem(key), authKey)).toBeNull();
});

test("não confirma criação quando o servidor falha", async ({ page, context }) => {
  await teacherSession(context);
  await context.route("https://backend-test.supabase.co/**", async (route) => route.request().url().endsWith("teacher_workspace") ? route.fulfill({ json: { classrooms: [], paths: [] } }) : route.fulfill({ status: 503, json: { message: "unavailable" } }));
  await page.goto("/#/app/minhas-turmas");
  await page.getByRole("button", { name: "Criar turma", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Criar turma", exact: true });
  await form.getByLabel("Nome da turma", { exact: true }).fill("Minha turma");
  await form.getByRole("combobox", { name: "Ano/série", exact: true }).selectOption("6");
  await form.getByRole("button", { name: "Criar turma", exact: true }).click();
  await expect(form.getByRole("alert").filter({ hasText: "Não foi possível criar" })).toBeVisible();
  await expect(form.getByRole("alert").filter({ hasText: "Não foi possível salvar online" })).toBeVisible();
  await expect(form.getByLabel("Nome da turma", { exact: true })).toHaveValue("Minha turma");
  await expect(page.getByRole("heading", { name: "Minha turma", exact: true, level: 1 })).toHaveCount(0);
});
