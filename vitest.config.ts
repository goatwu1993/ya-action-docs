import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // ← THIS enables describe/test/expect as globals
    environment: "node", // or 'jsdom' if you need a browser-like DOM
  },
});
