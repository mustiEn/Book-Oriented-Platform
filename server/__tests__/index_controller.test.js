import { test, expect, vi, beforeEach, describe, afterEach } from "vitest";
import { logger, returnRawQuery } from "../utils/constants";
import { bookCollection, login, signup } from "../controllers/index";
import { validationResult, matchedData } from "express-validator";
import Groq, { mockCreate } from "groq-sdk";
import { User } from "../models/User";
import bcrypt from "bcrypt";

vi.mock("express-validator");
vi.mock("../utils/constants");
vi.mock("groq-sdk");
vi.mock("bcrypt");

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

afterEach(async () => {
  vi.resetAllMocks();
  mockRequest.req = {};
});

describe("test bookcollection", () => {
  test("should get req param `bookId` and add `author data` if data exists", async () => {
    mockData = [{ author: "jack", title: "abc" }];
    mockReqData = { bookId: 1 };
    mockRequest.req["params"] = mockReqData;

    matchedData.mockReturnValue(mockReqData);
    returnRawQuery.mockResolvedValue(mockData);

    const { req, res, next } = mockRequest;
    await bookCollection(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(returnRawQuery).toHaveBeenCalled();
    await expect(returnRawQuery()).resolves.toMatchObject([
      { author: "jack", title: "abc" },
    ]);
    expect(Groq).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: expect.stringContaining(
            `Who is or are ${mockData[0].author}?`
          ),
        },
      ],
    });
    expect(mockData[0]).toHaveProperty("author_info");
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("should get req query `q` and return data", async () => {
    mockData = [{ isLiked: true, rate: 2, author: "jack", title: "abc" }];
    mockReqData = { q: "a" };
    mockRequest.req["query"] = mockReqData;

    matchedData.mockReturnValue(mockReqData);
    returnRawQuery.mockResolvedValue(mockData);

    const { req, res, next } = mockRequest;

    await bookCollection(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(returnRawQuery).toHaveBeenCalled();
    await expect(returnRawQuery()).resolves.toMatchObject(mockData);
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});

describe("test login", () => {
  beforeEach(() => {
    mockReqData = { username: "Jack", password: "123Jack!" };
    mockRequest.req["body"] = mockReqData;
    matchedData.mockReturnValue(mockReqData);
  });

  test("should log in user", async () => {
    User.findOne = vi
      .fn()
      .mockResolvedValue({ id: 1, email: "jack@gmail.com", ...mockReqData });
    bcrypt.compareSync = vi.fn(() => true);
    mockRequest.req["login"] = vi.fn((user, cb) => cb());

    const user = await User.findOne();
    const { req, res, next } = mockRequest;

    await login(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.compareSync).toHaveBeenCalled();
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      mockReqData.password,
      user.password
    );
    expect(req.login).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "User logged in successfully",
    });
  });

  test("shouldnt log in user", async () => {
    User.findOne = vi
      .fn()
      .mockResolvedValue({ id: 1, email: "jack@gmail.com", ...mockReqData });
    bcrypt.compareSync = vi.fn(() => true);
    mockRequest.req["login"] = vi.fn((user, cb) => cb(new Error(error)));

    const error = "Something went wrong";
    const user = await User.findOne();
    const { req, res, next } = mockRequest;

    await login(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.compareSync).toHaveBeenCalled();
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      mockReqData.password,
      user.password
    );
    expect(req.login).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should throw `User not found`", async () => {
    User.findOne = vi.fn().mockResolvedValue(null);

    const error = "User not found";
    const { req, res, next } = mockRequest;

    await login(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.compareSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should throw `Password is incorrect`", async () => {
    bcrypt.compareSync = vi.fn(() => false);
    User.findOne = vi.fn().mockResolvedValue({
      id: 1,
      email: "jack@gmail.com",
      ...mockReqData,
      password: "A different password",
    });

    const error = "Password is incorrect";
    const user = await User.findOne();
    const { req, res, next } = mockRequest;

    await login(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.compareSync).toHaveBeenCalled();
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      mockReqData.password,
      user.password
    );
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});

describe("test signup", () => {
  beforeEach(() => {
    mockReqData = {
      email: "jane.smith@example.com",
      password: "Jane@4567",
      firstname: "Jane",
      lastname: "Smith",
      username: "janesmith",
      DOB: "1985-09-22",
      gender: "Female",
    };
    mockRequest.req["body"] = mockReqData;
    matchedData.mockReturnValue(mockReqData);

    bcrypt.compareSync = vi.fn(() => true);
    bcrypt.genSalt = vi.fn().mockResolvedValue("generatedSalt");
    bcrypt.hash = vi.fn().mockResolvedValue("hashedPassword");
  });

  test("should throw `Email already exists`", async () => {
    User.findOne = vi
      .fn()
      .mockResolvedValue(null)
      .mockResolvedValueOnce({ id: 2, email: "emily@gmail.com" });

    const error = "Email already exists";
    const { req, res, next } = mockRequest;

    await signup(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockReqData.email },
    });
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: mockReqData.username },
    });
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should throw `Username already exists`", async () => {
    User.findOne = vi
      .fn()
      .mockResolvedValue({ id: 1, email: "jack@gmail.com" })
      .mockResolvedValueOnce(null);

    const error = "Username already exists";
    const { req, res, next } = mockRequest;

    await signup(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockReqData.email },
    });
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: mockReqData.username },
    });
    expect(next).toHaveBeenCalledWith(Error(error));
  });

  test("should sign up the user", async () => {
    const { req, res, next } = mockRequest;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.password, salt);

    User.create = vi
      .fn()
      .mockResolvedValue({ ...mockReqData, password: hashedPassword });
    User.findOne = vi.fn().mockResolvedValue(null);

    const newUser = await User.create();

    mockRequest.req["login"] = vi.fn((newUser, cb) => cb());

    await signup(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockReqData.email },
    });
    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: mockReqData.username },
    });
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(mockReqData.password, salt);
    expect(User.create).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalledWith({
      ...mockReqData,
      password: hashedPassword,
    });
    expect(req.login).toHaveBeenCalled();
    expect(req.login).toHaveBeenCalledWith(newUser, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully",
    });
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  test("shouldn't sign up the user", async () => {
    const { req, res, next } = mockRequest;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.password, salt);
    const error = "Something went wrong";

    User.create = vi
      .fn()
      .mockResolvedValue({ ...mockReqData, password: hashedPassword });
    User.findOne = vi.fn().mockResolvedValue(null);

    const newUser = await User.create();
    mockRequest.req["login"] = vi.fn((newUser, cb) => cb(new Error(error)));

    await signup(req, res, next);

    expect(validationResult).toHaveBeenCalled();
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(logger.log).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalled();
    expect(matchedData).toHaveBeenCalledWith(req);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockReqData.email },
    });
    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: mockReqData.username },
    });
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(mockReqData.password, salt);
    expect(User.create).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalledWith({
      ...mockReqData,
      password: hashedPassword,
    });
    expect(req.login).toHaveBeenCalled();
    expect(req.login).toHaveBeenCalledWith(newUser, expect.any(Function));
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Error(error));
  });
});
