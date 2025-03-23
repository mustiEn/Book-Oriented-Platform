import { test as teardown } from "@playwright/test";

teardown("setup", async ({}) => {
  console.log("Tearing down!!!");
});
