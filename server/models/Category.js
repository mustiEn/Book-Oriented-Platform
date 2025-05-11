import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Category = sequelize.define(
  "Category",
  {
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ["category"], unique: true }],
  }
);
