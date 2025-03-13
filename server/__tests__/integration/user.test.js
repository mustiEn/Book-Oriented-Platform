import request from "supertest";
import { app } from "../../server";
import { afterEach, beforeEach, test, vi } from "vitest";
import { sequelize } from "../../models/db";

vi.mock("../../middlewares/user_session_checker", () => ({
  isUserActive: (req, res, next) => {
    req.session.passport = { user: 6 };
    next();
  },
}));

const mockUser = {
  username: "111mike",
  password: "123",
  email: "test11@gmail.com",
  firstname: "mike",
  lastname: "james",
  DOB: "2000-02-12",
  gender: "Male",
};

beforeEach(async () => {
  await sequelize.authenticate();
  console.log("DB CONNECTED");
});

afterEach(async () => {
  await sequelize.close();
  console.log("DB DISCONNECTED");
});
