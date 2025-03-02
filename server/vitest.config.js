import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    include: ["__tests__/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["controllers/*.js"],
      reporter: ["text", "json", "html"],
    },
  },
});
