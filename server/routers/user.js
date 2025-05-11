import express from "express";
import * as userController from "../controllers/user.js";
import { query, body, param, check } from "express-validator";
import multer from "multer";
import bodyParser from "body-parser";
import { isUserActive } from "../middlewares/user_session_checker.js";
import { logger } from "../utils/constants.js";

const maxSize = 25 * 1000 * 100;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/Pps_and_Bgs");
  },
  filename: function (req, file, cb) {
    const userId = req.session.passport.user + "_";
    const imageFor = file.fieldname == "bgImage" ? "bg_" : "pp_";
    const uniqueSuffix =
      new Date().toJSON().slice(0, 10).replaceAll("-", "_") +
      "_" +
      Math.round(Math.random() * 1e9) +
      "_";
    cb(null, userId + imageFor + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: maxSize } });
const router = express.Router();

router.post(
  "/create-checkout-session",
  [isUserActive, body("premiumType").notEmpty().isString()],
  userController.createCheckoutSession
);

router.post(
  "/create-customer-portal-session",
  isUserActive,
  userController.createCustomerPortalSession
);

router.post("/webhook", userController.listenWebhook);

router.get(
  "/get-home-page-posts/:index",
  [isUserActive, param("index").notEmpty().isInt()],
  userController.getHomePagePosts
);

router.get(
  "/get-reader-notifications",
  isUserActive,
  userController.getReaderNotifications
);

router.post(
  "/notifications/mark-as-read",
  isUserActive,
  userController.markNotificationsAsRead
);

router.post(
  "/notifications/hide",
  [isUserActive, body("id").notEmpty().isInt()],
  userController.hideNotifications
);

router.get(
  "/get-reader-book-modal-details/:bookId",
  [isUserActive, param("bookId").notEmpty().isInt()],
  userController.getReaderBookModalDetails
);

router.get("/get-reader-info", isUserActive, userController.getLoggedInReader);

router.post(
  "/share-review",
  [
    isUserActive,
    body("topic").optional(),
    body("review").notEmpty().isString(),
    body("title").notEmpty().isString(),
    body("bookId").notEmpty().isInt(),
  ],
  userController.shareReview
);

router.post(
  "/share-quote",
  [
    isUserActive,
    body("topic").optional(),
    body("quote").notEmpty().isString(),
    body("page_count").notEmpty().isInt(),
    body("title").notEmpty().isString(),
    body("bookId").notEmpty().isInt(),
  ],
  userController.shareQuote
);

router.post(
  "/share-thought",
  [
    isUserActive,
    body("topic").optional(),
    body("thought").notEmpty().isString(),
    body("title").notEmpty().isString(),
    body("bookId").optional(),
  ],
  userController.shareThought
);

router.get(
  "/get-sidebar-topics",
  isUserActive,
  userController.getSidebarTopics
);

router.get(
  "/get-book-reviews/:bookId",
  [isUserActive, param("bookId").notEmpty().isInt()],
  userController.getBookReviews
);

router.post(
  "/set-private-note/:bookId",
  [
    isUserActive,
    body("privateNote").notEmpty().isString(),
    param("bookId").notEmpty().isInt(),
  ],
  userController.setPrivateNote
);

router.post(
  "/set-reading-state/:bookId",
  [
    isUserActive,
    body("readingState").notEmpty().isString(),
    param("bookId").notEmpty().isInt(),
  ],
  userController.setReadingState
);

router.post(
  "/set-book-liked/:bookId",
  [
    isUserActive,
    param("bookId").notEmpty().isInt(),
    body("isBookLiked").notEmpty().isBoolean(),
  ],
  userController.setBookLiked
);

router.post(
  "/set-book-rate/:bookId",
  [
    isUserActive,
    param("bookId").notEmpty().isInt(),
    body("rate").notEmpty().isInt(),
  ],
  userController.setBookRate
);

router.get(
  "/get-reader-book-interaction-data/:bookId",
  [isUserActive, param("bookId").notEmpty().isInt()],
  userController.getReaderBookInteractionData
);

router.post(
  "/set-reader-book-record/:bookId",
  [isUserActive, param("bookId").notEmpty().isInt()],
  userController.setUserBookRecord
);

router.get(
  "/get-book-statistics/:bookId",
  [isUserActive, param("bookId").notEmpty().isInt()],
  userController.getBookStatistics
);

router.get(
  "/get-reader-profiles/:bookId/reader",
  [
    isUserActive,
    param("bookId").notEmpty().isInt(),
    query("q").optional().notEmpty().isString(),
  ],
  userController.getReaderProfiles
);

router.get(
  "/profile/:username/display-reader-profile",
  [isUserActive, param("username").notEmpty().isString()],
  userController.displayReaderProfile
);

