import express from "express";
import cors from "cors";
import { logger } from "./utils/constants.js";
import { sequelize } from "./models/db.js";
import dotenv from "dotenv";
import userRouter from "./routers/user.js";
import indexRouter from "./routers/index.js";
import { handleError } from "./middlewares/error_handler.js";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import passport from "passport";
import "./strategies/strategy.js";
import cookieParser from "cookie-parser";
import { setupAssociations } from "./models/associations.js";
import "./crons/index.js";
import { createCsrfToken } from "./middlewares/csrf_token_handler.js";

dotenv.config();

export const app = express();
const port = process.env.PORT || 8081;
const SequelizeStore = sequelizeStore(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});
const sessionMiddleware = session({
  secret: "abc",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 90,
    // secure:true,
    // httpOnly:true
  },
});

try {
  await sequelize.authenticate();
  setupAssociations();
  await sequelize.sync();
  logger.log("Connection has been established successfully.");
  logger.log("All models were synchronized successfully.");
} catch (error) {
  logger.log(error);
}

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.get("/api/csrf-token", createCsrfToken);
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));
sessionStore.sync();
app.use(passport.initialize());
app.use(passport.session());
app.use(indexRouter);
app.use(userRouter);
app.use(handleError);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
  });
}
