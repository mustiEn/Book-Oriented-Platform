import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const BookDescription = sequelize.define(
  "Description",
  {
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false }
);
