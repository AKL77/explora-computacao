import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
import { fileURLToPath } from "node:url";

export default defineConfig(base, {
  testMatch: "backend.spec.ts",
  testIgnore: [],
  use: { baseURL: "http://127.0.0.1:4175/" },
  webServer: {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    command: "node node_modules/vite/bin/vite.js --config config/vite.config.ts --port 4175 --strictPort",
    url: "http://127.0.0.1:4175/",
    reuseExistingServer: false,
    env: { VITE_BASE_PATH: "/", VITE_APP_MODE: "supabase", VITE_SUPABASE_URL: "https://backend-test.supabase.co", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" },
  },
});
