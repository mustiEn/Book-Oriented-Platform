import { type Locator, type Page, expect } from "@playwright/test";

export class Toast {
  private toast: Locator;
  constructor(public readonly page: Page) {}

  async getToast(text: string) {
    this.toast = this.page.getByText(text);
    await this.toast.waitFor({ state: "attached" });
    await expect(this.toast).toBeInViewport({ ratio: 1 });
  }
}
