import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = process.env.NODE_ENV === "test" ? "book-app-test" : "book-app";

export const sequelize = new Sequelize(
  db,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);