router.get(
  "/profile/:username/books",
  [
    isUserActive,
    query("q").isString(),
    query("sort").optional().isString(),
    query("category").optional().isString(),
    query("year").optional().isString(),
    query("author").optional().isString(),
    param("username").notEmpty().isString(),
  ],
  userController.filterReaderBooks
);

router.get(
  "/:username/get-reader-reviews",
  [isUserActive, param("username").notEmpty().isString()],
  userController.getReaderReviews
);
router.get(
  "/:username/get-reader-thoughts",
  [isUserActive, param("username").notEmpty().isString()],
  userController.getReaderThoughts
);
router.get(
  "/:username/get-reader-quotes",
  [isUserActive, param("username").notEmpty().isString()],
  userController.getReaderQuotes
);

router.get(
  "/get-topic/:topicName",
  [isUserActive, param("topicName").notEmpty().isString()],
  userController.getTopic
);

router.get(
  "/get-topic-posts/:topicName/:index",
  [
    isUserActive,
    param("topicName").notEmpty().isString(),
    query("sortBy").optional().notEmpty().isString().escape(),
    query("q").optional().notEmpty().isString().escape(),
    param("index").notEmpty().isInt(),
  ],
  userController.getTopicPosts
);

router.get(
  "/get-topic-books/:topicName",
  [isUserActive, param("topicName").notEmpty().isString()],
  userController.getTopicBooks
);

router.get(
  "/get-topic-readers/:topicName",
  [isUserActive, param("topicName").notEmpty().isString()],
  userController.getTopicReaders
);

router.get(
  "/get-explore-general",
  isUserActive,
  userController.getExploreGenerals
);

router.get(
  "/get-explore-readers",
  isUserActive,
  userController.getExploreReaders
);

router.get("/get-topics", isUserActive, userController.getAllTopics);

router.get(
  "/get-explore-topics",
  isUserActive,
  userController.getExplorePopularTopics
);

router.get("/get-explore-books", isUserActive, userController.getExploreBooks);

router.get(
  "/get-trending-topics",
  isUserActive,
  userController.getTrendingTopics
);

router.get(
  "/get-book-category/:categoryId",
  [isUserActive, param("categoryId").notEmpty().isInt()],
  userController.getCategoryBooks
);

router.get(
  "/get-book-categories",
  [
    isUserActive,
    query("q").optional().isString(),
    query("index").optional().isInt(),
  ],
  userController.getBookCategories
);

router.get(
  "/get-topic-categories",
  isUserActive,
  userController.getTopicCategories
);

router.post(
  "/set-following-state",
  [
    isUserActive,
    body("isFollowing").notEmpty().isBoolean(),
    body("topicId").notEmpty().isInt(),
  ],
  userController.setFollowingState
);

router.post(
  "/update-reader-book-dates/:bookId",
  [
    isUserActive,
    param("bookId").notEmpty().isInt(),
    body("startingDate"),
    body("finishingDate"),
  ],
  userController.updateReaderBookDates
);

router.post(
  "/update-reader-page-number/:bookId",
  [
    isUserActive,
    body("pageNumber").notEmpty().isInt(),
    param("bookId").notEmpty().isInt(),
  ],
  userController.updateReaderPageNumber
);

router.post(
  "/upload",
  isUserActive,
  upload.fields([
    { name: "bgImage", maxCount: 1 },
    { name: "ppImage", maxCount: 1 },
  ]),

  userController.uploadImage
);

router.get(
  "/profile/:username/get-bookshelf-overview",
  [isUserActive, param("username").notEmpty().isString()],
  userController.getReaderBookshelfOverview
);

router.get(
  "/get-reader-comments/:username/:index",
  [
    isUserActive,
    param("index").notEmpty().isInt(),
    param("username").notEmpty().isString(),
  ],
  userController.getReaderComments
);

router.get(
  "/get-themed-topics/:category",
  [isUserActive, param("category").notEmpty().isString()],
  userController.getThemedTopics
);

router.get(
  "/:postType/:postId",
  [
    isUserActive,
    param("postType").notEmpty().isString(),
    param("postId").notEmpty().isInt(),
  ],
  userController.getReaderPostComments
);

router.post(
  "/send-comment",
  [
    isUserActive,
    body("comment").notEmpty().isString(),
    body("commentToId").notEmpty().isInt(),
    body("postType").notEmpty().isString(),
  ],
  userController.sendComment
);

router.post(
  "/create-topic",
  [
    isUserActive,
    body("topic").notEmpty().isString(),
    body("category").notEmpty().isArray(),
  ],
  userController.createTopic
);

export default router;
