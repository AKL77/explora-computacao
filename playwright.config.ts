import { defineConfig, devices } from "@playwright/test";

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? "/";
const useProductionPreview = process.env.PLAYWRIGHT_USE_PREVIEW === "true";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:4173${basePath}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: useProductionPreview ? "pnpm preview" : "pnpm dev",
    url: `http://127.0.0.1:4173${basePath}`,
    reuseExistingServer: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
