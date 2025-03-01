import { validationResult, matchedData } from "express-validator";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setPrivateNote, shareReview } from "../controllers/user";
import { isErrored } from "form-data";
import { Topic } from "../models/Topic";
import { Review } from "../models/Review";
import { PrivateNote } from "../models/PrivateNote";

vi.mock("express-validator");

const mockRequest = {
  req: {},
  res: {
    status: vi.fn(() => mockRequest.res),
    json: vi.fn(() => mockRequest.res),
  },
  next: vi.fn(),
};

let mockData;
let mockReqData;

beforeEach(() => {
  mockRequest.req.session = {
    passport: {
      user: 6,
    },
  };
});

afterEach(() => {
  mockRequest.req = {};
  vi.resetAllMocks();
});

describe.skip("test share review", () => {
  beforeEach(() => {
    mockReqData = {
      topic: "Game",
      review: "nice!",
      title: "abc",
      bookId: 1,
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should throw validation error", async () => {
    const { req, res, next } = mockRequest;
    console.log(req);

    const mockValidationResult = {
      isEmpty: vi.fn(() => false),
      array: vi.fn(() => [{ msg: "er" }]),
    };

    validationResult.mockReturnValue(mockValidationResult);

    await shareReview(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(mockValidationResult.isEmpty).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("should throw `Topic not found`", async () => {
    const { req, res, next } = mockRequest;

    Topic.findOne = vi.fn(() => null);

    await shareReview(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("should share review", async () => {
    const { req, res, next } = mockRequest;

    Topic.findOne = vi.fn(() => ({ id: 1, topic: "Maths" }));
    Review.create = vi.fn(() => ({ review: "avc" }));

    await shareReview(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(Review.create).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    expect(res.json).toHaveBeenCalled({ message: "Review added successfully" });
  });
});

describe("test setPrivateNote", () => {
  beforeEach(() => {
    mockReqData = {
      topic: "Game",
      review: "nice!",
      title: "abc",
      bookId: 1,
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should throw validation error", async () => {
    const { req, res, next } = mockRequest;

    const mockValidationData = {
      isEmpty: vi.fn(() => false),
      array: vi.fn(() => [{ msg: "error" }]),
    };
    validationResult.mockReturnValue(mockValidationData);

    await setPrivateNote(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("should update private note", async () => {
    const { req, res, next } = mockRequest;

    PrivateNote.findOne = vi.fn(() => ({ id: 1, privateNote: "abc" }));
    PrivateNote.update = vi.fn(() => ({ note: "updated" }));
    await setPrivateNote(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(privateNote.findOne).toHaveBeenCalled();
    expect(PrivateNote.update).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  test("should create private note", async () => {
    const { req, res, next } = mockRequest;

    PrivateNote.findOne = vi.fn(() => null);
    PrivateNote.create = vi.fn(() => ({ note: "created" }));
    await setPrivateNote(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(privateNote.findOne).toHaveBeenCalled();
    expect(PrivateNote.create).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("test getBookStatistics", () => {
  test("should return statistics", async () => {});
});
