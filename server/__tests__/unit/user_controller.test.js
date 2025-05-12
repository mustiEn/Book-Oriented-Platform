//! UPDATE THIS FILE
import { validationResult, matchedData } from "express-validator";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  createCheckoutSession,
  createTopic,
  displayReaderProfile,
  getLoggedInReader,
  getReaderPostComments,
  getReaderReviews,
  getTopic,
  getTopicBooks,
  getTopicPosts,
  listenWebhook,
  sendComment,
  setFollowingState,
  setPrivateNote,
  shareReview,
  updateReaderBookDates,
  uploadImage,
} from "../../controllers/user";
import { sequelize } from "../../models/db";
import { Topic } from "../../models/Topic";
import { Review } from "../../models/Review";
import { PrivateNote } from "../../models/PrivateNote";
import { User } from "../../models/User";
import { logger, returnFromRaw } from "../../utils/constants";
import { BookReadingState } from "../../models/BookReadingState";
import fs from "fs";
import { Post } from "../../models/Post";
import { Quote } from "../../models/Quote";
import { Thought } from "../../models/Thought";
import { Comment } from "../../models/Comment";
import { Category } from "../../models/Category";
import { TopicCategory } from "../../models/TopicCategory";
import { RatedBook } from "../../models/RatedBook";
import { BookCollection } from "../../models/BookCollection";
import { Notification } from "../../models/Notification";
import { RestrictedPost } from "../../models/RestrictedPost";
import { RecommendedBook } from "../../models/RecommendedBook";
import { Subscription } from "../../models/Subscription";
import Stripe, { stripeProperties } from "stripe";
import { Transaction } from "../../models/Transaction";

vi.mock("stripe");
vi.mock("../../models/db");
vi.mock("express-validator");
vi.mock("../../utils/constants");
vi.mock("fs");
vi.mock("../../models/Topic");
vi.mock("../../models/Review");
vi.mock("../../models/PrivateNote");
vi.mock("../../models/BookReadingState");
vi.mock("../../models/Post");
vi.mock("../../models/Quote");
vi.mock("../../models/Thought");
vi.mock("../../models/Comment");
vi.mock("../../models/User");
vi.mock("../../models/RatedBook");
vi.mock("../../models/LikedBook");
vi.mock("../../models/TopicCategory");
vi.mock("../../models/Transaction");
vi.mock("../../models/Category");
vi.mock("../../models/BookCollection");
vi.mock("../../models/RestrictedPost");
vi.mock("../../models/RecommendedBook");
vi.mock("../../models/Subscription");
vi.mock("../../models/Notification");

