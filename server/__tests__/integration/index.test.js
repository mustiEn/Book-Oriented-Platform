//! UPDATE THIS FILE
// import request from "supertest";
// import { app } from "../../server";
// import { afterEach, beforeEach, test, vi } from "vitest";
// import { sequelize } from "../../models/db";

// vi.mock("../../middlewares/user_session_checker", () => ({
//   isUserActive: (req, res, next) => {
//     req.session.passport = { user: 6 };
//     next();
//   },
// }));

// const mockUser = {
//   username: "testuser",
//   password: "123testuser",
//   email: "testdump@gmail.com",
//   firstname: "test",
//   lastname: "user",
//   DOB: "2000-02-12",
//   gender: "Male",
// };

// beforeEach(async () => {
//   await sequelize.authenticate();
//   console.log("DB CONNECTED");
// });

// afterEach(async () => {
//   await sequelize.close();
//   console.log("DB DISCONNECTED");
// });

// test.only("should create user and log in", async () => {
//   await request(app)
//     .post("/signup")
//     .send(mockUser)
//     .expect("Content-Type", /json/)
//     .expect(200);
// });

// test("should log in", async () => {
//   const response = await request(app)
//     .post("/login")
//     .send({ username: mockUser.username, password: mockUser.password })
//     .expect("Content-Type", /json/)
//     .expect(200);

//   console.log(response.body);
// });

// test("should get 20 books with q = `a`", async () => {
//   const response = await request(app)
//     .get("/books/v1")
//     .query({ q: "a" })
//     .expect("Content-Type", /json/)
//     .expect(200);
// });

// test("should get 20 books with param bookId = `1`", async () => {
//   const response = await request(app)
//     .get("/books/v1/1")
//     .expect("Content-Type", /json/)
//     .expect(200);

//   console.log(response.body);
// });
