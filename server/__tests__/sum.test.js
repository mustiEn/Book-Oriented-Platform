import { logger, sum } from "../utils/constants.js";
import { vi, test, expect, describe, beforeAll } from "vitest";

test("add numbers", () => {
  expect(sum(5, 10)).toBe(15);
});

// test.only("check async func", async () => {
//   try {
//     const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
//     logger.log(await data.json());
//     expect(data).toBeDefined();
//   } catch (error) {
//     logger.log(error);
//   }
// });
