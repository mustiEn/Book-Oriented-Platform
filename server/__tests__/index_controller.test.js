import { test, expect, vi, beforeEach, describe, afterEach } from "vitest";
import { logger, returnRawQuery } from "../utils/constants";
import { bookCollection, login } from "../controllers/index";
import { validationResult, matchedData } from "express-validator";
import Groq from "groq-sdk";
import { User } from "../models/User";

vi.mock("express-validator", () => ({
  validationResult: vi.fn(() => ({
    isEmpty: vi.fn(() => true),
    array: vi.fn(() => [{ message: "error" }]),
  })),
  matchedData: vi.fn(),
}));
vi.mock("../utils/constants", () => ({
  returnRawQuery: vi.fn(),
}));
vi.mock("groq-sdk", () => {
  return {
    default: vi.fn(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

const mockRequest = {
  req: {},
  res: {
    status: vi.fn(() => mockRequest.res),
    json: vi.fn(() => mockRequest.res),
  },
  next: vi.fn(),
};
const mockCreate = vi.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content: "Mocked author information",
      },
    },
  ],
});
let mockData;
let mockReqData;

afterEach(async () => {
  vi.resetAllMocks();
  mockRequest.req = {};
});

describe.skip("test bookcollection", () => {
  test("should get req param `bookId` and add `author data` if data exists", async () => {
    mockData = [{ author: "jack", title: "abc" }];
    mockReqData = { bookId: 1 };
    mockRequest.req["params"] = mockReqData;

    matchedData.mockReturnValue(mockReqData);
    returnRawQuery.mockResolvedValue(mockData);

    await bookCollection(mockRequest.req, mockRequest.res, mockRequest.next);

    expect(validationResult).toHaveBeenCalledWith(mockRequest.req);
    expect(returnRawQuery).toHaveBeenCalled();
    await expect(returnRawQuery()).resolves.toMatchObject([
      { author: "jack", title: "abc" },
    ]);
    expect(Groq).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockData[0]).toHaveProperty("author_info");
    expect(mockRequest.res.status).toHaveBeenCalled();
    expect(mockRequest.res.json).toHaveBeenCalled();
  });

  test("should get req query `q` and return data", async () => {
    mockData = [{ isLiked: true, rate: 2, author: "jack", title: "abc" }];
    mockReqData = { q: "a" };
    mockRequest.req["query"] = mockReqData;

    matchedData.mockReturnValue(mockReqData);
    returnRawQuery.mockResolvedValue(mockData);

    await bookCollection(mockRequest.req, mockRequest.res, mockRequest.next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(mockRequest.req);
    expect(returnRawQuery).toHaveBeenCalled();
    await expect(returnRawQuery()).resolves.toMatchObject(mockData);
    expect(mockRequest.res.status).toHaveBeenCalled();
    expect(mockRequest.res.json).toHaveBeenCalled();
  });
});

describe("test login", () => {
  test("should log in user", async () => {
    mockReqData = { username: "Jack", password: "123Jack!" };
    User.findOne = vi
      .fn()
      .mockResolvedValue({ id: 1, email: "jack@gmail.com", ...mockReqData });
    mockRequest.req["body"] = mockReqData;

    matchedData.mockReturnValue(mockReqData);

    await login(mockRequest.req, mockRequest.res, mockRequest.next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(mockRequest.req);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(mockRequest.req);
    expect(User.findOne).not.toHaveBeenCalled();
    expect(mockRequest.res.status).toHaveBeenCalled();
    expect(mockRequest.res.json).toHaveBeenCalled();
  });
});
