import express from "express";
import * as indexController from "../controllers/index.js";

const router = express.Router();

router.post("/signup", indexController.signup);

router.post("/login", indexController.login);

router.get("/books/v1/:bookId?", indexController.bookCollection);

export default router;
