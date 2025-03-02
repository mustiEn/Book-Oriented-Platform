import { vi, test, expect, describe, beforeAll } from "vitest";
import { logger, returnRawQuery } from "../utils/constants";
import traceLogger from "tracer";

vi.mock("../utils/constants");
vi.mock("tracer");

test.skip("function should work", async () => {
  const mockResult = [{ id: 1, bookId: 22 }];
  const mockSql = `SELECT a.* from a`;
  returnRawQuery.mockResolvedValue(mockResult);

  const result = await returnRawQuery(mockSql, "QUERY");

  expect(returnRawQuery).toHaveBeenCalled();
  expect(returnRawQuery).toHaveBeenCalledWith(
    expect.stringContaining("SELECT"),
    expect.anything()
  );
  expect(result).toEqual(mockResult);
});

test.skip("function should work", async () => {
  const logger = traceLogger.colorConsole();

  logger.log("213123deneme");

  expect(logger.log).toHaveBeenCalled();
});
