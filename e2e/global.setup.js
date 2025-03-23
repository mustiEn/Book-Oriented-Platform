import { expect, test as setup } from "@playwright/test";
import { Login as LoginClass } from "./poms/login";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");
setup("setup and login", async ({ page }) => {
  console.log("SETTING UP!!!");
  const userDetails = {
    username: "fakeUsername",
    password: "fakePassword",
  };
  const Login = new LoginClass(page);

  await Login.goToLogin();
  await Login.fillDetails(userDetails);

  const resPromise = page.waitForResponse("/api/login", { timeout: 15000 });

  await Login.login();

  const res = await resPromise;

  await page.waitForURL("/home");
  expect(res.status()).toBe(200);
  await page.context().storageState({ path: authFile });
});
