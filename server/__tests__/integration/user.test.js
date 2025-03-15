import request from "supertest";
import { app } from "../../server";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  test,
  vi,
} from "vitest";
import { sequelize } from "../../models/db";
import { logger } from "../../utils/constants";

vi.mock("../../middlewares/user_session_checker", () => ({
  isUserActive: (req, res, next) => {
    req.session.passport = { user: 6 };
    next();
  },
}));

beforeAll(async () => {
  await sequelize.authenticate();
  logger.log("DB CONNECTED");
});

afterAll(async () => {
  await sequelize.close();
  logger.log("DB DISCONNECTED");
});

test.skip("should create review and save it as post too", async () => {
  await request(app)
    .post("/share-review")
    .send({
      topic: "Literature",
      review: "My test review",
      title: "My test title",
      bookId: 1,
    })
    .expect("Content-Type", /json/)
    .expect(200);
});

test.skip("should get book reviews, total rating and people's rating", async () => {
  const res = await request(app)
    .get("/get-book-reviews/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip("should create privateNote if not exist, else update", async () => {
  const res = await request(app)
    .post("/set-private-note/1")
    .send({ privateNote: "my private note" })
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip("should create readingState if not exist, else update", async () => {
  const res = await request(app)
    .post("/set-reading-state/1")
    .send({ readingState: "Did not finish" })
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip("should get reader book interaction data", async () => {
  const res = await request(app)
    .get("/get-reader-book-interaction-data/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip("should get book statistics", async () => {
  const res = await request(app)
    .get("/get-book-statistics/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip.each([
  "Read",
  "Currently-reading",
  "Want-to-read",
  "Did-not-finish",
  "Liked",
])("should get book reader profiles with param q = %s", async (param) => {
  const res = await request(app)
    .get("/get-reader-profiles/52/reader")
    .query({ q: param })
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip("should filter reader books", async () => {
  const res = await request(app)
    .get("/get-book-statistics/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});
