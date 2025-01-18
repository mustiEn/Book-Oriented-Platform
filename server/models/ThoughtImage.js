import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const ThoughtImage = sequelize.define(
  "Thought_Image",
  {
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false, indexes: [{ fields: ["image"] }] }
);
