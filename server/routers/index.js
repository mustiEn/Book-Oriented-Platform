import express from "express";
import * as indexController from "../controllers/index.js";
import { query, body, param } from "express-validator";
import { isUserActive } from "../middlewares/user_session_checker.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("username").notEmpty().isString(),
    body("password").notEmpty().isString(),
    body("email").notEmpty().isEmail(),
    body("firstname").notEmpty().isString(),
    body("lastname").notEmpty().isString(),
    body("DOB").notEmpty().isDate(),
    body("gender").custom((val) => {
      if (val != "Male" && val != "Female")
        throw new Error("Wrong gender input");
      return true;
    }),
  ],
  indexController.signup
);

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
  isUserActive,
  [query("q").optional().isString(), param("bookId").optional().isInt()],
  indexController.bookCollection
);

export default router;
