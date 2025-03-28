import { test } from "./utils/fixture.js";
import { randomUUID } from "crypto";

test(`test statistic links recursivly`, async ({ page }) => {
  await page.goto("/book/it-s-a-book/1/statistics");
  const links = await page.locator(`.statistic`).all();

  for (const link of links) {
    await page.goto("/book/it-s-a-book/1/statistics");
    const url = await link.getAttribute("href");

    await link.click();
    await page.screenshot({
      path: `./e2e/utils/${randomUUID()}.png`,
    });
  }
});
