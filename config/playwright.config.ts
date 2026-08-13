import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath, URL } from "node:url";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const useProductionPreview = process.env.PLAYWRIGHT_USE_PREVIEW === "true";
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  testDir: fileURLToPath(new URL("../tests/e2e", import.meta.url)),
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:4173${basePath}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: useProductionPreview ? "pnpm preview" : "pnpm dev",
    cwd: projectRoot,
    url: `http://127.0.0.1:4173${basePath}`,
    reuseExistingServer: process.env.CI !== "true",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