const transaction = {
  rollback: vi.fn().mockResolvedValue(),
  commit: vi.fn().mockResolvedValue(),
};
const filePath = "../client/public/Pps_and_Bgs";
const mockRequest = {
  req: {},
  res: {
    status: vi.fn(() => mockRequest.res),
    json: vi.fn(() => mockRequest.res),
    send: vi.fn(),
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
    req.body.topic = null;

    Review.create = vi.fn().mockResolvedValue({ review: "avc" });

    await shareReview(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
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
    // expect(User.findOne).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalled(expect.any(Error));
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
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
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
    // expect(res.json).not.toHaveBeenCalled();
    // expect(next).toHaveBeenCalledWith(Error(error));
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
    // expect(User.update).toHaveBeenCalled();
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
    // expect(User.update).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.rm).toHaveBeenCalled();
    expect(fs.rm).toHaveBeenCalledWith(imagePath, expect.any(Function));
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});

describe("test getLoggedInUser", () => {
  beforeEach(() => {
    mockData = { id: 1, user: "jack" };
  });

  test("should return data", async () => {
    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
      toJSON: vi.fn(() => mockData),
    });

    await getLoggedInReader(req, res, next);

    // expect(User.findByPk).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  test("should throw `User not found`", async () => {
    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue(null);

    await getLoggedInReader(req, res, next);

    // expect(User.findByPk).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("test getReaderPostComments", () => {
  beforeEach(() => {
    mockData = { id: 1, user: "jack" };
  });

  test("should return data with param postType = Review", async () => {
    mockReqData = { postId: 1, postType: "review" };
    mockRequest.req.params = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
    });
    Post.findOne = vi.fn().mockResolvedValue({
      id: 10,
      toJSON: vi.fn(() => ({
        id: 10,
      })),
    });
    Review.findOne = vi.fn().mockResolvedValue({ id: 2, review: "abc" });

    await getReaderPostComments(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(User.findByPk).toHaveBeenCalled();
    expect(Post.findOne).toHaveBeenCalled();
    // expect(Review.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
  test("should return data with param postType = Review", async () => {
    mockReqData = { postId: 1, postType: "review" };
    mockRequest.req.params = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
    });
    Post.findOne = vi.fn().mockResolvedValue({
      id: 10,
      toJSON: vi.fn(() => ({
        id: 10,
      })),
    });
    Review.findOne = vi.fn().mockResolvedValue({ id: 2, review: "abc" });

    await getReaderPostComments(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(User.findByPk).toHaveBeenCalled();
    expect(Post.findOne).toHaveBeenCalled();
    // expect(Review.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
  test("should return data with param postType = quote", async () => {
    mockReqData = { postId: 1, postType: "quote" };
    mockRequest.req.params = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
    });
    Post.findOne = vi.fn().mockResolvedValue({
      id: 10,
      toJSON: vi.fn(() => ({
        id: 10,
      })),
    });
    Quote.findOne = vi.fn().mockResolvedValue({ id: 2, Quote: "abc" });

    await getReaderPostComments(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(User.findByPk).toHaveBeenCalled();
    expect(Post.findOne).toHaveBeenCalled();
    // expect(Quote.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
  test("should return data with param postType = thought", async () => {
    mockReqData = { postId: 1, postType: "thought" };
    mockRequest.req.params = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
    });
    Post.findOne = vi.fn().mockResolvedValue({
      id: 10,
      toJSON: vi.fn(() => ({
        id: 10,
      })),
    });
    Thought.findOne = vi.fn().mockResolvedValue({ id: 2, thought: "abc" });

    await getReaderPostComments(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(User.findByPk).toHaveBeenCalled();
    expect(Post.findOne).toHaveBeenCalled();
    // expect(Thought.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
  test("should return data with param postType = comment", async () => {
    mockReqData = { postId: 1, postType: "comment" };
    mockRequest.req.params = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    const { req, res, next } = mockRequest;

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
    });
    Post.findOne = vi.fn().mockResolvedValue({
      id: 10,
      toJSON: vi.fn(() => ({
        id: 10,
      })),
    });
    Comment.findOne = vi.fn().mockResolvedValue({ id: 2, comment: "abc" });

    await getReaderPostComments(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(User.findByPk).toHaveBeenCalled();
    expect(Post.findOne).toHaveBeenCalled();
    // expect(Comment.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
  test("should throw `Post id not found`", async () => {
    mockReqData = { postId: 1, postType: "review" };
    mockRequest.req.params = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    const { req, res, next } = mockRequest;
    const error = "Post id not found";

    User.findByPk = vi.fn().mockResolvedValue({
      mockData,
    });
    Post.findOne = vi.fn().mockResolvedValue(null);

    await getReaderPostComments(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(User.findByPk).toHaveBeenCalled();
    expect(Post.findOne).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});

describe("test sendCommend", () => {
  beforeEach(() => {
    mockReqData = {
      comment: "abc",
      commentToId: 1,
      postType: "review",
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    sequelize.transaction.mockResolvedValue(transaction);
  });

  test("should send comment", async () => {
    const { req, res, next } = mockRequest;

    Post.findOne.mockResolvedValue({ id: 1, postId: 4 });
    Post.update.mockResolvedValue();
    Comment.create.mockResolvedValue();

    await sendComment(req, res, next);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    expect(Comment.create).toHaveBeenCalled();
    expect(transaction.commit).toHaveBeenCalled();
    expect(transaction.rollback).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should send comment with postType = comment", async () => {
    mockRequest.req.body.postType = "comment";
    const { req, res, next } = mockRequest;

    Post.findOne.mockResolvedValue({ id: 1, postId: 4 });
    Post.update.mockResolvedValue();
    Comment.findOne.mockResolvedValue({ id: 1, comment: "abc" });

    await sendComment(req, res, next);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    expect(Comment.findOne).toHaveBeenCalled();
    expect(transaction.commit).toHaveBeenCalled();
    expect(transaction.rollback).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw `Comment not found`", async () => {
    mockRequest.req.body.postType = "comment";
    const { req, res, next } = mockRequest;
    const error = "Comment not found";

    Post.findOne.mockResolvedValue({ id: 1, postId: 4 });
    Post.update.mockResolvedValue();
    Comment.findOne.mockResolvedValue(null);

    await sendComment(req, res, next);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Comment.findOne).toHaveBeenCalled();
    expect(transaction.rollback).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    // expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should throw `Post not found`", async () => {
    const { req, res, next } = mockRequest;
    const error = "Post not found";

    Post.findOne.mockResolvedValue(null);

    await sendComment(req, res, next);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(sequelize.transaction).toHaveBeenCalled();
    expect(transaction.rollback).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});

describe("test createTopic", () => {
  beforeEach(() => {
    mockReqData = {
      topic: "abc",
      category: "sports",
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    sequelize.transaction.mockResolvedValue(transaction);
  });

  test("should create topic", async () => {
    const { req, res, next } = mockRequest;

    Topic.create.mockResolvedValue({ id: 2 });
    TopicCategory.findAll.mockResolvedValue([{ id: 1, topic_category: 4 }]);

    await createTopic(req, res, next);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(TopicCategory.findAll).toHaveBeenCalled();
    expect(Topic.create).toHaveBeenCalled();
    // expect(returnFromRaw).toHaveBeenCalled();
    // expect(transaction.commit).toHaveBeenCalled();
    // expect(transaction.rollback).not.toHaveBeenCalled();
    // expect(res.json).toHaveBeenCalled();
    // expect(next).not.toHaveBeenCalled();
  });

  test("should throw `Topic category not found`", async () => {
    const { req, res, next } = mockRequest;
    const error = "Topic category not found";

    TopicCategory.findAll.mockResolvedValue(null);

    await createTopic(req, res, next);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(TopicCategory.findAll).toHaveBeenCalled();
    // expect(transaction.rollback).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});

describe("test getTopic", () => {
  beforeEach(() => {
    mockReqData = {
      topicName: "wild rift",
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should get topic", async () => {
    const { req, res, next } = mockRequest;

    Topic.findOne.mockResolvedValue({ id: 2 });
    Topic.findAndCountAll.mockResolvedValue({ count: 2 });
    await getTopic(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw `Topic not found`", async () => {
    const { req, res, next } = mockRequest;
    const error = "Topic not found";

    Topic.findOne.mockResolvedValue(null);
    await getTopic(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled(Error(error));
  });
});

describe("test getTopicBooks", () => {
  beforeEach(() => {
    mockReqData = {
      topicName: "wild rift",
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should get topic books", async () => {
    const { req, res, next } = mockRequest;

    Topic.findOne.mockResolvedValue({ id: 2 });
    returnFromRaw.mockResolvedValue([{ id: 1, BookCollectionId: 2 }]);
    BookCollection.findAll.mockResolvedValue([{ id: 1, page_count: 100 }]);

    await getTopicBooks(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    expect(BookCollection.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw `Topic not found`", async () => {
    const { req, res, next } = mockRequest;
    const error = "Topic not found";

    Topic.findOne.mockResolvedValue(null);
    await getTopicBooks(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled(Error(error));
  });
});

describe("test getTopicPosts", () => {
  beforeEach(() => {
    mockReqData = {
      topicName: "wild rift",
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should get topic posts with param = `all`", async () => {
    mockReqData.postType = "all";
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    const { req, res, next } = mockRequest;

    Topic.findOne.mockResolvedValue({ id: 2 });
    returnFromRaw
      .mockResolvedValueOnce([{ id: 1, review: "r" }])
      .mockResolvedValueOnce([{ id: 1, thought: "t" }])
      .mockResolvedValueOnce([{ id: 1, quote: "q" }]);

    await getTopicPosts(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should get topic posts with param = `review`", async () => {
    mockReqData.postType = "review";
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    const { req, res, next } = mockRequest;

    Topic.findOne.mockResolvedValue({ id: 2 });
    returnFromRaw
      .mockResolvedValueOnce([{ id: 1, review: "r" }])
      .mockResolvedValueOnce([{ id: 1, thought: "t" }])
      .mockResolvedValueOnce([{ id: 1, quote: "q" }]);

    await getTopicPosts(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should get topic posts with param = `thought`", async () => {
    mockReqData.postType = "thought";
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    const { req, res, next } = mockRequest;

    Topic.findOne.mockResolvedValue({ id: 2 });
    returnFromRaw
      .mockResolvedValueOnce([{ id: 1, review: "r" }])
      .mockResolvedValueOnce([{ id: 1, thought: "t" }])
      .mockResolvedValueOnce([{ id: 1, quote: "q" }]);

    await getTopicPosts(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should get topic posts with param = `quote`", async () => {
    mockReqData.postType = "quote";
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
    const { req, res, next } = mockRequest;

    Topic.findOne.mockResolvedValue({ id: 2 });
    returnFromRaw
      .mockResolvedValueOnce([{ id: 1, review: "r" }])
      .mockResolvedValueOnce([{ id: 1, thought: "t" }])
      .mockResolvedValueOnce([{ id: 1, quote: "q" }]);

    await getTopicPosts(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw `Topic not found`", async () => {
    const { req, res, next } = mockRequest;
    const error = "Topic not found";

    Topic.findOne.mockResolvedValue(null);
    await getTopicPosts(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(Topic.findOne).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled(Error(error));
  });
});

describe("test setFollowingState", () => {
  beforeEach(() => {
    mockReqData = {
      topicId: 2,
      isFollowed: true,
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should get topic posts with isFollowed = `true`", async () => {
    const { req, res, next } = mockRequest;

    await setFollowingState(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    // expect(returnFromRaw).toHaveBeenCalledWith(
    //   expect.anything(String),
    //   expect.stringMatching("INSERT")
    // );
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should get topic posts with isFollowed = `false`", async () => {
    mockRequest.req.body.isFollowed = false;
    const { req, res, next } = mockRequest;

    await setFollowingState(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalled();
    expect(returnFromRaw).toHaveBeenCalledWith(
      expect.anything(String),
      expect.stringMatching("DELETE")
    );
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

describe("test createCheckoutSession", () => {
  beforeEach(() => {
    mockReqData = {
      premiumType: "Annual",
      session: {
        passport: {
          user: 1,
        },
      },
    };
    mockRequest.req.body = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should create checkout session", async () => {
    const { req, res, next } = mockRequest;

    await createCheckoutSession(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    // expect(stripeProperties.prices.list).toHaveBeenCalled();
    expect(stripeProperties.checkout.sessions.create).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

describe("test listenWebhook", () => {
  beforeEach(() => {
    mockReqData = {
      id: "evt_1Example12345",
      object: "event",
    };
    mockRequest.req.body = mockReqData;
    mockRequest.req.headers = { "stripe-signature": "signature123" };
    mockRequest.req.rawBody = "rawBodyData";
  });

  test("should listen webhook with event = `checkout.session.completed`", async () => {
    const { req, res, next } = mockRequest;

    Transaction.create.mockResolvedValue({ id: 1 });
    stripeProperties.webhooks.constructEvent.mockReturnValueOnce({
      type: "checkout.session.completed",
      data: {
        object: {
          customer_details: {
            name: "John Doe",
            email: "john.doe@example.com",
            address: {
              country: "US",
              postal_code: "12345",
            },
          },
          customer: "cus_123",
          id: "cs_test_123",
          amount_total: 1000,
          currency: "usd",
          mode: "payment",
          payment_status: "paid",
          payment_method_configuration_details: {
            id: "pm_123",
          },
          subscription: "sub_123",
          expires_at: 1234567890,
          metadata: {
            user_id: "user_123",
          },
        },
      },
    });

    await listenWebhook(req, res, next);

    expect(stripeProperties.webhooks.constructEvent).toHaveBeenCalled();
    expect(Transaction.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should listen webhook with event = `checkout.session.expired`", async () => {
    const { req, res, next } = mockRequest;

    Transaction.create.mockResolvedValue({ id: 2 });
    stripeProperties.webhooks.constructEvent.mockReturnValue({
      type: "checkout.session.expired",
      data: {
        object: {
          id: "cs_test_456",
          amount_total: 2000,
          currency: "usd",
          mode: "payment",
          payment_status: "expired",
          payment_method_configuration_details: {
            id: "pm_456",
          },
          metadata: {
            user_id: "user_456",
          },
        },
      },
    });

    await listenWebhook(req, res, next);

    expect(stripeProperties.webhooks.constructEvent).toHaveBeenCalled();
    expect(Transaction.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should listen webhook with event = `customer.subscription.updated`", async () => {
    const { req, res, next } = mockRequest;

    stripeProperties.webhooks.constructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: {
          cancel_at: null,
          canceled_at: null,
          start_date: 1234567890,
          billing_cycle_anchor: 1234567890,
          plan: {
            interval: "month",
            amount: 1000,
            currency: "usd",
            product: "prod_123",
          },
          cancellation_details: {
            comment: "No longer needed",
            feedback: "too_expensive",
            reason: "cancelled",
          },
          id: "sub_123",
          customer: "cus_123",
          status: "active",
          metadata: {
            user_id: "user_123",
          },
        },
      },
    });
    Subscription.create.mockResolvedValue({ id: 1 });

    await listenWebhook(req, res, next);

    expect(stripeProperties.webhooks.constructEvent).toHaveBeenCalled();
    // expect(Subscription.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
