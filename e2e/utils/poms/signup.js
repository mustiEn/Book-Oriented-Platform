import { expect } from "@playwright/test";

export class SignUp {
  constructor(page) {
    this.page = page;
  }

  async goToSignUp() {
    await this.page.goto("/signup");
  }

  async chk() {
    await expect(this.page).toHaveTitle("Vite + React");
  }

  async fillDetails(details) {
    await this.page.locator("#username").fill(details.username);
    await this.page.locator("#firstname").fill(details.firstname);
    await this.page.locator("#lastname").fill(details.lastname);
    await this.page.locator("#email").fill(details.email);
    await this.page.locator("#password").fill(details.password);
    await this.page
      .locator("#confirmedPassword")
      .fill(details.confirmedPassword);
    await this.page.locator("#DOB").fill(details.DOB);
    await this.page.locator("#gender").selectOption(details.gender);
  }

  async signUp(btnName) {
    await this.page.getByRole("button", { name: btnName }).click();
  }
}
