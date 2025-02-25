import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  "book-app",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);
