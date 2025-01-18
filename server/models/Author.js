import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Author = sequelize.define(
  "Author",
  {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false, indexes: [{ unique: true, fields: ["author"] }] }
);
