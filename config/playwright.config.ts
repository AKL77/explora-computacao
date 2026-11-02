import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath, URL } from "node:url";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const useProductionPreview = process.env.PLAYWRIGHT_USE_PREVIEW === "true";
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const port = process.env.PLAYWRIGHT_PORT ?? "4174";

export default defineConfig({
  testDir: fileURLToPath(new URL("../tests/e2e", import.meta.url)),
  testIgnore: "backend.spec.ts",
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `node node_modules/vite/bin/vite.js ${useProductionPreview ? "preview" : ""} --config config/vite.config.ts --port ${port} --strictPort`,
    env: { VITE_APP_MODE: "demo", VITE_BASE_PATH: basePath },
    cwd: projectRoot,
    url: `http://127.0.0.1:${port}${basePath}`,
    reuseExistingServer: process.env.CI !== "true",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
