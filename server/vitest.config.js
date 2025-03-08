import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    include: ["__tests__/unit/*.test.js", "__tests__/integration/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["controllers/*.js"],
      reporter: ["text", "json", "html"],
    },
  },
});
