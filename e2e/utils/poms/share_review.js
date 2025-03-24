export class ShareReview {
  select;
  textInput;
  textArea;
  constructor(page) {
    this.page = page;
    this.select = this.page.locator("select");
    this.textInput = this.page.locator("#formBasicTitle");
    this.textArea = this.page.locator("#formBasicReview");
  }
  async fillDetails(details) {
    await this.select.selectOption(details.topic);
    await this.textInput.fill(details.title);
    await this.textArea.fill(details.review);
  }

  async cleanFields() {
    await this.select.selectOption("");
    await this.textInput.clear();
    await this.textArea.clear();
  }
}
