import request from "supertest";
import { app } from "../../server";
import { afterEach, beforeEach, describe, test, vi } from "vitest";
import { sequelize } from "../../models/db";
import { logger } from "../../utils/constants";

vi.mock("../../middlewares/user_session_checker", () => ({
  isUserActive: (req, res, next) => {
    req.session.passport = { user: 52 };
    next();
  },
}));

beforeEach(async () => {
  await sequelize.authenticate();
  logger.log("DB CONNECTED");
});

afterEach(async () => {
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

test("should create readingState if not exist, else update", async () => {
  const res = await request(app)
    .post("/set-reading-state/1")
    .send({ readingState: "Did not finish" })
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});
