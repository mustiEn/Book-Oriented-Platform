// @ts-check
import { test, expect } from "@playwright/test";
import { SignUp as SignUpClass } from "./poms/signup";

test("signup", async ({ page }) => {
  const SignUp = new SignUpClass(page);
  const userDetails = {
    username: "fakeUsername",
    email: "fakeEmail@gmail.com",
    password: "fakePassword",
    confirmedPassword: "fakePassword",
    firstname: "fakeFirstname",
    lastname: "fakeLastname",
    DOB: "1990-01-01",
    gender: "Male",
  };
  const resPromise = page.waitForResponse("/api/signup");

  await SignUp.goToSignUp();
  await SignUp.chk();
  await SignUp.fillDetails(userDetails);
  await SignUp.signUp("Sign Up");
  await page.waitForURL("/home", {
    timeout: 20000,
  });
  const res = await resPromise;

  console.log(await res.json());
  expect(res.status()).toBe(200);
});
