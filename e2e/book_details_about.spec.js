// @ts-check
import { test, expect } from "./utils/fixture.js";
import { ShareReview as ShareReviewClass } from "./utils/poms/share_review.js";

test.describe.configure({ mode: "parallel" });
test.describe("visit /book/it-s-a-book/1 page, component = book-details-about", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/book/it-s-a-book/1");
  });

  test("test if initials exist", async ({ page, css }) => {
    const rate = page.locator("#star-4");
    const like = page.locator("#like-btn");
    const authorInfo = page.locator("#authorInfo");

    await expect(page.locator("#bookDetails")).toBeVisible();
    await expect(rate).toBeVisible();
    await expect(like).toBeVisible();
    await expect(authorInfo).toBeVisible();
    await css.haveCSS(rate, "background-color", "rgb(255, 255, 0)");
    await css.haveCSS(rate, "color", "rgb(0, 0, 0)");
    await css.haveCSS(like, "background-color", "rgb(220, 53, 69)");
    await css.haveCSS(like, "color", "rgb(255, 255, 255)");
  });

  test("test rating", async ({ page, css }) => {
    const resPromise = page.waitForResponse(`/api/set-book-rate/1`);
    const rate = page.locator("#star-4");

    await rate.waitFor({ state: "attached" });
    await rate.click();

    const res = await resPromise;

    expect(res.status()).toBe(200);
    await css.haveCSS(rate, "background-color", "rgb(255, 255, 0)");
    await css.haveCSS(rate, "color", "rgb(0, 0, 0)");

    const toast = page.getByText("Rate updated");

    await toast.waitFor({ state: "attached" });
    await expect(toast).toBeInViewport({ ratio: 1 });
    // await page.waitForTimeout(3000);
  });

  test("test reseting rate", async ({ page, css }) => {
    await page.locator(".arrows-rotate").click();

    const rate = page.locator("#star-4");

    await css.haveCSS(rate, "background-color", "rgb(128, 128, 128)");
    await css.haveCSS(rate, "color", "rgb(255, 255, 255)");
  });

  [
    { link: "about", url: "/book/it-s-a-book/1" },
    { link: "reviews", url: "/book/it-s-a-book/1/reviews" },
    { link: "statistics", url: "/book/it-s-a-book/1/statistics" },
    { link: "readers", url: "/book/it-s-a-book/1/readers?q=Read" },
  ].forEach(({ link, url }) => {
    test(`test links link = ${link}`, async ({ page }) => {
      await page.goto(`/book/it-s-a-book/1`);
      await page.locator(`#li-${link}`).click();
      await page.waitForURL(url);
    });
  });

  test("share a review", async ({ page, toast }) => {
    const ShareReview = new ShareReviewClass(page);
    const shareReviewBtn = page.getByText("Share Review");
    const reviewData = {
      title: "Review Title",
      review: "This is a great book!",
      topic: "Literature",
    };

    await shareReviewBtn.click();
    await expect(page.getByText("Review")).toBeVisible();
    await ShareReview.fillDetails(reviewData);

    const resPromise = page.waitForResponse(`/api/share-review`);
    await page.getByRole("button", { name: "Share" }).click();

    const res = await resPromise;

    await toast.getToast("Review added successfully");
    await ShareReview.cleanFields();

    expect(res.status()).toBe(200);
  });

  [
    { next: "Want to read", active: "Did not finish" },
    { next: "Currently reading", active: "Want to read" },
    { next: "Read", active: "Currently reading" },
  ].forEach(({ next, active }) => {
    test(`change book reading states with state = ${next}`, async ({
      page,
      toast,
      css,
    }) => {
      await page.getByText("Add to my booklist").click();

      const modal = page.locator(".modal-content");
      await modal.waitFor({ state: "attached" });
      await expect(modal).toBeVisible();

      await test.step("check active btn", async () => {
        const btn = page.locator(`#${active.replaceAll(" ", "-")}`);
        await css.haveCSS(btn, "background-color", "rgb(13, 110, 253)");
        await css.haveCSS(btn, "color", "rgb(255, 255, 255)");
      });

      const btn = page.locator(`#${next.replaceAll(" ", "-")}`);
      await css.haveCSS(btn, "background-color", "rgb(248, 249, 250)");
      await css.haveCSS(btn, "color", "rgb(0, 0, 0)");

      const resPromise = page.waitForResponse(`/api/set-reading-state/1`);

      await btn.click();
      await page.mouse.move(0, 0);

      const res = await resPromise;

      await toast.getToast("Reading state updated");

      expect(res.status()).toEqual(200);

      await css.haveCSS(btn, "background-color", "rgb(13, 110, 253)");
      await css.haveCSS(btn, "color", "rgb(255, 255, 255)");

      if (next === "Currently reading") {
        await test.step(`when btn state = ${next},check if element exists.`, async () => {
          await expect(page.getByText("Where I left off")).toBeVisible();

          await test.step(`when btn state = ${next}, update page number.`, async () => {
            await page.locator("#pageNumberInp").fill("22");
            const resPromise = page.waitForResponse(
              `/api/update-reader-page-number/1`
            );
            await page.getByRole("button", { name: "Update" }).click();

            const res = await resPromise;

            expect(res.status()).toBe(200);
            await toast.getToast("Page number updated");
          });
        });
      } else if (next === "Read") {
        await test.step(`when btn state = ${next},check if element exists.`, async () => {
          const finishDate = page.getByText("Finish Date");

          await finishDate.waitFor();
          await expect(finishDate).toBeVisible();

          await test.step(`when btn state = ${next}, update book dates.`, async () => {
            const finishInp = page.locator("#finishingDate");
            const startInp = page.locator("#startingDate");

            await finishInp.waitFor();
            await startInp.waitFor();
            await finishInp.fill("2022-11-27");
            await startInp.fill("2022-01-27");
            const resPromise = page.waitForResponse(
              `/api/update-reader-book-dates/1`
            );
            await page.getByRole("button", { name: "Update" }).click();

            const res = await resPromise;

            expect(res.status()).toBe(200);
            await toast.getToast("Book dates updated");
          });
        });
      }
    });
  });

  test("set private note", async ({ page, toast }) => {
    await page.getByText("Add to my booklist").click();

    const modal = page.locator(".modal-content");
    await modal.waitFor({ state: "attached" });
    await expect(modal).toBeVisible();

    const resPromise = page.waitForResponse("/api/set-private-note/1");
    await page.getByPlaceholder("Your private note..").fill("This is a note");
    await page.waitForTimeout(1000);
    const res = await resPromise;

    expect(res.status()).toBe(200);

    await toast.getToast("Private note updated");
  });
});
