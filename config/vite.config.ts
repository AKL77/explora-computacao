import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH ?? "/";

  if (!base.startsWith("/") || !base.endsWith("/")) {
    throw new Error("VITE_BASE_PATH deve começar e terminar com '/'.");
  }

  return {
    base,
    root: projectRoot,
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../src", import.meta.url)),
      },
    },
    server: {
      host: "127.0.0.1",
      port: 4173,
    },
    preview: {
      host: "127.0.0.1",
      port: 4173,
    },
  };
});
