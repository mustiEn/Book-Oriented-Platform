import type { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class haveCSS {
  async haveCSS(elm: Locator, property: string, val: string) {
    await expect(elm).toHaveCSS(property, val);
  }
}
