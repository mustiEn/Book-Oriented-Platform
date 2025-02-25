// import { vi, test, expect, describe, beforeAll } from "vitest";
// import { logger } from "../utils/constants";
// // import { describe } from "vitest";

// beforeEach(() => {
//   vi.clearAllMocks();
// });

// vi.unstable_mockModule("../utils/constants", () => ({
//   returnRawQuery: vi.fn(),
// }));

// // vi.unstable_mockModule("sequelize", () => ({
// //   QueryTypes: {
// //     SELECT: "SELECT", // Mock QueryTypes
// //   },
// // }));

// const { returnRawQuery } = await import("../utils/constants");

// describe("returnRawQuery", () => {
//   test("function should work", async () => {
//     const mockResult = [{ id: 1, bookId: 22 }];
//     const mockSql = `SELECT a.* from a`;
//     returnRawQuery.mockResolvedValue(mockResult);

//     const result = await returnRawQuery(mockSql, "QUERY");

//     expect(returnRawQuery).toHaveBeenCalled();
//     expect(returnRawQuery).toHaveBeenCalledWith(
//       expect.stringContaining("SELECT"),
//       expect.anything()
//     );
//     expect(result).toEqual(mockResult);
//   });
// });
