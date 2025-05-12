import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db =
  process.env.NODE_ENV === "test" ? "book-app-test" : process.env.DB_DATABASE;

export const sequelize = new Sequelize(
  db,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    timezone: "+01:00", // or your actual local offset
    dialect: "mysql",
    logging: false,
  }
);
