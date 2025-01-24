import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const BookCollection = sequelize.define(
  "Book_Collection",
  {
    book_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING({ length: 1000 }),
      allowNull: false,
    },
    published_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    page_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING({ length: 1000 }),
      allowNull: true,
    },
    buy_link: {
      type: DataTypes.STRING({ length: 1000 }),
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pdf: {
      type: DataTypes.STRING({ length: 1000 }),
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["book_key"], unique: true }],
  }
);
