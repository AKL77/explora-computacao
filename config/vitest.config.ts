import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root: projectRoot,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: fileURLToPath(new URL("../src/test/setup.ts", import.meta.url)),
    include: ["src/**/*.test.{ts,tsx}"],
    css: true,
  },
});
