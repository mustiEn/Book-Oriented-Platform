import { test } from "./utils/fixture.js";

test(`test right sidebar links recursively`, async ({ page }) => {
  await page.goto("/home");
  const links = await page.locator(`.topic-li`).all();

  for (const link of links) {
    await page.goto("/home");
    await link.click();
    await page.waitForLoadState();
  }
});
