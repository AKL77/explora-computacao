import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext } from "@playwright/test";
import type { Classroom } from "../../src/domain/classroom";
import type { SavedTeachingPath } from "../../src/domain/savedTeachingPath";

const authKey = "explora:teacher-auth:v1";
const rememberKey = "explora:remember-device:v1";

for (const remember of [false, true]) {
  test(`login ${remember ? "lembrado" : "restrito à aba"}: retorno do Google, reabertura e saída`, async ({ page, context, browser }, testInfo) => {
    let exchanges = 0;
    let refreshes = 0;
    let logouts = 0;
    const user = { id: "00000000-0000-4000-8000-000000000001", email: "professor@example.com", aud: "authenticated", role: "authenticated", app_metadata: { provider: "google" }, user_metadata: { full_name: "Professor de Teste" }, created_at: new Date().toISOString() };
    const makeSession = (revision: number) => {
      const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, revision })).toString("base64url");
      return { access_token: `e30.${payload}.signature`, refresh_token: `refresh-${revision}`, token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user };
    };
    const mockAuth = async (target: BrowserContext) => {
      await target.route("https://backend-test.supabase.co/**", async (route) => {
        const url = new URL(route.request().url());
        const name = url.pathname.split("/").pop();
        if (name === "authorize") {
          expect(url.searchParams.get("provider")).toBe("google");
          expect(url.searchParams.get("code_challenge_method")).toBe("s256");
          return route.fulfill({ status: 302, headers: { location: "http://127.0.0.1:4175/?code=test-auth-code" } });
        }
        if (name === "token") {
          const args = route.request().postDataJSON();
          if (url.searchParams.get("grant_type") === "pkce") {
            exchanges++;
            expect(args.auth_code).toBe("test-auth-code");
            expect(args.code_verifier).toEqual(expect.any(String));
            expect(args.code_verifier.length).toBeGreaterThan(20);
            return route.fulfill({ json: makeSession(1) });
          }
          expect(url.searchParams.get("grant_type")).toBe("refresh_token");
          expect(args.refresh_token).toBe("refresh-1");
          refreshes++;
          return route.fulfill({ json: makeSession(2) });
        }
        if (name === "teacher_workspace") {
          expect(route.request().headers().authorization).toMatch(/^Bearer e30\./);
          return route.fulfill({ json: { classrooms: [], paths: [] } });
        }
        if (name === "logout") {
          expect(route.request().headers().authorization).toMatch(/^Bearer e30\./);
          logouts++;
          return route.fulfill({ status: 204 });
        }
        throw new Error(`Consulta inesperada: ${name}`);
      });
    };
    await context.addInitScript(() => localStorage.setItem("explora:analytics-consent:v1", "denied"));
    await mockAuth(context);
    await page.goto("/#/entrar");
    const checkbox = page.getByRole("checkbox", { name: "Manter conectado neste dispositivo", exact: true });
    await expect(checkbox).not.toBeChecked();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await checkbox.setChecked(remember);
    await page.screenshot({ path: testInfo.outputPath("manter-conectado-login.png"), fullPage: true });
    const independent = await context.newPage();
    // A sessão persistente também deve se propagar pelo armazenamento do navegador.
    await independent.addInitScript(() => Object.defineProperty(window, "BroadcastChannel", { value: undefined }));
    await independent.goto("/#/entrar");
    await expect(independent.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
    await page.bringToFront();
    await page.getByRole("button", { name: "Entrar com Google", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Buscar Materiais", exact: true })).toBeVisible();
    expect(exchanges).toBe(1);
    expect(await page.evaluate((key) => Boolean(localStorage.getItem(key)), authKey)).toBe(remember);
    expect(await page.evaluate((key) => Boolean(sessionStorage.getItem(key)), authKey)).toBe(!remember);
    await independent.bringToFront();
    if (!remember) await expect(independent.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
    else await expect(independent.getByRole("heading", { name: "Buscar Materiais", exact: true })).toBeVisible();
    await page.bringToFront();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Buscar Materiais", exact: true })).toBeVisible();
    const state = await context.storageState();
    await context.close();

    // Uma nova janela só recebe o armazenamento persistente, como após reabrir o navegador.
    if (remember) {
      const entry = state.origins.flatMap((origin) => origin.localStorage).find((item) => item.name === authKey)!;
      const session = JSON.parse(entry.value);
      session.expires_at = Math.floor(Date.now() / 1000) - 60;
      entry.value = JSON.stringify(session);
    }
    const reopened = await browser.newContext({ baseURL: "http://127.0.0.1:4175/", viewport: testInfo.project.use.viewport, storageState: state });
    try {
      await mockAuth(reopened);
      const resumed = await reopened.newPage();
      await resumed.goto("/#/app/minhas-turmas");
      if (!remember) {
        await expect(resumed.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
        await expect(resumed.getByRole("checkbox", { name: "Manter conectado neste dispositivo", exact: true })).not.toBeChecked();
        expect(refreshes).toBe(0);
        return;
      }
      await expect(resumed.getByRole("heading", { name: "Minhas Turmas", exact: true })).toBeVisible();
      expect(refreshes).toBe(1);
      expect(await resumed.evaluate((key) => JSON.parse(localStorage.getItem(key)!).refresh_token, authKey)).toBe("refresh-2");
      const otherTab = await reopened.newPage();
      await otherTab.goto("/#/app/minhas-trilhas");
      await expect(otherTab.getByRole("heading", { name: "Minhas Trilhas", exact: true })).toBeVisible();
      if (await resumed.getByRole("button", { name: "Abrir menu", exact: true }).isVisible()) await resumed.getByRole("button", { name: "Abrir menu", exact: true }).click();
      await resumed.getByRole("button", { name: "Minha conta", exact: true }).click();
      await resumed.getByRole("button", { name: "Sair", exact: true }).click();
      await expect(resumed.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
      await expect(otherTab.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
      expect(logouts).toBe(1);
      expect(await resumed.evaluate((key) => localStorage.getItem(key), authKey)).toBeNull();
      expect(await resumed.evaluate((key) => sessionStorage.getItem(key), authKey)).toBeNull();
      expect(await resumed.evaluate((key) => localStorage.getItem(key), rememberKey)).toBe("true");
      await resumed.reload();
      await expect(resumed.getByRole("button", { name: "Entrar com Google", exact: true })).toBeVisible();
    } finally { await reopened.close(); }
  });
}

test("confirma o compartilhamento de uma trilha somente após o servidor e entrega uma cópia pública", async ({ page, context }) => {
  await teacherSession(context);
  const path: SavedTeachingPath = { id: "33333333-3333-4333-8333-333333333333", revision: 3, name: "Algoritmos online", objective: "Objetivo reservado ao professor", backgroundColor: "amber", icon: "puzzle", resourceIds: ["lightbot-web", "google-blockly-games"], lessonCountsByResourceId: { "lightbot-web": 2 }, createdAt: "2026-11-08T12:00:00Z", updatedAt: "2026-11-08T12:30:00Z" };
  let classroom: Classroom = { id: "11111111-1111-4111-8111-111111111111", name: "6º Online", grade: 6, school: "", schoolYear: 2026, color: "blue", code: "123456", archived: false, materials: [], sharedPaths: [], revision: 1, createdAt: "2026-11-08T12:00:00Z" };
  let attempts = 0;
  let releaseFirst = () => {};
  const firstReply = new Promise<void>((resolve) => { releaseFirst = resolve; });
  await context.route("https://backend-test.supabase.co/**", async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    if (name === "teacher_workspace") return route.fulfill({ json: { classrooms: [classroom], paths: [path] } });
    if (name === "change_classroom_teaching_path") {
      const args = route.request().postDataJSON();
      expect(args.p_classroom_id).toBe(classroom.id);
      expect(args.p_path_id).toBe(path.id);
      expect(args.p_revision).toBe(classroom.revision);
      if (args.p_action === "share") {
        expect(args.p_path_revision).toBe(3);
        attempts++;
        if (attempts === 1) { await firstReply; return route.fulfill({ status: 503, json: { message: "unavailable" } }); }
        classroom = { ...classroom, revision: 2, sharedPaths: [{ id: path.id, name: path.name, objective: path.objective, backgroundColor: path.backgroundColor, icon: path.icon, resourceIds: [...path.resourceIds], lessonCountsByResourceId: { ...path.lessonCountsByResourceId }, visible: true, sourceRevision: 3, sourceUpdatedAt: path.updatedAt, sharedAt: "2026-11-08T13:00:00Z" }] };
      } else if (args.p_action === "visibility") {
        classroom = { ...classroom, revision: classroom.revision! + 1, sharedPaths: classroom.sharedPaths!.map((copy) => ({ ...copy, visible: args.p_visible })) };
      } else throw new Error(`Ação inesperada: ${args.p_action}`);
      return route.fulfill({ json: classroom });
    }
    if (name === "student-classroom") return route.fulfill({ json: {
      ...classroom, revision: undefined,
      sharedPaths: classroom.sharedPaths!.filter((copy) => copy.visible).map(({ id, name, icon, backgroundColor, resourceIds, visible }) => ({ id, name, icon, backgroundColor, resourceIds, visible })),
    } });
    throw new Error(`Consulta inesperada: ${name}`);
  });
  await page.goto(`/#/app/minhas-turmas/${classroom.id}`);
  await page.getByRole("button", { name: "Adicionar trilha", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Adicionar trilha", exact: true });
  await dialog.getByRole("radio", { name: /Algoritmos online/ }).check();
  const request = page.waitForRequest((request) => request.url().endsWith("change_classroom_teaching_path"));
  try {
    await dialog.getByRole("button", { name: "Adicionar trilha", exact: true }).click();
    await request;
    await expect(page.getByRole("article", { name: "Trilha Algoritmos online", exact: true })).toHaveCount(0);
    expect(classroom.sharedPaths).toHaveLength(0);
  } finally { releaseFirst(); }
  await expect(dialog.getByRole("alert").filter({ hasText: "Não foi possível confirmar a ação online" })).toBeVisible();
  await dialog.getByRole("button", { name: "Adicionar trilha", exact: true }).click();
  await expect(page.getByRole("article", { name: "Trilha Algoritmos online", exact: true })).toBeVisible();
  const student = await context.newPage();
  await student.goto("/#/alunos");
  await student.getByLabel("Código da turma", { exact: true }).fill("123456");
  await student.getByRole("button", { name: "Acessar turma", exact: true }).click();
  const publicCard = student.getByRole("article", { name: "Trilha Algoritmos online", exact: true });
  await expect(publicCard).toBeVisible();
  await publicCard.getByRole("button", { name: "Ver etapas", exact: true }).click();
  await expect(publicCard.getByRole("link").first()).toHaveAttribute("href", "https://www.lightbot.lu/#/welcome");
  await expect(student.getByText(path.objective, { exact: true })).toHaveCount(0);
  await page.getByRole("switch", { name: "Visível para alunos: trilha Algoritmos online", exact: true }).click();
  await student.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(publicCard).toHaveCount(0);
  await expect(student.getByRole("heading", { name: "Os materiais vão aparecer aqui", exact: true })).toBeVisible();
  expect(attempts).toBe(2);
});

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
    if (name === "unarchive_classroom") {
      const { p_id, p_revision } = route.request().postDataJSON();
      expect(classroom?.archived).toBe(true);
      expect(p_id).toBe(classroom!.id);
      expect(p_revision).toBe(classroom!.revision);
      classroom = { ...classroom!, archived: false, revision: classroom!.revision! + 1 };
      return route.fulfill({ json: classroom });
    }
    if (name === "logout") return route.fulfill({ status: 204 });
    throw new Error(`Consulta inesperada: ${name}`);
  });
  await page.goto("/#/app/minhas-turmas");
  await expect(page.getByRole("heading", { name: "Minhas Turmas", exact: true })).toBeVisible();
  await expect(page.getByText("Seu espaço online", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Atualizar dados", exact: true })).toHaveCount(0);
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
    if (classroom?.archived) return route.fulfill({ status: 404, json: { error: "not_found" } });
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
  await page.getByRole("button", { name: "Arquivar", exact: true }).click();
  await page.getByRole("dialog", { name: "Arquivar turma?", exact: true }).getByRole("button", { name: "Arquivar turma", exact: true }).click();
  await expect(page.getByRole("button", { name: "Desarquivar turma", exact: true })).toBeVisible();
  await student.getByLabel("Código da turma", { exact: true }).fill("123456");
  await student.getByRole("button", { name: "Acessar turma", exact: true }).click();
  await expect(student.getByRole("alert")).toContainText("Turma indisponível");
  await page.reload();
  await page.getByRole("button", { name: "Desarquivar turma", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editar turma", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("switch", { name: "Visível para alunos: Interland", exact: true })).toHaveAttribute("aria-checked", "false");
  await student.getByRole("button", { name: "Acessar turma", exact: true }).click();
  await expect(student.getByRole("heading", { name: "6º Online", exact: true })).toBeVisible();
  await expect(student.getByRole("link", { name: /Interland/ })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("turma-desarquivada-online.png"), fullPage: true });
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

test("mantém a turma arquivada quando o servidor recusa o desarquivamento", async ({ page, context }) => {
  await teacherSession(context);
  const classroom: Classroom = { id: "11111111-1111-4111-8111-111111111111", name: "6º Arquivada", grade: 6, school: "", schoolYear: 2026, color: "blue", code: "123456", archived: true, revision: 7, materials: [], createdAt: "2026-11-02T12:00:00Z" };
  let attempts = 0;
  await context.route("https://backend-test.supabase.co/**", async (route) => {
    if (route.request().url().endsWith("teacher_workspace")) return route.fulfill({ json: { classrooms: [classroom], paths: [] } });
    expect(route.request().url()).toContain("unarchive_classroom");
    attempts++;
    return route.fulfill({ status: 503, json: { message: "unavailable" } });
  });
  await page.goto(`/#/app/minhas-turmas/${classroom.id}`);
  await page.getByRole("button", { name: "Desarquivar turma", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Não foi possível confirmar a ação online");
  await expect(page.getByRole("button", { name: "Mostrar código", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Desarquivar turma", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Editar turma", exact: true })).toHaveCount(0);
  await expect(page.getByText("Turma desarquivada.", { exact: true })).toHaveCount(0);
  expect(attempts).toBe(1);
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
  await expect(form.getByRole("alert").filter({ hasText: "Não foi possível confirmar a ação online" })).toBeVisible();
  await expect(form.getByLabel("Nome da turma", { exact: true })).toHaveValue("Minha turma");
  await expect(page.getByRole("heading", { name: "Minha turma", exact: true, level: 1 })).toHaveCount(0);
});

test("exclui trilha online somente após confirmação do servidor e preserva as demais", async ({ page, context }) => {
  await teacherSession(context);
  const target: SavedTeachingPath = {
    id: "33333333-3333-4333-8333-333333333333", name: "Minha trilha descartável", objective: "Explorar programação.",
    backgroundColor: "blue", icon: "route", resourceIds: ["google-blockly-games"], lessonCountsByResourceId: {},
    createdAt: "2026-11-03T12:00:00Z", updatedAt: "2026-11-03T12:00:00Z", revision: 3,
  };
  const preserved = { ...target, id: "44444444-4444-4444-8444-444444444444", name: "Trilha preservada" };
  let paths = [target, preserved];
  let attempts = 0;
  await context.route("https://backend-test.supabase.co/**", async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    if (name === "teacher_workspace") return route.fulfill({ json: { classrooms: [], paths } });
    if (name === "delete_teaching_path") {
      expect(route.request().postDataJSON()).toEqual({ p_id: target.id, p_revision: 3 });
      attempts++;
      if (attempts === 1) return route.fulfill({ status: 503, json: { message: "unavailable" } });
      paths = paths.filter((path) => path.id !== target.id);
      return route.fulfill({ json: true });
    }
    throw new Error(`Consulta inesperada: ${name}`);
  });
  await page.goto("/#/app/minhas-trilhas");
  await page.getByRole("button", { name: /Minha trilha descartável/ }).click();
  await page.getByRole("button", { name: "Excluir trilha", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Excluir trilha", exact: true });
  await dialog.getByRole("button", { name: "Cancelar" }).click();
  expect(attempts).toBe(0);
  await page.getByRole("button", { name: "Excluir trilha", exact: true }).click();
  await dialog.getByRole("button", { name: "Excluir trilha", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Não foi possível confirmar a ação online");
  await expect(page.getByRole("heading", { name: target.name, exact: true, level: 2 })).toBeVisible();
  expect(paths).toHaveLength(2);
  await dialog.getByRole("button", { name: "Excluir trilha", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Minhas Trilhas", exact: true, level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /Minha trilha descartável/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Trilha preservada/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: /Minha trilha descartável/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Trilha preservada/ })).toBeVisible();
  expect(attempts).toBe(2);
});
