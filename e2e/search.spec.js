// @ts-check
import { test, expect } from "./utils/fixture.js";

test.describe.configure({ mode: "serial" });

test.describe("test search page", () => {
  [{ q: "a" }, { q: "b" }].forEach(({ q }) => {
    test(`search with query q = ${q}`, async ({ page }) => {
      await page.goto("/search");

      const resPromise = page.waitForResponse(`/api/books/v1?q=${q}`);

      await page.getByPlaceholder("Search in BookNest").fill(q);

      const res = await resPromise;
      const data = await res.json();
      console.log(data.length);

      expect(res.status()).toBe(200);
      await expect(page.locator(".books").first()).toBeVisible();
    });
  });

  test(`click on a book`, async ({ page }) => {
    await page.goto("/search");

    const resPromise = page.waitForResponse(`/api/books/v1?q=a`);

    await page.getByPlaceholder("Search in BookNest").fill("a");

    const res = await resPromise;
    const link = page
      .locator(".books")
      .getByRole("listitem")
      .nth(0)
      .locator("a");
    const href = await link.getAttribute("href", { timeout: 5000 });

    console.log(href);

    await link.click();
    await page.waitForLoadState();
    expect(res.status()).toBe(200);
    await expect(page).toHaveURL(`${href}`);
  });
});
