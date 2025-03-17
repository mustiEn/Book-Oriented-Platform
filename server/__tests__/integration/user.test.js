import request from "supertest";
import path from "path";
import { app } from "../../server";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { sequelize } from "../../models/db";
import { logger } from "../../utils/constants";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

vi.mock("../../middlewares/user_session_checker", () => ({
  isUserActive: (req, res, next) => {
    req.session.passport = { user: 6 };
    next();
  },
}));

// vi.mock(import("multer"), async (importOriginal) => {
//   const multer = await importOriginal();
//   return {
//     ...multer,
//     fields: vi.fn((req, res, next) => {
//       req.files = {
//         ppImage: [
//           {
//             fieldname: "ppImage",
//             originalname: "test.png",
//             // encoding: '7bit',
//             // mimetype: 'image/png
//             // filename: "6_bg_2025_02_02_126931149_Screenshott.png",
//             // path: filePath,
//           },
//         ],
//       };
//       next();
//     }),
//   };
// });

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

test.skip("should get book statistics", async () => {
  const res = await request(app)
    .get("/get-book-statistics/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.skip.each([
  { q: "Read" },
  { q: "Want to read" },
  { q: "Liked" },
  { q: "Read", sort: "Title" },
  { q: "Liked", year: 2024 },
])(
  "should filter books with q = $q, sort = $sort, year = $year",
  async ({ q, sort, year }) => {
    const res = await request(app)
      .get("/profile/books")
      .query({ q, sort, year })
      .expect("Content-Type", /json/)
      .expect(200);

    console.log(res.body);
  }
);

test.skip("should get reader reviews", async () => {
  const res = await request(app)
    .get("/ben11w/get-reader-reviews")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.skip("should update reader book dates", async () => {
  const res = await request(app)
    .post("/update-reader-book-dates/52")
    .send({ startingDate: "2000-05-05", finishingDate: "2500-05-05" })
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.skip("should upload image", async () => {
  const filePath = path.join(__dirname, "img", "test2.png");
  const res = await request(app)
    .post("/upload")
    .attach("ppImage", filePath)
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.skip("should get reader bookshelf overview", async () => {
  const res = await request(app)
    .get("/profile/bookshelf/get-bookshelf-overview")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.skip.each([
  { postType: "review", postId: 1 },
  { postType: "quote", postId: 1 },
  { postType: "thought", postId: 1 },
  { postType: "comment", postId: 1 },
])(
  "should get reader's comments with param postType = $postType, postId = $postId",
  async ({ postType, postId }) => {
    const res = await request(app)
      .get(`/${postType}/${postId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res.body);
  }
);

test.skip.each([
  { postType: "review", postId: 1, comment: "My test comment to review" },
  { postType: "comment", postId: 1, comment: "My test comment to comment" },
])(
  "should save reader's comment to the db and update the post being commented on with body postType = $postType, commentToId = $commentToId, comment = $comment",
  async ({ postType, commentToId }) => {
    const res = await request(app)
      .post("/send-comment")
      .send({
        comment,
        commentToId,
        postType,
      })
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res.body);
  }
);

test.skip("should get reader comments", async () => {
  const res = await request(app)
    .get("/get-reader-comments/0")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.skip("should get themed topics", async () => {
  const res = await request(app)
    .get("/get-themed-topics/Literature")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.skip.each([
  { topic: "test topic", category: ["Anime"] },
  { topic: "test topic 5", category: ["Anime", "Literature"] },
])(
  "should create topics with body topic = $topic, category = $category",
  async ({ topic, category }) => {
    const res = await request(app)
      .post("/create-topic")
      .send({ topic, category })
      .expect("Content-Type", /json/)
      .expect(200);

    console.log(res.body);
  }
);

test.skip("should get topic", async () => {
  const res = await request(app)
    .get("/get-topic/Literature")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.each([
  { topicName: "Literature", postType: "all" },
  { topicName: "Literature", postType: "review" },
  { topicName: "Literature", postType: "thought" },
  { topicName: "Literature", postType: "quote" },
  { topicName: "Literature", postType: "quote" },
])(
  "should get topic topic posts with param postType = $postType, topic = $topic",
  async ({ topicName, postType }) => {
    // const url = sortBy ?
    const res = await request(app)
      .get(`/get-topic-posts/${topicName}/${postType}?sortBy=`)
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res.body);
  }
);
