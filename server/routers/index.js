import express from "express";
import * as indexController from "../controllers/index.js";
import { query, body, param } from "express-validator";

const router = express.Router();

router.post("/signup", indexController.signup);

router.post(
  "/login",
  [
    body("username").notEmpty().isString(),
    body("password").notEmpty().isString(),
  ],
  indexController.login
);

router.get(
  "/books/v1/:bookId?",
  [query("q").optional().isString(), param("bookId").optional().isInt()],
  indexController.bookCollection
);

export default router;
