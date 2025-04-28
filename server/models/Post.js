import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Topic } from "./Topic.js";
import { Notification } from "./Notification.js";

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
    restricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, indexes: [{ fields: ["post_type"] }] }
);

Post.addHook("afterCreate", async (post, options) => {
  if (post.get("post_type") != "comment" && post.dataValues.topicId) {
    await Topic.update(
      {
        post_count: sequelize.literal("post_count + 1"),
      },
      {
        where: {
          id: post.dataValues.topicId,
        },
      }
    );
  }
});
