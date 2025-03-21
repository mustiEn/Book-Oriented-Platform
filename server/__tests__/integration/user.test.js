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
import Stripe, { stripeProperties } from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

vi.mock("../../middlewares/user_session_checker", () => ({
  isUserActive: (req, res, next) => {
    req.session.passport = { user: 6 };
    next();
  },
}));
vi.mock("stripe");

beforeAll(async () => {
  await sequelize.authenticate();
  logger.log("DB CONNECTED");
});

afterAll(async () => {
  await sequelize.close();
  logger.log("DB DISCONNECTED");
});

test("should create review and save it as post too", async () => {
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

test("should get book reviews, total rating and people's rating", async () => {
  const res = await request(app)
    .get("/get-book-reviews/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test("should create privateNote if not exist, else update", async () => {
  const res = await request(app)
    .post("/set-private-note/1")
    .send({ privateNote: "my private note" })
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

test("should get reader book interaction data", async () => {
  const res = await request(app)
    .get("/get-reader-book-interaction-data/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test("should get book statistics", async () => {
  const res = await request(app)
    .get("/get-book-statistics/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.each([
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

test("should get book statistics", async () => {
  const res = await request(app)
    .get("/get-book-statistics/52")
    .expect("Content-Type", /json/)
    .expect(200);

  console.log(res.body);
});

test.each([
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

test("should get reader reviews", async () => {
  const res = await request(app)
    .get("/ben11w/get-reader-reviews")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test("should update reader book dates", async () => {
  const res = await request(app)
    .post("/update-reader-book-dates/52")
    .send({ startingDate: "2000-05-05", finishingDate: "2500-05-05" })
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test("should upload image", async () => {
  const filePath = path.join(__dirname, "img", "test2.png");
  const res = await request(app)
    .post("/upload")
    .attach("ppImage", filePath)
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test("should get reader bookshelf overview", async () => {
  const res = await request(app)
    .get("/profile/bookshelf/get-bookshelf-overview")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.each([
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

test.only.each([
  { postType: "review", commentToId: 1, comment: "My test comment to review" },
  {
    postType: "comment",
    commentToId: 1,
    comment: "My test comment to comment",
  },
])(
  "should save reader's comment to the db and update the post being commented on with body postType = $postType, commentToId = $commentToId, comment = $comment",
  async ({ postType, comment, commentToId }) => {
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

test("should get reader comments", async () => {
  const res = await request(app)
    .get("/get-reader-comments/0")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test("should get themed topics", async () => {
  const res = await request(app)
    .get("/get-themed-topics/Literature")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.each([
  { topic: "test topic test", category: ["Anime"] },
  { topic: "test topic test 2", category: ["Anime", "Literature"] },
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

test("should get topic", async () => {
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
  { topicName: "Literature", postType: "quote", sortBy: "oldest" },
])(
  "should get topic posts with param postType = $postType, topic = $topicName, sortBy = $sortBy",
  async ({ topicName, postType, sortBy }) => {
    const url = sortBy
      ? `/get-topic-posts/${topicName}/${postType}?sortBy=${sortBy}`
      : `/get-topic-posts/${topicName}/${postType}`;
    const res = await request(app)
      .get(url)
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res.body);
  }
);

test("should get topic readers", async () => {
  const res = await request(app)
    .get("/get-topic-readers/Literature")
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.each([
  { isFollowed: true, topicId: 11 },
  { isFollowed: false, topicId: 10 },
])(
  "should set following state with body isFollowed = $isFollowed, topicId = $topicId",
  async ({ isFollowed, topicId }) => {
    const res = await request(app)
      .post("/set-following-state")
      .send({ isFollowed, topicId })
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res.body);
  }
);

test.each([
  { q: undefined, index: undefined },
  { q: undefined, index: 50 },
  { q: "a", index: undefined },
  { q: "b", index: 100 },
])(
  "should get book categories with query q = $q, index = $index",
  async ({ q, index }) => {
    let url;

    if (q && index) {
      url = `/get-book-categories?q=${q}&index=${index}`;
    } else if (!q && !index) {
      url = `/get-book-categories`;
    } else if (!q) {
      url = `/get-book-categories?index=${index}`;
    } else {
      url = `/get-book-categories?q=${q}`;
    }

    const res = await request(app)
      .get(url)
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res.body);
  }
);

test("should create checkout session", async () => {
  const res = await request(app)
    .post("/create-checkout-session")
    .send({ premiumType: "Annual" })
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});

test.each([
  {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_a1b2c3d4e5f6g7h8i9j0",
        object: "checkout.session",
        customer: "cus_123456789",
        customer_details: {
          name: "John Doe",
          email: "john.doe@example.com",
          address: {
            country: "US",
            postal_code: "12345",
          },
        },
        amount_total: 2000,
        currency: "usd",
        mode: "payment",
        payment_status: "paid",
        payment_method_configuration_details: {
          id: "pmc_123456789",
        },
        subscription: "sub_123456789",
        expires_at: 1698851832,
        metadata: {
          user_id: "6",
        },
      },
    },
  },
  {
    type: "checkout.session.expired",
    data: {
      object: {
        id: "cs_test_a1b2c3d4e5f6g7h8i9j0",
        object: "checkout.session",
        amount_total: 2000,
        currency: "usd",
        mode: "payment",
        payment_status: "expired",
        payment_method_configuration_details: {
          id: "pmc_123456789",
        },
        metadata: {
          user_id: "6",
        },
      },
    },
  },
  {
    type: "customer.subscription.updated",
    data: {
      object: {
        id: "sub_123456789",
        object: "subscription",
        cancel_at: 1698851832,
        canceled_at: 1698765432,
        start_date: 1698765432,
        billing_cycle_anchor: 1698765432,
        plan: {
          interval: "month",
          amount: 2000,
          currency: "usd",
          product: "prod_123456789",
        },
        cancellation_details: {
          comment: "User canceled subscription",
          feedback: "too_expensive",
          reason: "cancellation_requested",
        },
        customer: "cus_123456789",
        status: "canceled",
        metadata: {
          user_id: "6",
        },
      },
    },
  },
])("should listen webhooks type = $type", async ({ type, data }) => {
  const dataObj = stripeProperties.webhooks.constructEvent.mockReturnValue({
    type,
    data,
  });

  const res = await request(app)
    .post("/webhook")
    .send({ data: dataObj })
    .expect("Content-Type", /json/)
    .expect(200);
  console.log(res.body);
});
