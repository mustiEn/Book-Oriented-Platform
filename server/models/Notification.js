import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Notification = sequelize.define(
  "Notification",
  {
    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("book_recommendation", "post", "comment", "premium"),
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
  { timestamps: true, indexes: [{ fields: ["type"] }] }
);
