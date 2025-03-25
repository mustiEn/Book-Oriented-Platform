import { test, expect } from "./utils/fixture.js";

test.describe("visit /book/it-s-a-book/1/readers?q=Read page, component = book-details-about", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/book/it-s-a-book/1/readers?q=Read");
  });

  [
    { q: "Currently-reading" },
    { q: "Want-to-read" },
    { q: "Did-not-finish" },
    { q: "Liked" },
    { q: "Read" },
  ].forEach(({ q }) => {
    test(`displays a list of readers with q = ${q}`, async ({ page, css }) => {
      const resPromise = page.waitForResponse(
        `/api/get-reader-profiles/1/reader?q=${q}`
      );
      await page.goto(`/api/get-reader-profiles/1/reader?q=${q}`);

      const btn = page.locator(`#${q}`);
      await btn.waitFor({ state: "attached" });

      await css.haveCSS(btn, "background-color", "rgb(220, 53, 69)");
      await css.haveCSS(btn, "color", "rgb(255, 255, 255)");

      const res = await resPromise;
      expect(res.status()).toBe(200);
    });
  });
});
