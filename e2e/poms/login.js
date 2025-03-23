export class Login {
  constructor(page) {
    this.page = page;
  }

  async goToLogin() {
    await this.page.goto("/login");
  }

  async fillDetails(details) {
    await this.page.locator("#username").fill(details.username);
    await this.page.locator("#password").fill(details.password);
  }

  async login() {
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
