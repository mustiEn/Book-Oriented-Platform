import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const TopicCategory = sequelize.define(
  "Topic_Category",
  {
    topic_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, indexes: [{ fields: ["topic_category"], unique: true }] }
);
