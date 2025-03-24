import { test as base } from "@playwright/test";
import { haveCSS } from "./poms/have_css";
import { Toast } from "./poms/toast";

type CustomFixtures = {
  css: haveCSS;
  toast: Toast;
};

export const test = base.extend<CustomFixtures>({
  css: async ({}, use) => {
    await use(new haveCSS());
  },
  toast: async ({ page }, use) => {
    await use(new Toast(page));
  },
});

export { expect } from "@playwright/test";
