import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // automatically open the app in the browser
    port: 3000, // keep the port 3000 to match CRA
  },
  build: {
    outDir: "build", // CRA outputs to 'build', Vite defaults to 'dist'. Keep 'build' for consistency.
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "lcov"],
      thresholds: {
        branches: 60,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
