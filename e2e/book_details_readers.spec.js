import { test, expect } from "./utils/fixture.js";

test.describe("visit /book/it-s-a-book/1/readers?q=Read page, component = book-details-about", () => {
  [
    { q: "Did-not-finish" },
    { q: "Currently-reading" },
    { q: "Want-to-read" },
    { q: "Liked" },
    { q: "Read" },
  ].forEach(({ q }) => {
    test(`displays a list of readers with q = ${q}`, async ({ page, css }) => {
      await page.goto(`/book/it-s-a-book/1/readers?q=${q}`);

      page.on("response", async (res) => {
        if (res.url().includes(`/api/get-reader-profiles/1/reader?q=${q}`)) {
          const data = await res.json();
          console.log(data);
        }
      });

      const btn = page.locator(`#${q}`);
      await btn.waitFor({ state: "attached" });

      await css.haveCSS(btn, "background-color", "rgb(220, 53, 69)");
      await css.haveCSS(btn, "color", "rgb(255, 255, 255)");
    });
  });

  test.only(`displays a list of readers with q = Did-not-finish and it takes to the profile`, async ({
    page,
  }) => {
    await page.goto(`/book/it-s-a-book/1/readers?q=Did-not-finish`);

    page.on("response", async (res) => {
      if (
        res.url().includes(`/api/get-reader-profiles/1/reader?q=Did-not-finish`)
      ) {
        console.log("STATUS:" + res.status());
      }
    });

    const btn = page.getByText("test user");
    await btn.waitFor({ state: "attached" });
    await btn.click();
    await page.waitForURL("/testuser");
  });
});
