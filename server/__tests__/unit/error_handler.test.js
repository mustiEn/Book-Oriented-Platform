import { vi, test, expect } from "vitest";
import { handleError } from "../../middlewares/error_handler";

const error = "Testing error";
const mockRequest = {
  req: {},
  res: {
    status: vi.fn(() => mockRequest.res),
    json: vi.fn(() => mockRequest.res),
  },
  next: vi.fn(),
  err: new Error(error),
};

test("error handler should throw error", async () => {
  const { req, res, next, err } = mockRequest;

  handleError(err, req, res, next);

  expect(res.status).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: error })
  );
});
