import { test } from "./utils/fixture.js";
import { randomUUID } from "crypto";

test(`test left sidebar links recursively`, async ({ page }) => {
  await page.goto("/home");
  const links = await page.locator(`.left-sidebar-item`).all();

  for (const link of links) {
    await page.goto("/home");
    const url = await link.getAttribute("href");

    await link.click();
    // await page.screenshot({
    //   path: `./e2e/utils/${randomUUID()}.png`,
    // });
    await page.waitForLoadState();
  }
});
