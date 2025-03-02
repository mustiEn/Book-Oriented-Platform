import { validationResult, matchedData } from "express-validator";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  displayReaderProfile,
  getReaderReviews,
  setPrivateNote,
  shareReview,
  updateReaderBookDates,
  uploadImage,
} from "../controllers/user";
import { Topic } from "../models/Topic";
import { Review } from "../models/Review";
import { PrivateNote } from "../models/PrivateNote";
import { User } from "../models/User";
import { logger } from "../utils/constants";
import { BookReadingState } from "../models/BookReadingState";
import fs from "fs";

vi.mock("express-validator");
vi.mock("../utils/constants");
vi.mock("fs");

const filePath = "../client/public/Pps_and_Bgs";
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
  // console.log("exists func", fs.existsSync());
  vi.resetAllMocks();
  // console.log("exists func 1", fs.existsSync());
});

describe("test share review", () => {
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

    Topic.findOne = vi.fn().mockResolvedValue(null);

    await shareReview(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("should share review", async () => {
    const { req, res, next } = mockRequest;

    Topic.findOne = vi.fn().mockResolvedValue({ id: 1, topic: "Maths" });
    Review.create = vi.fn().mockResolvedValue({ review: "avc" });

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

    PrivateNote.findOne = vi
      .fn()
      .mockResolvedValue({ id: 1, privateNote: "abc" });
    PrivateNote.update = vi.fn().mockResolvedValue({ note: "updated" });

    await setPrivateNote(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(PrivateNote.findOne).toHaveBeenCalled();
    expect(PrivateNote.update).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  test("should create private note", async () => {
    const { req, res, next } = mockRequest;

    PrivateNote.findOne = vi.fn().mockResolvedValue(null);
    PrivateNote.create = vi.fn().mockResolvedValue({ note: "created" });

    await setPrivateNote(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(PrivateNote.findOne).toHaveBeenCalled();
    expect(PrivateNote.create).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("test displayReaderProfile", () => {
  test("should return data", async () => {
    mockReqData = { username: "Jack" };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    User.findOne = vi.fn().mockResolvedValue({ id: 1, username: "Jack" });

    const { req, res, next } = mockRequest;

    await displayReaderProfile(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled(expect.any(Error));
  });
});

describe("test getReaderReviews", () => {
  beforeEach(() => {
    mockReqData = { username: "Jack" };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should throw `User not found`", async () => {
    const { req, res, next } = mockRequest;
    const error = "User not found";

    User.findOne = vi.fn(() => null);

    await getReaderReviews(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should return data", async () => {
    const { req, res, next } = mockRequest;

    User.findOne = vi.fn().mockResolvedValue(mockReqData);

    await getReaderReviews(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("test updateReaderBookDates", () => {
  beforeEach(() => {
    mockReqData = { bookId: 1, startingDate: 2023, finishingDate: 2024 };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should update reader book dates", async () => {
    const { req, res, next } = mockRequest;

    BookReadingState.update = vi.fn().mockResolvedValue();

    await updateReaderBookDates(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(BookReadingState.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.anything(Error));
  });
});

describe("test uploadImage", () => {
  beforeEach(() => {
    mockRequest.req.files = {
      ppImage: [
        {
          fieldname: "ppImage",
          filename: "filename.jpg",
        },
      ],
    };
  });

  test("should upload and delete previous image", async () => {
    const { req, res, next } = mockRequest;
    const MockUserFindOneData = {
      profile_photo: "2023_image",
      toJSON: vi.fn(() => {
        return { profile_photo: "2023_image" };
      }),
    };

    User.findOne = vi.fn().mockResolvedValue(MockUserFindOneData);
    User.update = vi.fn().mockResolvedValue({
      profile_photo: "2023_image",
    });

    await uploadImage(req, res, next);

    expect(User.findOne).toHaveBeenCalled();
    expect(MockUserFindOneData.toJSON).toHaveBeenCalled();
    expect(User.update).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.rm).toHaveBeenCalled();
    expect(fs.rm).toHaveBeenCalledWith(
      expect.stringContaining(filePath),
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.anything(Error));
  });

  test("should upload and throw `Invalid data`", async () => {
    const { req, res, next } = mockRequest;
    const error = "Invalid data";
    const MockUserFindOneData = {
      profile_photo: "2023_image",
      toJSON: vi.fn(() => {
        return { profile_photo: null };
      }),
    };

    User.findOne = vi.fn().mockResolvedValue(MockUserFindOneData);
    User.update = vi.fn().mockResolvedValue({
      profile_photo: "2023_image",
    });

    await uploadImage(req, res, next);

    expect(User.findOne).toHaveBeenCalled();
    expect(MockUserFindOneData.toJSON).toHaveBeenCalled();
    expect(User.update).toHaveBeenCalled();
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should upload and throw `No such file exists`", async () => {
    const { req, res, next } = mockRequest;
    const error = "No such file exists";
    const MockUserFindOneData = {
      profile_photo: "2023_image",
      toJSON: vi.fn(() => {
        return { profile_photo: "2023_img.jpg" };
      }),
    };

    fs.existsSync.mockImplementation(() => false);
    User.findOne = vi.fn().mockResolvedValue(MockUserFindOneData);
    User.update = vi.fn().mockResolvedValue({
      profile_photo: "2023_image",
    });

    await uploadImage(req, res, next);

    expect(User.findOne).toHaveBeenCalled();
    expect(MockUserFindOneData.toJSON).toHaveBeenCalled();
    expect(User.update).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should upload and throw `No such image exists`", async () => {
    const { req, res, next } = mockRequest;
    const error = "No such image exists";
    const MockUserFindOneData = {
      profile_photo: "2023_image",
      toJSON: vi.fn(() => {
        return { profile_photo: "2023_img.jpg" };
      }),
    };
    const imagePath =
      filePath + "/" + MockUserFindOneData.toJSON().profile_photo;

    fs.rm = vi.fn((filePath, cb) => cb(new Error(error)));
    User.findOne = vi.fn().mockResolvedValue(MockUserFindOneData);
    User.update = vi.fn().mockResolvedValue({
      profile_photo: "2023_image",
    });

    await uploadImage(req, res, next);

    expect(User.findOne).toHaveBeenCalled();
    expect(MockUserFindOneData.toJSON).toHaveBeenCalled();
    expect(User.update).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.rm).toHaveBeenCalled();
    expect(fs.rm).toHaveBeenCalledWith(imagePath, expect.any(Function));
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});
