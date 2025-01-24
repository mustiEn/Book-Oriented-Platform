import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Post = sequelize.define(
  "Post",
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { timestamps: true, indexes: [{ fields: ["post_type"] }] }
);
