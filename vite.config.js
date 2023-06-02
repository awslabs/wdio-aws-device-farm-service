/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["html", "json", "lcov"],
      exclude: ["example", "dist"],
    },
    exclude: ["example", "node_modules", "dist"],
  },
});
