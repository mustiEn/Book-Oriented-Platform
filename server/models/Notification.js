import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Notification = sequelize.define(
  "Notification",
  {
    content: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "book_recommendation",
        "post",
        "comment",
        "premium",
        "topic_post"
      ),
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);
