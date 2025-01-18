import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Thought = sequelize.define(
  "Thought",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thought: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);
