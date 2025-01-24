import express from "express";
import * as userController from "../controllers/user.js";
import { query, body, param } from "express-validator";
import multer from "multer";

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
router.get(
  "/get-reader-book-modal-details/:bookId",
  userController.getReaderBookModalDetails
);
router.get("/get-reader-username", userController.getLoggedInReader);

router.post(
  "/share-review",
  body("topic").notEmpty().isString(),
  userController.shareReview
);

router.get("/get-sidebar-topics", userController.getSidebarTopics);

router.get("/get-book-reviews/:bookId", userController.getBookReviews);

router.post("/set-private-note/:bookId", userController.setPrivateNote);

router.post("/set-reading-state/:bookId", userController.setReadingState);

router.post("/set-book-liked/:bookId", userController.setBookLiked);

router.post("/set-book-rate/:bookId", userController.setBookRate);

router.get(
  "/get-reader-book-details/:bookId",
  userController.getReaderBookDetailsAndHeader
);

router.post(
  "/set-reader-book-record/:bookId",
  userController.setUserBookRecord
);

router.get("/get-book-statistics/:bookId", userController.getBookStatistics);

router.get(
  "/get-reader-profiles/:bookId/reader",
  //* WHY READER SINgLE
  userController.getReaderProfiles
);

router.get(
  "/:username/display-reader-profile",
  userController.displayReaderProfile
);

router.get("/profile/books", userController.filterReaderBooks);

router.get("/:username/get-reader-reviews", userController.getReaderReviews);
router.get("/:username/get-reader-thoughts", userController.getReaderThoughts);
router.get("/:username/get-reader-quotes", userController.getReaderQuotes);

router.get("/get-topic/:topicName", userController.getTopic);
router.get(
  "/get-topic-posts/:topicName/:postType",
  query("sortBy").optional().notEmpty().escape(),
  userController.getTopicPosts
);
router.get("/get-topic-books/:topicName", userController.getTopicBooks);
router.get("/get-topic-readers/:topicName", userController.getTopicReaders);

router.get("/get-explore-general", userController.getExploreGenerals);
router.get("/get-explore-topics", userController.getExploreTopics);
router.get("/get-explore-books", userController.getExploreBooks);
router.get("/get-trending-topics", userController.getTrendingTopics);
router.get(
  "/get-book-category/:categoryId",
  param("categoryId").notEmpty().isInt(),
  userController.getCategoryBooks
);
router.get(
  "/get-book-categories",
  query("q").optional(),
  query("index").optional().isNumeric(),
  userController.getBookCategories
);

router.get("/get-topic-categories", userController.getTopicCategories);

router.post("/set-following-state", userController.setFollowingState);

router.post(
  "/update-reader-book-dates/:bookId",
  userController.updateReaderBookDates
);

router.post(
  "/update-reader-page-number/:bookId",
  userController.updateReaderPageNumber
);

router.post(
  "/upload",
  upload.fields([
    { name: "bgImage", maxCount: 1 },
    { name: "ppImage", maxCount: 1 },
  ]),
  userController.uploadImage
);

router.get(
  "/profile/bookshelf/get-bookshelf-overview",
  userController.getReaderBookshelfOverview
);
router.get("/get-reader-comments/:index", userController.getReaderComments);
router.get("/get-themed-topics/:category", userController.getThemedTopics);
router.get("/:postType/:postId", userController.getReaderPostComments);
router.post("/send-comment", userController.sendComment);
router.post("/create-topic", userController.createTopic);

export default router;
