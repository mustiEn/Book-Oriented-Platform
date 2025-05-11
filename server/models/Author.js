import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Author = sequelize.define(
  "Author",
  {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [{ unique: true, name: "author_idx", fields: ["author"] }],
  }
);
